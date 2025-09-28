"use client";
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { DocumentSubmissionResponse, ApiError } from '@/types/auth';
import styles from './page.module.scss';

export default function DocumentsPage() {
  const { email, setStep, setEmail } = useAuthStore();
  const [localEmail, setLocalEmail] = useState(email || '');
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
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
        if (stored) {
          setLocalEmail(stored);
          setEmail(stored);
        }
      }
    }
  }, [localEmail, email, setEmail]);

  const onSubmit = async () => {
    if (!localEmail || !front || !back || !selfie) {
      setError('Email and all 3 files are required');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append('email', localEmail);
      form.append('files', front);
      form.append('files', back);
      form.append('files', selfie);
      await api.post<DocumentSubmissionResponse>('/api/v1/auth/documents', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setInfo('Documents submitted. You will be able to login after approval.');
      setStep('login');
      // Redirect to signin page after successful submission
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.response?.data?.message || 'Failed to submit documents');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className={styles.title}>Загрузите ваши документы</h1>
          <p className={styles.description}>Загрузите документы, удостоверяющие личность, для верификации</p>
          {localEmail && (
            <p className={styles.emailDisplay}>{localEmail}</p>
          )}
        </div>

        {/* Form Card */}
        <div className={styles.formCard}>
          <div className={styles.content}>
            {/* Instructions */}
            <div className={styles.instructions}>
              <div className={styles.instructionsContent}>
                <svg className={styles.instructionsIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className={styles.instructionsText}>
                  <h3 className={styles.title}>Требования к документам</h3>
                  <div className={styles.list}>
                    <div>• Четкие, высококачественные изображения (PNG, JPG, JPEG)</div>
                    <div>• Весь текст должен быть читаемым и не размытым</div>
                    <div>• Документы должны быть хорошо освещены и лежать ровно</div>
                    <div>• На селфи должно быть четко видно ваше лицо с документом</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Areas */}
            <div className={styles.uploadGrid}>
              {/* Document Front */}
              <div className={styles.uploadField}>
                <label className={styles.label}>Лицевая сторона документа</label>
                <div className={`${styles.uploadArea} ${front ? styles.hasFile : ''}`}>
                  <div className={styles.uploadContent}>
                    {front ? (
                      <>
                        <svg className={`${styles.uploadIcon} ${styles.success}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className={`${styles.fileName} ${styles.success}`}>{front.name}</p>
                        <p className={`${styles.fileStatus} ${styles.success}`}>Файл успешно загружен</p>
                      </>
                    ) : (
                      <>
                        <svg className={`${styles.uploadIcon} ${styles.default}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className={`${styles.fileName} ${styles.default}`}>Загрузить лицевую сторону</p>
                        <p className={`${styles.fileStatus} ${styles.default}`}>Нажмите, чтобы выбрать файл</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFront(e.target.files?.[0] || null)}
                    className={styles.fileInput}
                  />
                </div>
              </div>

              {/* Document Back */}
              <div className={styles.uploadField}>
                <label className={styles.label}>Обратная сторона документа</label>
                <div className={`${styles.uploadArea} ${back ? styles.hasFile : ''}`}>
                  <div className={styles.uploadContent}>
                    {back ? (
                      <>
                        <svg className={`${styles.uploadIcon} ${styles.success}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className={`${styles.fileName} ${styles.success}`}>{back.name}</p>
                        <p className={`${styles.fileStatus} ${styles.success}`}>Файл успешно загружен</p>
                      </>
                    ) : (
                      <>
                        <svg className={`${styles.uploadIcon} ${styles.default}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className={`${styles.fileName} ${styles.default}`}>Загрузить обратную сторону</p>
                        <p className={`${styles.fileStatus} ${styles.default}`}>Нажмите, чтобы выбрать файл</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBack(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Selfie Upload */}
            <div className={styles.selfieField}>
              <label className={styles.label}>Селфи с документом</label>
              <div className={`${styles.uploadArea} ${selfie ? styles.hasFile : ''}`}>
                <div className={styles.uploadContent}>
                  {selfie ? (
                    <>
                      <svg className={`${styles.uploadIcon} ${styles.success}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className={`${styles.fileName} ${styles.success}`}>{selfie.name}</p>
                      <p className={`${styles.fileStatus} ${styles.success}`}>Селфи успешно загружено</p>
                    </>
                  ) : (
                    <>
                      <svg className={`${styles.uploadIcon} ${styles.default}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className={`${styles.fileName} ${styles.default}`}>Загрузить селфи с документом</p>
                      <p className={`${styles.fileStatus} ${styles.default}`}>Держите документ рядом с лицом и сделайте четкое фото</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelfie(e.target.files?.[0] || null)}
                  className={styles.fileInput}
                />
              </div>
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

            {/* Submit Button */}
            <button
              disabled={loading || !localEmail || !front || !back || !selfie}
              onClick={onSubmit}
              className={styles.submitButton}
            >
              <div className={styles.buttonContent}>
                {loading ? (
                  <>
                    <svg className={`${styles.buttonIcon} ${styles.spinner}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Отправка документов...
                  </>
                ) : (
                  <>
                    <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Отправить документы
                  </>
                )}
              </div>
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
            <div className={`${styles.step} ${styles.completed}`}>
              <svg className={styles.stepIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className={`${styles.connector} ${styles.current}`}></div>
            <div className={`${styles.step} ${styles.current}`}>3</div>
          </div>
        </div>
        <div className={styles.stepsLabels}>
          <div className={styles.labelsContainer}>
            <span className={`${styles.label} ${styles.completed}`}>Аккаунт</span>
            <span className={`${styles.label} ${styles.completed}`}>Подтверждение почты</span>
            <span className={`${styles.label} ${styles.current}`}>Документы</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className={styles.securityNotice}>
          <div className={styles.securityCard}>
            <div className={styles.securityContent}>
              <svg className={styles.securityIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className={styles.securityText}>Ваши документы надежно зашифрованы и будут проверены в течение 24-48 часов</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


