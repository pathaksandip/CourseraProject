// AuthGuard.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    if (!token) {
      // If no token is found, redirect to the login page
      navigate("/");
    }
  }, [navigate]);

  return children;
};

export default AuthGuard;
