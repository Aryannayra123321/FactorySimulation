import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useStore } from '../store';

export function MachineUtilizationChart() {
  const machines = useStore((state) => state.machines);
  
  const data = [
    { name: 'Operational', value: machines.filter(m => m.status === 'operational').length },
    { name: 'Down', value: machines.filter(m => m.status === 'down').length },
    { name: 'Maintenance', value: machines.filter(m => m.status === 'maintenance').length },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#4F46E5" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AdjusterWorkloadChart() {
  const adjusters = useStore((state) => state.adjusters);
  
  const data = adjusters.map(adjuster => ({
    name: adjuster.name,
    workload: adjuster.status === 'busy' ? 100 : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="workload" stroke="#8B5CF6" fill="#C4B5FD" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Charts() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Machine Status Distribution</h3>
        <MachineUtilizationChart />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Adjuster Workload</h3>
        <AdjusterWorkloadChart />
      </div>
    </div>
  );
}