import { useMutation } from "@tanstack/react-query";
import { addReviewApi, editReviewApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface AddReviewData {
    booking_number: string;
    rating: string;
    review: string;
    status: string;
    is_edited: boolean | null;
    edited_at: string | null;
    images: string[];
}

export interface AddReviewApiResponse extends Omit<ApiResponseType, "data"> {
    data: AddReviewData;
}

export interface AddReviewFilters {
    booking_number: string;
    rating: number;
    review: string;
    images?: File[];
    existing_image_ids?: number[];
    isEdit?: boolean;
}

export const useAddReview = () => {
    return useMutation<AddReviewApiResponse, Error, AddReviewFilters>({
        mutationFn: async (filters: AddReviewFilters) => {
            try {
                const payload = {
                    booking_number: filters.booking_number,
                    rating: filters.rating,
                    review: filters.review,
                    images: filters.images ?? [],
                    existing_image_ids: filters.existing_image_ids ?? [],
                };

                const response = filters.isEdit
                    ? await editReviewApi(payload)
                    : await addReviewApi(payload);

                if (response?.error) {
                    throw new Error(response?.message || "Failed to submit review");
                }

                return response as AddReviewApiResponse;
            } catch (error: any) {
                const apiMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to submit review";
                throw new Error(apiMessage);
            }
        },
    });
};
