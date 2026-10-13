import { Skeleton } from '@/components/ui/skeleton'
import Divider from '@/components/storyBook/atoms/Divider'

const BookingCardSkeleton = () => (
  <div className="bg-white rounded-2xl border overflow-hidden">
    {/* Mobile header */}
    <div className="flex items-center justify-between gap-2 px-4 pt-4 md:hidden">
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-7 w-32 rounded-full" />
    </div>

    {/* Property row */}
    <div className="flex items-start justify-between gap-4 p-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Skeleton className="shrink-0 w-24 h-20 md:w-30 md:h-25 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="hidden md:block text-right space-y-1.5">
        <Skeleton className="h-3 w-16 ml-auto" />
        <Skeleton className="h-4 w-20 ml-auto" />
      </div>
    </div>

    <Divider />

    {/* Status bar */}
    <div className="bg-gray-100 flex items-center justify-between px-4 py-3 gap-2">
      <Skeleton className="hidden md:block h-4 w-28" />
      <Skeleton className="h-3 w-48 ml-auto" />
    </div>

    <Divider />

    {/* Actions */}
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <Skeleton className="h-4 w-24" />
      <div className="flex gap-3 ml-auto">
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>
    </div>
  </div>
)

export default BookingCardSkeleton
