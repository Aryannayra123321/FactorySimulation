import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Activity, Settings, PenTool as Tool, Users, Play, Pause } from 'lucide-react';
import { useStore } from './store';
import { MachineUtilizationChart, AdjusterWorkloadChart } from './components/Charts';
import { TaskList } from './components/TaskList';
import { Login } from './pages/Login';
import { AdjusterDashboard } from './pages/AdjusterDashboard';

function ManagerDashboard() {
  const { stats, simulation, startSimulation, stopSimulation, user, logout } = useStore();

  if (!user || user.role !== 'MANAGER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Factory Simulation Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {user.name}</span>
              <button
                onClick={() => simulation.isRunning ? stopSimulation() : startSimulation()}
                className={`px-4 py-2 ${
                  simulation.isRunning
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white rounded-md transition-colors flex items-center space-x-2`}
              >
                {simulation.isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Stop Simulation</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start Simulation</span>
                  </>
                )}
              </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Adjusters"
            value={stats.activeAdjusters}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Machines"
            value={stats.machinesDown}
            icon={Tool}
            color="bg-green-500"
          />
          <StatCard
            title="Machines Down"
            value={stats.machinesDown}
            icon={Activity}
            color="bg-red-500"
          />
          <StatCard
            title="Efficiency"
            value={`${stats.efficiency}%`}
            icon={Activity}
            color="bg-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Machine Utilization</h2>
            <div className="h-64">
              <MachineUtilizationChart />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Adjuster Workload</h2>
            <div className="h-64">
              <AdjusterWorkloadChart />
            </div>
          </div>
        </div>

        <TaskList />
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 flex items-center space-x-4`}>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useStore(state => state.user);
  return user ? <>{children}</> : <Navigate to="/" />;
}

function DashboardRouter() {
  const user = useStore(state => state.user);
  
  if (user?.role === 'MANAGER') {
    return <ManagerDashboard />;
  }
  return <AdjusterDashboard />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;