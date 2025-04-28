import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Signup from './Components/Auth/Signup'
import Login from './Components/Auth/Login'
import Dashboard from './Components/Dashboard/Dashboard'
import ProjectDetails from './Components/Projects/ProjectDetails'
import CreateProject from './Components/Projects/CreateProject'
import CreateTask from './Components/Tasks/CreateTask'
import ProtectedRoute from './Components/Common/ProtectedRoute'
import Navbar from './Components/Common/Navbar'
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
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
          </div>
        </div>
        <Toaster/>
      </AuthProvider>
    </BrowserRouter>
  );
}
