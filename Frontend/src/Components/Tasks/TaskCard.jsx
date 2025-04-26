import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import ConfirmationModal from '../Common/ConfirmationModal';

const TaskCard = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status || 'Not Started',
  });
 
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statusColors = {
    'Not Started': 'bg-gray-500',
    'In Progress': 'bg-blue-500',
    'Completed': 'bg-green-500',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.updateTask(task._id, formData);
      toast.success('Task updated successfully');
      onTaskUpdated(response.data.task);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteTask(task._id);
      toast.success('Task deleted successfully');
      onTaskDeleted(task._id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const updatedData = { ...formData, status: newStatus };
      const response = await api.updateTask(task._id, updatedData);
      toast.success(`Task marked as ${newStatus}`);
      onTaskUpdated(response.data.task);
      setFormData(updatedData);
      setShowStatusDropdown(false);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-required="true"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              aria-required="true"
            ></textarea>
          </div>

          <div className="mb-4 fixed">
            <label htmlFor="status" className="block text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full  px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white rounded transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white rounded transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{task.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full text-white ${statusColors[task.status || 'Not Started']}`}
        >
          {task.status || 'Not Started'}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
          {task.completedAt && (
            <span className="ml-3">
              Completed: {new Date(task.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition text-sm"
              aria-haspopup="true"
              aria-expanded={showStatusDropdown}
            >
              Change Status
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                <div className="py-1">
                  {['Not Started', 'In Progress', 'Completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                      disabled={task.status === status || loading}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-yellow-500 dark:bg-yellow-600 text-white rounded hover:bg-yellow-600 dark:hover:bg-yellow-700 transition text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-1 bg-red-500 dark:bg-red-600 text-white rounded hover:bg-red-600 dark:hover:bg-red-700 transition text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default TaskCard;