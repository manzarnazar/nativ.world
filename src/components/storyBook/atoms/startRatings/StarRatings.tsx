import React from 'react';
import { PiStarFill } from 'react-icons/pi';
import Checkbox from '../Checkbox';
import { StarRatingsProps } from './StarRatings.type';

const TOTAL = 5;

const StarRatings: React.FC<StarRatingsProps> = ({
    stars,
    checked = false,
    onChange,
    className = '',
}) => {
    return (
        <>
            {/* desktop view  */}
            <div className={`hidden md:flex items-center gap-2 ${className}`}>
                {/* Checkbox */}
                <Checkbox checked={checked} onChange={(val) => onChange?.(val)} />

                {/* Stars row */}
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: TOTAL }).map((_, i) => (
                        <PiStarFill
                            key={i}
                            className={`text-xl ${i < stars ? 'warningColor' : 'text-[#BFBFBF]'}`}
                        />
                    ))}
                </div>

                {/* Count in parentheses */}
                <span className="">({stars})</span>
            </div>
            <div className={`md:hidden ${className}`}>

                {/* mobile view  */}
                <button
                    type="button"
                    className={`flex md:hidden items-center justify-center gap-2 px-5 py-2 rounded-[30px] border transition-all ${checked ? 'primaryLightBg primaryBorder' : 'border-transparent bg-transparent'
                        } ${className}`}
                    onClick={() => onChange?.(!checked)}
                >
                    <PiStarFill className="text-xl warningColor" />
                    <span className="text-sm font-medium textPrimaryColor">{stars}</span>
                </button>
            </div>
        </>
    );
};

export default StarRatings;
