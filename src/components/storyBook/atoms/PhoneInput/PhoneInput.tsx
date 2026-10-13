'use client';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { PhoneInputProps } from './PhoneInput.type';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { settingsSelector } from '@/redux/reducers/settingsSlice';

const sizeClasses: Record<NonNullable<PhoneInputProps['size']>, string> = {
    sm: 'text-base!',
    md: 'text-base!',
    lg: 'text-base!',
};

const PhoneInput: React.FC<PhoneInputProps> = ({
    variant = 'outline',
    size = 'md',
    label,
    required = false,
    helperText,
    error,
    fullWidth = false,
    value,
    country,
    onChange,
    enableSearch = true,
    searchPlaceholder = 'Search country...',
    disabled = false,
}) => {
    const hasError = !!error || variant === 'error';
    const wrapperRef = useRef<HTMLDivElement>(null);

    const settingsData = useSelector(settingsSelector);

    useEffect(() => {
        const searchInput = wrapperRef.current?.querySelector<HTMLInputElement>('.search-box');
        if (searchInput) {
            searchInput.setAttribute('autocomplete', 'off');
        }
    });

    return (
        <div ref={wrapperRef} className={fullWidth ? 'w-full' : ''}>
            {label && (
                <label className={`block text-sm md:text-base mb-1.5 ${required ? 'requireInput' : ''}`}>
                    {label}
                </label>
            )}

            <div>
                <ReactPhoneInput
                    country={settingsData?.general_config?.country_code}
                    value={value}
                    onChange={onChange}
                    enableSearch={enableSearch}
                    searchPlaceholder={searchPlaceholder}
                    disabled={disabled}
                    inputClass={`w-full! bodyBg! textPrimaryColor! ${sizeClasses[size]}`}
                    buttonClass="bodyBg!"
                    containerClass={`w-full! phoneCustomInput ${hasError ? 'phone-input-error' : ''}`}
                    searchClass="bodyBg! textPrimaryColor! text-base!"
                    dropdownClass="bodyBg! textPrimaryColor!"
                />
            </div>

            {error
                ? <p className="mt-1 text-xs errorColor">{error}</p>
                : helperText && <p className="mt-1 text-xs textSecondaryColor">{helperText}</p>
            }
        </div>
    );
};

export default PhoneInput;
