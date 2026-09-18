// Shared navigation items for all admin pages
// This file centralizes the admin navigation menu to ensure consistency across the admin UI.
// Import icons from lucide-react; the DashboardLayout component expects each item to have `label`, `href`, and `icon`.

import { LayoutDashboard, ShieldCheck, Users, Stethoscope, Calendar, BarChart } from 'lucide-react';

export const adminNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'User Directory & Roles', href: '/admin/users', icon: <ShieldCheck size={20} /> },
  { label: 'Manage Patients', href: '/admin/patients', icon: <Users size={20} /> },
  { label: 'Manage Doctors', href: '/admin/doctors', icon: <Stethoscope size={20} /> },
  { label: 'Appointments', href: '/admin/appointments', icon: <Calendar size={20} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart size={20} />, active: true },
];
