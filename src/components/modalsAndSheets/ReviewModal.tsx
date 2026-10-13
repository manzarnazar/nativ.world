import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../storyBook/atoms/Button"
import Divider from "../storyBook/atoms/Divider"
import PropertyInfo from "../storyBook/atoms/PropertyInfo"
import AverageRatings from "../storyBook/atoms/AverageRatings/AverageRatings"
import Review from "../storyBook/molecules/Review/Review"
import { PiArrowLeft, PiArrowRight } from "react-icons/pi"
import { useTranslation } from "@/hooks/useTranslation"
import { sortByOptsType } from "@/types/GlobalTypes"
import { useIsMobile } from "@/hooks/useMobile"
import { ReviewItem, ReviewsSummary, ReviewsPropertyOverview } from "@/hooks/queries/useReviews"
import { SelectOpt } from "../storyBook/atoms/SelectOpt"
import { Typography } from "../storyBook/atoms/Typography"
import { Skeleton } from "../ui/skeleton"

interface ReviewModalProps {
    sortByOpts: sortByOptsType[];
    sortBy: string | undefined;
    setSortBy: (value: string) => void;
    allReviews: ReviewItem[];
    property: ReviewsPropertyOverview;
    summary: ReviewsSummary;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
    isLoading?: boolean;
}

const ReviewModal = ({
    sortByOpts,
    sortBy,
    setSortBy,
    allReviews,
    property,
    summary,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
}: ReviewModalProps) => {
    const { t } = useTranslation();
    const isMobile = useIsMobile();

    return (
        <Dialog>
            <DialogTrigger className="btn_md lg:btn_lg primaryColor flexCenter gap-2 p-0!">
                <span>{t('seeAllReviews')}</span>
                <PiArrowRight className="text-2xl rtl:rotate-180" />
            </DialogTrigger>
            <DialogContent className={`overflow-x-hidden overflow-y-auto ${isMobile ? 'max-w-full! max-h-full! h-full! [&>.closeBtn]:hidden rounded-none' : 'max-w-full! max-h-full! w-full! md:max-w-full! h-full! rounded-none'} flex flex-col`}>
                <div className="container flex flex-col gap-4">
                    <DialogHeader className='block'>
                        <div className="flex items-center gap-6">
                            <DialogClose asChild>
                                <span className="md:hidden cursor-pointer">
                                    <PiArrowLeft className="text-2xl" />
                                </span>
                            </DialogClose>
                            <DialogTitle>
                                <PropertyInfo
                                    name={property?.name}
                                    location={property?.street_address}
                                    className="[&>h3]:font-semibold"
                                />
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="bg-(--neutral-200) h-px relative w-[250%] -left-full" />

                    {/* Summary inside modal */}
                    <div className="flex items-center justify-between flex-wrap w-full bodyBg p-4 rounded-2xl">
                        <Typography variant="h5" weight="semibold">
                            {t('rateReviews')}
                        </Typography>
                        <SelectOpt
                            options={sortByOpts}
                            value={sortBy}
                            onChange={setSortBy}
                            triggerClassName="w-40"
                        />
                    </div>

                    <AverageRatings
                        rating={summary?.average_rating}
                        breakdown={summary?.rating_breakdown}
                        reviews={summary?.total_reviews}
                    />

                    <Divider width='bleed' />

                    {/* All accumulated reviews */}
                    <div className="w-full space-y-4">
                        {isLoading ? Array.from({ length: 3 }).map((_, index) => (
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
                        )) : allReviews.map((review, idx) => (
                            <div key={review.id} className='space-y-4'>
                                <Review
                                    rating={review?.rating}
                                    reviewerName={review?.user?.name}
                                    date={review?.date}
                                    reviewText={review?.review}
                                    images={review?.images?.map((img) => img?.url)}
                                    review={review}
                                />
                                {idx !== allReviews.length - 1 && <Divider width='bleed' />}
                            </div>
                        ))}
                    </div>

                    {/* Load more — stays inside modal, no close triggered */}
                    {hasNextPage && (
                        <div className="flexColCenter gap-6 mt-6">
                            <Divider />
                            <Button
                                variant="primary"
                                onClick={(e) => {
                                    e.preventDefault();   // prevent any form/dialog side effects
                                    e.stopPropagation();  // prevent event bubbling to dialog
                                    fetchNextPage();
                                }}
                                className="capitalize"
                                loading={isFetchingNextPage}
                            >
                                {t('loadMore') + " " + (t('reviews'))}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewModal;