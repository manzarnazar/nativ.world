import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNotificationPreferenceApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";
import { NotificationCategory } from "./useNotificationPreferences";

export interface UpdatePreferencePayload {
  category: NotificationCategory;
  is_enabled: boolean;
}

export interface UpdatePreferenceData {
  id: number;
  user_id: number;
  category: NotificationCategory;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdatePreferenceApiResponse extends Omit<ApiResponseType, "data"> {
  data: UpdatePreferenceData;
}

export const useUpdateNotificationPreference = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdatePreferenceApiResponse, Error, UpdatePreferencePayload>({
    mutationFn: async (payload) => {
      try {
        const response = await updateNotificationPreferenceApi(payload);
        if (response?.error) {
          throw new Error(response?.message || "Failed to update preference");
        }
        return response as UpdatePreferenceApiResponse;
      } catch (error: any) {
        const apiMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update preference";
        throw new Error(apiMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationPreferences"] });
    },
  });
};
