'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartPulse, Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { loginUser, registerUser, getUserProfile, logoutUser } from '../../../lib/auth';
import styles from '../login.module.css';

export default function PatientLogin() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (isRegistering) {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        await registerUser(email, password, fullName.trim(), 'PATIENT');
        router.push('/patient/dashboard');
      } else {
        const user = await loginUser(email, password);
        const profile = await getUserProfile(user.uid);

        if (!profile || profile.role !== 'PATIENT') {
          await logoutUser();
          setError(`Access denied. Account is registered as ${profile?.role || 'another role'}, not a Patient.`);
          setIsLoading(false);
          return;
        }

        router.push('/patient/dashboard');
      }
    } catch (authError: unknown) {
      console.error('Patient login error:', authError);
      const code = authError instanceof Error && 'code' in authError
        ? String(authError.code)
        : '';
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (code === 'auth/invalid-credential') {
        setError('The email or password is incorrect.');
      } else {
        setError(isRegistering
          ? 'Unable to create patient account. Please try again.'
          : 'Unable to sign in. Check your credentials.');
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
          <Link href="/" className={styles.logo}>
            <div className={styles.iconWrapper}>
              <HeartPulse size={24} color="var(--color-primary)" />
            </div>
          </Link>
          <h1 className={styles.title}>{isRegistering ? 'Patient Registration' : 'Patient Login'}</h1>
          <p className={styles.subtitle}>
            {isRegistering ? 'Create your MedIntel patient account' : 'Sign in to access your patient portal'}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {isRegistering && (
            <Input
              icon={<UserIcon size={18} />}
              type="text"
              placeholder="Full Name"
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              fullWidth
            />
          )}

          <Input
            icon={<Mail size={18} />}
            type="email"
            placeholder="Email Address"
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
            autoComplete={isRegistering ? 'new-password' : 'current-password'}
            required
            fullWidth
          />

          {isRegistering && (
            <Input
              icon={<Lock size={18} />}
              type="password"
              placeholder="Confirm Password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              fullWidth
            />
          )}

          {error && <p role="alert" className={styles.error}>{error}</p>}

          <Button type="submit" fullWidth size="lg" disabled={isLoading}>
            {isLoading
              ? (isRegistering ? 'Creating Account...' : 'Authenticating...')
              : (isRegistering ? 'Register as Patient' : 'Sign In as Patient')}
          </Button>
        </form>

        <div className={styles.modeSwitch}>
          <span>{isRegistering ? 'Already have an account?' : 'New patient?'}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
          >
            {isRegistering ? 'Sign In' : 'Create Account'}
          </Button>
        </div>
      </div>
    </main>
  );
}
