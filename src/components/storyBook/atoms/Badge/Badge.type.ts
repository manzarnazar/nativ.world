import React from 'react';

export interface BadgeProps {
    /** Text content of the badge */
    label: string;
    /** Icon to render before the label */
    iconLeft?: React.ReactNode;
    /** Icon to render after the label */
    iconRight?: React.ReactNode;
    /** Color variant */
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Border radius variant */
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    /** Custom CSS classes */
    className?: string;
}
