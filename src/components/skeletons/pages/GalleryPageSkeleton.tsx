import { Skeleton } from '@/components/ui/skeleton'

// One gallery group: label pill + image grid
const GalleryGroupSkeleton = ({ count = 8 }: { count?: number }) => (
    <div className="space-y-6">
        <Skeleton className="w-40 h-12 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:commonGap">
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl w-full" />
            ))}
        </div>
    </div>
)

const GalleryPageSkeleton = () => {
    return (
        <section className="bg-white commonPY">
            <div className="container space-y-6 md:space-y-12">
                <GalleryGroupSkeleton count={8} />
                <Skeleton className="h-px w-full" />
                <GalleryGroupSkeleton count={4} />
                <Skeleton className="h-px w-full" />
                <GalleryGroupSkeleton count={6} />
            </div>
        </section>
    )
}

export default GalleryPageSkeleton
