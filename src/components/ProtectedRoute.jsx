import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) {
    return <Navigate to="/" />;
  }

  const userType = user.userType;

  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/acceso-denegado" />;
  }

  return children;
};

export default ProtectedRoute;
