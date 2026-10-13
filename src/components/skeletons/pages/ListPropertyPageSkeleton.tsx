'use client'
import { Skeleton } from '@/components/ui/skeleton'

const ListPropertyPageSkeleton = () => {
  return (
    <div>
      <section className='commonPY bg-white'>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 items-center">
            <div className='space-y-6 lg:space-y-8 order-2 lg:order-1 h-full'>
              <div className='space-y-2 sm:space-y-3'>
                <Skeleton className="h-8 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {[...Array(4)].map((_, index) => (
                  <div key={index} className='primaryLightBg primaryLightBorderColor! border rounded-2xl p-4 sm:p-6 flex flex-col gap-3'>
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className='flex flex-col gap-1'>
                      <Skeleton className="h-5 w-1/2 rounded-md" />
                      <Skeleton className="h-3 w-full rounded-md" />
                      <Skeleton className="h-3 w-4/5 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>

              <Skeleton className="h-12 w-40 rounded-xl" />
            </div>

            <div className='flexCenter order-1 lg:order-2 w-full'>
              <Skeleton className='w-full h-60 sm:h-90 lg:h-159 aspect-770/636 rounded-2xl' />
            </div>
          </div>
        </div>
      </section>

      <section className="hidden md:block container py-20">
        <div className="space-y-6 md:space-y-10">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-56 rounded-md" />
            <Skeleton className="h-4 w-80 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl border p-3 md:p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                  <Skeleton className="h-3 w-full rounded-md" />
                  <Skeleton className="h-3 w-5/6 rounded-md" />
                </div>
                <div className="my-2">
                  <Skeleton className="h-px w-full" />
                </div>
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className='bodyBg commonPY md:hidden'>
        <div className="flex flex-col gap-6 container pb-4">
          <section className="flex flex-col">
            <div className="flex flex-col gap-2 mb-6">
              <Skeleton className="h-8 w-56 rounded-md" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>

            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center gap-3 py-4 px-3 border rounded-xl mb-3 w-full bg-white">
                <div className="flex-1 flex flex-col gap-1">
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                  <Skeleton className="h-3 w-full rounded-md" />
                </div>
                <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}

export default ListPropertyPageSkeleton
