import React from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../store';
import { formatDistanceToNow } from 'date-fns';
import type { RepairTask } from '../types';

interface TaskListProps {
  tasks?: RepairTask[];
}

export function TaskList({ tasks: propTasks }: TaskListProps) {
  const {
    repairTasks: storeTasks,
    machines,
    adjusters,
    assignTask,
    completeTask,
    cancelTask,
    user
  } = useStore();

  const tasks = propTasks || storeTasks;
  const isManager = user?.role === 'MANAGER';
  const isAdjuster = user?.role === 'ADJUSTER';

  const handleAssign = (taskId: string, adjusterId: string) => {
    if (isManager || (isAdjuster && adjusterId === user.adjusterId)) {
      assignTask(taskId, adjusterId);
    }
  };

  const handleComplete = (taskId: string) => {
    if (isManager || (isAdjuster && tasks.find(t => t.id === taskId)?.adjusterId === user.adjusterId)) {
      completeTask(taskId);
    }
  };

  const handleCancel = (taskId: string) => {
    if (isManager) {
      cancelTask(taskId);
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const machine = machines.find(m => m.id === task.machineId);
        const adjuster = task.adjusterId ? adjusters.find(a => a.id === task.adjusterId) : null;

        return (
          <div key={task.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className={
                  task.priority === 'high' ? 'text-red-500' :
                  task.priority === 'medium' ? 'text-yellow-500' :
                  'text-blue-500'
                } />
                <span className="font-medium">{machine?.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.status}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(task.startTime)} ago</span>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Priority: <span className="font-medium capitalize">{task.priority}</span>
              </p>
              {!task.adjusterId && isManager && (
                <div className="mt-2">
                  <select
                    className="w-full mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    onChange={(e) => handleAssign(task.id, e.target.value)}
                    value=""
                  >
                    <option value="" disabled>Assign Adjuster</option>
                    {adjusters
                      .filter(a => a.status === 'available')
                      .map(adjuster => (
                        <option key={adjuster.id} value={adjuster.id}>
                          {adjuster.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              {!task.adjusterId && isAdjuster && (
                <div className="mt-2">
                  <button
                    onClick={() => handleAssign(task.id, user.adjusterId!)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Accept Task
                  </button>
                </div>
              )}
              {adjuster && (
                <p className="text-sm text-gray-600 mt-1">
                  Assigned to: <span className="font-medium">{adjuster.name}</span>
                </p>
              )}
              {task.status === 'in-progress' && (
                <div className="mt-2 flex space-x-2">
                  {(isManager || (isAdjuster && task.adjusterId === user.adjusterId)) && (
                    <button
                      onClick={() => handleComplete(task.id)}
                      className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </button>
                  )}
                  {isManager && (
                    <button
                      onClick={() => handleCancel(task.id)}
                      className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
      {tasks.length === 0 && (
        <p className="text-gray-500 text-center py-4">No active repair tasks</p>
      )}
    </div>
  );
}