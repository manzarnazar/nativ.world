'use client'
import { Skeleton } from '@/components/ui/skeleton'

// Desktop: search hero
const SearchSectionSkeleton = () => (
    <section className="hidden md:block primaryLightBg py-10 md:py-16 lg:py-20">
        <div className="container flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col gap-2">
                <Skeleton className="w-72 h-9 rounded-md" />
                <Skeleton className="w-96 h-5 rounded-md" />
            </div>
            {/* Search bar */}
            <Skeleton className="w-full max-w-2xl h-12 rounded-full" />
        </div>
    </section>
)

// Desktop: how it works — 4 step cards in bordered grid
const HowItWorksSkeleton = () => (
    <section className="hidden md:block bg-white py-20">
        <div className="container space-y-6 md:space-y-10">
            <div className="flex flex-col gap-2">
                <Skeleton className="w-56 h-8 rounded-md" />
                <Skeleton className="w-80 h-5 rounded-md" />
            </div>
            <div className="rounded-2xl overflow-hidden border">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => {
                        const borderClasses = [
                            'border-b sm:border-r lg:border-b-0',
                            'border-b lg:border-b-0 lg:border-r',
                            'border-b sm:border-b-0 sm:border-r',
                            '',
                        ][i]
                        return (
                            <div key={i} className={`p-5 md:p-6 flex flex-col gap-4 ${borderClasses}`}>
                                <Skeleton className="w-11 h-11 md:w-12 md:h-12 rounded-full" />
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-4 w-3/4 rounded-md" />
                                    <Skeleton className="h-3 w-full rounded-md" />
                                    <Skeleton className="h-3 w-5/6 rounded-md" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    </section>
)

// Desktop: help by topics — 3-col card grid
const HelpByTopicsSkeleton = () => (
    <section className="hidden md:block container py-20">
        <div className="space-y-6 md:space-y-10">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <Skeleton className="w-56 h-8 rounded-md" />
                    <Skeleton className="w-80 h-5 rounded-md" />
                </div>
                <Skeleton className="w-28 h-10 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border p-3 md:p-4 flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-2/3 rounded-md" />
                            <Skeleton className="h-3 w-full rounded-md" />
                            <Skeleton className="h-3 w-5/6 rounded-md" />
                        </div>
                        <Skeleton className="h-px w-full" />
                        <Skeleton className="h-4 w-24 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    </section>
)

// Mobile: search bar + topic list + how it works steps
const MobileSkeleton = () => (
    <div className="flex md:hidden flex-col gap-6 mt-4 container pb-4">
        {/* Search bar */}
        <Skeleton className="w-full h-12 rounded-full" />

        {/* Help topics list — 6 rows */}
        <section className="flex flex-col">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-4 px-3 border rounded-xl mb-3">
                    <div className="flex-1 flex flex-col gap-2">
                        <Skeleton className="h-4 w-3/4 rounded-md" />
                        <Skeleton className="h-3 w-full rounded-md" />
                    </div>
                    <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                </div>
            ))}
        </section>

        {/* How it works steps */}
        <section className="flex flex-col gap-4">
            <Skeleton className="h-6 w-40 rounded-md" />
            <div className="flex flex-col">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i}>
                        <div className="flex items-start gap-4 py-4">
                            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                            <div className="flex flex-col gap-2 flex-1">
                                <Skeleton className="h-4 w-2/3 rounded-md" />
                                <Skeleton className="h-3 w-full rounded-md" />
                                <Skeleton className="h-3 w-5/6 rounded-md" />
                            </div>
                        </div>
                        {i < 3 && <Skeleton className="h-px w-full" />}
                    </div>
                ))}
            </div>
        </section>
    </div>
)

const HelpSupportPageSkeleton = () => {
    return (
        <>
            <SearchSectionSkeleton />
            <HowItWorksSkeleton />
            <HelpByTopicsSkeleton />
            <MobileSkeleton />
        </>
    )
}

export default HelpSupportPageSkeleton
