'use client'
import { Skeleton } from '@/components/ui/skeleton'

const FaqsPageSkeleton = () => {
    return (
        <div className="relative after:absolute after:inset-0 after:w-1/4 lg:after:bg-white after:z-1">
            <section className="container relative z-2">
                <div className="grid grid-cols-12 commonGap">

                    {/* Left sidebar — sticky topic nav (desktop) */}
                    <aside className="hidden lg:flex flex-col gap-2 shrink-0 sticky top-34 border-r p-7.5 col-span-12 lg:col-span-4 commonPY bg-white">
                        <Skeleton className="w-28 h-6 rounded-md mb-2" />
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-9 w-full rounded-lg" />
                        ))}
                    </aside>

                    {/* Right: FAQ accordion sections */}
                    <div className="flex-1 flex flex-col gap-6 col-span-12 lg:col-span-8 commonPY">
                        {Array.from({ length: 3 }).map((_, sIdx) => (
                            <div key={sIdx} className="border rounded-2xl p-4 md:p-6 flex flex-col gap-4">
                                {/* Topic title + divider */}
                                <Skeleton className="h-5 w-48 rounded-md" />
                                <Skeleton className="h-px w-full" />
                                {/* FAQ accordion rows */}
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-12 w-full rounded-2xl" />
                                ))}
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </div>
    )
}

export default FaqsPageSkeleton
