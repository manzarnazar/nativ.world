import { useMutation } from "@tanstack/react-query";
import { confirmBookingApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

// ── Response Types ────────────────────────────────────────────────────────────

export interface ConfirmBookingProperty {
    name: string;
    street_address: string;
    primary_image: string;
}

export interface ConfirmBookingTaxDetail {
    name: string;
    type: string;
    rate: number;
    amount: number;
}

export interface ConfirmBookingPricing {
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    currency_code: string;
    currency_symbol: string;
    tax_details: ConfirmBookingTaxDetail[];
    converted_subtotal: number;
    converted_currency_code: string;
    converted_currency_symbol: string;
    exchange_rate: number;
    converted_tax_amount: number;
    converted_discount_amount: number;
    converted_total_amount: number;
}

export interface ConfirmBookingRecord {
    id: number;
    booking_number: string;
    status: string;
    payment_status: string;
    payment_method: string;
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
    property: ConfirmBookingProperty;
    room_type_name: string;
    pricing: ConfirmBookingPricing;
}

export interface ConfirmBookingLock {
    id: number;
    status: string;
}

export interface ConfirmBookingData {
    booking: ConfirmBookingRecord;
    lock: ConfirmBookingLock;
}

export interface ConfirmBookingApiResponse extends Omit<ApiResponseType, 'data'> {
    data: ConfirmBookingData;
}

// ── Request Filters ───────────────────────────────────────────────────────────

export interface ConfirmBookingFilters {
    lock_id: number;
    gateway_type?: string;
    payment_type?: string;
    payment_method: string;
    adults: number;
    children: number;
    has_pets: boolean;
    // rooms: number;
    coupon_code?: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    guest_dial_code: string;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

// ✅ useMutation — not useQuery, since this is a POST that submits data
export const useConfirmBooking = () => {
    return useMutation<ConfirmBookingApiResponse, Error, ConfirmBookingFilters>({
        mutationFn: async (filters: ConfirmBookingFilters) => {
            try {
                const response = await confirmBookingApi({
                    lock_id: filters.lock_id,
                    payment_method: filters.payment_method,
                    adults: filters.adults,
                    children: filters.children,
                    has_pets: filters.has_pets,
                    coupon_code: filters.coupon_code,
                    guest_name: filters.guest_name,
                    guest_email: filters.guest_email,
                    guest_phone: filters.guest_phone,
                    guest_dial_code: filters.guest_dial_code,
                    // rooms: filters.rooms,
                });

                if (response?.error) {
                    throw new Error(response?.message || "Failed to confirm booking");
                }

                return response as ConfirmBookingApiResponse;
            } catch (error: any) {
                const apiMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to confirm booking";
                throw new Error(apiMessage);
            }
        },
    });
};