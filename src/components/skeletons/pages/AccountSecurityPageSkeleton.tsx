'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarSkeleton } from './MyBookingsPageSkeleton'

// 3 password fields (current, new, confirm)
const PasswordFormSkeleton = () => (
    <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-32 h-4 rounded-md" />
                <Skeleton className="w-full h-11 rounded-lg" />
            </div>
        ))}
    </div>
)

const AccountSecurityPageSkeleton = () => {
    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden sticky top-0 z-10 bg-white h-14 flex items-center px-4 border-b">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="mx-auto w-36 h-5 rounded-md" />
            </div>

            {/* Desktop layout */}
            <div className="hidden md:block container commonPY">
                <Skeleton className="w-48 h-4 rounded-md mb-6" />
                <div className="grid grid-cols-12 commonGap">
                    <SidebarSkeleton />
                    <div className="col-span-8 min-1200:col-span-9">
                        <div className="rounded-2xl border bg-white">
                            <div className="flex items-center px-6 py-4 border-b">
                                <Skeleton className="w-36 h-6 rounded-md" />
                            </div>
                            <div className="p-6 space-y-5">
                                <PasswordFormSkeleton />
                                <div className="flex justify-end">
                                    <Skeleton className="w-36 h-9 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile content */}
            <div className="md:hidden px-4 py-6 pb-32">
                <PasswordFormSkeleton />
            </div>

            {/* Mobile fixed bottom button */}
            <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t px-4 pt-3 pb-6">
                <Skeleton className="w-full h-11 rounded-full" />
            </div>
        </>
    )
}

export default AccountSecurityPageSkeleton
