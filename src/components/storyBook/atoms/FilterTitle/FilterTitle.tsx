'use client';

import React, { useState } from 'react';
import { PiCaretDown } from 'react-icons/pi';
import { Typography } from '../Typography';
import { FilterTitleProps } from './FilterTitle.type';
import Divider from '../Divider';

const FilterTitle: React.FC<FilterTitleProps> = ({
    title,
    children,
    defaultOpen = true,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div>
            {/* ── Header row (clickable) ── */}
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className={`w-full hidden md:flex items-center justify-between py-4 cursor-pointer ${className}`}
            >
                <Typography variant="h5" weight="semibold" className='first-letter:capitalize'>
                    {title}
                </Typography>
                <PiCaretDown
                    className={`text-gray-900 text-xl shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>
            <button
                className={`w-full flex items-center justify-between pt-2 cursor-pointer md:hidden ${className}`}
            >
                <Typography variant="h5" weight="semibold">
                    {title}
                </Typography>
            </button>

            <Divider width='bleed' className='hidden md:block'/>

            {/* ── Collapsible content ── */}
            {children && (
                <div
                    className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-full opacity-100 pt-4' : 'max-h-0 opacity-0'}`}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default FilterTitle;
