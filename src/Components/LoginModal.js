import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Login = ({ handleLogin, onClose, openSignUpModal }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await fetch("https://money-transfer-app-1.onrender.com/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (response.ok) {
          // Set cookies
          Cookies.set("token", data.token);
          Cookies.set("username", data.username);

          console.log("Navigating to dashboard...")
          formik.resetForm();
          navigate("/dashboard");
          window.location.reload();
          if (onClose) onClose();
        } else {
          alert(data.message || "Invalid username or password");
        }
      } catch (error) {
        alert("Failed to log in. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
      onClick={(e) => e.stopPropagation()}
      aria-labelledby="login-modal"
      aria-modal="true"
    >
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={onClose}
        aria-label="Close login form"
      >
        ×
      </button>

      {/* Header */}
      <h2 id="login-modal" className="text-2xl font-bold text-center mb-4">Login</h2>

      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
            required
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
            required
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Signup Message */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => {
              onClose(); 
              openSignUpModal(); 
            }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
