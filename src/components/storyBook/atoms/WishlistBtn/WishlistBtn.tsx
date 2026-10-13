'use client';
import React, { useEffect, useState } from 'react';
import { PiHeart, PiHeartFill } from 'react-icons/pi';
import { WishlistBtnProps } from './WishlistBtn.type';
import { useAddRemoveFavorites } from '@/hooks/addRemoveFavorites';
import { useTranslation } from '@/hooks/useTranslation';
import { useSelector } from 'react-redux';
import { businessModeSelector } from '@/redux/reducers/settingsSlice';

const WishlistBtn: React.FC<WishlistBtnProps> = ({
    isWishlisted = false,
    showLabel = false,
    className = '',
    slug
}) => {

    const { t } = useTranslation();
    const [wishlisted, setWishlisted] = useState(isWishlisted);
    const { toggleFavorite, isTogglingFavorite } = useAddRemoveFavorites();

    const businessMode = useSelector(businessModeSelector);
    const isMultiMode = businessMode?.business_mode === 'multi';

    useEffect(() => {
        setWishlisted(isWishlisted);
    }, [isWishlisted]);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isTogglingFavorite(slug)) return;

        const previous = wishlisted;
        setWishlisted(!previous);

        const result = await toggleFavorite(slug, previous);
        if (result === null) {
            setWishlisted(previous);
        }
    };

    return (
        isMultiMode &&
        <div className='flexCenter gap-3! text-xl'>
            <button
                onClick={handleClick}
                disabled={isTogglingFavorite(slug)}
                className={`absolute top-4 right-4 z-2 w-8 h-8 bg-white rounded-full flexCenter border ${showLabel ? '' : 'hover:scale-110'} transition-transform duration-200 ${className}`}
                aria-label={wishlisted ? 'Remove from favorites' : 'Add to favorites'}
            >
                {wishlisted
                    ? <PiHeartFill className="errorColor text-xl" />
                    : <PiHeart className="textSecondaryColor text-xl" />
                }
            </button>
            {
                showLabel &&
                <span>{t('save')}</span>
            }
        </div>
    );
};

export default WishlistBtn;
