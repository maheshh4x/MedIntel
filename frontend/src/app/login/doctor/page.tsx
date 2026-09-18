'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stethoscope, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { loginUser, getUserProfile, logoutUser } from '../../../lib/auth';
import styles from '../login.module.css';

export default function DoctorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await loginUser(email, password);
      const profile = await getUserProfile(user.uid);

      if (!profile || profile.role !== 'DOCTOR') {
        await logoutUser();
        setError(`Access denied. Account is registered as ${profile?.role || 'another role'}, not a Doctor.`);
        setIsLoading(false);
        return;
      }

      router.push('/doctor/dashboard');
    } catch (authError: unknown) {
      console.error('Doctor login error:', authError);
      const code = authError instanceof Error && 'code' in authError
        ? String(authError.code)
        : '';
      if (code === 'auth/invalid-credential') {
        setError('The email or password is incorrect.');
      } else {
        setError('Unable to sign in to Doctor Workbench. Check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} /> All Login Options
          </Link>
        </div>

        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.iconWrapper} style={{ background: '#ecfdf5', color: '#059669' }}>
              <Stethoscope size={24} color="#059669" />
            </div>
          </div>
          <h1 className={styles.title}>Doctor Login</h1>
          <p className={styles.subtitle}>Sign in to access your physician workbench</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            icon={<Mail size={18} />}
            type="email"
            placeholder="Doctor Email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            fullWidth
          />
          <Input
            icon={<Lock size={18} />}
            type="password"
            placeholder="Password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            fullWidth
          />

          {error && <p role="alert" className={styles.error}>{error}</p>}

          <Button type="submit" fullWidth size="lg" disabled={isLoading}>
            {isLoading ? 'Verifying Doctor Credentials...' : 'Sign In as Doctor'}
          </Button>
        </form>

        <div className={styles.modeSwitch} style={{ flexDirection: 'column', gap: '0.5rem', marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Doctor accounts are provisioned by Hospital Administration.
          </p>
        </div>
      </div>
    </main>
  );
}
