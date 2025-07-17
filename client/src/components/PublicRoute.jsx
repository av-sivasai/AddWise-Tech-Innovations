import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.user);

  // If user is logged in, redirect to appropriate dashboard
  if (user.isLoggedIn) {
    return <Navigate to={user.user.role === 'admin' ? '/admin' : '/user'} replace />;
  }

  return children;
};

export default PublicRoute; 