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
import type { Machine, Adjuster } from '../types';

interface MachineChartData {
  name: string;
  value: number;
}

interface AdjusterChartData {
  name: string;
  workload: number;
}

export function MachineUtilizationChart() {
  const machines = useStore<Machine[]>((state: { machines: Machine[] }) => state.machines);
  
  const data: MachineChartData[] = [
    { name: 'Operational', value: machines.filter((m: Machine) => m.status === 'operational').length },
    { name: 'Down', value: machines.filter((m: Machine) => m.status === 'down').length },
    { name: 'Maintenance', value: machines.filter((m: Machine) => m.status === 'maintenance').length },
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
  const adjusters = useStore<Adjuster[]>((state: { adjusters: Adjuster[] }) => state.adjusters);
  
  const data: AdjusterChartData[] = adjusters.map((adjuster: Adjuster) => ({
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

export function Charts(): JSX.Element {
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