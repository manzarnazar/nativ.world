'use client'
import { Skeleton } from '@/components/ui/skeleton'

// Left col — guest details form
const GuestDetailsSkeleton = () => (
    <div className="space-y-4 md:rounded-2xl md:border md:p-4">
        <div className="flex flex-col gap-1">
            <Skeleton className="w-40 h-5 rounded-md" />
            <Skeleton className="w-64 h-4 rounded-md" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
                <Skeleton className="w-24 h-4 rounded-md" />
                <Skeleton className="w-full h-11 rounded-lg" />
            </div>
            <div className="flex flex-col gap-2">
                <Skeleton className="w-16 h-4 rounded-md" />
                <Skeleton className="w-full h-11 rounded-lg" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
                <Skeleton className="w-20 h-4 rounded-md" />
                <Skeleton className="w-full h-11 rounded-lg" />
            </div>
        </div>
    </div>
)

// Left col — payment options
const PaymentOptionsSkeleton = () => (
    <div className="space-y-4 md:rounded-2xl md:border md:p-4">
        <div className="flex flex-col gap-1">
            <Skeleton className="w-40 h-5 rounded-md" />
            <Skeleton className="w-56 h-4 rounded-md" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="space-y-4">
            {/* Pay Now option with gateway grid */}
            <div className="rounded-xl border p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                    <div className="flex flex-col gap-1 flex-1">
                        <Skeleton className="w-20 h-4 rounded-md" />
                        <Skeleton className="w-48 h-3 rounded-md" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 rounded-xl" />
                    ))}
                </div>
            </div>
            {/* Pay Partial */}
            <div className="rounded-xl border p-4 flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <div className="flex flex-col gap-1 flex-1">
                    <Skeleton className="w-28 h-4 rounded-md" />
                    <Skeleton className="w-48 h-3 rounded-md" />
                </div>
            </div>
            {/* Pay at Property */}
            <div className="rounded-xl border p-4 flex items-center gap-3">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <div className="flex flex-col gap-1 flex-1">
                    <Skeleton className="w-36 h-4 rounded-md" />
                    <Skeleton className="w-48 h-3 rounded-md" />
                </div>
            </div>
        </div>
    </div>
)

// Right col — property card
const PropertyCardSkeleton = () => (
    <div className="border rounded-2xl p-3 md:p-4 flex items-center gap-2 sm:gap-4">
        <Skeleton className="shrink-0 w-26 h-20 rounded-2xl" />
        <div className="flex-1 flex flex-col gap-2 min-w-0">
            <Skeleton className="w-3/4 h-4 rounded-md" />
            <Skeleton className="w-1/2 h-3 rounded-md" />
            <div className="flex items-center gap-2">
                <Skeleton className="w-10 h-4 rounded-md" />
                <Skeleton className="w-20 h-3 rounded-md" />
            </div>
        </div>
    </div>
)

// Right col — reserve card
const ReserveCardSkeleton = () => (
    <div className="bg-white rounded-2xl md:p-4 space-y-4">
        {/* Dates: 2-col grid */}
        <div className="bodyBg rounded-2xl border overflow-hidden">
            <div className="grid grid-cols-2 divide-x">
                {['Check In', 'Check Out'].map((_, i) => (
                    <div key={i} className="p-5 flex flex-col gap-2">
                        <Skeleton className="w-16 h-3 rounded-md" />
                        <Skeleton className="w-24 h-5 rounded-md" />
                    </div>
                ))}
            </div>
            <Skeleton className="h-px w-full" />
            <div className="p-5 flex flex-col gap-2">
                <Skeleton className="w-14 h-3 rounded-md" />
                <Skeleton className="w-20 h-4 rounded-md" />
            </div>
        </div>

        {/* Coupon */}
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <Skeleton className="w-28 h-4 rounded-md" />
                <Skeleton className="w-16 h-4 rounded-md" />
            </div>
            <div className="border rounded-lg p-3 flex justify-between items-center">
                <Skeleton className="flex-1 h-4 rounded-md mr-3" />
                <Skeleton className="w-16 h-8 rounded-lg" />
            </div>
        </div>

        <Skeleton className="h-px w-full" />

        {/* Booking summary price rows */}
        <div className="rounded-2xl border p-5 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                    <Skeleton className="w-28 h-4 rounded-md" />
                    <Skeleton className="w-16 h-4 rounded-md" />
                </div>
            ))}
            <Skeleton className="h-px w-full" />
            <div className="flex justify-between">
                <Skeleton className="w-20 h-5 rounded-md" />
                <Skeleton className="w-20 h-5 rounded-md" />
            </div>
        </div>

        {/* Reserve button */}
        <Skeleton className="w-full h-11 rounded-lg" />
    </div>
)

const ConfirmBookingPageskeleton = () => {
    return (
        <div className="relative after:absolute after:inset-0 after:w-1/4 lg:after:bg-white after:z-1 py-6 md:py-0">
            <div className="container relative z-2">
                <div className="grid grid-cols-12">

                    {/* Left col */}
                    <div className="col-span-12 lg:col-span-7 md:py-12 md:px-10 pb-32 md:pb-0 space-y-6">
                        <GuestDetailsSkeleton />
                        <PaymentOptionsSkeleton />
                        {/* Book Now button — hidden on mobile (fixed), shown on desktop */}
                        <Skeleton className="hidden md:block w-full h-11 rounded-lg" />
                    </div>

                    {/* Right col — desktop only */}
                    <div className="hidden lg:block col-span-12 lg:col-span-5">
                        <div className="space-y-6 py-20 pl-10 rtl:pl-0 rtl:pr-10">
                            <div className="space-y-2">
                                <Skeleton className="w-44 h-6 rounded-md" />
                                <PropertyCardSkeleton />
                            </div>
                            <ReserveCardSkeleton />
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile fixed bottom Book Now button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg md:hidden z-10">
                <Skeleton className="w-full h-11 rounded-lg" />
            </div>
        </div>
    )
}

export default ConfirmBookingPageskeleton
