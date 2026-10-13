import { useMutation } from "@tanstack/react-query";
import { contactUsApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface ContactUsPayload {
    name: string;
    email?: string;
    subject: string;
    message: string;
}

export interface ContactUsData {
    query_number: string;
    status: string;
}

export interface ContactUsApiResponse extends Omit<ApiResponseType, "data"> {
    data: ContactUsData;
}

export const useContactUs = () => {
    return useMutation<ContactUsApiResponse, Error, ContactUsPayload>({
        mutationFn: async ({ name, email, subject, message }) => {
            try {
                const response = await contactUsApi({ name, email, subject, message });
                if (!response) {
                    throw new Error("Failed to submit query");
                }
                if (response?.error) {
                    throw new Error(response?.message || "Failed to submit query");
                }
                return response as ContactUsApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to submit query";
                throw new Error(apiMessage);
            }
        },
    });
};
