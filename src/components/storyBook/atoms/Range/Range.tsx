'use client';
import React, { useState } from 'react';

import { Slider } from '@/components/ui/slider';
import { RangeProps } from './Range.type';
import Input from '../Input/Input';

const Range: React.FC<RangeProps> = ({
    min = 1,
    max = 5000,
    value,
    defaultValue,
    step = 1,
    prefix = '$',
    minLabel = 'Min Price',
    maxLabel = 'Max Price',
    onChange,
    onChangeEnd,
    className = '',
}) => {
    const initial: [number, number] = defaultValue ?? value ?? [min, max];
    const [range, setRange] = useState<[number, number]>(initial);

    // Keep in sync when controlled externally
    const current: [number, number] = value ?? range;

    const handleSliderChange = (vals: number[]) => {
        const next: [number, number] = [vals[0], vals[1]];
        setRange(next);
        onChange?.(next);
    };

    const handleSliderCommit = (vals: number[]) => {
        const next: [number, number] = [vals[0], vals[1]];
        onChangeEnd?.(next);
    };

    const handleMinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = Number(e.target.value);
        if (isNaN(num)) return;
        const next: [number, number] = [Math.min(num, current[1] - step), current[1]];
        setRange(next);
        onChange?.(next);
    };

    const handleMaxInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = Number(e.target.value);
        if (isNaN(num)) return;
        const next: [number, number] = [current[0], Math.max(num, current[0] + step)];
        setRange(next);
        onChange?.(next);
    };

    return (
        <div className={`w-full space-y-4 ${className}`}>

            {/* Labels above slider */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold primaryColor">
                    {prefix}{current[0]}
                </span>
                <span className="text-sm font-semibold primaryColor">
                    {prefix}{current[1]}
                </span>
            </div>

            {/* Shadcn dual-thumb slider */}
            <Slider
                min={min}
                max={max}
                step={step}
                value={current}
                onValueChange={handleSliderChange}
                onValueCommit={handleSliderCommit}
                className="w-full"
            />

            {/* Min / Max input boxes */}
            <div className="flex items-center gap-3 pt-1">
                {/* Min */}
                <div className="flex-1">
                    <Input
                        label={minLabel}
                        type="number"
                        value={current[0]}
                        min={min}
                        max={current[1] - step}
                        step={step}
                        onChange={handleMinInput}
                        onBlur={() => onChangeEnd?.(current)}
                        variant="outline"
                        fullWidth
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                {/* Separator */}
                <span className="text-gray-400 font-medium mt-6">-</span>

                {/* Max */}
                <div className="flex-1">
                    <Input
                        label={maxLabel}
                        type="number"
                        value={current[1]}
                        min={current[0] + step}
                        max={max}
                        step={step}
                        onChange={handleMaxInput}
                        onBlur={() => onChangeEnd?.(current)}
                        variant="outline"
                        fullWidth
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default Range;
