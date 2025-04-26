import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import ConfirmationModal from '../Common/ConfirmationModal';
import { FaPlus, FaTasks, FaTrash } from 'react-icons/fa';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [projectTaskCounts, setProjectTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.getProjects();
      const projectsData = response.data;
      setProjects(projectsData);

      // Fetch task counts for each project
      const taskCountsObj = {};
      for (const project of projectsData) {
        try {
          const tasksResponse = await api.getTasks(project._id);
          taskCountsObj[project._id] = tasksResponse.data.length;
        } catch (err) {
          console.error(`Error fetching tasks for project ${project._id}:`, err);
          taskCountsObj[project._id] = 0;
        }
      }
      setProjectTaskCounts(taskCountsObj);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await api.deleteProject(projectToDelete._id);
      toast.success('Project deleted successfully');

      // Update projects list
      setProjects(projects.filter(project => project._id !== projectToDelete._id));

      // Update task counts
      const updatedTaskCounts = { ...projectTaskCounts };
      delete updatedTaskCounts[projectToDelete._id];
      setProjectTaskCounts(updatedTaskCounts);

      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 dark:border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">My Projects</h1>
        {projects.length < 4 && (
          <Link
            to="/create-project"
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition shadow-md"
            aria-label="Create New Project"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Create Project
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-md">
          <FaTasks className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">No projects yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first project to get started</p>
          <Link
            to="/create-project"
            className="inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition shadow-md"
            aria-label="Create First Project"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
             <div className="flex items-center justify-between mb-2">
               <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{project.title}</h3>
               <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                 {projectTaskCounts[project._id] || 0} Tasks
               </div>
             </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <div className="flex justify-between mt-4">
                <Link
                  to={`/project/${project._id}`}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 transition"
                  aria-label={`View details for ${project.title}`}
                >
                  View Details
                </Link>
                <button
                  onClick={() => openDeleteModal(project)}
                  className="inline-flex items-center text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 transition"
                  aria-label={`Delete ${project.title}`}
                >
                  <FaTrash className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {projects.length >= 4 && (
        <div className="mt-6 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg flex items-center">
          <p className="text-yellow-800 dark:text-yellow-300">
            You've reached the maximum limit of 4 projects. Delete a project to create a new one.
          </p>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={projectToDelete
          ? `Are you sure you want to delete the project "${projectToDelete.title}"? This will also delete all tasks associated with this project. This action cannot be undone.`
          : 'Are you sure you want to delete this project?'}
      />
    </div>
  );
};

export default Dashboard;