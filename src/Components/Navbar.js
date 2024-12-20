import React, { useState } from "react";
import Login from "./LoginModal"; // Assuming this is the correct path
import SignUpForm from "./SignUpModal";
import { Link } from "react-router-dom";


const Navbar = ({ isAuthenticated, username, handleLogout }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const openSignUpModal = () => setIsSignupModalOpen(true);

  const closeLoginModal = () => setIsLoginModalOpen(false);
  const closeSignUpModal = () => setIsSignupModalOpen(false);

  // Define handleLogin here
  const handleLogin = (username) => {
  };

  return (
    <>
      <nav className="bg-blue-50 border-b border-blue-200 py-3">
        <div className="container mx-auto flex justify-between items-center px-4">
        <div className="logo">
            <p>VisaPay</p>
          </div>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
  <div className="flex items-center space-x-3">
    {/* Welcome Message */}
    <span className="text-gray-600">Welcome,<Link to={"/userDetails"}>{username}</Link> </span>
  </div>
  {/* Logout Button */}
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
                  onClick={openLoginModal}
                >
                  Login
                </button>
                <button
                  className="text-blue-600 hover:text-blue-800 font-medium"
                  onClick={openSignUpModal}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Login
            onClose={closeLoginModal}
            openSignUpModal={openSignUpModal}
            handleLogin={handleLogin} 
          />
        </div>
      )}

      {/* Sign Up Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={closeSignUpModal}
            >
              ×
            </button>
            <SignUpForm onClose={closeSignUpModal} onOpenLogin={openLoginModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
