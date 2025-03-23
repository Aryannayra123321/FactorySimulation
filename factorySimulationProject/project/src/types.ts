export type UserRole = 'MANAGER' | 'ADJUSTER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  adjusterId?: string; // Only for ADJUSTER role
}

export interface Machine {
  id: string;
  name: string;
  category: string;
  status: 'operational' | 'down' | 'maintenance';
  mttf: number; // Mean Time To Failure in hours
  lastFailure: Date | null;
  nextPredictedFailure: Date | null;
}

export interface Adjuster {
  id: string;
  name: string;
  expertise: string[];
  status: 'available' | 'busy';
  currentTask: string | null;
  efficiency: number; // 0-100
}

export interface RepairTask {
  id: string;
  machineId: string;
  adjusterId: string | null;
  startTime: Date;
  estimatedDuration: number; // in minutes
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface SimulationState {
  isRunning: boolean;
  startTime: Date | null;
  speed: number; // simulation speed multiplier
  currentTime: Date;
}