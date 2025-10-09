import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Get the authentication status from the Redux store
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If the user is authenticated, render the child component (using <Outlet />).
  // Otherwise, redirect them to the /login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
