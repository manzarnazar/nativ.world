'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { isSingleHotelBranch } from '@/utils/helpers'
import SearchCardSkeleton from '../SearchCardSkeleton'

const PropertyDetailsPageSkeleton = () => {
  const singleHotel = isSingleHotelBranch()

  return (
    <section className="overflow-x-hidden">
      <div className="relative md:hidden">
        <div className="absolute top-10 z-12 w-full">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>

        <Skeleton className="h-[325px] w-full rounded-none" />

        <div className="absolute bottom-10 z-10 w-full">
          <div className="container flex justify-end">
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white pt-4 md:commonPY" id="overview">
        <div className="container">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-3">
              <Skeleton className="h-8 w-2/3 rounded-md" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-12 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
            </div>

            <Skeleton className="h-px w-full" />

            <div className="hidden md:flex items-center justify-between flex-wrap gap-y-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-32 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="h-10 w-24 rounded-xl" />
              </div>
            </div>

            <div className="hidden md:grid grid-cols-2 commonGap">
              <Skeleton className="h-[420px] w-full rounded-2xl" />
              <div className="grid grid-cols-2 commonGap">
                <Skeleton className="h-[200px] w-full rounded-2xl" />
                <Skeleton className="h-[200px] w-full rounded-2xl" />
                <Skeleton className="h-[200px] w-full rounded-2xl" />
                <Skeleton className="h-[200px] w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:commonPY md:container">
        <div className="grid grid-cols-12 commonGap">
          <div className="max-1199:col-span-12 col-span-8 space-y-4 bg-white md:bg-transparent">
            {!singleHotel && (
              <div className="rounded-2xl border bg-white p-5 space-y-4">
                <Skeleton className="h-7 w-40 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-11/12 rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>
            )}

            <div id="roomType" className="bg-white rounded-2xl border overflow-hidden p-4 flex flex-col gap-y-4 items-start">
              <Skeleton className="h-7 w-32 rounded-md" />
              <Skeleton className="h-px w-full" />
              <div className="flex flex-col gap-6 w-full">
                {Array.from({ length: 2 }).map((_, index) => (
                  <SearchCardSkeleton key={index} />
                ))}
              </div>
            </div>

            <div id="amenities" className="rounded-2xl border bg-white p-5 space-y-4">
              <Skeleton className="h-7 w-32 rounded-md" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            </div>

            <div id="reviews" className="rounded-2xl border bg-white p-5 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-7 w-40 rounded-md" />
                <Skeleton className="h-10 w-36 rounded-xl" />
              </div>

              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-28 rounded-md" />
                      <Skeleton className="h-3 w-20 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-10/12 rounded-md" />
                  {index < 2 && <Skeleton className="h-px w-full" />}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block max-1199:col-span-12 col-span-4">
            <div className="rounded-2xl border bg-white p-5 space-y-5">
              <div className="space-y-2">
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 z-10 w-full bg-white px-4 py-6 shadow-[0px_8px_20px_0px_#00000014] md:hidden">
        <div className="container flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
      </div>
    </section>
  )
}

export default PropertyDetailsPageSkeleton
