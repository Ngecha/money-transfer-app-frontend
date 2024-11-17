
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom"; 
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { handleLogin } = useOutletContext(); 

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      setError("");
      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const data = await response.json();
          Cookies.set("token", data.token);
          Cookies.set("username", data.username);

          handleLogin(data.username);
          navigate("/dashboard");
        } else {
          setError("Invalid username or password");
        }
      } catch (error) {
        setError("Failed to log in. Please try again.");
      }
    },
  });

  return (
    <div className="login-form">
      <form onSubmit={formik.handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <p style={{ color: "red" }}>{formik.errors.username}</p>
          ) : null}
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <p style={{ color: "red" }}>{formik.errors.password}</p>
          ) : null}
        </div>
        <button className="login-btn" type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
