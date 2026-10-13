import React from 'react';
import { PropertyPriceProps } from './PropertyPrice.type';
import { useTranslation } from '@/hooks/useTranslation';
import { Typography } from '../Typography';

const PropertyPrice: React.FC<PropertyPriceProps> = ({
    currency,
    price,
    startingFromLabel,
    nightLabel,
    className = '',
    searchCard = false,
    showTaxLabel = false,
    taxesAmt,
    detailPage = false,
    fixedBottom = false,
    roomsCard = false
}) => {

    const { t } = useTranslation();
    return (
        <div className={`${searchCard || detailPage ? '' : 'pt-4'} space-y-2 ${className}`}>
            {
                !roomsCard &&
                <div className="flex items-baseline gap-1">
                    <span className="text-sm textSecondaryColor">{startingFromLabel ? startingFromLabel : t('startingFrom')}</span>
                </div>
            }
            <div className={`flex ${detailPage ? `items-center ${fixedBottom ? 'flex-wrap' : 'bodyBg p-3 rounded-2xl w-fit border'}` : 'flex-col'} gap-1`}>
                <div className="flex items-baseline gap-1">
                    <span className={`${fixedBottom ? '' : 'text-lg'} font-semibold`}>
                        {currency}{price?.toFixed(2)}
                    </span>
                    <span className="font-medium text-sm textSecondaryColor">/{nightLabel ? nightLabel : t('night')}</span>
                </div>
                {
                    showTaxLabel &&
                    <Typography variant="desc2" className="textSecondaryColor">
                        +{t('taxesAndFees') ?? 'taxes & fees'}
                    </Typography>
                }
            </div>
        </div >
    );
};

export default PropertyPrice;
