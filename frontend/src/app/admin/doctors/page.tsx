'use client';

import { AdminDoctors } from '../../../components/ui/AdminDoctors';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { adminNavItems } from '../../../components/layout/adminNavItems';

export default function AdminDoctorsPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navItems={adminNavItems} userRole="Admin" userName="Admin Operator">
        <AdminDoctors />
      </DashboardLayout>
    </ProtectedRoute>
  );
}