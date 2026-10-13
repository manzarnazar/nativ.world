import { ReactNode } from 'react';

export interface FilterTitleProps {
    /** Section title */
    title: string;
    /** Filter content to show/hide below the title */
    children?: ReactNode;
    /** Start open (default: true) */
    defaultOpen?: boolean;
    /** Additional CSS classes for the header row */
    className?: string;
}
