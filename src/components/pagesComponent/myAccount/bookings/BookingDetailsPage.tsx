'use client'

import Layout from '@/components/layout/Layout'
import { Typography } from '@/components/storyBook/atoms/Typography'
import React, { useEffect, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import {
  PiBabyCarriage,
  PiBed,
  PiCalendarDots,
  PiCheckCircleFill,
  PiClock,
  PiClockFill,
  PiEnvelope,
  PiInfo,
  PiPawPrint,
  PiPhone,
  PiReceipt,
  PiUserCircle,
  PiUsers,
  PiX,
  PiXCircleFill,
} from 'react-icons/pi'
import { Button } from '@/components/storyBook/atoms/Button'
import Divider from '@/components/storyBook/atoms/Divider'
import PropertyCard from '../../confirmBooking/PropertyCard'
import { useParams } from 'next/navigation'
import { useBookingDetails } from '@/hooks/queries/bookings/useBookingDetails'
import { formateDatePretty, formatTime, formatLocalDate, formatLocalTime, formatPriceHelper } from '@/utils/helpers'
import { useDownloadInvoice } from '@/hooks/useDownloadInvoice'
import BookingDetailsPageSkeleton from '@/components/skeletons/pages/BookingDetailsPageSkeleton'
import NoDataFound from '@/components/systemStates/NoDataFound'
import BankDetailsModal from './BankDetailsModal'
import CancellationComp from '@/components/storyBook/organisms/CancellationComp'
import CancelBookingConfimationModal from '@/components/modalsAndSheets/CancelBookingConfimationModal'
import { MobileBreadcrum } from '@/components/storyBook/molecules/mobileBreadcrum'
import { useIsMobile } from '@/hooks/useMobile'

interface InfoCellProps {
  icon: React.ReactNode
  label: string
  value: string | number | React.ReactNode
}

const InfoCell = ({ icon, label, value }: InfoCellProps) => (
  <div className="flex gap-2 items-start p-4 border-r [&:nth-child(3n)]:border-r-0 last:border-r-0 borderColor rtl:border-l rtl:[&:nth-child(3n)]:border-l-0 rtl:last:border-l-0  rtl:border-r-0">
    <span className="text-xl textSecondaryColor!">{icon}</span>
    <div className="flex flex-col textSecondaryColor -mt-1">
      <Typography variant="caption" className="textSecondaryColor!">{label}</Typography>
      <Typography variant="desc2" weight="semibold" className="textPrimaryColor! break-all">{value}</Typography>
    </div>
  </div>
)

const BookingDetailsPage = () => {

  const { t } = useTranslation()
  const params = useParams()
  const bookingId = params?.bookingId as string

  const [cancelBookingModal, setCancelBookingModal] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(false);
  const isMobile = useIsMobile()

  const { data, isLoading, isError, error, refetch } = useBookingDetails(bookingId)

  useEffect(() => {
    if (isError) {
      console.log("bookingDetailsPage error =>", error)
    }
  }, [isError]);

  const detailsData = data?.data
  const bookingStatus = detailsData?.status
  const refundStatus = detailsData?.refund?.status

  const statusTitle = refundStatus === 'completed' ? t('refundCompletedTitle') : bookingStatus === 'upcoming' ? t(isMobile ? 'bookingConf' : 'bookingConfStatusTitle') : bookingStatus === 'completed' ? t('stayCompleted') : bookingStatus === 'ongoing' ? t('stayInProgress') : bookingStatus === 'pending_payment' ? t('pendingPayment') : refundStatus === 'failed' ? t('refundFailTitle') : bookingStatus === 'cancelled' ? t(isMobile ? 'cancelledBooking' : 'cancelTitle') : '';

  const statusDesc = refundStatus === 'completed' ? t('refundCompletedDesc') : bookingStatus === 'upcoming'
    ? t('bookingConfStatusDesc')
    : bookingStatus === 'completed' ? t('bookingCompletedDesc') : bookingStatus === 'ongoing' ? `` : refundStatus === 'failed' ? t('refundFailDesc') : bookingStatus === 'cancelled'
      ? t('cancelDesc1') + ' ' + formateDatePretty(detailsData?.cancelled_at) + t('cancelDesc2') + ` ${detailsData?.pricing?.currency_symbol}${formatPriceHelper(detailsData?.refund?.amount!)} ` + t('cancelDesc3')
      : ''

  const statusBg = refundStatus === 'completed' || bookingStatus === 'upcoming' ? 'successLightBg' : bookingStatus === 'completed' || bookingStatus === 'pending_payment' ? 'warningLightBg' : bookingStatus === 'ongoing' ? 'primaryLightBg' : 'errorLightBg'
  const statusColor = refundStatus === 'completed' || bookingStatus === 'upcoming' ? 'successColor!' : bookingStatus === 'completed' || bookingStatus === 'pending_payment' ? 'warningColor!' : bookingStatus === 'ongoing' ? 'primaryColor' : 'errorColor!'
  const statusBorder = refundStatus === 'completed' || bookingStatus === 'upcoming' ? 'successLightBorderColor!' : bookingStatus === 'completed' || bookingStatus === 'pending_payment' ? 'warningLightBorderColor!' : bookingStatus === 'ongoing' ? 'primaryLightBorderColor!' : 'errorLightBorderColor!'

  const statusIconBg = bookingStatus === 'upcoming' || refundStatus === 'completed' ? 'successBg' : bookingStatus === 'completed' || bookingStatus === 'pending_payment' ? 'warningBg' : bookingStatus === 'ongoing' ? 'primaryBg' : 'errorBg'
  const isCheckIcon = bookingStatus === 'upcoming' || bookingStatus === 'completed' || refundStatus === 'completed'
  const isClockIcon = bookingStatus === 'ongoing' || bookingStatus === 'pending_payment'
  const showTotalAmount = bookingStatus === 'upcoming' || bookingStatus === 'completed' || bookingStatus === 'ongoing' || bookingStatus === 'pending_payment' || (bookingStatus === 'cancelled' && detailsData?.refund === null)
  // const showTotalAmountMobile = bookingStatus === 'upcoming' || bookingStatus === 'completed' || bookingStatus === 'ongoing' || bookingStatus === 'pending_payment'
  const formatRefundMethod = (method: string) => method.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const { handleDownloadInvoice, invoiceLoading } = useDownloadInvoice();

  useEffect(() => {
    if (refetchTrigger) {
      refetch()
      setRefetchTrigger(false)
    }
  }, [refetchTrigger]);

  return (
    <Layout>
      <MobileBreadcrum title={t('bookingDetails')} />
      {
        isLoading ?
          <BookingDetailsPageSkeleton />
          :
          isError ?
            <NoDataFound />
            :
            <div className="container py-6 md:commonPY space-y-4 lg:space-y-6">

              <div className="flex items-center justify-between lg:hidden">
                <div>
                  <Typography variant="caption" className="primaryColor!">{t('bookingId')}</Typography>
                  <Typography variant="h5" weight="semibold" className="textPrimaryColor!">#{detailsData?.booking_number}</Typography>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${statusBorder} ${statusBg}`}>
                  {isCheckIcon
                    ? <PiCheckCircleFill className={`${statusColor} text-sm"`} />
                    : isClockIcon
                      ? <PiClockFill className={`${statusColor} text-sm"`} />
                      : <PiXCircleFill className="errorColor text-sm" />}
                  <Typography variant="caption" weight="semibold" className={`${isMobile ? '' : statusColor}`}>{statusTitle}</Typography>
                </div>
              </div>
              {/* Desktop: full status banner */}
              <div className={`hidden lg:flex items-center justify-between ${statusBg} w-full p-3 lg:p-6 gap-4 rounded-2xl border ${statusBorder}`}>
                <div className='flex items-center gap-4'>
                  <span className={`w-12 h-12 lg:h-18 lg:w-18 flexCenter ${statusIconBg} text-white rounded-2xl`}>
                    {isCheckIcon
                      ? <PiCheckCircleFill className="lg:text-4xl text-2xl" />
                      : isClockIcon
                        ? <PiClockFill className="lg:text-4xl text-2xl" />
                        : <PiXCircleFill className="lg:text-4xl text-2xl" />}
                  </span>
                  <div className="flex flex-col gap-1">
                    <Typography variant="h3" weight="semibold" className={`${statusColor}`}>{statusTitle}</Typography>
                    {
                      (bookingStatus == 'cancelled' && detailsData?.refund) || bookingStatus === 'upcoming' ?
                        <Typography variant='h6' weight='regular' className='textSecondaryColor!'>{statusDesc}</Typography>
                        :
                        bookingStatus === "cancelled" && detailsData?.cancellation_reason ?
                          <Typography variant='h6' weight='regular' className='textSecondaryColor!'>{detailsData?.cancellation_reason}</Typography>
                          :
                          null
                    }
                  </div>
                </div>
                {
                  detailsData?.refund?.status === 'failed' &&
                  <BankDetailsModal bookingNumber={detailsData?.booking_number!} />
                }
              </div>


              <div className="grid grid-cols-12 gap-4 lg:gap-6 items-start pb-10 md:pb-0">

                {/* Left column */}
                <div className="col-span-12 lg:col-span-8 space-y-4 overflow-hidden">
                  <div className="lg:bg-white rounded-2xl p-0 lg:p-6 space-y-4 lg:border">

                    {/* Desktop header */}
                    <div className="hidden lg:flex items-center justify-between">
                      <Typography variant="h4" weight="semibold" className="textPrimaryColor!">{t('bookingDetails')}</Typography>
                      <div className="flexCenter gap-1">
                        <Typography variant="desc2" className="primaryColor!" weight='medium'>{t('bookingId')} :</Typography>
                        <Typography variant="h5" weight="semibold" className="textPrimaryColor!">#{detailsData?.booking_number}</Typography>
                      </div>
                    </div>

                    <Divider width='bleed' />

                    {/* Property card */}
                    <PropertyCard propertyDetails={detailsData?.property} bookingDetailsPage={true} hotelPlaceId={detailsData?.property?.place_id!} />

                    <Divider width='bleed' />

                    {/* Mobile booking detail layout */}
                    <div className="lg:hidden space-y-4 border rounded-2xl p-3">

                      {/* Booked On */}
                      {(detailsData as any)?.created_at && (
                        <div className='flex items-center gap-2'>
                          <Typography variant="caption" className="textSecondaryColor!">{t('bookedOn')}</Typography>
                          <Typography variant="desc2" weight="medium" className="textPrimaryColor!">{formatLocalDate((detailsData as any)?.created_at)}, {formatLocalTime((detailsData as any)?.created_at)}</Typography>
                        </div>
                      )}
                      {detailsData?.cancelled_at && (
                        <div className='flex items-center gap-2'>
                          <Typography variant="caption" className="textSecondaryColor!">{t('cancelledOn')}</Typography>
                          <Typography variant="desc2" weight="medium" className="textPrimaryColor!">{formatLocalDate((detailsData as any)?.cancelled_at)}, {formatLocalTime((detailsData as any)?.cancelled_at)}</Typography>
                        </div>
                      )}

                      {/* Room type */}
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                        <PiBed className="text-xl textSecondaryColor!" />
                        <Typography variant="desc2" weight="medium" className="textPrimaryColor!">
                          {detailsData?.booked_rooms} {detailsData?.room_type_name}
                        </Typography>
                      </div>

                      <Divider />

                      {/* Check-in / nights badge / Check-out */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                          <Typography variant="caption" className="textSecondaryColor!">{t('checkIn')}</Typography>
                          <Typography variant="desc2" weight="medium" className="textPrimaryColor!">{formateDatePretty(detailsData?.check_in)}</Typography>
                        </div>
                        <div className="flex-1 flex justify-center">
                          <span className="primaryLightBg primaryColor! text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap">
                            {detailsData?.total_nights} {t('night')} / {(detailsData?.total_nights ?? 0) + 1} Day
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <Typography variant="caption" className="textSecondaryColor!">{t('checkOut')}</Typography>
                          <Typography variant="desc2" weight="medium" className="textPrimaryColor!">{formateDatePretty(detailsData?.check_out)}</Typography>
                        </div>
                      </div>

                      <Divider />

                      {/* Guest info list */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <PiUserCircle className="text-xl textSecondaryColor! shrink-0" />
                          <Typography variant="desc2" className="textPrimaryColor!">{detailsData?.guest_name}</Typography>
                        </div>
                        <div className="flex items-center gap-3">
                          <PiPhone className="text-xl textSecondaryColor! shrink-0" />
                          <Typography variant="desc2" className="textPrimaryColor!">{detailsData?.guest_dial_code ? (detailsData.guest_dial_code.includes('+') ? detailsData.guest_dial_code : '+' + detailsData.guest_dial_code) + ' ' + detailsData?.guest_phone : detailsData?.guest_phone}</Typography>
                        </div>
                        <div className="flex items-center gap-3">
                          <PiEnvelope className="text-xl textSecondaryColor! shrink-0" />
                          <Typography variant="desc2" className="textPrimaryColor!">{detailsData?.guest_email}</Typography>
                        </div>
                      </div>

                      <Divider />

                      {/* Adults | Children | Pets */}
                      <div className="flex items-center gap-5 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <PiUsers className="text-lg textSecondaryColor!" />
                          <Typography variant="desc2" className="textPrimaryColor!">{detailsData?.adults} {t('Adults')}</Typography>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PiBabyCarriage className="text-lg textSecondaryColor!" />
                          <Typography variant="desc2" className="textPrimaryColor!">{detailsData?.children} {t('Children')}</Typography>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PiPawPrint className="text-lg textSecondaryColor!" />
                          <Typography variant="desc2" className="textPrimaryColor!">{detailsData?.has_pets ? t('yes') : t('no')}</Typography>
                        </div>
                      </div>
                    </div>

                    {/* Desktop info grid */}
                    <div className="hidden lg:block bg-white rounded-2xl overflow-hidden">
                      <div className="grid grid-cols-3 borderColor commonGap">
                        <InfoCell icon={<PiUserCircle />} label={t('guestDetails')} value={detailsData?.guest_name} />
                        {
                          detailsData?.guest_email &&
                          <InfoCell icon={<PiEnvelope />} label={t('email')} value={detailsData?.guest_email} />
                        }
                        {
                          detailsData?.guest_phone &&
                          <InfoCell icon={<PiPhone />} label={t('phoneNumber')} value={detailsData?.guest_dial_code ? (detailsData.guest_dial_code.includes('+') ? detailsData.guest_dial_code : '+' + detailsData.guest_dial_code) + ' ' + detailsData?.guest_phone : detailsData?.guest_phone} />
                        }
                        <InfoCell icon={<PiCalendarDots />} label={t('bookedOn')} value={formatLocalDate(detailsData?.created_at)} />
                        <InfoCell icon={<PiClock />} label={t('bookedTime')} value={formatLocalTime(detailsData?.created_at)} />
                        {detailsData?.cancelled_at && <InfoCell icon={<PiCalendarDots />} label={t('canceledOn')} value={formatLocalDate(detailsData?.cancelled_at)} />}
                        {detailsData?.cancelled_at && <InfoCell icon={<PiClock />} label={t('canceledTime')} value={formatLocalTime(detailsData?.cancelled_at)} />}
                        <InfoCell icon={<PiCalendarDots />} label={t('checkIn')} value={formateDatePretty(detailsData?.check_in)} />
                        <InfoCell icon={<PiCalendarDots />} label={t('checkOut')} value={formateDatePretty(detailsData?.check_out)} />
                        <InfoCell icon={<PiUsers />} label={t('guestsAndRooms')} value={`${detailsData?.adults} ${t('adults')}`} />
                        <InfoCell icon={<PiBed />} label={t('roomType')} value={detailsData?.room_type_name} />
                        <InfoCell icon={<PiBed />} label={'Your Reservation'} value={`${detailsData?.booked_rooms} ${t('rooms')} (${detailsData?.total_nights} ${t('night')} / ${detailsData?.total_nights! + 1} Days)`} />
                        <InfoCell icon={<PiBabyCarriage />} label={t('children')} value={`${detailsData?.children} ${t('children')}`} />
                        <InfoCell icon={<PiPawPrint />} label={t('pets')} value={detailsData?.has_pets ? t('yes') : t('no')} />
                      </div>
                    </div>

                    {bookingStatus === 'upcoming' && <Divider width='bleed' />}

                    {/* Check-in & Check-out policy */}
                    {bookingStatus === 'upcoming' && (
                      <div className="lg:bg-white rounded-2xl space-y-3">
                        <Typography variant="h6" weight="semibold" className="textPrimaryColor!">{t('checkInChekout')}</Typography>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="mt-2.5 w-1 h-1 rounded-full bg-black shrink-0" />
                            <Typography variant="desc2" className="textPrimaryColor!">{t('checkIn')}: {t('from')} {formatTime(detailsData?.property?.check_in_time)}</Typography>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-2.5 w-1 h-1 rounded-full bg-black shrink-0" />
                            <Typography variant="desc2" className="textPrimaryColor!">{t('checkOut')}: {t('until')} {formatTime(detailsData?.property?.check_out_time)}</Typography>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-2.5 w-1 h-1 rounded-full bg-black shrink-0" />
                            <Typography variant="desc2" className="textPrimaryColor!">{t('earlyCheckInCheckOutPolicy')}</Typography>
                          </li>
                        </ul>
                      </div>
                    )}

                    {/* Desktop action buttons */}
                    {

                      detailsData?.refund?.status !== 'failed' &&
                      <Divider width='bleed' className="hidden lg:block" />
                    }
                    <div className="hidden lg:flex items-center justify-end gap-3">
                      {bookingStatus === 'upcoming' && detailsData?.is_cancellable && (
                        <>
                          <Button variant="text" className='primaryColor!' leftIcon={<PiX className="text-2xl" />} onClick={() => setCancelBookingModal(true)}>
                            {t('cancelBooking')}
                          </Button>
                          <CancelBookingConfimationModal open={cancelBookingModal} onOpenChange={setCancelBookingModal} bookingNumber={bookingId} setRefetchTrigger={setRefetchTrigger} />
                        </>
                      )}
                      {
                        detailsData?.refund?.status !== 'failed' &&
                        <Button variant="secondary" leftIcon={<PiReceipt className="text-2xl" />} onClick={() => handleDownloadInvoice(bookingId)} loading={invoiceLoading} disabled={invoiceLoading}>
                          {t('downloadInvoice')}
                        </Button>
                      }
                    </div>
                  </div>
                </div>

                {/* Right column — Price Summary */}
                <div className="col-span-12 lg:col-span-4 overflow-hidden">
                  <div className="lg:bg-white lg:rounded-2xl border-t pt-4 lg:border p-0 lg:p-6 flex flex-col gap-4">
                    <Typography variant="h5" weight="semibold" className="textPrimaryColor!">{t('pricingSummary')}</Typography>

                    <Divider width='bleed' className='h-[1.5px]! hidden lg:block' />

                    <div className='bg-[#EDEDED] rounded-xl lg:bg-transparent flex flex-col gap-4 p-4 lg:p-0'>
                      {/* Subtotal */}
                      <div className="flex items-center justify-between">
                        <Typography variant="h6" className="textPrimaryColor!" weight='medium'>{t('subtotal')}</Typography>
                        <Typography variant="h5" weight="semibold" className="textPrimaryColor!">{detailsData?.pricing?.currency_symbol}{formatPriceHelper(detailsData?.pricing?.subtotal!)}</Typography>
                      </div>

                      <Divider className='bg-gray-300! lg:bodyBg' />

                      {/* Tax & Fees */}
                      <div className="flex items-center justify-between">
                        <Typography variant="desc2" className="textPrimaryColor!">{t('taxAndFees')}</Typography>
                        <Typography variant="desc2" className="textPrimaryColor!">{detailsData?.pricing?.currency_symbol}{formatPriceHelper(detailsData?.pricing?.tax_amount!)}</Typography>
                      </div>

                      {/* Payment Mode */}
                      <div className="flex items-center justify-between">
                        <Typography variant="desc2" className="textPrimaryColor!">{t('paymentMode')}</Typography>
                        <Typography variant="desc2" className="textPrimaryColor!">
                          {detailsData?.payment_method === 'pay_at_property' ? t('payAtProperty') : detailsData?.payment_method === 'pay_online' ? t('onlinePayment') : detailsData?.payment_method}
                        </Typography>
                      </div>

                      {/* Coupon Discount */}
                      {detailsData?.pricing?.discount_amount! > 0 && (
                        <div className="flex items-center justify-between">
                          <Typography variant="desc2" className="textPrimaryColor!">{t('couponDiscount')}</Typography>
                          <Typography variant="desc2" weight="semibold" className="errorColor!">- {detailsData?.pricing?.currency_symbol}{formatPriceHelper(detailsData?.pricing?.discount_amount!)}</Typography>
                        </div>
                      )}

                      {/* Transaction ID */}
                      {detailsData?.refund?.transaction_id && (
                        <div className="flex items-center justify-between">
                          <Typography variant="desc2" className="textPrimaryColor!">{t('transactionId')}</Typography>
                          <Typography variant="desc2" className="textPrimaryColor!">{detailsData.refund.transaction_id}</Typography>
                        </div>
                      )}

                      {/* Refund Method */}
                      {detailsData?.refund?.refund_method && refundStatus === 'completed' && (
                        <div className="flex items-center justify-between">
                          <Typography variant="desc2" className="textPrimaryColor!">{t('refundMethod')}</Typography>
                          <Typography variant="desc2" className="textPrimaryColor!">{formatRefundMethod(detailsData.refund.refund_method)}</Typography>
                        </div>
                      )}

                      {/* Refund Status — only when failed */}
                      {refundStatus === 'failed' && (
                        <div className="flex items-center justify-between">
                          <Typography variant="desc2" className="textPrimaryColor!">{t('refundStatus')}</Typography>
                          <Typography variant="desc2" className="errorColor!">{t('notReceived')}</Typography>
                        </div>
                      )}

                      <Divider className='bg-gray-300! lg:bodyBg' />

                      {/* Total / Refund Amount — desktop */}
                      <div className={`${showTotalAmount ? 'successBg' : 'errorBg'} rounded-xl p-3 hidden lg:flex items-center justify-between`}>
                        <Typography variant="h5" className="text-white!">{showTotalAmount ? t('totalAmount') : t('refundAmount')}</Typography>
                        <Typography variant="h5" className="text-white!">{detailsData?.pricing?.currency_symbol}{showTotalAmount ? formatPriceHelper(detailsData?.pricing?.total_amount!) : formatPriceHelper(detailsData?.refund?.amount!)}</Typography>
                      </div>

                      {
                        ((detailsData?.pricing && detailsData?.pricing?.remaining_amount > 0) || (detailsData?.pricing && detailsData?.pricing?.amount_paid > 0)) &&
                        <div className='space-y-4'>
                          {
                            (detailsData?.pricing?.remaining_amount > 0 && detailsData?.property?.advance_percentage > 0 || detailsData?.pricing && detailsData?.pricing?.amount_paid > 0) ?
                              <div className="flex items-center justify-between w-full">
                                {
                                  detailsData?.pricing?.remaining_amount > 0 ?
                                    <Typography variant="h6" weight="medium" className="textPrimaryColor!">
                                      {t('advancePaid')} {detailsData?.property?.advance_percentage > 0 ? (`(${detailsData?.property?.advance_percentage}%)`) : null}
                                    </Typography>
                                    :
                                    <Typography variant="h6" weight="medium" className="textPrimaryColor!">
                                      {t('amountPaid')}
                                    </Typography>
                                }
                                <Typography variant="h6" weight="medium" className="textPrimaryColor!">
                                  {detailsData?.pricing?.currency_symbol}{formatPriceHelper(detailsData?.pricing?.amount_paid!)}
                                </Typography>
                              </div>
                              :
                              null
                          }
                          {
                            detailsData?.pricing && detailsData?.pricing?.remaining_amount > 0 ?
                              <div className="flex items-center justify-between w-full">
                                <Typography variant="h5" weight="semibold" className="textPrimaryColor!">
                                  {t('remainingAmount')}
                                </Typography>
                                <Typography variant="h5" weight="semibold" className="textPrimaryColor!">
                                  {detailsData?.pricing?.currency_symbol}{formatPriceHelper(detailsData?.pricing?.remaining_amount!)}
                                </Typography>
                              </div>
                              :
                              null
                          }
                        </div>
                      }

                      {/* Total / Refund Amount — mobile */}
                      <div className={`flex items-center justify-between w-full lg:hidden m-0 p-3 rounded-lg border ${showTotalAmount ? 'successLightBg successLightBorderColor' : 'errorLightBg errorLightBorderColor'}`}>
                        <Typography variant="h5" weight="semibold" className="textPrimaryColor!">
                          {showTotalAmount ? t('totalAmount') : t('refundAmount')}
                        </Typography>
                        <Typography variant="h5" weight="semibold" className="textPrimaryColor!">
                          {detailsData?.pricing?.currency_symbol}{showTotalAmount ? formatPriceHelper(detailsData?.pricing?.total_amount!) : formatPriceHelper(detailsData?.refund?.amount!)}
                        </Typography>
                      </div>


                    </div>

                    {/* Free cancellation note */}
                    {bookingStatus === 'upcoming' && (
                      <CancellationComp
                        cancellationPolicy={detailsData?.cancellation_policy}
                        variant="row"
                      />
                    )}
                    {
                      ((detailsData?.pricing?.remaining_amount! > 0) || detailsData?.cancellation_reason || refundStatus === 'failed') &&
                      <div className='warningLightBg w-full flex gap-2 p-4 rounded-lg mt-2'>
                        <span>
                          <PiInfo className='text-2xl warningColor' />
                        </span>
                        <div className='flex flex-col '>
                          {
                            detailsData?.cancellation_reason &&
                            <Typography variant="caption" weight="semibold" className="textPrimaryColor!">
                              {t('cancellationReason')}
                            </Typography>
                          }
                          <Typography variant="caption" weight="regular" className="textPrimaryColor!">
                            {refundStatus === 'failed' ? t('refundFailDesc') : detailsData?.cancellation_reason ? detailsData?.cancellation_reason : detailsData?.payment_status === 'unpaid' ? t('paymentUnpaidMsg') : t('payRemainingAmtAtProperty')}
                          </Typography>
                        </div>
                      </div>
                    }
                  </div>
                </div>

              </div>

              {/* Mobile bottom buttons */}
              <div className="lg:hidden flex items-center gap-3 pb-2 fixed inset-x-0 z-10 bottom-0 p-4 w-full bg-white">
                {
                  detailsData?.refund?.status === 'failed' ?
                    <BankDetailsModal bookingNumber={detailsData?.booking_number!} />
                    :
                    <Button
                      variant="primary"
                      className="flex-1 truncate"
                      onClick={() => handleDownloadInvoice(bookingId)}
                      loading={invoiceLoading}
                      disabled={invoiceLoading} size='md'
                    >
                      {t('downloadInvoice')}
                    </Button>
                }
                {detailsData?.is_cancellable && (
                  <Button variant="outline" className="flex-1 border-(--error-color)! errorColor! truncate" size='md' leftIcon={<PiX className="text-xl hidden md:block" />} onClick={() => setCancelBookingModal(true)}>
                    {t('cancelBooking')}
                  </Button>
                )}
              </div>

            </div>
      }
    </Layout >
  )
}

export default BookingDetailsPage
