import React from 'react';
import { useStore } from '../store';
import { TaskList } from '../components/TaskList';

export function AdjusterDashboard() {
  const user = useStore(state => state.user);
  const tasks = useStore(state => state.repairTasks.filter(task => 
    task.adjusterId === user?.adjusterId || task.adjusterId === null
  ));

  if (!user || user.role !== 'ADJUSTER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Adjuster Dashboard</h1>
            <div className="text-sm text-gray-500">
              Welcome, {user.name}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Your Tasks</h2>
          <TaskList tasks={tasks} />
        </div>
      </main>
    </div>
  );
}