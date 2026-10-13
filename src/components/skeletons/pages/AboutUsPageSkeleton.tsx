'use client'
import { Skeleton } from '@/components/ui/skeleton'

const AboutUsPageSkeleton = () => {
    return (
        <>
            {/* Who We Are Section */}
            <section className="bg-white commonPY">
                <div className="container">
                    <section className="flex flex-col gap-4 md:gap-6">

                        {/* SectionInfo badge + title + desc */}
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-8 w-2/3 rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-5/6 rounded-md" />
                        </div>

                        {/* Banner Image */}
                        <Skeleton className="h-[132px] sm:h-[250px] md:h-[350px] lg:h-[600px] w-full rounded-2xl" />

                        {/* Rich Text Content */}
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-4/5 rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-3/4 rounded-md" />
                        </div>

                        {/* Divider */}
                        <Skeleton className="h-px w-full rounded-full" />

                        {/* Key Highlights Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-[#f0f5fa] rounded-2xl p-3 sm:p-6 flex flex-col justify-center gap-3 sm:gap-4">
                                    <Skeleton className="h-8 w-20 rounded-md" />
                                    <Skeleton className="h-4 w-full rounded-md" />
                                    <Skeleton className="h-4 w-3/4 rounded-md" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </section>

            {/* Our Promise Section */}
            <section className="commonPY container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">

                    {/* Left: SectionInfo + Feature List */}
                    <div className="flex flex-col gap-6 md:gap-10">
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-8 w-3/4 rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-5/6 rounded-md" />
                            <Skeleton className="h-4 w-2/3 rounded-md" />
                        </div>

                        <div className="space-y-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                                    <Skeleton className="h-4 w-full rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="flexCenter">
                        <Skeleton className="h-[279px] sm:h-[350px] md:h-[600px] w-full rounded-2xl" />
                    </div>
                </div>
            </section>

            {/* Hotel Services Section */}
            <section className="commonPY bg-white">
                <div className="container space-y-10">
                    <div className="flex flex-col items-center gap-3">
                        <Skeleton className="h-6 w-28 rounded-full" />
                        <Skeleton className="h-8 w-1/2 rounded-md" />
                        <Skeleton className="h-4 w-2/3 rounded-md" />
                    </div>
                    <div className="grid max-375:grid-cols-1 grid-cols-2 lg:grid-cols-3 gap-4 sm:commonGap">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white flexColCenter gap-4 md:gap-10 rounded-2xl border p-4 md:py-12 md:px-6">
                                <Skeleton className="w-24 md:w-28 h-24 md:h-28 rounded-2xl" />
                                <div className="flexColCenter gap-2 md:gap-4 text-center md:w-[80%] mx-auto w-full">
                                    <Skeleton className="h-5 md:h-6 w-28 rounded-md" />
                                    <Skeleton className="h-4 w-full rounded-md" />
                                    <Skeleton className="h-4 w-3/4 rounded-md" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flexCenter">
                        <Skeleton className="h-10 w-32 rounded-lg" />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="commonPY bodyBg">
                <div className="container space-y-10">
                    <div className="flex flex-col items-center gap-3">
                        <Skeleton className="h-6 w-28 rounded-full" />
                        <Skeleton className="h-8 w-1/2 rounded-md" />
                        <Skeleton className="h-4 w-2/3 rounded-md" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                                    <div className="flex flex-col gap-2 flex-1">
                                        <Skeleton className="h-4 w-32 rounded-md" />
                                        <Skeleton className="h-3 w-20 rounded-md" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-full rounded-md" />
                                <Skeleton className="h-4 w-full rounded-md" />
                                <Skeleton className="h-4 w-3/4 rounded-md" />
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <Skeleton key={j} className="h-4 w-4 rounded-sm" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="bg-white commonPY">
                <div className="container space-y-6">
                    <div className="grid grid-cols-12">
                        <div className="col-span-12 sm:col-span-8 flex flex-col gap-3">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-8 w-3/4 rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-5/6 rounded-md" />
                        </div>
                        <div className="col-span-12 sm:col-span-4 flex justify-end items-end">
                            <Skeleton className="h-10 w-36 rounded-lg" />
                        </div>
                    </div>

                    {/* Gallery Carousel */}
                    <div className="flex gap-4 overflow-hidden mt-8">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="rounded-2xl h-62.5 md:h-75 lg:h-87.5 shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-[30%]" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default AboutUsPageSkeleton