import React, { ButtonHTMLAttributes } from 'react';
import '../../styles/buttonAnimations.css';
import { chatStyles } from '../../styles/chatStyles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'selected' | 'nav';
  animation?: 'slide' | 'grow' | 'pulse' | 'fade' | 'none';
  fullWidth?: boolean;
  width?: string;
  height?: string;
  bgColor?: string;
  margin?: string;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  animation = 'slide',
  fullWidth = false,
  width,
  height,
  bgColor,
  margin,
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

  // Determine width based on props
  let buttonWidth = 'auto';
  if (fullWidth) {
    buttonWidth = '95%';
  } else if (width) {
    buttonWidth = width;
  }

  return (
    <button
      className={`${animationClass} ${className}`}
      style={{
        ...chatStyles.modularButtonStyle,
        ...variantStyles[variant],
        width: buttonWidth,
        height: height || undefined,
        backgroundColor: bgColor || 'black',
        margin: margin || undefined,
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 