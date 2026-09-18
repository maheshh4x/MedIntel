'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in -> redirect to main login landing page
        router.replace('/login');
      } else if (role && !allowedRoles.includes(role)) {
        // Logged in but wrong role -> redirect to appropriate role dashboard or login
        if (role === 'PATIENT') router.replace('/patient/dashboard');
        else if (role === 'DOCTOR') router.replace('/doctor/dashboard');
        else if (role === 'ADMIN') router.replace('/admin/dashboard');
        else if (role === 'STAFF') router.replace('/staff/dashboard');
        else router.replace('/login');
      }
    }
  }, [user, role, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg-subtle, #f8fafc)',
        fontFamily: 'sans-serif',
        color: 'var(--color-text-muted, #64748b)'
      }}>
        <div>Verifying authentication & permissions...</div>
      </div>
    );
  }

  if (!user || (role && !allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
};
