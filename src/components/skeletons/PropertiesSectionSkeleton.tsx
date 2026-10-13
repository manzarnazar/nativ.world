import { Skeleton } from '@/components/ui/skeleton'
import PropertyCardSkeleton from '@/components/skeletons/PropertyCardSkeleton'

const PropertiesSectionSkeleton = () => {
    return (
        <>
            <section className="hidden sm:block container commonMT">
                <div className="flex items-center justify-between mb-7">
                    <div className="flex flex-col gap-2">
                        <Skeleton className="w-24 h-6 rounded-full" />
                        <Skeleton className="w-48 h-8 rounded-md" />
                    </div>
                    <Skeleton className="w-36 h-10 rounded-lg" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 between-1200-1399:grid-cols-4 xl:grid-cols-5 commonGap">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <PropertyCardSkeleton key={i} />
                    ))}
                </div>
            </section>
            <section className="sm:hidden container commonMT">
                <div className="flex items-center justify-between mb-7">
                    <Skeleton className="w-40 h-7 rounded-md" />
                    <Skeleton className="w-24 h-5 rounded-md" />
                </div>
                <div className="flex gap-4 overflow-hidden">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="basis-[70%] shrink-0">
                            <PropertyCardSkeleton />
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default PropertiesSectionSkeleton
