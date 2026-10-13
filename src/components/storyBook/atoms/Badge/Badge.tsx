import React from 'react';
import { BadgeProps } from './Badge.type';

// Variant class maps — background + text color pairs
const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
    primary: 'primaryLightBg text-[var(--primary-color-700)]',
    success: 'successLightBg successColor',
    warning: 'warningLightBg warningColor',
    error: 'errorLightBg errorColor',
    info: 'primaryLightBg primaryColor',
    neutral: 'bg-gray-100 text-gray-600',
};

// Size class maps — padding + font size
const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
    sm: 'py-0.5 px-2.5 text-xs',
    md: 'py-1 px-3 text-sm',
    lg: 'py-1 px-4 text-sm',
};

// Rounded class map
const roundedClasses: Record<NonNullable<BadgeProps['rounded']>, string> = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
};

const Badge: React.FC<BadgeProps> = ({
    label,
    iconLeft,
    iconRight,
    variant = 'primary',
    size = 'lg',
    rounded = 'full',
    className = '',
}) => {
    const baseClasses =
        'inline-flex items-center gap-1.5 w-fit';

    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <span className={classes}>
            {iconLeft && (
                <span className="flex items-center shrink-0">{iconLeft}</span>
            )}
            {label}
            {iconRight && (
                <span className="flex items-center shrink-0">{iconRight}</span>
            )}
        </span>
    );
};

export default Badge;
