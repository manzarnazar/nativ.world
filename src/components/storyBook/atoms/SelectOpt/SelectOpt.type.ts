export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectOptProps {
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    /** Extra classes for the trigger button */
    triggerClassName?: string;
    className?: string;
}
