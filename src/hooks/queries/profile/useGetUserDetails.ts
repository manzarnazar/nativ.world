import { useQuery } from "@tanstack/react-query";
import { getUserDetailsApi } from "@/api/client/apiRoutes";
import { ApiResponseType, userDetailsType } from "@/types/GlobalTypes";

interface UserDetailsData {
    user: userDetailsType;
}

export interface UserDetailsApiResponse extends Omit<ApiResponseType, 'data'> {
    data: UserDetailsData;
}

export const useGetUserDetails = (enabled = true) => {
    return useQuery<UserDetailsApiResponse>({
        queryKey: ["userDetails"],
        enabled,
        retry: false,
        queryFn: async () => {
            try {
                const response = await getUserDetailsApi();
                if (!response) {
                    throw new Error("Failed to fetch user details");
                }
                if (response?.error) {
                    throw new Error(response?.message || "Failed to fetch user details");
                }
                return response as UserDetailsApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch user details";
                throw new Error(apiMessage);
            }
        },
    });
};
