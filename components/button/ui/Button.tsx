import { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  id,
  onClick,
  type = "button",
  variant = "primary",
  className,
}) => {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      className={clsx(styles.button, styles[variant], className)}
    >
      {children}
    </button>
  );
};
export default Button;
