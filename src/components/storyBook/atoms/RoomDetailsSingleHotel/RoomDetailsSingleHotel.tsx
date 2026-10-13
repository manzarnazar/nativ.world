import React from 'react';
import { PiBed, PiUsers, PiResize, } from 'react-icons/pi';
import { Typography } from '../Typography';
import PropertyRating from '../PropertyRating';
import { RoomDetailsSingleHotelProps } from './RoomDetailsSingleHotel.type';
import { useTranslation } from '@/hooks/useTranslation';
import { useIsMobile } from '@/hooks/useMobile';

const RoomDetailsSingleHotel: React.FC<RoomDetailsSingleHotelProps> = ({
    name,
    location,
    rating,
    reviews,
    maxGuests,
    bedType,
    roomSize,
    detailPage = false,
    className = '',
    roomsCard = false,
    reserveCard = false,
    bookingModal = false,
    bookingCard = false,
    roomsModal = false,
    propertyType = ''
}) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const ratingNode = (
        <PropertyRating rating={rating!} reviews={reviews!} showHotelBadge={detailPage && !roomsCard} propertyType={propertyType}/>
    );

    const specsRow = (
        <div className={`flex flex-wrap items-center gap-x-5 gap-y-1.5 ${roomsCard ? 'mt-2' : roomsModal ? '' : 'mt-1'}`}>
            {/* Max guests */}
            {
                roomsCard || roomsModal ?
                    <div className={`flex gap-4 flex-col sm:flex-wrap ${roomsModal ? 'sm:flex-row' : ''}`}>
                        <span className="flex items-center gap-1.5 text-sm textSecondaryColor">
                            {
                                reserveCard ? <span className='-mt-3 font-bold text-lg'>.</span>
                                    :
                                    <PiUsers className="text-lg shrink-0" />
                            }
                            <span className='textSecondaryColor text-sm'>{t('maxGuests')} : <span className="font-medium textPrimaryColor">{maxGuests}</span></span>
                        </span>

                        {/* Bed type */}
                        <span className="flex items-center gap-1.5 text-sm textSecondaryColor">
                            {
                                reserveCard ? <span className='-mt-3 font-bold text-lg'>.</span>
                                    :
                                    <PiBed className="text-lg shrink-0" />
                            }
                            <div className='flexCenter gap-1 w-full flex-wrap justify-start!'>
                                <span className='textSecondaryColor text-sm'>{t('bedType')}:</span>
                                <span className="font-medium textPrimaryColor line-clamp-1">{bedType}</span>
                            </div>
                        </span>

                        {/* Room size */}
                        <span className="flex items-center gap-1.5 text-sm textSecondaryColor">
                            {
                                reserveCard ? <span className='-mt-3 font-bold text-lg'>.</span>
                                    :
                                    <PiResize className="text-lg shrink-0" />
                            }
                            <span className='textSecondaryColor text-sm'>{t('roomSize')} : <span className="font-medium textPrimaryColor">{roomSize} sq.ft</span></span>
                        </span>
                    </div>
                    :
                    <div>
                        <p className="max-399:text-xs text-sm md:text-base textSecondaryColor first-letter:capitalize">{location}</p>
                    </div>
            }


        </div>
    );

    /* ── detailPage layout (image 1) ─────────────────────────────
       rating
       Title
       specs row
    ─────────────────────────────────────────────────────────────── */
    if (detailPage) {
        return (
            <div className={className}>
                {ratingNode}
                <Typography variant="h5" weight="semibold" className="mt-1 capitalize text-lg! mb-2 md:mb-0">
                    {name}
                </Typography>
                {specsRow}
            </div>
        );
    }

    return (
        <div className={className}>
            <div className={`flex items-center justify-between flex-wrap gap-1 max-375:flex-wrap max-375:gap-1 ${bookingCard && isMobile ? 'flex-col items-start justify-start gap-1' : ''}`}>
                <Typography variant="h5" weight="semibold" className='max-375:text-sm! text-base! sm:text-lg! capitalize between-768-991:text-base!'>
                    {name}
                </Typography>
                {
                    (!bookingModal && !roomsModal) && ratingNode
                }
            </div>
            {specsRow}
        </div>
    );
};

export default RoomDetailsSingleHotel;
