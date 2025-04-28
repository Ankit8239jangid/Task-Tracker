import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Components/Common/Navbar';
import ProtectedRoute from './Components/Common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

// Lazy Load Components impliementatig
const Signup = lazy(() => import('./Components/Auth/Signup'));
const Login = lazy(() => import('./Components/Auth/Login'));
const Dashboard = lazy(() => import('./Components/Dashboard/Dashboard'));
const ProjectDetails = lazy(() => import('./Components/Projects/ProjectDetails'));
const CreateProject = lazy(() => import('./Components/Projects/CreateProject'));
const CreateTask = lazy(() => import('./Components/Tasks/CreateTask'));

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/project/:id" element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                } />
                <Route path="/create-project" element={
                  <ProtectedRoute>
                    <CreateProject />
                  </ProtectedRoute>
                } />
                <Route path="/create-task/:projectId" element={
                  <ProtectedRoute>
                    <CreateTask />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </div>
        </div>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}
