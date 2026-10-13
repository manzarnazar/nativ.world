'use client'

import ImagePreview from "@/components/storyBook/atoms/ImagePreview";
import RoomDetailsSingleHotel from "@/components/storyBook/atoms/RoomDetailsSingleHotel";
import { Typography } from "@/components/storyBook/atoms/Typography";
import { useIsMobile } from "@/hooks/useMobile";
import { useTranslation } from "@/hooks/useTranslation";
import { selectedRoomSelector } from "@/redux/reducers/helpersReducer";
import Link from "next/link";
import { PiMapPinArea } from "react-icons/pi";
import { useSelector } from "react-redux";


interface PropertyCardProps {
    bookingModal?: boolean;
    bookingDetailsPage?: boolean;
    propertyDetails?: any
    hotelPlaceId?: string
}

const PropertyCard: React.FC<PropertyCardProps> = ({ bookingModal, propertyDetails, bookingDetailsPage, hotelPlaceId }) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const selectedRoom = useSelector(selectedRoomSelector);
    const propertyData = bookingDetailsPage ? propertyDetails : selectedRoom?.property;


    return (
        <div className={`${bookingModal || bookingDetailsPage ? '' : 'border rounded-2xl overflow-hidden bg-white'}`}
        >
            <div className={`flex gap-2 sm:gap-4 items-center ${bookingModal || bookingDetailsPage ? '' : 'p-3 md:p-4'} flex-wrap`}>
                {/* Image with wishlist overlay */}
                <div className={`shrink-0 ${bookingModal || bookingDetailsPage ? 'w-23.5 h-20 md:w-23 md:h-20' : 'w-23.5 h-20 md:w-26 md:h-20'} relative`}>
                    <ImagePreview
                        src={propertyData?.image ? propertyData.image : propertyData?.primary_image}
                        alt={propertyData?.name}
                        objectFit="cover"
                        rounded="2xl"
                        aspectRatio="square"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-2 md:gap-4 md:justify-between">
                    <div className="flex  flex-col gap-2 md:gap-4 relative">
                        <RoomDetailsSingleHotel
                            name={propertyData?.name}
                            location={propertyData?.address || `${propertyData?.street_address},${propertyData?.city},${propertyData?.state}${propertyData?.country?.name ? `,${propertyData?.country?.name}` : ''}${propertyData?.zip_code ? ` - ${propertyData?.zip_code}` : ''}`}
                            rating={propertyData?.rating || 0}
                            reviews={propertyData?.review_count}
                            roomsCard={false}
                            bookingModal={bookingModal}
                            bookingCard={bookingDetailsPage}
                        />
                        {
                            bookingDetailsPage && (() => {
                                const lat = propertyData?.latitude;
                                const lng = propertyData?.longitude;
                                const mapUrl = hotelPlaceId
                                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyData?.name ?? '')}&query_place_id=${hotelPlaceId}`
                                    : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                                return (
                                    <Link href={mapUrl} target='_blank' className={`flexCenter gap-1.5 primaryColor w-fit ${isMobile ? 'absolute right-1 inset-y-0' : ''}`}>
                                        <span className={`${isMobile ? 'primaryLightBg p-2 rounded-full' : ''}`}>
                                            <PiMapPinArea className="text-xl" />
                                        </span>
                                        <Typography variant="caption" className={`primaryColor! ${isMobile ? 'hidden!' : ''}`}>{t('findHotelLocation')}</Typography>
                                    </Link>
                                );
                            })()
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropertyCard
