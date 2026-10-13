import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Typography from '../Typography/Typography';
import Divider from '../Divider/Divider';
import { BookingSummaryProps } from './BookingSummary.type';
import { useSelector } from 'react-redux';
import { bookingSummarySelector } from '@/redux/reducers/helpersReducer';

const BookingSummary: React.FC<BookingSummaryProps> = ({
    className = '',
    isPayAtProperty = false,
    paymentStatusModal = false
}) => {

    const { t } = useTranslation();

    const bookingSummary = useSelector(bookingSummarySelector);
    const pricingSummary = bookingSummary?.pricing;
    const subtotal = paymentStatusModal ? pricingSummary?.subtotal : pricingSummary?.converted_subtotal;
    const taxAndFees = paymentStatusModal ? pricingSummary?.tax_amount : pricingSummary?.converted_tax_amount;
    const totalAmount = paymentStatusModal ? pricingSummary?.total_amount : pricingSummary?.converted_total_amount;
    const couponDiscount = paymentStatusModal ? pricingSummary?.discount_amount : pricingSummary?.converted_discount_amount;
    const currencySymbol = paymentStatusModal ? pricingSummary?.currency_symbol : pricingSummary?.converted_currency_symbol;
    const subtotalDesc = `${bookingSummary?.room?.converted_currency_symbol}${bookingSummary?.room?.converted_base_price_per_night} x ${bookingSummary?.stay?.nights} ${t('night')} (${bookingSummary?.stay?.rooms} ${t(bookingSummary?.stay?.rooms > 1 ? 'rooms' : 'room')})`;
    const subtotalDescForPaymentStatus = `${bookingSummary?.room?.currency_symbol}${bookingSummary?.room?.base_price_per_night} x ${bookingSummary?.stay?.nights} ${t('night')} (${bookingSummary?.stay?.rooms} ${t(bookingSummary?.stay?.rooms > 1 ? 'rooms' : 'room')})`;
    const advanceAmount = paymentStatusModal ? bookingSummary?.payment?.advance_amount : bookingSummary?.payment?.converted_advance_amount;

    const subtotalDescDisplay = paymentStatusModal ? subtotalDescForPaymentStatus : subtotalDesc;

    const formatPrice = (val: number) => {
        return `${currencySymbol}${val?.toFixed(2)}`;
    }

    return (
        <div className={`p-4 md:p-5 rounded-xl border bodyBg flex flex-col gap-4 ${className}`}>

            {/* Subtotal */}
            <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between w-full">
                    <Typography variant="h6" weight="medium" className="textPrimaryColor!">
                        {t('subtotal')}
                    </Typography>
                    <Typography variant="h6" weight="medium" className="textPrimaryColor!">
                        {formatPrice(subtotal)}
                    </Typography>
                </div>
                {subtotalDescDisplay && (
                    <Typography variant="caption" className="textSecondaryColor text-sm!">
                        {subtotalDescDisplay}
                    </Typography>
                )}
            </div>

            <Divider />

            {/* Tax & Fees */}
            <div className="flex items-center justify-between w-full">
                <Typography variant="desc2" className="textPrimaryColor!">
                    {t('taxAndFees')}
                </Typography>
                <Typography variant="desc2" className="textPrimaryColor!">
                    {formatPrice(taxAndFees)}
                </Typography>
            </div>

            {/* Coupon Discount */}
            {couponDiscount !== undefined && couponDiscount > 0 && (
                <div className="flex items-center justify-between w-full">
                    <Typography variant="desc2" className="textPrimaryColor!">
                        {t('couponDiscount')}
                    </Typography>
                    <Typography variant="desc2" className="text-[#e2504c]!">
                        - {formatPrice(couponDiscount)}
                    </Typography>
                </div>
            )}

            {/* Total Amount Box */}
            <div className="bg-white rounded-lg p-3 mt-2 flex items-center justify-between">
                <Typography variant="h4" weight="semibold">
                    {t('totalAmount')}
                </Typography>
                <Typography variant="h4" weight="semibold" >
                    {formatPrice(totalAmount)}
                </Typography>
            </div>

            {
                isPayAtProperty &&
                <div className='space-y-4'>
                    <div className="flex items-center justify-between w-full">
                        <Typography variant="h6" weight="medium" className="textPrimaryColor!">
                            {t('paymentMode')}
                        </Typography>
                        <Typography variant="h6" weight="medium" className="textPrimaryColor!">
                            {t('payAtProperty')}
                        </Typography>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Typography variant="h6" weight="medium" className="textPrimaryColor!">
                            {t('advancePaid')} {bookingSummary?.property?.advance_percentage > 0 ? ` (${bookingSummary?.property?.advance_percentage}%)` : ''}
                        </Typography>
                        <Typography variant="h6" weight="medium" className="textPrimaryColor!">
                            {formatPrice(advanceAmount)}
                        </Typography>
                    </div>
                    <Divider />
                    <div className="flex items-center justify-between w-full">
                        <Typography variant="h5" weight="semibold" className="textPrimaryColor!">
                            {t('remainingAmount')}
                        </Typography>
                        <Typography variant="h5" weight="semibold" className="textPrimaryColor!">
                            {formatPrice(totalAmount - advanceAmount)}
                        </Typography>
                    </div>
                </div>
            }


        </div>
    );
};

export default BookingSummary;
