import { useMutation } from "@tanstack/react-query";
import { manualRefundRequestApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface ManualRefundRequestPayload {
    bookingNumber: string;
    account_holder_name: string;
    bank_name: string;
    account_number: string;
    ifsc_swift_code: string;
    message: string;
}

export interface ManualRefundRequestData {
    id: number;
    refund_number: string;
    booking_number: string;
    account_holder_name: string;
    bank_name: string;
    account_number: string;
    ifsc_swift_code: string;
    amount: number;
    message: string;
    status: string;
    submitted_at: string;
}

export interface ManualRefundRequestApiResponse extends Omit<ApiResponseType, "data"> {
    data: ManualRefundRequestData;
}

export const useManualRefundRequest = () => {
    return useMutation<ManualRefundRequestApiResponse, Error, ManualRefundRequestPayload>({
        mutationFn: async (payload) => {    
            try {
                const response = await manualRefundRequestApi(payload);
                if (!response) {
                    throw new Error("Failed to submit manual refund request");
                }
                if (response?.error) {
                    throw new Error(response?.message || "Failed to submit manual refund request");
                }
                return response as ManualRefundRequestApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to submit manual refund request";
                throw new Error(apiMessage);
            }
        },
    });
};
