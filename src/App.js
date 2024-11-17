import React, { useState, useEffect } from "react";
import { Outlet,useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Cookies from "js-cookie";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setIsAuthenticated(true);
      setUsername(user);
    }
  }, []);

  const handleLogin = (loggedInUser) => {
    setIsAuthenticated(true);
    setUsername(loggedInUser);
    Cookies.set("username", loggedInUser);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    Cookies.remove("username");
    navigate("/")
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} username={username} handleLogout={handleLogout} />
      <div className="content">
        <Outlet context={{ handleLogin, isAuthenticated, username }} /> 
      </div>
    </div>
  );
};

export default App;