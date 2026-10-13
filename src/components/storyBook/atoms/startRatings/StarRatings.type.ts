export interface StarRatingsProps {
    /** Number of filled stars (1–5) */
    stars: 1 | 2 | 3 | 4 | 5;
    /** Whether this row is checked */
    checked?: boolean;
    /** Change handler */
    onChange?: (checked: boolean) => void;
    /** Additional CSS classes */
    className?: string;
}
