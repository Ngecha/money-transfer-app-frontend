import React, { useState } from "react";

const SignUpForm = ({ onClose, onOpenLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Sign Up Successful! You can now log in.");
        setFormData({
          username: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setError("Failed to sign up. Try again.");
      }
    } catch (err) {
      setError("Network error. Try again.");
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
      onClick={(e) => e.stopPropagation()}
      aria-labelledby="signup-modal"
      aria-modal="true"
    >
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={onClose}
        aria-label="Close signup form"
      >
        ×
      </button>

      {/* Header */}
      <h2 id="signup-modal" className="text-2xl font-bold text-center mb-4">
        Sign Up
      </h2>

      {/* Success/Error Messages */}
      {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number:
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>

      {/* Login Message */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => {
              if (onClose) onClose(); // Close signup modal
              if (onOpenLogin) onOpenLogin(); // Open login modal
            }}
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
