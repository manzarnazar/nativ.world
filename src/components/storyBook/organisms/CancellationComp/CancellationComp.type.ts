import { BookingQuoteCancellationPolicy } from '@/hooks/queries/useBookingQuote';

export interface CancellationCompProps {
    /** The full cancellation policy object from the booking summary */
    cancellationPolicy?: BookingQuoteCancellationPolicy | null;
    /** Layout variant: 'row' renders inline (md desktop), 'column' renders stacked (mobile) */
    variant?: 'row' | 'column';
    className?: string;
}
