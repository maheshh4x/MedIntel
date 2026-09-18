'use client';

import { AdminUsers } from '../../../components/ui/AdminUsers';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { adminNavItems } from '../../../components/layout/adminNavItems';

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navItems={adminNavItems} userRole="Admin" userName="Admin Operator">
        <AdminUsers />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
