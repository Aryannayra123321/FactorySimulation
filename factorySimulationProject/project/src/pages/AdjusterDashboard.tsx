import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { TaskList } from '../components/TaskList';

export function AdjusterDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useStore();

  React.useEffect(() => {
    if (!user || user.role !== 'ADJUSTER') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'ADJUSTER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Adjuster Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {user.name}</span>
              <button 
                onClick={logout}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Your Tasks</h2>
            <div className="mt-4">
              <TaskList tasks={useStore(state => state.repairTasks.filter(task => 
                task.adjusterId === user.adjusterId || 
                (!task.adjusterId && task.status === 'pending')
              ))} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}