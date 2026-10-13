'use client'
import { Skeleton } from '@/components/ui/skeleton'

const PropertyCardSkeleton = ({ horizontal = false }: { horizontal?: boolean }) => {
    if (horizontal) {
        return (
            <div className="rounded-2xl overflow-hidden flex h-full max-h-[220px] border">
                <Skeleton className="w-[264px] h-full shrink-0 rounded-none" />
                <div className="flex-1 p-3 flex flex-col justify-between gap-2">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-5 w-3/4 rounded-md" />
                        <Skeleton className="h-4 w-1/2 rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-px w-full" />
                        <Skeleton className="h-5 w-24 rounded-md" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-2xl overflow-hidden h-full border">
            <Skeleton className="w-full h-45 rounded-none" />
            <div className="p-3 flex flex-col gap-3">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                </div>
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-5 w-24 rounded-md" />
            </div>
        </div>
    )
}

export default PropertyCardSkeleton
