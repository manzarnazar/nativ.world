import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getReviewsApi } from "@/api/client/apiRoutes";
import { ApiResponseType, PaginationType } from "@/types/GlobalTypes";

export interface RatingBreakdown {
  rating: number;
  count: number;
}
export interface ReviewsPropertyOverview {
  id: number;
  name: string;
  slug: string;
  street_address: string;
  image: string;
  rating_overview: {
    average_rating: number;
    total_reviews: number;
  };
}
export interface ReviewUser {
  id: number;
  name: string;
  avatar: string | null;
}
export interface ReviewItemRoomType {
  id: number;
  slug: string | null;
  name: string;
  property_room_id: number;
}
export interface ReviewImage {
  id: number;
  url: string;
}
export interface ReviewItem {
  id: number;
  rating: number;
  review: string;
  stayed_nights: number;
  date: string;
  user: ReviewUser;
  room_type: ReviewItemRoomType;
  images: ReviewImage[];
}
export interface ReviewsSummary {
  total_reviews: number;
  total_ratings: number;
  average_rating: number;
  rating_breakdown: RatingBreakdown[];
}
export interface ReviewsResponseData {
  property: ReviewsPropertyOverview;
  room_type: ReviewItemRoomType | null;
  summary: ReviewsSummary;
  items: ReviewItem[];
  pagination: PaginationType;
}
export interface ReviewsApiResponse extends Omit<ApiResponseType, "data"> {
  data: ReviewsResponseData;
}
export interface ReviewsFilters {
  property_slug?: string;
  room_type_id?: string;
  room_type_slug?: string;
  sort?: string;
}

const REVIEWS_LIMIT = 4;

export const useReviews = (filters: ReviewsFilters = {}) => {
  return useInfiniteQuery<ReviewsApiResponse>({
    queryKey: ["reviews", filters], // auto-enable based on filter
    placeholderData: keepPreviousData,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination;
      if (pagination?.has_more) {
        return pagination.offset + pagination.limit;
      }
      return undefined;
    },
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getReviewsApi({
        limit: String(REVIEWS_LIMIT),
        offset: String(pageParam),
        ...(filters.property_slug && { property_slug: filters.property_slug }),
        ...(filters.room_type_slug && { room_type_slug: filters.room_type_slug }),
        ...(filters.sort && { sort: filters.sort }),
        // ...(filters.room_type_id && { room_type_id: filters.room_type_id }),
      });

      if (response?.error) {
        throw new Error(response?.message || "Failed to fetch reviews");
      }

      return response as ReviewsApiResponse;
    },
    staleTime: 0,
    gcTime: 0
  });
};