'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { HeartPulse, Menu, User, Settings, LogOut, X } from 'lucide-react';
import { FloatingAIAssistant } from '../ui/FloatingAIAssistant';
import { logoutUser } from '../../lib/auth';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardLayout.module.css';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userRole: 'Patient' | 'Doctor' | 'Admin' | 'Healthcare Staff' | 'Nurse';
  userName?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, navItems, userRole, userName }) => {
  const router = useRouter();
  const { profile, user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const handleSignOut = async () => {
    await logoutUser();
    router.push('/login');
  };

  const displayName = profile?.name || userName || (user?.email?.split('@')[0] ?? 'User');

  if (loading) {
    return null;
  }

  return (
    <div className={styles.container}>
      <button className={`${styles.overlay} ${isSidebarOpen ? styles.overlayVisible : ''}`} aria-label="Close navigation" onClick={() => setIsSidebarOpen(false)} />
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logoSection}>
          <Link href="/" className={styles.logo}>
            <div className={styles.iconWrapper}>
              <HeartPulse size={20} color="var(--color-primary)" />
            </div>
            <span className={styles.brandName}>MedIntel</span>
          </Link>
          <div className={styles.roleBadge}>{userRole}</div>
          <button className={styles.closeButton} aria-label="Close navigation" onClick={() => setIsSidebarOpen(false)}><X size={21} /></button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href} 
              className={`${styles.navItem} ${item.active ? styles.active : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.bottomNav}>
          <Link href={`/${userRole.toLowerCase().includes('staff') || userRole.toLowerCase().includes('nurse') ? 'staff' : userRole.toLowerCase()}/profile`} className={styles.navItem} onClick={() => setIsSidebarOpen(false)}>
            <Settings size={20} />
            <span>Profile Settings</span>
          </Link>
          <button type="button" className={styles.navItem} onClick={handleSignOut}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <button className={styles.menuButton} aria-label="Open navigation" aria-expanded={isSidebarOpen} onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className={styles.userProfile}>
            <div className={styles.greeting}>
              <span className={styles.hello}>Welcome,</span>
              <span className={styles.name}>{displayName}</span>
            </div>
            <div className={styles.avatar}>
              <User size={20} color="var(--color-primary)" />
            </div>
          </div>
        </header>

        <main className={styles.content}>
          {children}
        </main>
      </div>

      <FloatingAIAssistant />
    </div>
  );
};
