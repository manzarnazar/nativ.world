import { Skeleton } from "../../ui/skeleton";
import BlogCardSkeleton from "../BlogCardSkeleton";

const BlogDetailsSkeleton = () => {
  return (
    <div>
      
      {/* ─── Top Section ─── */}
      <section className="container py-8 md:py-12 space-y-4">

        {/* Mobile Badge */}
        <Skeleton className="h-6 w-24 rounded-full md:hidden" />

        {/* Title + Description */}
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>

        {/* Info Bar */}
        <div className="flex items-center justify-between bg-white rounded-2xl border p-4">

          <div className="flex items-center gap-10">
            
            {/* Category (desktop) */}
            <div className="hidden md:flex flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="bodyBg border h-13 hidden md:block" />

            {/* Publish Date */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-28" />
            </div>

            <div className="bodyBg border h-13" />

            {/* Read Time */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Share Button */}
          <div className="hidden md:block">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Image */}
        <div className="w-auto h-[181px] md:h-[479px] lg:h-[823px]">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>

      </section>

      {/* ─── Content Section ─── */}
      <section className="bg-white py-8 md:py-12">
        <div className="container space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded-md" />
          ))}
        </div>
      </section>

      {/* ─── Related Articles ─── */}
      <section className="container py-8 md:py-12 flex flex-col commonGap">

        {/* Section Header */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 min-1200:grid-cols-3! commonGap">
          {[...Array(3)].map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>

      </section>

    </div>
  );
};

export default BlogDetailsSkeleton;