import { Skeleton } from "../ui/skeleton";

const BlogCardSkeleton = () => {
  return (
    <div className="bodyBg border rounded-2xl p-4 md:p-5 flex flex-col gap-5">
      
      {/* Image Section */}
      <div className="relative w-auto h-43 sm:h-62">
        <Skeleton className="w-full h-full rounded-xl" />

        {/* Date Badge */}
        <div className="absolute bottom-4 right-4 bg-white rounded-xl w-12 h-20 shadow-md gap-2 flexColCenter p-2">
          <Skeleton className="h-4 w-6 rounded-md" />
          <Skeleton className="h-3 w-8 rounded-md" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3">
        
        {/* Category */}
        <Skeleton className="h-6 w-24 rounded-full" />

        {/* Title */}
        <Skeleton className="h-5 w-3/4 rounded-md" />

        {/* Description */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6">
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
};

export default BlogCardSkeleton;