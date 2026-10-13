'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarSkeleton } from './MyBookingsPageSkeleton'

const ReferralContentSkeleton = () => (
    <div className="p-5 md:p-6 space-y-6">

        {/* Banner card */}
        <div className="border rounded-xl p-5 space-y-4">
            <div className="space-y-2">
                <Skeleton className="w-48 h-5 rounded-md" />
                <Skeleton className="w-72 h-4 rounded-md" />
            </div>
            <Skeleton className="w-52 h-9 rounded-2xl" />
        </div>

        {/* How it works — 4 steps */}
        <div className="space-y-4">
            <Skeleton className="w-28 h-5 rounded-md" />
            <div>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                        <Skeleton className="w-9 h-9 rounded-full shrink-0 mt-0.5" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="w-40 h-4 rounded-md" />
                            <Skeleton className="w-full h-3 rounded-md" />
                            <Skeleton className="w-5/6 h-3 rounded-md" />
                            {i > 0 && (
                                <div className="space-y-1.5 pt-1">
                                    {Array.from({ length: 2 }).map((_, j) => (
                                        <Skeleton key={j} className="w-3/4 h-3 rounded-md" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Referral code input */}
        <div className="space-y-2">
            <Skeleton className="w-32 h-4 rounded-md" />
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3">
                    <Skeleton className="w-5 h-5 rounded" />
                </div>
                <Skeleton className="flex-1 h-4 rounded-md mx-2" />
                <div className="flex items-center gap-1.5 px-4 py-3 border-l border-gray-200">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="hidden md:block w-16 h-4 rounded-md" />
                </div>
            </div>
        </div>

    </div>
)

const ReferralEarnPageSkeleton = () => {
    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden sticky top-0 z-10 bg-white h-14 flex items-center px-4 border-b">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="mx-auto w-28 h-5 rounded-md" />
            </div>

            {/* Desktop layout */}
            <div className="hidden md:block container commonPY">
                <Skeleton className="w-48 h-4 rounded-md mb-6" />
                <div className="grid grid-cols-12 commonGap">
                    <SidebarSkeleton />
                    <div className="col-span-8 min-1200:col-span-9">
                        <div className="rounded-2xl border bg-white">
                            <div className="flex items-center px-6 py-4 border-b">
                                <Skeleton className="w-28 h-6 rounded-md" />
                            </div>
                            <ReferralContentSkeleton />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile content */}
            <div className="md:hidden">
                <ReferralContentSkeleton />
            </div>
        </>
    )
}

export default ReferralEarnPageSkeleton
