'use client'
import React from 'react';
import { PiArrowRight, PiCheck } from 'react-icons/pi';
import { Button } from '../../atoms/Button';
import { RoomHotelCardFooterProps } from './RoomHotelCardFooter.type';
import { useTranslation } from '@/hooks/useTranslation';
import PropertyPrice from '../../atoms/PropertyPrice';
import { useSelector } from 'react-redux';
import { isFromSearchSelector, selectedRoomSelector } from '@/redux/reducers/helpersReducer';
import { useIsMobile } from '@/hooks/useMobile';

const RoomHotelCardFooter: React.FC<RoomHotelCardFooterProps> = ({
    price,
    currency,
    taxesAmt,
    className = '',
    roomsCard = false,
    roomsTypeCard = false,
    roomSlug,
    handleRedirectDetailPage,
    isAvailable,
    lockBookingLoading,
    setRoomsModal,
    roomsModal = false,
    handleOpenReserveModal
}) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const selectedRoom = useSelector(selectedRoomSelector);
    const isSelected = selectedRoom?.room?.slug === roomSlug;
    const isFromSearch = useSelector(isFromSearchSelector);

    const handleRedirectTo = (e: React.MouseEvent, selectRoom?: boolean, reserverNow?: boolean) => {
        e.stopPropagation()
        if (isSelected && !reserverNow) return;

        if (selectRoom || reserverNow) {
            handleRedirectDetailPage?.('', true, reserverNow);
            return
        }

        if (handleRedirectDetailPage && roomSlug) {
            handleRedirectDetailPage(roomSlug);
        }
    }

    const handleOpenRoomsModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setRoomsModal?.();
    }

    const handleOpenReserveModalMobile = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleOpenReserveModal?.();
    }
    return (
        <div className={`${roomsCard ? 'border-t' : 'rounded-2xl'} bodyBg  relative z-2 px-4 py-3 flex flex-wrap items-center justify-between gap-4 ${className}`}>
            {/* Full price with "Starting from" */}
            <PropertyPrice price={Number(price) || 0} currency={currency} taxesAmt={taxesAmt} searchCard={true} showTaxLabel={true} roomsCard={roomsCard} />
            {

                roomsTypeCard ?
                    <div className='flexCenter gap-4 flex-wrap'>
                        <Button
                            variant="outline"
                            size="md"
                            children={t('moreDetails')}
                            className={`hidden md:flex ${roomsTypeCard ? `hidden! ${roomsModal ? '' : 'lg:flex!'}` : ''}`}
                            onClick={handleOpenRoomsModal}
                        />
                        {
                            !isAvailable ?
                                <Button
                                    variant={"ghost"}
                                    size="md"
                                    children={t('notAvailable')}
                                    className='flex cursor-not-allowed!  bg-[#EDEDED]! border-2 border-[#D9D9D9]!'
                                    disabled={true}
                                    onClick={(e) => handleRedirectTo(e, true)}
                                />
                                :
                                isSelected ?
                                    <Button
                                        variant={"primary"}
                                        size="md"
                                        children={t('selected')}
                                        className='flex hover:primaryBg! cursor-default!'
                                        leftIcon={<PiCheck className='text-lg' />}
                                        onClick={(e) => handleRedirectTo(e, true)}
                                    />
                                    :
                                    <Button
                                        variant={"secondary"}
                                        size="md"
                                        onClick={(e) => handleRedirectTo(e, true)}
                                        children={t('selectRoom')}
                                        className=''
                                    />

                        }
                    </div>
                    :
                    roomsCard ?
                        <div className='flexCenter gap-4 flex-wrap'>
                            {
                                isAvailable || !isFromSearch ?
                                    <div className='flexCenter gap-4 flex-wrap'>
                                        {
                                            isFromSearch && <>

                                                {
                                                    isMobile ?
                                                        <Button
                                                            variant="secondary"
                                                            size="md"
                                                            onClick={handleOpenReserveModalMobile}
                                                            children={t('reserveNow')}
                                                            loading={lockBookingLoading}
                                                        />
                                                        :
                                                        <Button
                                                            variant="secondary"
                                                            size="md"
                                                            onClick={(e) => handleRedirectTo(e, true, true)}
                                                            children={t('reserveNow')}
                                                            loading={lockBookingLoading}
                                                        />
                                                }
                                            </>
                                        }
                                        <Button
                                            variant="primary"
                                            size="md"
                                            rightIcon={<PiArrowRight className='text-2xl rtl:rotate-180' />}
                                            children={t('viewDetails')}
                                            className='hidden sm:flex'
                                        />
                                    </div>
                                    :
                                    <div className='flexCenter gap-4 flex-wrap'>
                                        <Button
                                            variant={"ghost"}
                                            size="md"
                                            children={t('notAvailable')}
                                            className='flex cursor-not-allowed!  bg-[#EDEDED]! border-2 border-[#D9D9D9]!'
                                            disabled={true}
                                            onClick={(e) => handleRedirectTo(e, true)}
                                        />
                                    </div>
                            }
                        </div>
                        :

                        <Button
                            variant="primary"
                            size="md"
                            rightIcon={<PiArrowRight className='text-2xl rtl:rotate-180' />}
                            children={t('seeAvailability')}
                            className='hidden sm:flex'
                        />
            }
        </div>
    );
};

export default RoomHotelCardFooter;
