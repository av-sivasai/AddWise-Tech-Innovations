import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  // If user is not logged in, redirect to login
  if (!user.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is empty, allow all authenticated users
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.user.role)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={user.user.role === 'admin' ? '/admin' : '/user'} replace />;
  }

  return children;
};

export default ProtectedRoute; 