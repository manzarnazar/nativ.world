export interface RoomDetailsSingleHotelProps {
    /** Room name/title */
    name: string;
    /** Average rating value */
    rating?: number;
    /** Total number of reviews */
    reviews?: number;
    /** Max guests label (e.g. "2 adults") */
    maxGuests?: string;
    /** Bed type label (e.g. "1 King bed") */
    bedType?: string;
    /** Room size label (e.g. "280 sq. ft") */
    roomSize?: string;
    /**
     * When true  → rating above title (detail page layout — image 1)
     * When false → rating inline right of title (card layout — image 2)
     */
    detailPage?: boolean;
    /** Additional CSS classes */
    className?: string;
    location?: string;
    roomsCard?: boolean;
    reserveCard?: boolean;
    bookingModal?: boolean;
    bookingCard?: boolean;
    roomsModal?: boolean;
    propertyType?: string;
}
