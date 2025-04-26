import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTasks, FaTachometerAlt, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-900 dark:bg-gray-800 py-4 shadow-md animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          className="flex items-center text-lg sm:text-xl font-bold text-gray-100 dark:text-gray-200"
          aria-label="Task Tracker Home"
        >
          <FaTasks className="w-6 h-6 mr-2" />
          Task Tracker
        </Link>

        <div className="hidden sm:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm px-3 py-1 bg-gray-700 dark:bg-gray-600 text-gray-100 dark:text-gray-200 rounded-full">
                Welcome, {user?.firstname || 'User'}
              </span>
              <Link
                to="/dashboard"
                className="flex items-center text-gray-100 dark:text-gray-200 hover:text-blue-400 dark:hover:text-blue-300 transition"
                aria-label="Dashboard"
              >
                <FaTachometerAlt className="w-4 h-4 mr-1" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded transition shadow-md"
                aria-label="Logout"
              >
                <FaSignOutAlt className="w-4 h-4 mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center text-gray-100 dark:text-gray-200 hover:text-blue-400 dark:hover:text-blue-300 transition"
                aria-label="Login"
              >
                <FaSignInAlt className="w-4 h-4 mr-1" />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded transition shadow-md"
                aria-label="Sign Up"
              >
                <FaUserPlus className="w-4 h-4 mr-1" />
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="sm:hidden text-gray-100 dark:text-gray-200 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden bg-gray-900 dark:bg-gray-800 px-4 pt-4 pb-6 animate-slide-in"
        >
          {isAuthenticated ? (
            <div className="flex flex-col space-y-4">
              <span className="text-sm px-3 py-1 bg-gray-700 dark:bg-gray-600 text-gray-100 dark:text-gray-200 rounded-full text-center">
                Welcome, {user?.firstname || 'User'}
              </span>
              <Link
                to="/dashboard"
                className="flex items-center text-gray-100 dark:text-gray-200 hover:text-blue-400 dark:hover:text-blue-300 transition"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Dashboard"
              >
                <FaTachometerAlt className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded transition shadow-md"
                aria-label="Logout"
              >
                <FaSignOutAlt className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <Link
                to="/login"
                className="flex items-center text-gray-100 dark:text-gray-200 hover:text-blue-400 dark:hover:text-blue-300 transition"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Login"
              >
                <FaSignInAlt className="w-4 h-4 mr-2" />
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded transition shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Sign Up"
              >
                <FaUserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;