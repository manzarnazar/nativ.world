'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../atoms/Button';
import { PiArrowLeft, PiList, PiMapPinBold } from 'react-icons/pi';
import { Typography } from '../../atoms/Typography';
import { MobileBreadcrumProps } from './MobileBreadcrum.type';
import { useTranslation } from '@/hooks/useTranslation';
import { useSelector } from 'react-redux';
import { businessModeSelector } from '@/redux/reducers/settingsSlice';
import { BasicDetails } from '@/hooks/queries/useSettings';

const MobileBreadcrum: React.FC<MobileBreadcrumProps> = ({ title, className, setShowMap, showMapState = false }) => {

    const { t } = useTranslation();
    const router = useRouter();
    const isProperties = title === t("properties");
    const businessMode = useSelector(businessModeSelector) as BasicDetails;
    const showMap = isProperties && businessMode?.business_mode === 'multi';


    return (
        <div className={`bg-white border-b py-3 md:hidden ${className}`}>
            <div className="container">
                <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-4 justify-baseline">
                        {
                            !isProperties &&
                            <Button variant='text' className="p-0! min-w-fit! h-auto! shrink-0 border-0 hover:bg-transparent focus:ring-0" onClick={() => router.back()}>
                                <PiArrowLeft className='text-2xl' />
                            </Button>
                        }
                        <Typography variant='h1' weight='semibold' className='text-base!'>{title}</Typography>
                    </div>
                    {
                        showMap &&
                        <>
                            {showMapState ?
                                <button
                                    onClick={() => setShowMap?.(false)}
                                    className="flex items-center gap-2 border rounded-full border-black py-2 px-3"
                                >
                                    <span className="">
                                        <PiList />
                                    </span>
                                    {t('listView')}
                                </button>
                                :
                                <button
                                    onClick={() => setShowMap?.(true)}
                                    className="flex items-center gap-2 border rounded-full border-black py-2 px-3"
                                >
                                    <span className="">
                                        <PiMapPinBold />
                                    </span>
                                    {t('showOnMap')}
                                </button>}
                        </>
                    }
                </div>
            </div>

        </div >
    );
};

export default MobileBreadcrum;
