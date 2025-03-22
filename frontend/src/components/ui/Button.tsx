import React, { ButtonHTMLAttributes } from 'react';
import '../../styles/buttonAnimations.css';
import { chatStyles } from '../../styles/chatStyles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'selected' | 'nav';
  animation?: 'slide' | 'grow' | 'pulse' | 'fade' | 'none';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  animation = 'slide',
  fullWidth = false,
  className = '',
  children, 
  ...props 
}) => {

  // Variant styles
  const variantStyles = {
    default: {},
    selected: {
      border: '2px solid rgb(62, 0, 100)',
    },
    nav: {
      margin: '0 4px',
    }
  };

  // Animation classes
  const animationClass = animation !== 'none' ? `btn-${animation}` : '';

  return (
    <button
      className={`${animationClass} ${className}`}
      style={{
        ...chatStyles.modularButtonStyle,
        ...variantStyles[variant],
        width: fullWidth ? '95%' : 'auto',
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 