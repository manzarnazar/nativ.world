import React from 'react';
import { DividerProps } from './Divider.type';

const Divider: React.FC<DividerProps> = ({ width = 'full', className = '' }) => {
    const classes = [
        'bg-[var(--neutral-200)] h-px relative',
        width === 'bleed' ? 'w-[150%] -left-8' : 'w-full',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classes} />;
};

export default Divider;
