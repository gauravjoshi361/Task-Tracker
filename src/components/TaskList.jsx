import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Layout from './Layout';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from './LoadingSpinner';

export default function TaskList() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'TODO'
  });
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    setLoading(true);
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/tasks/project/${projectId}`)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to fetch project data', 'error');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, project: projectId });
      setNewTask({ title: '', description: '', status: 'TODO' });
      fetchProjectAndTasks();
      showNotification('Task created successfully');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to create task', 'error');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchProjectAndTasks();
      showNotification('Task status updated');
    } catch (error) {
      showNotification('Failed to update task status', 'error');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      TODO: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchProjectAndTasks();
        showNotification('Task deleted successfully');
      } catch (error) {
        showNotification('Failed to delete task', 'error');
      }
    }
  };

  const getTaskStats = () => {
    const stats = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: 'To Do', value: stats.TODO || 0, color: '#FCD34D' },
      { name: 'In Progress', value: stats.IN_PROGRESS || 0, color: '#60A5FA' },
      { name: 'Completed', value: stats.COMPLETED || 0, color: '#34D399' }
    ];
  };

  return (
    <Layout>
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{project?.title}</h1>
            <p className="text-gray-600">{project?.description}</p>
          </div>

          {/* Progress Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Task Progress</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getTaskStats()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {getTaskStats().map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Add Task Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Task Title</label>
                  <input
                    type="text"
                    className="mt-1 w-full px-4 py-2 border rounded-md"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 w-full px-4 py-2 border rounded-md"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    rows="3"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Task
                </button>
              </form>
            </div>
          </div>

          {/* Task List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg mb-4 text-yellow-600">To Do</h3>
              <div className="space-y-4">
                {tasks.filter(task => task.status === 'TODO').map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onStatusChange={handleUpdateStatus} 
                    onDelete={handleDeleteTask}
                    getStatusColor={getStatusColor}  
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg mb-4 text-blue-600">In Progress</h3>
              <div className="space-y-4">
                {tasks.filter(task => task.status === 'IN_PROGRESS').map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onStatusChange={handleUpdateStatus} 
                    onDelete={handleDeleteTask}
                    getStatusColor={getStatusColor} 
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg mb-4 text-green-600">Completed</h3>
              <div className="space-y-4">
                {tasks.filter(task => task.status === 'COMPLETED').map(task => (
                  <TaskCard 
                    key={task._id} 
                    task={task} 
                    onStatusChange={handleUpdateStatus} 
                    onDelete={handleDeleteTask}
                    getStatusColor={getStatusColor} 
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

// Task Card Component
function TaskCard({ task, onStatusChange, onDelete, getStatusColor }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{task.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          <div className="text-xs text-gray-500 mt-2">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className={`text-sm px-2 py-1 rounded-md ${getStatusColor(task.status)}`}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button
            onClick={() => onDelete(task._id)}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}