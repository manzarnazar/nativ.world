import { useMutation } from "@tanstack/react-query";
import { retryPaymentApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";
import { ConfirmBookingRecord } from "../useConfirmBookings";

export interface RetryPaymentData {
    id: number;
    gateway_order_id: string;
    payment_url: string;
    amount: string;
    currency: string;
    payment_type: string;
    remaining_amount: number | null;
    status: string;
}

export interface RetryPaymentResponseData {
    booking: ConfirmBookingRecord;
    payment: RetryPaymentData;
}

export interface RetryPaymentApiResponse extends Omit<ApiResponseType, "data"> {
    data: RetryPaymentResponseData;
}

export interface RetryPaymentPayload {
    bookingNumber: string;
    // gateway_type: string;
    // payment_type: string;
}

export const useRetryPayment = () => {
    return useMutation<RetryPaymentApiResponse, Error, RetryPaymentPayload>({
        mutationFn: async ({ bookingNumber }) => {
            try {
                const response = await retryPaymentApi({ bookingNumber });
                if (!response) {
                    throw new Error("Failed to retry payment");
                }
                if (response?.error) {
                    throw new Error(response?.message || "Failed to retry payment");
                }
                return response as RetryPaymentApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to retry payment";
                throw new Error(apiMessage);
            }
        },
    });
};
