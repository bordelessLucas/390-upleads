import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const buttonClasses = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth && 'button-full-width',
    isLoading && 'button-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="button-spinner" />
          <span>Carregando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

