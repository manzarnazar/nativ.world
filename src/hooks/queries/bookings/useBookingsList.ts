import { useQuery } from "@tanstack/react-query";
import { getBookingsListApi } from "@/api/client/apiRoutes";
import { ApiResponseType, PaginationType } from "@/types/GlobalTypes";

export interface BookingListProperty {
  name: string;
  slug: string;
  rating: number;
  review_count: number;
  address: string;
  image: string;
}


export interface Image {
  id: number;
  url: string;
}

export interface BookingReview {
  id: number;
  rating: number;
  review: string;
  status: string;
  is_edited: boolean;
  edited_at: null;
  images: Image[];
}

export interface Cancellation {
  refund_percentage: number;
  refund_amount: number;
  cancellation_deadline: string | null;
  cancellation_text: string | null;
}

export interface BookingListItem {
  id: number;
  booking_number: string;
  status: string;
  status_label?: string;
  status_color?: string;
  property_room_id: number;
  room_type_name: string;
  property: BookingListProperty;
  check_in: string;
  check_out: string;
  check_in_time: string;
  check_out_time: string;
  total_amount: number;
  currency_symbol: string;
  cancelled_at?: string | null;
  is_cancellable?: boolean;
  cancellation: Cancellation;
  refund?: { amount: number; currency_symbol: string;[key: string]: unknown } | null;
  review: BookingReview | null;
}

export interface BookingsListData {
  items: BookingListItem[];
  pagination: PaginationType;
}

export interface BookingsListApiResponse extends Omit<ApiResponseType, "data"> {
  data: BookingsListData;
}

export interface BookingsListFilters {
  status?: string;
}

const BOOKINGS_LIMIT = 10;

export const useBookingsList = (filters: BookingsListFilters = {}, page: number = 1) => {
  const offset = (page - 1) * BOOKINGS_LIMIT;

  return useQuery<BookingsListApiResponse>({
    queryKey: ["bookingsList", filters, page],
    queryFn: async () => {
      try {
        const response = await getBookingsListApi({
          limit: BOOKINGS_LIMIT,
          offset,
          status: filters.status ?? "",
        });
        if (response?.error) {
          throw new Error(response?.message || "Failed to fetch bookings");
        }
        return response as BookingsListApiResponse;
      } catch (error: any) {
        const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch bookings";
        throw new Error(apiMessage);
      }
    },
  });
};
