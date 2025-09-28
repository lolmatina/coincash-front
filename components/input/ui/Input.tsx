import { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.scss';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && (
          <div className={styles.icon}>
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            styles.input,
            {
              [styles.withIcon]: !!icon,
              [styles.error]: !!error
            },
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className={styles.errorMessage}>{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
