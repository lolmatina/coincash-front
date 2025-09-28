"use client";
import { FormEvent, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { VerificationResponse, ApiError } from '@/types/auth';
import styles from './page.module.scss';

export default function VerifyPage() {
  const { email, setStep } = useAuthStore();
  const [localEmail, setLocalEmail] = useState(email || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    if (!localEmail) {
      if (email) {
        setLocalEmail(email);
      } else if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('email');
      if (stored) setLocalEmail(stored);
    }
    }
  }, [localEmail, email]);

  const onVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post<VerificationResponse>('/api/v1/auth/email/verify', { email: localEmail, code });
      setStep('documents');
      router.push('/auth/signup/documents');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || 'Invalid or expired code');
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError(null);
    setInfo(null);
    try {
      await api.post<VerificationResponse>('/api/v1/auth/email/send', { email: localEmail });
      setInfo('Code resent. Please check your inbox.');
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || 'Failed to resend code');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className={styles.title}>Подтвердите вашу почту</h1>
          <p className={styles.description}>Мы отправили код подтверждения на вашу почту</p>
          {localEmail && (
            <p className={styles.emailDisplay}>{localEmail}</p>
          )}
        </div>

        {/* Form Card */}
        <div className={styles.formCard}>
          <form onSubmit={onVerify} className={styles.form}>
            {/* Email Field */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Электронная почта</label>
              <div className={styles.inputWrapper}>
                <input
                  className={styles.input}
                  placeholder="Введите вашу электронную почту"
                  type="email"
                  value={localEmail}
                  onChange={(e) => setLocalEmail(e.target.value)}
                  required
                />
                <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Verification Code Field */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Код подтверждения</label>
              <div className={styles.inputWrapper}>
                <input
                  className={`${styles.input} ${styles.codeInput}`}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                />
                <svg className={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className={styles.hint}>Введите 6-значный код, отправленный на вашу почту</p>
            </div>

            {/* Success Message */}
            {info && (
              <div className={`${styles.message} ${styles.success}`}>
                <div className={styles.messageContent}>
                  <svg className={styles.messageIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className={styles.messageText}>{info}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className={`${styles.message} ${styles.error}`}>
                <div className={styles.messageContent}>
                  <svg className={styles.messageIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className={styles.messageText}>{error}</p>
                </div>
              </div>
            )}

            {/* Verify Button */}
            <button
              disabled={loading || code.length !== 6}
              className={styles.submitButton}
            >
              {loading ? (
                <div className={styles.buttonContent}>
                  <svg className={`${styles.buttonIcon} ${styles.spinner}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Проверка...
                </div>
              ) : (
                <div className={styles.buttonContent}>
                  <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Подтвердить почту
                </div>
              )}
        </button>
      </form>

          {/* Resend Code */}
          <div className={styles.resendSection}>
            <p className={styles.resendText}>Не получили код?</p>
            <button
              onClick={onResend}
              className={styles.resendButton}
            >
              <svg className={styles.resendIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Отправить снова
            </button>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className={styles.stepsIndicator}>
          <div className={styles.stepsContainer}>
            <div className={`${styles.step} ${styles.completed}`}>
              <svg className={styles.stepIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className={`${styles.connector} ${styles.completed}`}></div>
            <div className={`${styles.step} ${styles.current}`}>2</div>
            <div className={`${styles.connector} ${styles.pending}`}></div>
            <div className={`${styles.step} ${styles.pending}`}>3</div>
          </div>
        </div>
        <div className={styles.stepsLabels}>
          <div className={styles.labelsContainer}>
            <span className={`${styles.label} ${styles.completed}`}>Аккаунт</span>
            <span className={`${styles.label} ${styles.current}`}>Подтверждение почты</span>
            <span className={styles.label}>Документы</span>
          </div>
        </div>

        {/* Help Text */}
        <div className={styles.helpSection}>
          <div className={styles.helpCard}>
            <div className={styles.helpContent}>
              <svg className={styles.helpIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className={styles.helpText}>
                <p className={styles.helpTitle}>Проверьте папку спам</p>
                <p className={styles.helpDescription}>Иногда наши письма попадают в спам. Код действует 10 минут.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


