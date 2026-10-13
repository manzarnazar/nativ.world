'use client'
import { Skeleton } from '@/components/ui/skeleton'
import BookingCardSkeleton from '../BookingCardSkeleton'

// Desktop sidebar — AccountTabs
export const SidebarSkeleton = () => (
    <div className="hidden md:block col-span-4 min-1200:col-span-3 sticky top-27.5">
        <div className="rounded-2xl border overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < 4 ? 'border-b' : ''}`}>
                    <Skeleton className="w-5 h-5 rounded-md shrink-0" />
                    <Skeleton className="flex-1 h-4 rounded-md" />
                </div>
            ))}
        </div>
    </div>
)

// Desktop content card header
const ContentHeaderSkeleton = () => (
    <div className="flex items-center justify-between px-6 py-4 border-b">
        <Skeleton className="w-32 h-6 rounded-md" />
        <Skeleton className="w-36 h-10 rounded-lg" />
    </div>
)

// Mobile sticky top bar
const MobileHeaderSkeleton = () => (
    <div className="md:hidden sticky top-0 z-10 bg-white h-14 flex items-center justify-between px-4 border-b">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-32 h-5 rounded-md" />
        <Skeleton className="w-24 h-9 rounded-lg" />
    </div>
)

// Mobile status filter tabs
const MobileTabsSkeleton = () => (
    <div className="flex md:hidden gap-2 overflow-x-auto px-4 py-4 no-scrollbar">
        {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="shrink-0 w-20 h-8 rounded-full" />
        ))}
    </div>
)

const MyBookingsPageSkeleton = () => {
    return (
        <>
            {/* Mobile header */}
            <MobileHeaderSkeleton />

            {/* Desktop: breadcrumb */}
            <div className="hidden md:block container commonPY">
                <Skeleton className="w-48 h-4 rounded-md mb-6" />

                <div className="grid grid-cols-12 commonGap">
                    <SidebarSkeleton />

                    {/* Content card */}
                    <div className="col-span-8 min-1200:col-span-9">
                        <div className="rounded-2xl border bg-white">
                            <ContentHeaderSkeleton />
                            <div className="px-6 py-6 flex flex-col gap-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <BookingCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile content */}
            <div className="md:hidden">
                <MobileTabsSkeleton />
                <div className="px-4 pb-28 flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <BookingCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default MyBookingsPageSkeleton
