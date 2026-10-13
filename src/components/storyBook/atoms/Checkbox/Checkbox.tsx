import React, { useEffect, useId, useRef } from 'react';
import { CheckboxProps } from './Checkbox.type';

const sizeMap = {
    sm: { box: 'h-4 w-4', label: 'text-sm', gap: 'gap-2' },
    md: { box: 'h-5 w-5', label: 'text-sm', gap: 'gap-2.5' },
    lg: { box: 'h-6 w-6', label: 'text-base', gap: 'gap-3' },
};

const Checkbox: React.FC<CheckboxProps> = ({
    checked = false,
    indeterminate = false,
    disabled = false,
    error = false,
    size = 'md',
    label,
    helperText,
    errorMessage,
    required = false,
    className = '',
    onChange,
    id,
}) => {
    const autoId = useId();
    const checkboxId = id ?? autoId;
    const inputRef = useRef<HTMLInputElement>(null);

    // React doesn't expose indeterminate as a prop — set it via ref
    useEffect(() => {
        if (inputRef.current) inputRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        onChange?.(e.target.checked, e);
    };

    const { box, label: labelSize, gap } = sizeMap[size];

    const boxClasses = [
        box,
        'shrink-0 rounded border-2 transition-colors duration-200 flex items-center justify-center',
        disabled
            ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-300'
            : error
                ? checked || indeterminate
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'border-red-500 hover:border-red-400 bg-white cursor-pointer'
                : checked || indeterminate
                    ? 'primaryBg text-white border-transparent'
                    : 'border-gray-300 hover:border-gray-400 bg-white cursor-pointer',
    ].join(' ');

    return (
        <div className={`flex items-center ${className}`}>
            <label className={`inline-flex items-center ${gap} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} htmlFor={checkboxId}>
                {/* Hidden native checkbox */}
                <input
                    ref={inputRef}
                    id={checkboxId}
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    required={required}
                    className="sr-only"
                    onChange={handleChange}
                />

                {/* Custom visual box */}
                <div className={boxClasses}>
                    {indeterminate && (
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                    {!indeterminate && checked && (
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>

                {/* Label */}
                {label && (
                    <span className={`first-letter:capitalize ${labelSize} ${disabled ? 'text-gray-400' : error ? 'text-red-700' : 'text-gray-900'}`}>
                        {label}
                        {required && <span className="errorColor ml-1">*</span>}
                    </span>
                )}
            </label>

            {/* Helper / error text */}
            {(helperText || (error && errorMessage)) && (
                <p className={`mt-1 text-xs ${error ? 'errorColor' : 'text-gray-500'}`}>
                    {error && errorMessage ? errorMessage : helperText}
                </p>
            )}
        </div>
    );
};

export default Checkbox;
