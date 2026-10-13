import React, { useState } from 'react'
import { Typography } from '../Typography'
import Divider from '../Divider'
import { useTranslation } from '@/hooks/useTranslation'
import { AmenitiesProps, } from './Amenities.type'
import IconLabel from '../IconLabel/IconLabel'
import AmenitiesModal from '@/components/modalsAndSheets/AmenitiesModal'
import { useIsMobile } from '@/hooks/useMobile'
import ImagePreview from '../ImagePreview'

const Amenities: React.FC<AmenitiesProps> = ({
    amenities,
    initialCount = 9,
    className = '',
}) => {

    const { t } = useTranslation();

    const isMobile = useIsMobile();

    const [expanded, setExpanded] = useState(false);

    const visible = expanded ? amenities : amenities?.slice(0, initialCount);
    return (
        amenities && amenities?.length > 0 &&
        <div
            className={`bg-white rounded-2xl md:border ${isMobile ? 'container' : ''} overflow-hidden p-4 sm:p-5 md:p-6 flex flex-col gap-y-4 items-start w-full  ${className}`
            }
        >
            {/* Title */}
            < Typography variant="h5" weight="semibold" >
                {t('amenities')}
            </Typography >

            {
                isMobile ?
                    <Divider /> :
                    <Divider width='bleed' />
            }

            {/* Amenity Grid — 1 col on mobile, 2 on sm, 3 on md+ */}
            <div className="grid grid-cols-2 md:grid-cols-3 commonGap w-full">
                {visible?.map((amenity, index) => (
                    <IconLabel
                        key={index}
                        icon={
                            <span className="bodyBg border rounded-lg p-2 md:p-3 flex items-center justify-center shrink-0 h-9.5 w-9.5 md:h-12.5 md:w-12.5">
                                <ImagePreview src={amenity?.icon} alt={amenity?.name} className='h-5.5 w-5.5 md:w-6 md:h-6' />
                            </span>
                        }
                        label={amenity?.name}
                        className="gap-4 text-sm sm:text-base"
                    />
                ))}
            </div>
            {/* See All Amenities */}
            {
                amenities && amenities?.length > 9 &&
                <AmenitiesModal amenities={amenities} />
            }
        </div >
    )
}

export default Amenities
