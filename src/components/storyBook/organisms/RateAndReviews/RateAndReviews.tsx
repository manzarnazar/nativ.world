'use client'
import { Typography } from '../../atoms/Typography'
import Divider from '../../atoms/Divider'
import { useTranslation } from '@/hooks/useTranslation'
import AverageRatings from '../../atoms/AverageRatings/AverageRatings'
import Review from '../../molecules/Review/Review'
import { PiArrowRight } from 'react-icons/pi'
import { SelectOpt } from '../../atoms/SelectOpt'
import ReviewModal from '@/components/modalsAndSheets/ReviewModal'
import { sortByOptsType } from '@/types/GlobalTypes'
import { useIsMobile } from '@/hooks/useMobile'
import { ReviewItem, ReviewsFilters, ReviewsPropertyOverview, useReviews } from '@/hooks/queries/useReviews'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface RateAndReviewsProps {
    className?: string;
    modal?: boolean;
    roomsPage?: boolean;
    propertySlug?: string;
    roomsSlug?: string;
    isPropertyRoomsModal?: boolean
}

const RateAndReviews = ({ className = '', modal = false, roomsPage, propertySlug, roomsSlug, isPropertyRoomsModal }: RateAndReviewsProps) => {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const { slug } = useParams<{ slug: string }>();

    const sortByOpts = [
        {
            label: t('newFirst'),
            value: 'newest_first'
        },
        {
            label: t('oldFirst'),
            value: 'oldest_first'
        },
        {
            label: t('highToLow'),
            value: 'high_low'
        },
        {
            label: t('lowToHigh'),
            value: 'low_high'
        },
    ];

    const [sortBy, setSortBy] = useState<string>('newest_first');

    const {
        data: reviewsData,
        isLoading: reviewsLoading,
        error: reviewsError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useReviews({ property_slug: propertySlug || slug, ...(modal || roomsPage) && { room_type_slug: roomsSlug ? roomsSlug : slug }, sort: sortBy },);

    // First page data for summary/property info
    const firstPage = reviewsData?.pages?.[0]?.data;

    const [summary, setSummary] = useState(firstPage?.summary)
    useEffect(() => {
        if (firstPage) setSummary(firstPage?.summary);
    }, [firstPage]);
    // Accumulate all reviews across pages
    const allReviews: ReviewItem[] = reviewsData?.pages?.flatMap(page => page?.data?.items ?? []) ?? [];

    // Show only first 3 in the card view
    const previewReviews = allReviews.slice(0, 3);

    useEffect(() => {
        if (reviewsError) {
            console.log("reviewsError =>", reviewsError);
        }
    }, [reviewsError])



    return (
        (reviewsError || (!reviewsLoading && allReviews?.length === 0)) ? null :
            <div className={`${modal ? '' : `bg-white p-4 sm:p-5 md:p-6 rounded-2xl md:border ${isMobile ? 'container' : ''}`} overflow-hidden flex flex-col gap-y-4 items-start w-full ${className}`}>
                <div className={`flex items-center justify-between flex-wrap w-full ${modal ? 'bodyBg p-4 rounded-2xl' : ''}`}>
                    <Typography variant="h5" weight="semibold">
                        {t('rateReviews')}
                    </Typography>
                    <SelectOpt
                        options={sortByOpts}
                        value={sortBy ?? ''}
                        onChange={setSortBy}
                        triggerClassName="w-40"
                    />
                </div>

                {!modal && <Divider width='bleed' />}

                {

                    isPropertyRoomsModal && reviewsLoading ?
                        <div className={`flex flex-col md:flex-row items-center gap-4 w-full ${modal && 'mb-4'}`}>
                            <div className="flex items-center gap-3 md:flexCeneter md:flex-col border rounded-2xl p-3 md:p-4 min-w-50 w-full md:w-auto shrink-0">
                                <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                                <div className="flex flex-col md:flexCenter gap-2 w-full">
                                    <Skeleton className="h-4 w-24 rounded-md" />
                                    <Skeleton className="h-3 w-32 rounded-md" />
                                </div>
                            </div>
                            <div className="w-full h-full flex flex-col gap-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center h-full gap-4">
                                        <Skeleton className="h-3 w-22.5 rounded-md shrink-0" />
                                        <Skeleton className="flex-1 h-1.5 rounded-full" />
                                        <Skeleton className="h-3 w-8.75 rounded-md shrink-0" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        :
                        <div className={`w-full ${modal && 'mb-4'}`}>
                            <AverageRatings
                                rating={summary?.average_rating}
                                breakdown={summary?.rating_breakdown}
                                reviews={summary?.total_reviews}
                            />
                        </div>
                }


                {!modal && (firstPage?.summary?.total_reviews ?? 0) > 0 && <Divider width='bleed' />}

                <div className="w-full space-y-4">

                    {
                        reviewsLoading ?
                            Array.from({ length: 3 }).map((_, index) => (
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
                            ))
                            :
                            (modal ? allReviews : previewReviews).map((review, idx) => {
                                const list = modal ? allReviews : previewReviews;
                                return (
                                    <div key={review.id} className='space-y-4'>
                                        <Review
                                            rating={review?.rating}
                                            reviewerName={review?.user?.name}
                                            date={review?.date}
                                            reviewText={review?.review}
                                            images={review?.images?.map((img) => img?.url)}
                                            review={review}
                                        />
                                        {idx !== list.length - 1 && <Divider width='bleed' />}
                                    </div>
                                );
                            })}
                </div>

                {allReviews.length > 3 && !modal && <Divider width='bleed' />}

                {/* "See All Reviews" triggers modal — only shown in card view when reviews exist */}
                {allReviews.length > 3 && !modal && !modal && firstPage && (firstPage?.summary?.total_reviews ?? 0) > 0 && (hasNextPage || firstPage?.pagination?.last_page) && (
                    <ReviewModal
                        sortByOpts={sortByOpts}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        allReviews={allReviews}
                        property={firstPage?.property as ReviewsPropertyOverview}
                        hasNextPage={!!hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        summary={firstPage?.summary}
                        isLoading={reviewsLoading}
                    />
                )}
            </div>
    );
};

export default RateAndReviews;