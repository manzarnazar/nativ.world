'use client'
import { useSelector } from 'react-redux'
import { Skeleton } from '../../ui/skeleton'
import { businessModeSelector } from '@/redux/reducers/settingsSlice'
import { BasicDetails } from '@/hooks/queries/useSettings'
import PropertiesSectionSkeleton from '../PropertiesSectionSkeleton'

// Slider section
const SliderSkeleton = () => (
    <div className="w-full h-62.5 md:h-97.5 lg:h-137.5 2xl:h-187.5 rounded-2xl relative overflow-hidden">
        <Skeleton className="w-full h-full rounded-2xl" />
        {/* SearchBar overlay */}
        <div className="absolute bottom-0 left-0 right-0 -mb-10 px-4 hidden md:block">
            <Skeleton className="w-full h-16 rounded-xl" />
        </div>
    </div>
)

// AboutUs section
const AboutUsSkeleton = () => (
    <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20">
            {/* Text col */}
            <div className="flex flex-col gap-4">
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-3/4 h-8 rounded-md" />
                <Skeleton className="w-full h-4 rounded-md" />
                <Skeleton className="w-5/6 h-4 rounded-md" />
                <Skeleton className="w-4/6 h-4 rounded-md" />
                <div className="flex gap-3 mt-4">
                    <Skeleton className="w-32 h-10 rounded-lg" />
                    <Skeleton className="w-32 h-10 rounded-lg hidden sm:block" />
                </div>
            </div>
            {/* Image col */}
            <Skeleton className="w-full max-h-69.5 sm:max-h-150 h-69.5 sm:h-150 rounded-2xl" />
        </div>
    </div>
)

// HotelServices section
const HotelServicesSkeleton = () => (
    <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-3 mb-6">
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-56 h-8 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex md:flex-col items-center gap-3 p-4 rounded-2xl border">
                    <Skeleton className="w-12 h-12 md:w-28 md:h-28 rounded-xl shrink-0" />
                    <div className="flex flex-col gap-2 w-full">
                        <Skeleton className="w-3/4 h-4 rounded-md" />
                        <Skeleton className="w-full h-3 rounded-md" />
                        <Skeleton className="w-5/6 h-3 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
        <div className="flex justify-center mt-6">
            <Skeleton className="w-32 h-10 rounded-lg" />
        </div>
    </div>
)

// SelectRooms section
const SelectRoomsSkeleton = () => (
    <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-3 mb-6">
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-56 h-8 rounded-md" />
        </div>
        <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="basis-[65%] between-400-575:basis-[55%] sm:basis-[45%] lg:basis-1/3 xl:basis-1/4 shrink-0 rounded-2xl border p-4"
                >
                    <Skeleton className="w-full h-38 md:h-72 rounded-xl mb-3" />
                    <Skeleton className="w-3/4 h-5 rounded-md mb-2" />
                    <Skeleton className="w-full h-px rounded-md mb-2" />
                    <div className="flex justify-between items-center">
                        <Skeleton className="w-20 h-5 rounded-md" />
                        <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    </div>
)

// HowItWorks section
const HowItWorksSkeleton = () => (
    <div className="w-full bg-[#020B17] py-10">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left: steps */}
                <div className="flex flex-col gap-3">
                    <Skeleton className="w-24 h-6 rounded-full bg-gray-700" />
                    <Skeleton className="w-3/4 h-8 rounded-md bg-gray-700" />
                    <Skeleton className="w-full h-4 rounded-md bg-gray-700" />
                    <div className="flex flex-col gap-2 mt-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <Skeleton className="w-14 h-14 rounded-full bg-gray-700 shrink-0" />
                                <div className="flex flex-col gap-2 flex-1 pt-2">
                                    <Skeleton className="w-1/2 h-4 rounded-md bg-gray-700" />
                                    <Skeleton className="w-full h-3 rounded-md bg-gray-700" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Right: image */}
                <Skeleton className="w-full h-64 md:h-auto rounded-2xl bg-gray-700" />
            </div>
        </div>
    </div>
)

// EventsFacilities section
const EventsFacilitiesSkeleton = () => (
    <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-3 mb-6">
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-56 h-8 rounded-md" />
        </div>
        <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="basis-[75%] md:basis-[85%] xl:basis-[70%] shrink-0 rounded-2xl overflow-hidden">
                    <Skeleton className="w-full h-56 rounded-2xl" />
                </div>
            ))}
        </div>
    </div>
)

// Testimonials section
const TestimonialsSkeleton = () => (
    <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-3 mb-6">
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-56 h-8 rounded-md" />
        </div>
        <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="basis-[85%] sm:basis-[60%] lg:basis-1/3 shrink-0 rounded-2xl border p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <Skeleton className="w-11 h-11 rounded-full shrink-0" />
                        <div className="flex flex-col gap-2 flex-1">
                            <Skeleton className="w-1/2 h-4 rounded-md" />
                            <Skeleton className="w-1/3 h-3 rounded-md" />
                        </div>
                    </div>
                    <Skeleton className="w-full h-px rounded-md mb-3" />
                    <Skeleton className="w-full h-3 rounded-md mb-2" />
                    <Skeleton className="w-5/6 h-3 rounded-md" />
                </div>
            ))}
        </div>
    </div>
)

// WhyBookWithUs section (multi-hotel mode)
const WhyBookWithUsSkeleton = () => (
    <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-3 mb-10">
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-56 h-8 rounded-md" />
            <Skeleton className="w-80 h-4 rounded-md" />
        </div>
        {/* Feature cards */}
        <div className="grid grid-cols-2 min-1200:grid-cols-4 gap-4 mb-10">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border p-3 md:p-6 flex flex-col items-center gap-3">
                    <Skeleton className="w-12 h-12 md:w-24 md:h-24 rounded-full" />
                    <Skeleton className="w-3/4 h-5 rounded-md" />
                    <Skeleton className="w-full h-px rounded-md" />
                    <Skeleton className="w-full h-3 rounded-md" />
                    <Skeleton className="w-5/6 h-3 rounded-md" />
                </div>
            ))}
        </div>
        {/* CTA banner */}
        <div className="rounded-2xl border p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="w-10 h-10 rounded-full border-2 border-white" />
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="w-40 h-4 rounded-md" />
                    <Skeleton className="w-28 h-3 rounded-md" />
                </div>
            </div>
            <Skeleton className="w-36 h-10 rounded-lg" />
        </div>
    </div>
)

const HomePageSkeleton = () => {
    const businessMode = useSelector(businessModeSelector) as BasicDetails;
    const isSingleHotel = businessMode?.business_mode === 'single';
    return (
        <div className="bg-white">
            <SliderSkeleton />
            {isSingleHotel ? (
                <>
                    <AboutUsSkeleton />
                    <HotelServicesSkeleton />
                    <SelectRoomsSkeleton />
                    <HowItWorksSkeleton />
                    <EventsFacilitiesSkeleton />
                    <TestimonialsSkeleton />
                </>
            ) : (
                <div className="pt-10 space-y-10">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="basis-[70%] shrink-0">
                            <PropertiesSectionSkeleton />
                        </div>
                    ))}
                    <WhyBookWithUsSkeleton />
                </div>
            )}
        </div>
    )
}

export default HomePageSkeleton
