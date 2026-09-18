'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, ArrowLeft } from 'lucide-react';

import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import {
  loginUser,
  getUserProfile,
  logoutUser,
} from '../../../lib/auth';

import styles from '../login.module.css';

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      console.log('========== ADMIN LOGIN START ==========');

      console.log('Email entered:', email);

      // --------------------------------------------------
      // STEP 1: Firebase Authentication
      // --------------------------------------------------

      const user = await loginUser(email, password);

      console.log('AUTHENTICATION SUCCESS');
      console.log('Firebase UID:', user.uid);
      console.log('Firebase Email:', user.email);

      await user.getIdToken(true);

      // --------------------------------------------------
      // STEP 2: Get Firestore user profile
      // --------------------------------------------------

      console.log(
        'Reading Firestore document:',
        `users/${user.uid}`
      );

      const profile = await getUserProfile(user.uid);

      console.log('Firestore profile:', profile);

      // --------------------------------------------------
      // STEP 3: Check whether profile exists
      // --------------------------------------------------

      if (!profile) {
        console.error(
          'NO USER PROFILE FOUND FOR UID:',
          user.uid
        );

        await logoutUser();

        setError(
          'Login successful, but no user profile was found in Firestore.'
        );

        return;
      }

      // --------------------------------------------------
      // STEP 4: Show role information
      // --------------------------------------------------

      console.log('Firestore role:', profile.role);
      console.log('Firestore active:', profile.isActive);

      // --------------------------------------------------
      // STEP 5: Check ADMIN role
      // --------------------------------------------------

      if (profile.role !== 'ADMIN') {
        console.error(
          'WRONG ROLE. Expected ADMIN but received:',
          profile.role
        );

        await logoutUser();

        setError(
          `Access denied. Your account role is "${profile.role}", not "ADMIN".`
        );

        return;
      }

      // --------------------------------------------------
      // STEP 6: Check account status
      // --------------------------------------------------

      if (profile.isActive !== true) {
        console.error(
          'ACCOUNT IS INACTIVE'
        );

        await logoutUser();

        setError(
          'Your administrator account is inactive.'
        );

        return;
      }

      // --------------------------------------------------
      // STEP 7: Everything is correct
      // --------------------------------------------------

      console.log('ADMIN AUTHORIZATION SUCCESS');
      console.log('Redirecting to /admin/dashboard');

      router.push('/admin/dashboard');

    } catch (authError: unknown) {

      console.error(
        '========== ADMIN LOGIN ERROR =========='
      );

      console.error(
        'FULL ERROR:',
        authError
      );

      // Firebase errors normally contain code/message.
      const error = authError as {
        code?: string;
        message?: string;
      };

      console.error(
        'ERROR CODE:',
        error.code
      );

      console.error(
        'ERROR MESSAGE:',
        error.message
      );

      // --------------------------------------------------
      // Firebase Authentication errors
      // --------------------------------------------------

      if (
        error.code === 'auth/invalid-credential'
      ) {
        setError(
          'The email or password is incorrect.'
        );

      } else if (
        error.code === 'auth/user-not-found'
      ) {
        setError(
          'No Firebase Authentication account exists for this email.'
        );

      } else if (
        error.code === 'auth/wrong-password'
      ) {
        setError(
          'The password is incorrect.'
        );

      } else if (
        error.code === 'auth/invalid-email'
      ) {
        setError(
          'The email address is invalid.'
        );

      } else if (
        error.code === 'auth/too-many-requests'
      ) {
        setError(
          'Too many login attempts. Please wait and try again.'
        );

      } else if (
        error.code === 'permission-denied' ||
        error.code === 'firestore/permission-denied'
      ) {
        setError(
          'Firebase denied access to the user profile. Check Firestore Security Rules.'
        );

      } else {

        setError(
          `Login failed: ${error.code || 'unknown-error'
          }`
        );
      }

    } finally {

      setIsLoading(false);

      console.log(
        '========== ADMIN LOGIN END =========='
      );
    }
  };

  return (
    <main className={styles.loginPage}>

      <div className={styles.loginContainer}>

        {/* Back to login options */}

        <div style={{ marginBottom: '1rem' }}>

          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem',
            }}
          >

            <ArrowLeft size={16} />

            All Login Options

          </Link>

        </div>


        {/* Header */}

        <div className={styles.header}>

          <div className={styles.logo}>

            <div
              className={styles.iconWrapper}
              style={{
                background: '#fef2f2',
                color: '#dc2626',
              }}
            >

              <ShieldCheck
                size={24}
                color="#dc2626"
              />

            </div>

          </div>


          <h1 className={styles.title}>
            Admin Login
          </h1>


          <p className={styles.subtitle}>
            Sign in to access system administration & analytics
          </p>

        </div>


        {/* Login Form */}

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          {/* Email */}

          <Input
            icon={<Mail size={18} />}
            type="email"
            placeholder="Admin Email"
            label="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            autoComplete="email"
            required
            fullWidth
          />


          {/* Password */}

          <Input
            icon={<Lock size={18} />}
            type="password"
            placeholder="Password"
            label="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="current-password"
            required
            fullWidth
          />


          {/* Error */}

          {error && (
            <p
              role="alert"
              className={styles.error}
            >
              {error}
            </p>
          )}


          {/* Submit */}

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={isLoading}
          >

            {isLoading
              ? 'Verifying Admin Access...'
              : 'Sign In as Admin'}

          </Button>

        </form>


        {/* Footer */}

        <div
          className={styles.modeSwitch}
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
          }}
        >

          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              margin: 0,
            }}
          >
            System Administrator credentials are
            restricted to authorized operators.
          </p>

        </div>

      </div>

    </main>
  );
}