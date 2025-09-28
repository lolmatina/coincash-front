import { ReactNode } from 'react';
import styles from './Card.module.scss';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  glass?: boolean;
}

export default function Card({ 
  children, 
  className = '', 
  hover = true, 
  padding = 'md',
  glass = false
}: CardProps) {
  return (
    <div className={clsx(
      styles.card,
      styles[padding],
      {
        [styles.hoverScale]: hover,
        [styles.glass]: glass
      },
      className
    )}>
      {children}
    </div>
  );
}
