import React from 'react';
import Link from 'next/link';
import { HeartPulse, Globe, Mail, Phone } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        
        {/* Brand Column */}
        <div className={styles.col}>
          <Link href="/" className={styles.logo}>
            <div className={styles.iconWrapper}>
              <HeartPulse size={24} color="var(--color-primary)" />
            </div>
            <span className={styles.brandName}>MedIntel</span>
          </Link>
          <p className={styles.desc}>
            AI-powered appointment booking and clinical intelligence for smarter, faster healthcare.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialLink}><Globe size={20} /></a>
            <a href="#" className={styles.socialLink}><Mail size={20} /></a>
            <a href="#" className={styles.socialLink}><Phone size={20} /></a>
          </div>
        </div>

        {/* Services */}
        <div className={styles.col}>
          <h4 className={styles.heading}>Services</h4>
          <Link href="/find-doctors" className={styles.link}>Find Doctors</Link>
          <Link href="/patient/appointments" className={styles.link}>Appointments</Link>
          <Link href="/patient/ai-symptom-checker" className={styles.link}>AI Symptom Checker</Link>
          <Link href="/patient/reports" className={styles.link}>Medical Reports</Link>
        </div>

        {/* Platform */}
        <div className={styles.col}>
          <h4 className={styles.heading}>Platform</h4>
          <Link href="/patient/dashboard" className={styles.link}>Patient Portal</Link>
          <Link href="/doctor/dashboard" className={styles.link}>Doctor Portal</Link>
          <Link href="/admin/dashboard" className={styles.link}>Admin Dashboard</Link>
        </div>

        {/* Company */}
        <div className={styles.col}>
          <h4 className={styles.heading}>Company</h4>
          <Link href="/about" className={styles.link}>About Us</Link>
          <Link href="/contact" className={styles.link}>Contact</Link>
          <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
          <Link href="/terms" className={styles.link}>Terms of Service</Link>
        </div>

      </div>
      
      <div className={`container ${styles.bottom}`}>
        <p>Copyright © {new Date().getFullYear()} MedIntel. All rights reserved.</p>
      </div>
    </footer>
  );
};
