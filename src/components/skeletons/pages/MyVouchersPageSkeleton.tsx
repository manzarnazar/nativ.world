'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { SidebarSkeleton } from './MyBookingsPageSkeleton'

const TableRowSkeleton = () => (
    <tr className="border-b border-gray-100">
        {Array.from({ length: 8 }).map((_, i) => (
            <td key={i} className="px-6 py-4">
                <Skeleton className="h-4 w-full rounded" />
            </td>
        ))}
    </tr>
)

const MobileCardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="flex justify-between">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 rounded" />
            ))}
        </div>
    </div>
)

const MyVouchersPageSkeleton = () => {
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
                            <div className="flex items-center px-6 py-4 border-b">
                                <Skeleton className="w-28 h-6 rounded-md" />
                            </div>
                            <div className="p-5">
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200 bg-blue-50">
                                                    {Array.from({ length: 8 }).map((_, i) => (
                                                        <th key={i} className="px-6 py-3">
                                                            <Skeleton className="h-4 w-20 rounded" />
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <TableRowSkeleton key={i} />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Footer: per-page + pagination */}
                                    <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-between bg-white">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="w-24 h-4 rounded" />
                                            <Skeleton className="w-14 h-8 rounded-md" />
                                            <Skeleton className="w-10 h-4 rounded" />
                                        </div>
                                        <div className="flex items-center gap-2">
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
                    </div>
                </div>
            </div>

            {/* Mobile content */}
            <div className="md:hidden px-4 py-4 pb-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <MobileCardSkeleton key={i} />
                ))}
            </div>
        </>
    )
}

export default MyVouchersPageSkeleton
