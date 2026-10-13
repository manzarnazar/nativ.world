'use client';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const EventCardSkeleton = ({ className = '' }: { className?: string }) => {
    return (
        <>
            {/* Desktop Skeleton */}
            <div className={`hidden md:block relative w-full rounded-2xl overflow-hidden h-[427px] lg:h-[535px] ${className}`}>
                
                {/* Background Image Skeleton */}
                <Skeleton className="absolute inset-0 w-full h-full" />

                {/* Overlay Card */}
                <div className="absolute inset-0 z-10 flex items-stretch h-full">
                    <div className="bg-white rounded-2xl sm:m-8 lg:m-12 p-5 sm:p-6 flex flex-col justify-between w-full max-w-[300px] sm:max-w-[320px] md:max-w-[343px] shadow-lg">

                        {/* Title + Description */}
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-3/4 rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-5/6 rounded-md" />
                        </div>

                        {/* Feature list */}
                        <div className="space-y-4 mt-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-5 rounded-full" />
                                    <Skeleton className="h-4 w-3/4 rounded-md" />
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <Skeleton className="h-10 w-full rounded-lg mt-6" />
                    </div>
                </div>
            </div>

            {/* Mobile Skeleton */}
            <div className={`md:hidden flex flex-col rounded-2xl border overflow-hidden bg-white p-3 gap-y-4 ${className}`}>

                {/* Image */}
                <Skeleton className="max-399:h-[120px] h-[160px] w-full rounded-lg" />

                {/* Content */}
                <div className="flex flex-col gap-2">

                    {/* Title */}
                    <Skeleton className="h-5 w-3/4 rounded-md" />

                    {/* Description */}
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />

                    {/* Features */}
                    <div className="space-y-4 my-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-4 w-3/4 rounded-md" />
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </div>
        </>
    );
};

export default EventCardSkeleton;