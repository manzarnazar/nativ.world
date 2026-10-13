import React from 'react';
import { ButtonProps } from './Button.type';
import FormLoader from '@/components/commonComponents/FormLoader';

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  active = false,
  className = '',
  children,
  ...props
}) => {
  // Base button classes
  const baseClasses =
    'btn_sm md:btn_md lg:btn_lg';

  // Variant classes using CSS custom properties
  const variantClasses = {
    primary:
      'primaryBg text-white hover:hoverBgColor',
    secondary:
      'bg-black text-white hover:primaryBg',
    outline:
      'border border-black',
    ghost:
      'bg-[#F7F7F7] textSecondaryColor border border-[#EDEDED]',
    text: 'bg-transparent',
    danger:
      'errorBg text-white',
    normal:
      'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300 active:bg-gray-300',
    nav_link: active
      ? 'primaryLightBg primaryColor justify-start font-medium rounded-lg'
      : 'bg-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-300 justify-start font-medium rounded-lg',
  };

  // Size classes
  const sizeClasses = {
    sm: 'btn_sm',
    md: 'btn_md',
    lg: 'btn_lg',
  };

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Combine all classes
  const buttonClasses = `${size ? `${sizeClasses[size]}` : `${baseClasses}`} ${variantClasses[variant]} ${widthClasses} ${className} transition-all flexCenter gap-2 duration-200 disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:primaryBg`;

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading && (
        <FormLoader />
      )}
      {!loading && leftIcon && (
        <span
          className={`inline-flex items-center`}
        >
          {leftIcon}
        </span>
      )}
      {
        !loading &&
        <span className={variant === 'nav_link' ? 'flex-1 text-left' : ''}>
          {children}
        </span>
      }
      {!loading && rightIcon && (
        <span
          className={`inline-flex items-center ${variant === 'nav_link' ? 'flex-shrink-0' : 'flex-shrink-0'
            }`}
        >
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
