import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) {
    // Redirige al login si no hay usuario
    return <Navigate to="/login" />;
  }

  // Verifica si el userType del usuario está en los roles permitidos
  const userType = user.userType;

  if (!allowedRoles.includes(userType)) {
    // Redirige a una página de acceso denegado si el userType no está permitido
    return <Navigate to="/acceso-denegado" />;
  }

  return children;
};

export default ProtectedRoute;
