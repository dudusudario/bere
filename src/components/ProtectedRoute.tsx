
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfileComplete?: boolean;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireProfileComplete = true,
  adminOnly = false
}) => {
  const { user, profile, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin only route and user is not admin, redirect to chat
  if (adminOnly && !isAdmin) {
    return <Navigate to="/chat" replace />;
  }

  // If profile is required but not complete, redirect to profile setup
  if (requireProfileComplete && profile && !profile.email_confirmed) {
    return <Navigate to="/email-confirmation" replace />;
  }

  // If profile is required but not complete, redirect to profile setup
  if (requireProfileComplete && (!profile || !profile.full_name || !profile.address || !profile.cpf_cnpj)) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
