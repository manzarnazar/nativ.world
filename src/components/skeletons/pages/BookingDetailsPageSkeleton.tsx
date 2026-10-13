'use client'

import { Skeleton } from '@/components/ui/skeleton'

const BookingDetailsPageSkeleton = () => {
  return (
    <div className="container commonPY space-y-4 md:space-y-6">

      {/* Mobile: compact top row */}
      <div className="flex items-center justify-between lg:hidden">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
        <Skeleton className="h-7 w-36 rounded-full" />
      </div>

      {/* Desktop: full status banner */}
      <Skeleton className="hidden lg:block h-24 w-full rounded-2xl" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 items-start">

        {/* Left column */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl p-4 md:p-6 space-y-4 border">

            {/* Desktop header */}
            <div className="hidden lg:flex items-center justify-between">
              <Skeleton className="h-6 w-36 rounded-md" />
              <Skeleton className="h-5 w-28 rounded-md" />
            </div>

            <Skeleton className="hidden lg:block h-px w-full" />

            {/* Property card skeleton */}
            <div className="flex gap-3">
              <Skeleton className="h-20 w-24 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-2/5 rounded-md" />
              </div>
            </div>

            <Skeleton className="h-px w-full" />

            {/* Mobile booking details */}
            <div className="lg:hidden space-y-4">

              {/* Booked On */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </div>

              {/* Room type pill */}
              <Skeleton className="h-10 w-full rounded-xl" />

              {/* Check-in / nights / Check-out */}
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-14 rounded-md" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
                <Skeleton className="h-7 w-28 rounded-full" />
                <div className="space-y-1.5 items-end flex flex-col">
                  <Skeleton className="h-3 w-14 rounded-md" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              </div>

              <Skeleton className="h-px w-full" />

              {/* Guest info rows */}
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded-md shrink-0" />
                    <Skeleton className="h-4 w-40 rounded-md" />
                  </div>
                ))}
              </div>

              <Skeleton className="h-px w-full" />

              {/* Adults | Children | Pets */}
              <div className="flex items-center gap-5 flex-wrap">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Skeleton className="h-5 w-5 rounded-md shrink-0" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop info grid */}
            <div className="hidden lg:grid grid-cols-3 divide-x divide-y borderColor">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex gap-2 items-start p-4">
                  <Skeleton className="h-5 w-5 rounded-md shrink-0 mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-16 rounded-md" />
                    <Skeleton className="h-4 w-28 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            <Skeleton className="hidden lg:block h-px w-full" />

            {/* Check-in & Check-out policy */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-44 rounded-md" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-1.5 w-1.5 rounded-full mt-2 shrink-0" />
                    <Skeleton className="h-4 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop action buttons */}
            <Skeleton className="hidden lg:block h-px w-full" />
            <div className="hidden lg:flex items-center justify-end gap-3">
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Right column — Price Summary */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-2xl border p-4 md:p-6 space-y-4">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-px w-full" />

            {/* Row items */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            ))}

            <Skeleton className="h-px w-full" />

            {/* Total block */}
            <Skeleton className="h-12 w-full rounded-xl" />

            {/* Payment mode */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>

            {/* Note */}
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>

      </div>

      {/* Mobile bottom buttons */}
      <div className="lg:hidden flex items-center gap-3 pb-2">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 flex-1 rounded-xl" />
      </div>

    </div>
  )
}

export default BookingDetailsPageSkeleton
