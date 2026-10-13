import { useMutation, useQuery } from "@tanstack/react-query";
import { bookingQuoteApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface BookingQuoteProperty {
    id: number;
    name: string;
    slug: string;
    city: string;
    state: string;
    pay_at_property: boolean;
    advance_percentage: number;
}

export interface BookingQuoteRoom {
    property_room_id: number;
    room_type_id: number;
    name: string;
    bed_type: string;
    max_guests: number;
    room_size: string;
    base_price_per_night: number;
    currency_code: string;
    currency_symbol: string;
    converted_base_price_per_night: number;
    converted_currency_code: string;
    converted_currency_symbol: string;
    exchange_rate: number;
}

export interface BookingQuoteStay {
    check_in: string;
    check_out: string;
    nights: number;
    adults: number;
    children: number;
    rooms: number;
    has_pets: boolean;
}

export interface BookingQuoteAvailability {
    available_rooms: number;
    requested_rooms: number;
    is_available: boolean;
}

export interface BookingQuoteCoupon {
    code: string;
    discount_type: string;
    discount_value: number;
    discount_amount: number;
}

export interface BookingQuotePromoCode {
    code: string;
    type: string;
    value: number;
}

export interface TaxDetail {
    name: string;
    type: string;
    rate: number;
    amount: number;
}

export interface BookingQuotePricing {
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
}

export interface BookingQuotePayment {
    available_methods: string[];
    payment_status_on_confirm: string;
    advance_amount: number;
    currency_code: string;
    currency_symbol: string;
    available_gateways: string[];
    converted_advance_amount: number;
    converted_currency_code: string;
    converted_currency_symbol: string;
    exchange_rate: number;
    has_pending_booking: boolean;
    booking_number: string | null;
    can_retry: boolean;
    reason: string | null;
}

export interface CancellationRule {
    refund_percentage: number
    label: string
    description: string
}

export interface BookingQuoteCancellationPolicy {
    free_cancellation_until: string | null;
    cancellation_cutoff_time: string;
    rules: CancellationRule[];
}

export interface BookingQuoteData {
    property: BookingQuoteProperty;
    room: BookingQuoteRoom;
    stay: BookingQuoteStay;
    availability: BookingQuoteAvailability;
    coupon: BookingQuoteCoupon | null;
    promo_code: BookingQuotePromoCode | null;
    pricing: BookingQuotePricing;
    payment: BookingQuotePayment;
    cancellation_policy: BookingQuoteCancellationPolicy;
}

export interface BookingQuoteApiResponse extends Omit<ApiResponseType, 'data'> {
    data: BookingQuoteData;
}

export interface BookingQuoteFilters {
    property_room_id?: string | number;
    check_in?: string;
    check_out?: string;
    adults?: number;
    children?: number;
    rooms?: number;
    has_pets?: boolean;
    coupon_code?: string;
    skip_auto_promo?: boolean;
}

export const useBookingQuote = () => {
    return useMutation<BookingQuoteApiResponse, Error, BookingQuoteFilters>({
        mutationFn: async (filters: BookingQuoteFilters) => {
            try {
                // ✅ SAME validation pattern
                if (!filters.property_room_id) {
                    throw new Error("Property room id is required");
                }

                const response = await bookingQuoteApi({
                    property_room_id: filters.property_room_id,
                    check_in: filters.check_in,
                    check_out: filters.check_out,
                    adults: filters.adults,
                    children: filters.children,
                    rooms: filters.rooms,
                    has_pets: filters.has_pets,
                    coupon_code: filters.coupon_code,
                    skip_auto_promo: filters.skip_auto_promo,
                });

                // ✅ SAME API error handling
                if (response?.error) {
                    throw new Error(response?.message || "Failed to fetch booking quote");
                }

                return response as BookingQuoteApiResponse;

            } catch (error: any) {
                // ✅ SAME error extraction
                const apiMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch booking quote";

                throw new Error(apiMessage);
            }
        },
    });
};

//     return useQuery<BookingQuoteApiResponse>({
//         queryKey: ["bookingQuote", filters],
//         enabled: !!(filters.property_room_id && filters.check_in && filters.check_out),
//         queryFn: async () => {

//             try {
//                 if (!filters.property_room_id) {
//                     throw new Error("Property room id is required");
//                 }
//                 const response = await bookingQuoteApi({
//                     property_room_id: filters.property_room_id,
//                     check_in: filters.check_in,
//                     check_out: filters.check_out,
//                     adults: filters.adults,
//                     children: filters.children,
//                     rooms: filters.rooms,
//                     has_pets: filters.has_pets,
//                     coupon_code: filters.coupon_code,
//                 });
//                 if (response?.error) {
//                     throw new Error(response?.message || "Failed to fetch rooms");
//                 }
//                 return response as BookingQuoteApiResponse;
//             } catch (error: any) {
//                 const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch rooms";
//                 throw new Error(apiMessage);
//             }
//         },
//         staleTime: 0,
//         gcTime: 0
//     });
// };