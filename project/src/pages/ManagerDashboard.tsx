import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Settings, Play, Pause, Plus } from 'lucide-react';
import { Charts } from '../components/Charts';
import { TaskList } from '../components/TaskList';

export const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [newMachine, setNewMachine] = useState({ name: '', category: '', mttf: 48 });
  const [newAdjuster, setNewAdjuster] = useState({ name: '', expertise: [] });
  
  const {
    user,
    machines,
    adjusters,
    repairTasks,
    simulation,
    stats,
    startSimulation,
    stopSimulation,
    addMachine,
    addAdjuster,
  } = useStore();

  // Protect the route
  React.useEffect(() => {
    if (!user || user.role !== 'MANAGER') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    addMachine({
      name: newMachine.name,
      category: newMachine.category,
      mttf: newMachine.mttf,
      status: 'operational',
      lastFailure: null,
      nextPredictedFailure: null,
    });
    setNewMachine({ name: '', category: '', mttf: 48 });
  };

  const handleAddAdjuster = (e: React.FormEvent) => {
    e.preventDefault();
    addAdjuster({
      name: newAdjuster.name,
      expertise: newAdjuster.expertise,
      status: 'available',
      currentTask: null,
      efficiency: 95,
    });
    setNewAdjuster({ name: '', expertise: [] });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Factory Manager Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={() => simulation.isRunning ? stopSimulation() : startSimulation()}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              simulation.isRunning
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {simulation.isRunning ? (
              <>
                <Pause size={20} /> Stop Simulation
              </>
            ) : (
              <>
                <Play size={20} /> Start Simulation
              </>
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Efficiency</h3>
          <p className="text-3xl font-bold text-green-600">{stats.efficiency}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Machines Down</h3>
          <p className="text-3xl font-bold text-red-600">{stats.machinesDown}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Active Adjusters</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.activeAdjusters}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Machines ({machines.length})</h2>
          <div className="space-y-4">
            {machines.map(machine => (
              <div key={machine.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold">{machine.name}</p>
                  <p className="text-sm text-gray-600">{machine.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  machine.status === 'operational' ? 'bg-green-100 text-green-800' :
                  machine.status === 'down' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {machine.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Adjusters ({adjusters.length})</h2>
          <div className="space-y-4">
            {adjusters.map(adjuster => (
              <div key={adjuster.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold">{adjuster.name}</p>
                  <p className="text-sm text-gray-600">{adjuster.expertise.join(', ')}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  adjuster.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {adjuster.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Performance Charts</h2>
        <Charts />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Repair Tasks</h2>
        <TaskList />
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Add New Machine</h3>
              <form onSubmit={handleAddMachine} className="space-y-3">
                <input
                  type="text"
                  placeholder="Machine Name"
                  value={newMachine.name}
                  onChange={e => setNewMachine({ ...newMachine, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newMachine.category}
                  onChange={e => setNewMachine({ ...newMachine, category: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="MTTF (hours)"
                  value={newMachine.mttf}
                  onChange={e => setNewMachine({ ...newMachine, mttf: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                  Add Machine
                </button>
              </form>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Add New Adjuster</h3>
              <form onSubmit={handleAddAdjuster} className="space-y-3">
                <input
                  type="text"
                  placeholder="Adjuster Name"
                  value={newAdjuster.name}
                  onChange={e => setNewAdjuster({ ...newAdjuster, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Expertise (comma-separated)"
                  value={newAdjuster.expertise.join(', ')}
                  onChange={e => setNewAdjuster({
                    ...newAdjuster,
                    expertise: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                  Add Adjuster
                </button>
              </form>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 