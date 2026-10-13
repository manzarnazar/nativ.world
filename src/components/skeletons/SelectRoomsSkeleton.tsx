import { Skeleton } from '@/components/ui/skeleton'

const RoomCardSkeleton = () => (
    <div className="flex flex-col gap-3 border rounded-2xl p-4">
        <Skeleton className="h-38.5 md:h-72.5 w-full rounded-2xl" />
        <Skeleton className="h-6 w-3/5 rounded-md" />
        <Skeleton className="h-px w-full" />
        <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl hidden sm:block" />
        </div>
    </div>
)

export const PropertyCardSkeleton = () => (
    <div className="flex flex-col gap-3 border rounded-2xl overflow-hidden">
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="p-3 flex flex-col gap-2">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-10 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
            </div>
            <Skeleton className="h-5 w-24 rounded-md mt-1" />
        </div>
    </div>
)

const SelectRoomsSkeleton = ({ isSingleHotel }: { isSingleHotel: boolean }) => {
    return (
        <section className='container commonPY'>
            <div className='space-y-3 sm:space-y-6 md:space-y-12'>
                <div className='flex items-center justify-between'>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-8 w-56 rounded-md" />
                        <Skeleton className="h-4 w-72 rounded-md" />
                    </div>
                </div>

                <div className="flex gap-4 md:gap-6 overflow-hidden">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="shrink-0 w-[65%] between-400-575:w-[55%] sm:w-[45%] lg:w-1/3 xl:w-1/4 pb-3"
                        >
                            {isSingleHotel ? <RoomCardSkeleton /> : <PropertyCardSkeleton />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SelectRoomsSkeleton
