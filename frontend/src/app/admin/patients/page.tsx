'use client';

import { AdminPatients } from '../../../components/ui/AdminPatients';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { adminNavItems } from '../../../components/layout/adminNavItems';

export default function AdminPatientsPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navItems={adminNavItems} userRole="Admin" userName="Admin Operator">
        <AdminPatients />
      </DashboardLayout>
    </ProtectedRoute>
  );
}