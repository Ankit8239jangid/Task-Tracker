import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }

    try {
      setLoading(true);
      await api.createProject({ title });
      toast.success('Project created successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.response?.data?.message === 'Project limit reached. You can have a maximum of 4 projects.') {
        toast.error('Project limit reached (maximum 4 projects)');
      } else {
        toast.error(error.response?.data?.message || 'Failed to create project');
      }

      if (error.response?.data?.errors) {
        setError(error.response.data.errors.title || 'Invalid project data');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-300 mb-2">Project Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            className={`w-full px-3 py-2 bg-gray-700 text-white rounded ${
              error ? 'border border-red-500' : 'border border-gray-600'
            }`}
            placeholder="Enter project title"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
