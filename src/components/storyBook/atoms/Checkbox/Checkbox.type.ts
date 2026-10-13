export interface CheckboxProps {
    /** Checked state */
    checked?: boolean;
    /** Indeterminate state (partially checked) */
    indeterminate?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Shows error styling */
    error?: boolean;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Label text */
    label?: string;
    /** Helper text shown below */
    helperText?: string;
    /** Error message (shown when error=true) */
    errorMessage?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Additional classes for wrapper */
    className?: string;
    /** onChange handler - receives the new boolean value */
    onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
    /** Unique id - auto-generated if not provided */
    id?: string;
}
