import { useMutation } from "@tanstack/react-query";
import { cancelBookingApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface RefundData {
    id: number;
    amount: number;
    status: string;
    refund_id: string;
    refund_percentage: number;
    processed_at: string;
}

export interface CancelledBooking {
    booking_number: string;
    status: string;
    cancelled_at: string;
}

export interface CancelBookingData {
    booking: CancelledBooking;
    refund: RefundData | null;
}

export interface CancelBookingApiResponse extends Omit<ApiResponseType, "data"> {
    data: CancelBookingData;
}


export const useCancelBooking = () => {
    return useMutation<CancelBookingApiResponse, Error, { bookingNumber: string }>({
        mutationFn: async ({ bookingNumber }) => {
            try {
                const response = await cancelBookingApi({ bookingNumber });
                if (!response) {
                    throw new Error("Failed to cancel booking");
                }
                if (response?.error) {
                    throw new Error(response?.message || "Failed to cancel booking");
                }
                return response as CancelBookingApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to cancel booking";
                throw new Error(apiMessage);
            }
        },
    });
};
