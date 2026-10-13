'use client'
import { Skeleton } from '@/components/ui/skeleton'

const ContactUsPageSkeleton = () => {
  return (
    <section className="bg-white commonPY">
      <div className="container space-y-6">
        {/* Page title — desktop only */}
        <Skeleton className="hidden md:block w-40 h-8 rounded-md" />

        <div className="grid grid-cols-1 lg:grid-cols-12 lg:rounded-2xl bg-white lg:shadow-[1px_1px_4px_0px_#0000001F] gap-y-6">

          {/* Left panel — contact info */}
          <div className="col-span-1 lg:col-span-5 rounded-2xl lg:rounded-l-2xl lg:rounded-r-none primaryLightBg p-4 lg:p-6 space-y-7.5 lg:border-r">
            <div className="flex flex-col gap-2">
              <Skeleton className="w-36 h-6 rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-4/5 h-4 rounded-md" />
            </div>

            {/* Contact info cards x3 */}
            <div className="flex flex-col gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-3 lg:p-6 flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-20 h-4 rounded-md" />
                    <Skeleton className="w-40 h-3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex flex-col gap-6">
              <Skeleton className="w-40 h-5 rounded-md" />
              <div className="flex items-center gap-6 flex-wrap">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-10 h-10 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Right panel — contact form */}
          <div className="col-span-1 lg:col-span-7 lg:rounded-r-2xl p-0 lg:p-6 space-y-7.5">
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 h-6 rounded-md" />
              <Skeleton className="w-full h-4 rounded-md" />
              <Skeleton className="w-3/4 h-4 rounded-md" />
            </div>

            {/* Divider */}
            <Skeleton className="w-full h-px rounded-full" />

            <div className="flex flex-col commonGap">
              {/* Name + Email row */}
              <div className="grid grid-cols-1 md:grid-cols-2 commonGap">
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-16 h-4 rounded-md" />
                  <Skeleton className="w-full h-11 rounded-lg" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-14 h-4 rounded-md" />
                  <Skeleton className="w-full h-11 rounded-lg" />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-2">
                <Skeleton className="w-16 h-4 rounded-md" />
                <Skeleton className="w-full h-11 rounded-lg" />
              </div>

              {/* Message textarea */}
              <div className="flex flex-col gap-2">
                <Skeleton className="w-20 h-4 rounded-md" />
                <Skeleton className="w-full h-30 rounded-lg" />
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <Skeleton className="w-32 h-11 rounded-lg" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default ContactUsPageSkeleton
