import { useMutation } from "@tanstack/react-query";
import { confirmBookingWithPaymentGateApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";
import { ConfirmBookingFilters, ConfirmBookingPricing, ConfirmBookingProperty } from "../useConfirmBookings";

// ── Response Types ────────────────────────────────────────────────────────────

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

export interface ConfirmBookingPaymentResult {
    id: number;
    gateway_order_id: string;
    payment_url: string;
    amount: string;
    currency: string;
    payment_type: string;
    remaining_amount: number | null;
    status: string;
}

export interface ConfirmBookingData {
    booking: ConfirmBookingRecord;
    payment: ConfirmBookingPaymentResult;
}

export interface ConfirmBookingWithPaymentApiResponse extends Omit<ApiResponseType, "data"> {
    data: ConfirmBookingData;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useConfirmBookingsWithPayment = () => {
    return useMutation<ConfirmBookingWithPaymentApiResponse, Error, ConfirmBookingFilters>({
        mutationFn: async (filters: ConfirmBookingFilters) => {
            try {
                if (!filters.lock_id) {
                    throw new Error("Lock id is required");
                }
                const response = await confirmBookingWithPaymentGateApi({
                    lock_id: filters.lock_id,
                    gateway_type: filters.gateway_type,
                    payment_type: filters.payment_type,
                    adults: filters.adults,
                    children: filters.children,
                    has_pets: filters.has_pets,
                    coupon_code: filters.coupon_code,
                    guest_name: filters.guest_name,
                    guest_email: filters.guest_email,
                    guest_phone: filters.guest_phone,
                    guest_dial_code: filters.guest_dial_code,
                });
                if (response?.error) {
                    throw new Error(response?.message || "Failed to confirm booking");
                }
                return response as ConfirmBookingWithPaymentApiResponse;
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