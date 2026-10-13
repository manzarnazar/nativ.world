import { ReviewItem } from "@/hooks/queries/useReviews";

export interface ReviewProps {
    review: ReviewItem;
    rating: number;
    reviewerName: string;
    date: string;
    reviewText: string;
    images?: (string | { src: string })[];
    className?: string;
}
