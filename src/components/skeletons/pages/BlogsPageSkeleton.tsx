'use client'
import { Skeleton } from '@/components/ui/skeleton'
import BlogCardSkeleton from '../BlogCardSkeleton'

const BlogsPageSkeleton = () => {
    return (
        <div className="bg-white py-6 md:py-12">
            <div className="container flex flex-col commonGap">

                {/* Section title + desc — desktop only */}
                <div className="hidden md:flex flex-col gap-2">
                    <Skeleton className="w-48 h-8 rounded-md" />
                    <Skeleton className="w-80 h-5 rounded-md" />
                </div>

                {/* Filter + search bar */}
                <div className="flex items-center justify-between flex-wrap md:p-4 md:bodyBg rounded-2xl md:border gap-y-6">
                    {/* Category select — desktop */}
                    <Skeleton className="hidden md:block w-36 h-10 rounded-lg" />
                    {/* Search bar */}
                    <div className="w-full sm:max-w-66 md:max-w-165">
                        <Skeleton className="w-full h-11 rounded-lg" />
                    </div>
                </div>

                {/* Blog cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 min-1200:grid-cols-3 commonGap">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <article key={i}>
                            <BlogCardSkeleton />
                        </article>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-20">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="w-9 h-9 rounded-lg" />
                    ))}
                    <Skeleton className="w-9 h-9 rounded-lg" />
                </div>

            </div>
        </div>
    )
}

export default BlogsPageSkeleton
