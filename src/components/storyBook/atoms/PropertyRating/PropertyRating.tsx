'use client'
import React from 'react';
import { PiStarFill } from 'react-icons/pi';
import { PropertyRatingProps } from './PropertyRating.type';
import { useTranslation } from '@/hooks/useTranslation';
import { useSelector } from 'react-redux';
import { businessModeSelector } from '@/redux/reducers/settingsSlice';
import { BasicDetails } from '@/hooks/queries/useSettings';
import Badge from '../Badge';

const PropertyRating: React.FC<PropertyRatingProps> = ({
    rating,
    reviews,
    className = '',
    showHotelBadge = false,
    propertyType = '',
}) => {

    const { t } = useTranslation()
    const businessMode = useSelector(businessModeSelector) as BasicDetails;
    const isMultiMode = businessMode?.business_mode === 'multi'

    const propertyBadge = isMultiMode ? propertyType : businessMode?.property_type;

    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {
                showHotelBadge &&
                <Badge label={propertyBadge ?? ''} className='rounded-[4px]! p-2!' />
            }

            {
                reviews > 0 ?
                    <div className={`flex items-center gap-1.5 ${className}`}>
                        <PiStarFill className="successColor" />
                        <span className="text-sm font-medium">{rating}</span>
                        <span className="text-sm textSecondaryColor">({reviews})</span>
                    </div>
                    :
                    <div className='flexCenter gap-1'>
                        <span className="text-sm successColor font-medium">{t('new')} </span>
                        {/* <span className="text-sm textSecondaryColor">{t('noReviewsYet')}</span> */}
                    </div>
            }

        </div>
    );
};

export default PropertyRating;
