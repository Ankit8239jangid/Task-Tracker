import axios from './axios';

// Auth API calls
const login = (credentials) => axios.post('/auth/login', credentials);
const signup = (userData) => axios.post('/auth/signup', userData);
const logout = () => axios.post('/auth/logout');
const getCurrentUser = () => axios.get('/auth/me');

// Project API calls
const getProjects = () => axios.get('/projects');
const getProject = (id) => axios.get(`/projects/${id}`);
const createProject = (projectData) => axios.post('/projects', projectData);
const deleteProject = (id) => axios.delete(`/projects/${id}`);

// Task API calls
const getTasks = (projectId) => axios.get(`/tasks/${projectId}`);
const createTask = (taskData) => axios.post('/tasks', taskData);
const updateTask = (taskId, taskData) => axios.put(`/tasks/${taskId}`, taskData);
const deleteTask = (taskId) => axios.delete(`/tasks/${taskId}`);

// Export all API functions
const api = {
  login,
  signup,
  logout,
  getCurrentUser,
  getProjects,
  getProject,
  createProject,
  deleteProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

export default api;
