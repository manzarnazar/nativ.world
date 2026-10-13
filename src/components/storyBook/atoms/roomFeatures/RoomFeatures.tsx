import React from 'react';
import { RoomFeaturesProps } from './RoomFeatures.type';
import { useTranslation } from '@/hooks/useTranslation';
import { Typography } from '../Typography';
import { usePathname } from 'next/navigation';
import AmenitiesModal from '@/components/modalsAndSheets/AmenitiesModal';

const RoomFeatures: React.FC<RoomFeaturesProps> = ({
    features,
    visibleCount = 2,
    extraCount = 0,
    className = '',
    roomsCard = false,
    showViewMoreModal = false,
}) => {

    const { t } = useTranslation();
    const pathname = usePathname();
    const isHotelPage = pathname.includes('/properties');
    const visible = features?.slice(0, visibleCount);

    if (roomsCard) {
        return (
            features && features?.length > 0 &&
            <div className={`${className} space-y-2`}>
                <Typography variant='h6' children={t('roomFeaturesInc')} weight='medium' className='' />
                <ul className="space-y-2">
                    {visible.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 textSecondaryColor">
                            <span className="textSecondaryColor text-xs">•</span>
                            {f.name}
                        </li>
                    ))}
                </ul>
                {
                    showViewMoreModal ? <AmenitiesModal amenities={features} isHotelPage={isHotelPage} showViewMoreModal={showViewMoreModal} extraCount={extraCount} />
                        :
                        extraCount > 0 && !isHotelPage ? (
                            <p className="mt-2 text-sm">{extraCount}+ {t('more')}</p>
                        )
                            :
                            <AmenitiesModal amenities={features} isHotelPage={isHotelPage} />

                }
            </div>
        );
    }

    return (
        features && features?.length > 0 &&
        <div className={`flex flex-wrap items-center gap-2 amenitiesDiv ${className}`}>
            {visible?.map((f, i) => (
                <span
                    key={i}
                    className="inline-flex items-center bodyBg gap-1.5 px-3 py-1.5 border border-gray-300 rounded-full text-sm text-gray-700"
                >
                    {f.icon && <img src={f.icon} alt={f.name} className="w-4 h-4 object-contain shrink-0" />}
                    {f.name}
                </span>
            ))}
            {extraCount > 0 && (
                <span className="text-sm text-gray-600 font-medium">{extraCount}+ {t('more')}</span>
            )}
        </div>
    );
};

export default RoomFeatures;
