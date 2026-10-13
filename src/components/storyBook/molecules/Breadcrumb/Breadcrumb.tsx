'use client';
import React from 'react';
import { PiArrowLeft, PiCaretRight } from 'react-icons/pi';
import { Typography } from '../../atoms/Typography';
import { BreadcrumbProps } from './Breadcrumb.type';
import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';

const Breadcrumb: React.FC<BreadcrumbProps> = ({ activeLabel, className }) => {

    const { t } = useTranslation();
    const router = useRouter();

    const isConfirmBooking = activeLabel === t("confirmYourBooking");

    return (
        <nav aria-label="breadcrumb" className={`flex items-center border-b ${isConfirmBooking ? "bodyBg! h-22" : "bg-white h-18"} ${className}`}>

            <div className="container hidden md:flex items-center gap-1">
                {
                    isConfirmBooking ?
                        <div className='flex items-center gap-6'>

                            <button className='w-10 h-10 rounded-full flexCenter bg-white' onClick={() => router.back()}>
                                <PiArrowLeft className='text-2xl rtl:rotate-180' />
                            </button>

                            <Typography
                                variant="h1"
                                weight="semibold"
                                className="textPrimaryColor! text-2xl!"
                            >
                                {t("confirmYourBooking")}
                            </Typography>
                        </div>
                        :
                        <div className='flex items-center gap-2'>

                            {/* Static "My Account" label */}
                            <Typography
                                variant="caption"
                                weight="semibold"
                                className="textPrimaryColor!"
                            >
                                {t("myAccount")}
                            </Typography>

                            <PiCaretRight className="text-xl textPrimaryColor shrink-0 rtl:rotate-180" />

                            {/* Dynamic active page label */}
                            <Typography
                                variant="caption"
                                weight="regular"
                                className="primaryColor!"
                            >
                                {activeLabel}
                            </Typography>
                        </div>
                }
            </div>
        </nav >
    );
};

export default Breadcrumb;