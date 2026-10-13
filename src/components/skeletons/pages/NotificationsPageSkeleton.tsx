'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarSkeleton } from './MyBookingsPageSkeleton'

// Matches inline NotificationSkeleton in Notifications.tsx
const NotificationRowSkeleton = ({ last = false }: { last?: boolean }) => (
    <div className={`flex items-start gap-4 py-4 ${!last ? 'border-b border-gray-100' : ''}`}>
        <Skeleton className="w-10 h-10 rounded-xl shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-52 rounded" />
            <Skeleton className="h-3 w-3/4 rounded" />
        </div>
        <Skeleton className="h-3 w-16 rounded shrink-0" />
    </div>
)

const NotificationsPageSkeleton = () => {
    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden sticky top-0 z-10 bg-white h-14 flex items-center px-4 border-b">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="mx-auto w-28 h-5 rounded-md" />
                <Skeleton className="w-9 h-9 rounded-full" />
            </div>

            {/* Desktop layout */}
            <div className="hidden md:block container commonPY">
                <Skeleton className="w-48 h-4 rounded-md mb-6" />
                <div className="grid grid-cols-12 commonGap">
                    <SidebarSkeleton />
                    <div className="col-span-8 min-1200:col-span-9">
                        <div className="rounded-2xl border bg-white">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b">
                                <Skeleton className="w-32 h-6 rounded-md" />
                                <Skeleton className="w-9 h-9 rounded-full" />
                            </div>
                            {/* Notification rows */}
                            <div className="px-5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <NotificationRowSkeleton key={i} last={i === 4} />
                                ))}
                            </div>
                            {/* Pagination */}
                            <div className="border-t border-gray-100 px-5 py-4 flex justify-center gap-2">
                                <Skeleton className="w-9 h-9 rounded-lg" />
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="w-9 h-9 rounded-lg" />
                                ))}
                                <Skeleton className="w-9 h-9 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile content */}
            <div className="md:hidden px-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <NotificationRowSkeleton key={i} last={i === 3} />
                ))}
            </div>
        </>
    )
}

export default NotificationsPageSkeleton
