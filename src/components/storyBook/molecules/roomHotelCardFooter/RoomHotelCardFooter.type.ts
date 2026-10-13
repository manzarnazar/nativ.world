export interface RoomHotelCardFooterProps {
    price?: number | string;
    currency?: string;
    taxesAmt?: number;
    className?: string;
    roomsCard?: boolean;
    roomsTypeCard?: boolean;
    isAvailable?: boolean;
    roomSlug?: string;
    handleRedirectDetailPage?: (slug?: string, selectRoom?: boolean, reserverNow?: boolean) => void;
    lockBookingLoading?: boolean;
    setRoomsModal?: () => void;
    roomsModal?: boolean;
    handleOpenReserveModal?: () => void;
}
