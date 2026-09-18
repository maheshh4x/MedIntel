'use client';

import { AdminAppointments } from '../../../components/ui/AdminAppointments';
import { ProtectedRoute } from '../../../components/layout/ProtectedRoute';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { adminNavItems } from '../../../components/layout/adminNavItems';

export default function AdminAppointmentsPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout navItems={adminNavItems} userRole="Admin" userName="Admin Operator">
        <AdminAppointments />
      </DashboardLayout>
    </ProtectedRoute>
  );
}