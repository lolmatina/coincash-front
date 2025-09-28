"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  id,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {loading && (
        <div className={styles.loadingSpinner} />
      )}
      {children}
    </button>
  );
};
export default Button;
