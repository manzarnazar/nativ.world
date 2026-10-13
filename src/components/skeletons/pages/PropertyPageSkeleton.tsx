'use client'
import { Skeleton } from '@/components/ui/skeleton'
import SearchCardSkeleton from '../SearchCardSkeleton'

const SidebarSkeleton = () => (
    <div className="hidden lg:flex flex-col gap-5 lg:col-span-3">
        {/* Price range */}
        <div className="border rounded-2xl p-4 flex flex-col gap-3">
            <Skeleton className="w-32 h-5 rounded-md" />
            <Skeleton className="w-full h-4 rounded-full" />
            <div className="flex justify-between">
                <Skeleton className="w-16 h-8 rounded-lg" />
                <Skeleton className="w-16 h-8 rounded-lg" />
            </div>
        </div>
        {/* Filter sections x3 */}
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-2xl p-4 flex flex-col gap-3">
                <Skeleton className="w-28 h-5 rounded-md" />
                {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-3">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="w-24 h-4 rounded-md" />
                    </div>
                ))}
            </div>
        ))}
    </div>
)

const SortBarSkeleton = () => (
    <>
        {/* Desktop sort bar */}
        <div className="border rounded-2xl p-4 hidden md:flex items-center justify-between">
            <Skeleton className="w-48 h-5 rounded-md" />
            <Skeleton className="w-36 h-10 rounded-lg" />
        </div>
        {/* Mobile filter bar */}
        <div className="flex gap-2 md:hidden overflow-hidden py-2">
            <Skeleton className="w-24 h-9 rounded-lg shrink-0" />
            <Skeleton className="w-28 h-9 rounded-lg shrink-0" />
            <Skeleton className="w-20 h-9 rounded-lg shrink-0" />
        </div>
    </>
)

const PaginationSkeleton = () => (
    <div className="flex items-center justify-center gap-2 mt-8">
        <Skeleton className="w-9 h-9 rounded-lg" />
        {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-9 h-9 rounded-lg" />
        ))}
        <Skeleton className="w-9 h-9 rounded-lg" />
    </div>
)

const PropertyPageSkeleton = () => {
    return (
        <section className="bg-white pb-30 md:commonPY">
            <div className="container">
                <div className="grid grid-cols-12 commonGap">
                    <SidebarSkeleton />
                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        <SortBarSkeleton />
                        <div className="space-y-4">
                            {/* Mobile result count */}
                            <Skeleton className="h-5 w-32 rounded-md md:hidden" />
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SearchCardSkeleton key={i} />
                            ))}
                        </div>
                        <PaginationSkeleton />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PropertyPageSkeleton
