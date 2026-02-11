import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  // BYPASS MODE: Set to true to skip authentication check
  const BYPASS_AUTH = true;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If bypass is enabled, always render the outlet (protected content)
  if (BYPASS_AUTH) {
    return <Outlet />;
  }

  // Otherwise, check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
