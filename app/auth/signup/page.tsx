"use client";
import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { SignupResponse, ApiError } from '@/types/auth';
import Link from 'next/link';
import { Button, Input, Card } from '@/components';
import styles from './page.module.scss';

export default function RegisterPage() {
  const { setEmail, setStep } = useAuthStore();
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmailLocal] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post<SignupResponse>('/api/v1/auth/signup', { name, lastname, email, password });
      setEmail(email);
      setStep('verify');
      router.push('/auth/signup/verify');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || 'Ошибка регистрации');
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
          <h1 className={styles.title}>Создайте аккаунт <br /><span>COIN CASH</span></h1>
          <p className={styles.subtitle}>Присоединяйтесь к лучшему сервису обмена криптовалют</p>
        </div>

        {/* Form Card */}
        <Card className={styles.formCard} glass>
          <form onSubmit={onSubmit} className={styles.form}>
            {/* Name Fields */}
            <div className={styles.nameFields}>
              <Input
                label="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                required
              />
              <Input
                label="Фамилия"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Ваша фамилия"
                required
              />
            </div>

            {/* Email Field */}
            <Input
              label="Электронная почта"
              type="email"
              value={email}
              onChange={(e) => setEmailLocal(e.target.value)}
              placeholder="Введите вашу электронную почту"
              required
              icon={
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />

            {/* Password Field */}
            <div className={styles.passwordField}>
              <Input
                label="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Создайте надежный пароль"
                required
                minLength={6}
                icon={
                  <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
              <p className={styles.passwordHint}>Минимум 6 символов</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage}>
                <div className={styles.errorContent}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className={styles.signinLink}>
            <p>
              Уже есть аккаунт?{' '}
              <Link href="/auth/signin">
                Войти здесь
              </Link>
            </p>
          </div>
        </Card>

        {/* Steps Indicator */}
        <div className={styles.stepsIndicator}>
          <div className={styles.steps}>
            <div className={`${styles.step} ${styles.active}`}>1</div>
            <div className={styles.divider}></div>
            <div className={`${styles.step} ${styles.inactive}`}>2</div>
            <div className={styles.divider}></div>
            <div className={`${styles.step} ${styles.inactive}`}>3</div>
          </div>
        </div>
        <div className={styles.stepsLabels}>
          <div className={styles.labels}>
            <span className={`${styles.label} ${styles.active}`}>Аккаунт</span>
            <span className={`${styles.label} ${styles.inactive}`}>Подтверждение почты</span>
            <span className={`${styles.label} ${styles.inactive}`}>Документы</span>
          </div>
        </div>
      </div>
    </div>
  );
}


