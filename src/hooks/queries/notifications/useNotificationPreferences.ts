import { useQuery } from "@tanstack/react-query";
import { getNotificationPreferencesApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export type NotificationCategory =
  | "booking_updates"
  | "reminders"
  | "payments"
  | "refund_updates";

export interface NotificationPreference {
  category: NotificationCategory;
  label: string;
  is_enabled: boolean;
}

export interface NotificationPreferencesApiResponse
  extends Omit<ApiResponseType, "data"> {
  data: NotificationPreference[];
}

export const useNotificationPreferences = () => {
  return useQuery<NotificationPreferencesApiResponse>({
    queryKey: ["notificationPreferences"],
    queryFn: async () => {
      try {
        const response = await getNotificationPreferencesApi();
        if (response?.error) {
          throw new Error(
            response?.message || "Failed to fetch notification preferences"
          );
        }
        return response as NotificationPreferencesApiResponse;
      } catch (error: any) {
        const apiMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch notification preferences";
        throw new Error(apiMessage);
      }
    },
  });
};
