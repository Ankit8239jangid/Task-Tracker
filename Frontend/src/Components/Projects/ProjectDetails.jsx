import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import TaskCard from '../Tasks/TaskCard';
import { FaArrowLeft, FaPlus, FaTasks } from 'react-icons/fa';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    notStarted: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      const projectResponse = await api.getProject(id);
      setProject(projectResponse.data);

      const tasksResponse = await api.getTasks(id);
      const fetchedTasks = tasksResponse.data;
      setTasks(fetchedTasks);

      const stats = {
        total: fetchedTasks.length,
        notStarted: fetchedTasks.filter(task => task.status === 'Not Started' || !task.status).length,
        inProgress: fetchedTasks.filter(task => task.status === 'In Progress').length,
        completed: fetchedTasks.filter(task => task.status === 'Completed').length,
      };
      setTaskStats(stats);
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast.error('Failed to load project details');
      if (error.response?.status === 404) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    const updatedTasks = tasks.map(task =>
      task._id === updatedTask._id ? updatedTask : task
    );
    setTasks(updatedTasks);

    const stats = {
      total: updatedTasks.length,
      notStarted: updatedTasks.filter(task => task.status === 'Not Started' || !task.status).length,
      inProgress: updatedTasks.filter(task => task.status === 'In Progress').length,
      completed: updatedTasks.filter(task => task.status === 'Completed').length,
    };
    setTaskStats(stats);
  };

  const handleTaskDeleted = (taskId) => {
    const updatedTasks = tasks.filter(task => task._id !== taskId);
    setTasks(updatedTasks);

    const stats = {
      total: updatedTasks.length,
      notStarted: updatedTasks.filter(task => task.status === 'Not Started' || !task.status).length,
      inProgress: updatedTasks.filter(task => task.status === 'In Progress').length,
      completed: updatedTasks.filter(task => task.status === 'Completed').length,
    };
    setTaskStats(stats);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Project not found</h2>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition"
        >
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 py-1 mb-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm"
            aria-label="Back to Dashboard"
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{project.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>

        <Link
          to={`/create-task/${project._id}`}
          className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-800 transition shadow-md"
          aria-label="Add New Task"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Add Task
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">Tasks</h2>

          {taskStats.total > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{taskStats.notStarted} Not Started</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{taskStats.inProgress} In Progress</span>
              </div>
              <div className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{taskStats.completed} Completed</span>
              </div>
            </div>
          )}
        </div>

        {taskStats.total > 0 && (
          <div
            className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden"
            role="progressbar"
            aria-valuenow={(taskStats.completed / taskStats.total) * 100}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div className="flex h-full">
              {taskStats.completed > 0 && (
                <div
                  className="h-full bg-green-600 dark:bg-green-500 transition-all duration-300"
                  style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}
                  title={`${Math.round((taskStats.completed / taskStats.total) * 100)}% Completed`}
                ></div>
              )}
              {taskStats.inProgress > 0 && (
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                  style={{ width: `${(taskStats.inProgress / taskStats.total) * 100}%` }}
                  title={`${Math.round((taskStats.inProgress / taskStats.total) * 100)}% In Progress`}
                ></div>
              )}
              {taskStats.notStarted > 0 && (
                <div
                  className="h-full bg-gray-500 dark:bg-gray-600 transition-all duration-300"
                  style={{ width: `${(taskStats.notStarted / taskStats.total) * 100}%` }}
                  title={`${Math.round((taskStats.notStarted / taskStats.total) * 100)}% Not Started`}
                ></div>
              )}
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <FaTasks className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No tasks yet</p>
            <Link
              to={`/create-task/${project._id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition shadow-md"
              aria-label="Create First Task"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Create Your First Task
            </Link>
          </div>
        ) : (
          <div className="space-y-4" id="task-card-container">
            {tasks.map((task, index) => (
              <div key={task._id} className={`animate-fade-in delay-${index}`}>
                <TaskCard
                  task={task}
                  onTaskUpdated={handleTaskUpdated}
                  onTaskDeleted={handleTaskDeleted}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;