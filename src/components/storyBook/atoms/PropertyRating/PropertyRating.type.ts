export interface PropertyRatingProps {
    /** Average rating value (e.g. 4.5) */
    rating: number;
    /** Total number of reviews */
    reviews: number;
    /** Additional CSS classes */
    className?: string;
    showHotelBadge?: boolean;
    propertyType?: string;
}
