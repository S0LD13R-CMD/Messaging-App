import React, { ButtonHTMLAttributes } from 'react';
import '../../styles/buttonAnimations.css';

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
  // Base styles to match the navigation buttons
  const baseStyle = {
    backgroundColor: 'black',
    color: 'white',
    border: '2px solid white',
    borderRadius: '12px',
    margin: '4px',
    padding: '8px 10px',
    width: fullWidth ? '90%' : 'auto',
    textAlign: 'center' as const,
  };

  // Variant styles
  const variantStyles = {
    default: {},
    selected: {
      backgroundColor: 'rgb(62, 0, 100)',
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
        ...baseStyle,
        ...variantStyles[variant],
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 