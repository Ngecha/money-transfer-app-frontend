import React, { useState } from "react";
//import { Link } from "react-router-dom";
import Login from "./LoginModal";
import SignUpForm from "./SignUpModal";

const Navbar = ({ isAuthenticated, username, handleLogout,handleLogin }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-blue-50 border-b border-blue-200 py-3">
        <div className="container mx-auto flex justify-between items-center px-4">
          <a href="/" className="text-xl font-bold text-blue-600">
            Money Transfer App
          </a>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">Welcome, {username}</span>
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Login
                </button>
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={() => setIsSignupModalOpen(true)}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Login onClose={() => setIsLoginModalOpen(false)} />
        </div>
      )}

      {isSignupModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setIsSignupModalOpen(false)}
            >
              ×
            </button>
            <SignUpForm />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
