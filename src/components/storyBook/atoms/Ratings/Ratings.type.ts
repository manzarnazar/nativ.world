export interface RatingsProps {
    /** Rating value to display (e.g. 4.7) */
    value: number;
    /** Stack icon and value vertically when true, inline when false */
    col?: boolean;
    /** Additional CSS classes */
    className?: string;
}
