'use client';
import React from 'react';

import Badge from '../../../atoms/Badge';
import Divider from '../../../atoms/Divider';
import PropertyInfo from '../../../atoms/PropertyInfo';
import PropertyPrice from '../../../atoms/PropertyPrice';
import PropertyRating from '../../../atoms/PropertyRating';
import WishlistBtn from '../../../atoms/WishlistBtn';

import ImagePreview from '@/components/storyBook/atoms/ImagePreview';
import { VerticalCardProps } from './VerticalCard.type';
import { RoomImgsSlider } from '@/components/storyBook/atoms/RoomImgsSlider';

const VerticalCard: React.FC<VerticalCardProps> = ({
    property,
    onClick,
    className = '',
    sliderSect = false
}) => {
    return (
        <div
            className={`${className} flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full border group`}
            onClick={onClick}
        >
            <div className={`relative ${sliderSect ? 'max-md:w-full!' : ''} w-full lg:w-[300px] h-[179px] sm:h-[250px] flex-shrink-0 z-[1] overflow-hidden`}>
                {/* Wishlist button */}
                <WishlistBtn isWishlisted={property?.is_favorited} slug={property?.slug} />

                {/* Featured badge */}
                {/* {true && (
                <Badge
                    label={t('featured')}
                    variant="info"
                    className="absolute top-4 left-4 bg-white text-black! [&>span]:primaryColor!"
                    iconLeft={<PiLightningFill className="md:text-lg" />}
                />
            )} */}
                {/* Image */}
                <ImagePreview src={property?.image} alt={property?.name} objectFit='cover' />
                {property?.images && property.images.length > 1 && (
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <RoomImgsSlider
                            images={property.images.map((src) => ({ src }))}
                            className="h-full"
                            imageClassName="h-full"
                            alwaysShowDots
                            enableLightbox={false}
                            blurredEdge={true}
                        />
                    </div>
                )}


            </div>

            {/* Details */}
            <div className="flex-1 p-3 flex flex-col justify-between">
                <div className="space-y-2">
                    <PropertyRating rating={property?.rating || 0} reviews={property?.reviews_count} />
                    <PropertyInfo name={property?.name} location={`${property?.street_address},${property?.city}`} />
                </div>

                <div className="mt-4">
                    <Divider />
                    <PropertyPrice price={property?.converted_starting_price} currency={property?.converted_currency_symbol} showTaxLabel />
                </div>
            </div>
        </div>
    );
};

export default VerticalCard;
