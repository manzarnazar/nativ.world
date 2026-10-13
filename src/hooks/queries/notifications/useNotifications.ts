import { useQuery } from "@tanstack/react-query";
import { getNotificationsApi } from "@/api/client/apiRoutes";
import { ApiResponseType, PaginationType } from "@/types/GlobalTypes";

export type NotificationType =
  | "booking_updates"
  | "reminders"
  | "payments"
  | "refund_updates"
  | "marketing"
  | string;

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  image: string | null;
  link: string | null;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export interface NotificationsListData {
  items: NotificationItem[];
  pagination: PaginationType;
}

export interface NotificationsApiResponse extends Omit<ApiResponseType, "data"> {
  data: NotificationsListData;
}

const NOTIFICATIONS_LIMIT = 5;

export const useNotifications = (page: number = 1) => {
  const offset = (page - 1) * NOTIFICATIONS_LIMIT;

  return useQuery<NotificationsApiResponse>({
    queryKey: ["notifications", page],
    queryFn: async () => {
      try {
        const response = await getNotificationsApi({
          limit: NOTIFICATIONS_LIMIT,
          offset,
        });
        if (response?.error) {
          throw new Error(response?.message || "Failed to fetch notifications");
        }
        return response as NotificationsApiResponse;
      } catch (error: any) {
        const apiMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch notifications";
        throw new Error(apiMessage);
      }
    },
  });
};
