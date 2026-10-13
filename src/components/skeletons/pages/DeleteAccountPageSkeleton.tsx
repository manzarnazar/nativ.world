'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarSkeleton } from './MyBookingsPageSkeleton'

const DeleteAccountContentSkeleton = () => (
    <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
            <Skeleton className="w-56 h-5 rounded-md" />
            <Skeleton className="w-full h-4 rounded-md" />
            <Skeleton className="w-4/5 h-4 rounded-md" />
        </div>

        {/* Loss list */}
        <div className="space-y-2">
            <Skeleton className="w-40 h-4 rounded-md" />
            <div className="space-y-1">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <Skeleton className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" />
                        <Skeleton className="flex-1 h-3 rounded-md" />
                    </div>
                ))}
            </div>
            <Skeleton className="w-64 h-4 rounded-md" />
        </div>

        {/* Password input */}
        <div className="flex flex-col gap-2">
            <Skeleton className="w-20 h-4 rounded-md" />
            <Skeleton className="w-full h-11 rounded-lg" />
        </div>

        {/* Confirm checkbox */}
        <div className="flex items-start gap-3">
            <Skeleton className="w-4 h-4 rounded shrink-0 mt-0.5" />
            <Skeleton className="flex-1 h-4 rounded-md" />
        </div>

        {/* Delete button */}
        <Skeleton className="w-36 h-10 rounded-lg" />
    </div>
)

const DeleteAccountPageSkeleton = () => {
    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden sticky top-0 z-10 bg-white h-14 flex items-center px-4 border-b">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="mx-auto w-32 h-5 rounded-md" />
            </div>

            {/* Desktop layout */}
            <div className="hidden md:block container commonPY">
                <Skeleton className="w-48 h-4 rounded-md mb-6" />
                <div className="grid grid-cols-12 commonGap">
                    <SidebarSkeleton />
                    <div className="col-span-8 min-1200:col-span-9">
                        <div className="rounded-2xl border bg-white">
                            <div className="flex items-center px-6 py-4 border-b">
                                <Skeleton className="w-32 h-6 rounded-md" />
                            </div>
                            <DeleteAccountContentSkeleton />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile content */}
            <div className="md:hidden">
                <DeleteAccountContentSkeleton />
            </div>
        </>
    )
}

export default DeleteAccountPageSkeleton
