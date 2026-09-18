import React from 'react';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './Navbar.module.css';

export const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navbarInner}`}>
        <Link href="/" className={styles.logo}>
          <div className={styles.iconWrapper}>
            <HeartPulse size={24} color="var(--color-primary)" />
          </div>
          <span className={styles.brandName}>MedIntel</span>
        </Link>

        <nav className={styles.navLinks}>
          <Link href="/" className={styles.link}>Home</Link>
          <Link href="/find-doctors" className={styles.link}>Find Doctors</Link>
          <Link href="/patient/dashboard" className={styles.link}>Patient Portal</Link>
          <Link href="/staff/intake" className={styles.link}>Nurse Intake Desk</Link>
          <Link href="/doctor/dashboard" className={styles.link}>Doctor Workbench</Link>
          <Link href="/admin/dashboard" className={styles.link}>Admin Portal</Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/login" className={styles.authLink}>Sign In</Link>
          <Link href="/patient/dashboard">
            <Button variant="primary">Book Appointment</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
