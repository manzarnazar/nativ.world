'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarSkeleton } from './MyBookingsPageSkeleton'

// Desktop: avatar row + form + save button
const DesktopFormSkeleton = () => (
    <div className="hidden md:block p-6 space-y-6">
        {/* Avatar row */}
        <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2 min-w-0">
                <Skeleton className="w-36 h-4 rounded-md" />
                <Skeleton className="w-48 h-3 rounded-md" />
            </div>
            <Skeleton className="w-32 h-9 rounded-full shrink-0" />
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
                <Skeleton className="w-16 h-4 rounded-md" />
                <Skeleton className="w-full h-11 rounded-lg" />
            </div>
            <div className="flex flex-col gap-2">
                <Skeleton className="w-14 h-4 rounded-md" />
                <Skeleton className="w-full h-11 rounded-lg" />
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-full h-11 rounded-lg" />
        </div>

        {/* Save button */}
        <div className="flex justify-end">
            <Skeleton className="w-36 h-9 rounded-full" />
        </div>
    </div>
)

// Mobile: centered avatar + stacked form
const MobileFormSkeleton = () => (
    <div className="md:hidden pb-32">
        {/* Centered avatar */}
        <div className="flex justify-center pt-8 pb-10">
            <div className="relative">
                <Skeleton className="w-28 h-28 rounded-full" />
                <Skeleton className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-28 h-7 rounded-full" />
            </div>
        </div>

        {/* Stacked form fields */}
        <div className="px-4 space-y-4">
            {['Name', 'Email', 'Phone'].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="w-20 h-4 rounded-md" />
                    <Skeleton className="w-full h-11 rounded-lg" />
                </div>
            ))}
        </div>
    </div>
)

const MyProfilePageSkeleton = () => {
    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden sticky top-0 z-10 bg-white h-14 flex items-center px-4 border-b">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="mx-auto w-24 h-5 rounded-md" />
            </div>

            {/* Desktop layout */}
            <div className="hidden md:block container commonPY">
                <Skeleton className="w-48 h-4 rounded-md mb-6" />
                <div className="grid grid-cols-12 commonGap">
                    <SidebarSkeleton />
                    <div className="col-span-8 min-1200:col-span-9">
                        <div className="rounded-2xl border bg-white">
                            {/* Content header */}
                            <div className="flex items-center px-6 py-4 border-b">
                                <Skeleton className="w-28 h-6 rounded-md" />
                            </div>
                            <DesktopFormSkeleton />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile content */}
            <MobileFormSkeleton />

            {/* Mobile fixed bottom button */}
            <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t px-4 pt-3 pb-6">
                <Skeleton className="w-full h-11 rounded-full" />
            </div>
        </>
    )
}

export default MyProfilePageSkeleton
