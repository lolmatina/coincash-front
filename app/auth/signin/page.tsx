"use client";
import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { AuthResponse, ApiError } from '@/types/auth';
import Link from 'next/link';
import { Button, Input, Card } from '@/components';
import styles from './page.module.scss';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setEmail: setAuthEmail, setStep } = useAuthStore();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>('/api/v1/auth', { email, password });
      const { user, token } = response.data;

      console.log(response.data);
      
      // Set token cookie for authenticated user - simplified version
      document.cookie = `token=${token}; path=/; max-age=${24 * 60 * 60}`;
      console.log('🍪 [SIGNIN] Setting simplified cookie');
      
      // Also try localStorage as backup
      localStorage.setItem('token', token);
      
      setAuthEmail(email);
      
      if (!user.email_verified_at) {
        setStep('verify');
        router.push('/auth/signup/verify');
        return;
      }
      
      if (!user.documents_submitted_at) {
        setStep('documents');
        router.push('/auth/signup/documents');
        return;
      }
      
      if (user.documents_submitted_at && !user.documents_verified_at) {
        router.push('/auth/verification-pending');
        return;
      }
      
      router.push('/');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <div className={styles.header}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </Link>
          <h1 className={styles.title}>Добро пожаловать в <br /><span>COIN CASH!</span></h1>
          <p className={styles.subtitle}>Войдите в ваш аккаунт</p>
        </div>

        {/* Form Card */}
        <Card className={styles.formCard} glass>
          <form onSubmit={onSubmit} className={styles.form}>
            {/* Email Field */}
            <Input
              label="Электронная почта"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите вашу электронную почту"
              required
              icon={
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />

            {/* Password Field */}
            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите ваш пароль"
              required
              icon={
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage}>
                <div className={styles.errorContent}>
                  <svg fill="#fff" stroke="#fff" viewBox="0 0 24 24">
                    <path strokeLinecap="round" color="#fff" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              size="lg"
              style={{ width: '100%' }}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>

          {/* Links */}
          <div className={styles.links}>
            <div className={styles.forgotPassword}>
              <Link href="#">
                Забыли пароль?
              </Link>
            </div>
            
            <div className={styles.divider}>
              <span>Нет аккаунта?</span>
            </div>

            <div className={styles.signupLink}>
              <Link href="/auth/signup">
                <Button variant="outline" size="lg" style={{ width: '100%' }}>
                  <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Создать аккаунт
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


