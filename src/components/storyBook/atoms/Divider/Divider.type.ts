export interface DividerProps {
    /**
     * 'bleed'  → w-[110%] -left-4 (bleeds past parent padding — the default)
     * 'full'   → w-full (stays within parent)
     */
    width?: 'bleed' | 'full';
    /** Additional CSS classes */
    className?: string;
}
