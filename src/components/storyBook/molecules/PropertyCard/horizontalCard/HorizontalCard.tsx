'use client';
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

import Divider from '../../../atoms/Divider';
import ImagePreview from '../../../atoms/ImagePreview';
import PropertyInfo from '../../../atoms/PropertyInfo';
import PropertyPrice from '../../../atoms/PropertyPrice';
import PropertyRating from '../../../atoms/PropertyRating';
import WishlistBtn from '../../../atoms/WishlistBtn';

import { HorizontalCardProps } from './HorizontalCard.type';

const HorizontalCard: React.FC<HorizontalCardProps> = ({
    property,
    onClick,
    className = '',
}) => {
    const { t } = useTranslation();

    return (
        <div
            className={`bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex h-full gap-3 max-h-[220px] border ${className}`}
            onClick={onClick}
        >
            {/* Image — fixed width left side */}
            <div className="relative w-[264px] h-full flex-shrink-0 z-[1]">
                <ImagePreview src={property?.image} alt={property?.name} objectFit="cover" />

                <WishlistBtn isWishlisted={property?.is_favorited} slug={property?.slug} />
            </div>

            {/* Details — right side */}
            <div className="flex-1 p-3 flex flex-col justify-between">
                <div className="space-y-2">
                    <PropertyRating rating={property?.rating || 0} reviews={property?.reviews_count} />
                    <PropertyInfo name={property?.name} location={`${property?.street_address},${property?.city}`} />
                </div>

                <div className="between-1200-1399:mt-8 max-1199:mt-8 mt-4">
                    <Divider />
                    <PropertyPrice price={property?.converted_starting_price} currency={property?.converted_currency_symbol} showTaxLabel />
                </div>
            </div>
        </div>
    );
};

export default HorizontalCard;
