import { useQuery } from "@tanstack/react-query";
import { getBookingDetailsApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";
import { BookingQuoteCancellationPolicy } from "../useBookingQuote";

export interface BookingProperty {
  name: string;
  slug: string;
  street_address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  place_id: string;
  rating: number;
  review_count: number;
  check_in_time: string;
  check_out_time: string;
  pay_at_property: boolean;
  advance_percentage: number;
  primary_image: string;
}

export interface TaxDetail {
  name: string;
  type: string;
  rate: number;
  amount: number;
}

export interface BookingPricing {
  price_per_night: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency_code: string;
  currency_symbol: string;
  tax_details: TaxDetail[];
  converted_subtotal: number;
  converted_currency_code: string;
  converted_currency_symbol: string;
  exchange_rate: number;
  converted_tax_amount: number;
  converted_discount_amount: number;
  converted_total_amount: number;
  amount_paid: number;
  remaining_amount: number;
}

export interface RefundData {
  id: number;
  amount: number;
  status: string;
  refund_id: string;
  refund_percentage: number;
  processed_at: string;
  is_manual_request_submitted: boolean;
  refund_method: string;
  transaction_id: string | null;
}

export interface BookingDetails {
  id: number;
  booking_number: string;
  status: string;
  status_label: string;
  status_color: string;
  payment_status: string;
  payment_method: string;
  booking_source: string;
  created_at: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  is_cancellable: boolean;
  refund: RefundData | null;
  property: BookingProperty;
  property_room_id: number;
  room_type_name: string;
  check_in: string;
  check_out: string;
  total_nights: number;
  booked_rooms: number;
  adults: number;
  children: number;
  has_pets: boolean;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_dial_code: string;
  pricing: BookingPricing;
  review: unknown | null;
  cancellation_policy: BookingQuoteCancellationPolicy;
}

export interface BookingDetailsApiResponse extends Omit<ApiResponseType, "data"> {
  data: BookingDetails;
}

export const useBookingDetails = (bookingNumber: string) => {
  return useQuery<BookingDetailsApiResponse>({
    queryKey: ["bookingDetails", bookingNumber],
    queryFn: async () => {
      try {
        const response = await getBookingDetailsApi({ bookingNumber });
        if (!response) {
          throw new Error("Failed to fetch booking details");
        }
        if (response?.error) {
          throw new Error(response?.message || "Failed to fetch booking details");
        }
        return response as BookingDetailsApiResponse;
      } catch (error: any) {
        const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch booking details";
        throw new Error(apiMessage);
      }
    },
    enabled: !!bookingNumber,
  });
};
