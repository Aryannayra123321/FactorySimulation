import { create } from 'zustand';
import { addMinutes, addHours } from 'date-fns';
import type { Machine, Adjuster, RepairTask, SimulationState, User, UserRole } from './types';

interface AuthState {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

interface StoreState extends AuthState {
  machines: Machine[];
  adjusters: Adjuster[];
  repairTasks: RepairTask[];
  simulation: SimulationState;
  stats: {
    efficiency: number;
    machinesDown: number;
    activeAdjusters: number;
  };
  // Actions
  startSimulation: () => void;
  stopSimulation: () => void;
  updateSimulation: () => void;
  assignTask: (taskId: string, adjusterId: string) => void;
  completeTask: (taskId: string) => void;
  cancelTask: (taskId: string) => void;
  addMachine: (machine: Omit<Machine, 'id'>) => void;
  addAdjuster: (adjuster: Omit<Adjuster, 'id'>) => void;
}

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock users for demo
const mockUsers = {
  'manager@factory.com': {
    id: 'manager-1',
    name: 'John Manager',
    email: 'manager@factory.com',
    password: 'manager123',
    role: 'MANAGER' as const,
  },
  'adjuster@factory.com': {
    id: 'adjuster-1',
    name: 'Alice Adjuster',
    email: 'adjuster@factory.com',
    password: 'adjuster123',
    role: 'ADJUSTER' as const,
    adjusterId: 'adj-1',
  },
};

// Initial mock data
const initialMachines: Machine[] = [
  {
    id: generateId(),
    name: 'Machine A1',
    category: 'Assembly',
    status: 'operational',
    mttf: 48,
    lastFailure: null,
    nextPredictedFailure: addHours(new Date(), 48),
  },
  {
    id: generateId(),
    name: 'Machine B1',
    category: 'Electronics',
    status: 'operational',
    mttf: 72,
    lastFailure: null,
    nextPredictedFailure: addHours(new Date(), 72),
  },
];

const initialAdjusters: Adjuster[] = [
  {
    id: 'adj-1',
    name: 'Alice Adjuster',
    expertise: ['Assembly', 'Electronics'],
    status: 'available',
    currentTask: null,
    efficiency: 95,
  },
];

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  machines: initialMachines,
  adjusters: initialAdjusters,
  repairTasks: [],
  simulation: {
    isRunning: false,
    startTime: null,
    speed: 1,
    currentTime: new Date(),
  },
  stats: {
    efficiency: 95,
    machinesDown: 0,
    activeAdjusters: 0,
  },

