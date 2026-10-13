'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { isSingleHotelBranch } from '@/utils/helpers'

const SearchCardSkeleton = () => {
  const singleHotel = isSingleHotelBranch();

  if (singleHotel) {
    return (
      <div className="border rounded-2xl overflow-hidden bg-white">
        {/* Top section */}
        <div className="flex gap-4 p-4 flex-wrap md:flex-nowrap">
          {/* Image placeholder */}
          <div className="shrink-0 w-full md:w-67.5 h-57.5 relative pr-4 after:hidden after:md:block after:absolute after:inset-0 after:border-r after:h-[130%] after:-top-5 after:border-gray-200 after:z-1">
            <Skeleton className="w-full h-full rounded-2xl" />
          </div>

          {/* Details placeholder */}
          <div className="flex flex-col gap-4 w-full">
            {/* Room name */}
            <Skeleton className="h-6 w-3/5 rounded-md" />
            {/* Rating row */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-10 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            {/* Room details (guests, bed, size) */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
            {/* Divider on mobile */}
            <Skeleton className="h-px w-full md:hidden" />
            {/* Feature chips */}
            <div className="flex gap-2 md:mt-4">
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-3 w-32 rounded-md" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-2xl overflow-hidden bg-white">
      <div className="flex gap-4 p-4 flex-wrap">
        {/* Image placeholder */}
        <div className="shrink-0 w-full md:w-75 h-62.5 relative">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>

        {/* Content placeholder */}
        <div className="flex-1 min-w-0 flex flex-col gap-4 md:justify-between">
          <div className="flex flex-col gap-4">
            {/* Room name */}
            <Skeleton className="h-6 w-3/5 rounded-md" />
            {/* Location */}
            <Skeleton className="h-4 w-2/5 rounded-md" />
            {/* Rating row */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-10 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            {/* Room details (guests, bed, size) */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
          </div>

          {/* Price + CTA footer */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchCardSkeleton
