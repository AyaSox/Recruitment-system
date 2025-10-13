import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React, { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [] }) => {
  const { authState, isAdmin, isRecruiter, isHiringManager, isApplicant } = useAuth();
  const location = useLocation();

  if (authState.loading) {
    // You can return a loading spinner or component here
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if the user has at least one of the required roles
  if (roles.length > 0) {
    const hasRequiredRole = roles.some((role) => {
      if (role === 'Admin') return isAdmin();
      if (role === 'Recruiter') return isRecruiter();
      if (role === 'HiringManager') return isHiringManager();
      if (role === 'Applicant') return isApplicant();
      return false;
    });

    if (!hasRequiredRole) {
      // Redirect to unauthorized page if the user doesn't have the required role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If everything is fine, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