  login: async (email: string, password: string, role: UserRole) => {
    const mockUser = mockUsers[email as keyof typeof mockUsers];
    
    if (!mockUser || mockUser.password !== password || mockUser.role !== role) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...user } = mockUser;
    set({ user });
  },

  logout: () => {
    set({ user: null });
  },

  startSimulation: () => {
    const user = get().user;
    if (!user || user.role !== 'MANAGER') return;

    set((state) => ({
      simulation: {
        ...state.simulation,
        isRunning: true,
        startTime: new Date(),
      },
    }));

    // Start simulation loop
    const simulationInterval = setInterval(() => {
      if (get().simulation.isRunning) {
        get().updateSimulation();
      } else {
        clearInterval(simulationInterval);
      }
    }, 1000);
  },

  stopSimulation: () => {
    const user = get().user;
    if (!user || user.role !== 'MANAGER') return;

    set((state) => ({
      simulation: {
        ...state.simulation,
        isRunning: false,
      },
    }));
  },

  updateSimulation: () => {
    set((state) => {
      // Update simulation time
      const newTime = addMinutes(state.simulation.currentTime, 1 * state.simulation.speed);

      // Check for machine failures
      const updatedMachines = state.machines.map(machine => {
        if (machine.status === 'operational' && machine.nextPredictedFailure) {
          if (newTime >= machine.nextPredictedFailure) {
            // Machine fails
            return {
              ...machine,
              status: 'down',
              lastFailure: newTime,
              nextPredictedFailure: null,
            };
          }
        }
        return machine;
      });

      // Create repair tasks for newly failed machines
      const newTasks = updatedMachines
        .filter(m => m.status === 'down' && !state.repairTasks.some(t => t.machineId === m.id))
        .map(machine => ({
          id: generateId(),
          machineId: machine.id,
          adjusterId: null,
          startTime: newTime,
          estimatedDuration: 60, // 1 hour repair time
          status: 'pending' as const,
          priority: 'medium' as const,
        }));

      // Update repair tasks progress
      const updatedTasks = [...state.repairTasks, ...newTasks].map(task => {
        if (task.status === 'in-progress') {
          const timeSpent = Math.floor((newTime.getTime() - task.startTime.getTime()) / (1000 * 60));
          if (timeSpent >= task.estimatedDuration) {
            // Task completed
            const machine = updatedMachines.find(m => m.id === task.machineId);
            if (machine) {
              machine.status = 'operational';
              machine.nextPredictedFailure = addHours(newTime, machine.mttf);
            }
            return { ...task, status: 'completed' as const };
          }
        }
        return task;
      });

      // Calculate statistics
      const machinesDown = updatedMachines.filter(m => m.status === 'down').length;
      const activeAdjusters = state.adjusters.filter(a => a.status === 'busy').length;
      const efficiency = Math.round(
        ((updatedMachines.length - machinesDown) / updatedMachines.length) * 100
      );

      return {
        machines: updatedMachines,
        repairTasks: updatedTasks.filter(t => t.status !== 'completed'),
        simulation: {
          ...state.simulation,
          currentTime: newTime,
        },
        stats: {
          efficiency,
          machinesDown,
          activeAdjusters,
        },
      };
    });
  },

  assignTask: (taskId: string, adjusterId: string) => {
    const user = get().user;
    if (!user) return;

    // Managers can assign any task, adjusters can only accept their own tasks
    if (user.role === 'ADJUSTER' && user.adjusterId !== adjusterId) return;

    set((state) => {
      const updatedTasks = state.repairTasks.map(task =>
        task.id === taskId ? { ...task, adjusterId, status: 'in-progress' as const } : task
      );

      const updatedAdjusters = state.adjusters.map(adjuster =>
        adjuster.id === adjusterId
          ? { ...adjuster, status: 'busy' as const, currentTask: taskId }
          : adjuster
      );

      return {
        repairTasks: updatedTasks,
        adjusters: updatedAdjusters,
      };
    });
  },

  completeTask: (taskId: string) => {
    const user = get().user;
    if (!user) return;

    set((state) => {
      const task = state.repairTasks.find(t => t.id === taskId);
      if (!task) return state;

      // Only managers or the assigned adjuster can complete tasks
      if (user.role === 'ADJUSTER' && task.adjusterId !== user.adjusterId) return state;

      const updatedTasks = state.repairTasks.filter(t => t.id !== taskId);
      const updatedAdjusters = state.adjusters.map(adjuster =>
        adjuster.id === task.adjusterId
          ? { ...adjuster, status: 'available' as const, currentTask: null }
          : adjuster
      );

      const updatedMachines = state.machines.map(machine =>
        machine.id === task.machineId
          ? {
              ...machine,
              status: 'operational' as const,
              nextPredictedFailure: addHours(new Date(), machine.mttf),
            }
          : machine
      );

      return {
        repairTasks: updatedTasks,
        adjusters: updatedAdjusters,
        machines: updatedMachines,
      };
    });
  },

  cancelTask: (taskId: string) => {
    const user = get().user;
    if (!user || user.role !== 'MANAGER') return;

    set((state) => {
      const task = state.repairTasks.find(t => t.id === taskId);
      if (!task) return state;

      const updatedTasks = state.repairTasks.filter(t => t.id !== taskId);
      const updatedAdjusters = state.adjusters.map(adjuster =>
        adjuster.id === task.adjusterId
          ? { ...adjuster, status: 'available' as const, currentTask: null }
          : adjuster
      );

      return {
        repairTasks: updatedTasks,
        adjusters: updatedAdjusters,
      };
    });
  },

  addMachine: (machine) => {
    const user = get().user;
    if (!user || user.role !== 'MANAGER') return;

    set((state) => ({
      machines: [
        ...state.machines,
        {
          ...machine,
          id: generateId(),
          status: 'operational',
          lastFailure: null,
          nextPredictedFailure: addHours(new Date(), machine.mttf),
        },
      ],
    }));
  },

  addAdjuster: (adjuster) => {
    const user = get().user;
    if (!user || user.role !== 'MANAGER') return;

    set((state) => ({
      adjusters: [
        ...state.adjusters,
        {
          ...adjuster,
          id: generateId(),
          status: 'available',
          currentTask: null,
        },
      ],
    }));
  },
}));