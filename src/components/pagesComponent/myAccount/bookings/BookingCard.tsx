'use client'

import React from 'react'
import Link from 'next/link'
import {
  PiArrowRight,
  PiCheck,
  PiCheckCircleFill,
  PiClock,
  PiClockCounterClockwise,
  PiClockFill,
  PiXCircle,
} from 'react-icons/pi'
import { Button } from '@/components/storyBook/atoms/Button'
import { Typography } from '@/components/storyBook/atoms/Typography'
import ImagePreview from '@/components/storyBook/atoms/ImagePreview'
import RoomDetailsSingleHotel from '@/components/storyBook/atoms/RoomDetailsSingleHotel'
import { useTranslation } from '@/hooks/useTranslation'
import { formateDatePretty, formatTime } from '@/utils/helpers'
import { BookingListItem } from '@/hooks/queries/bookings/useBookingsList'
import { useSelector } from 'react-redux'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice'
import Divider from '@/components/storyBook/atoms/Divider'
import CancelBookingConfimationModal from '@/components/modalsAndSheets/CancelBookingConfimationModal'
import AddEditReviewModal from './AddEditReviewModal'
import { useIsMobile } from '@/hooks/useMobile'

interface BookingCardProps {
  booking: BookingListItem
  setRefetchTrigger: (value: boolean) => void
  propertySlug: string | undefined
}


const BookingCard = ({ booking, setRefetchTrigger, propertySlug }: BookingCardProps) => {

  const { t } = useTranslation()
  const langCode = useSelector(currentLangCodeSelector)
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);

  const isMobile = useIsMobile();

  const getTotalNights = (checkIn: string, checkOut: string) =>
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)

  const getDayOfStay = (checkIn: string) =>
    Math.floor((Date.now() - new Date(checkIn).getTime()) / 86400000) + 1

  type StatusKey = 'ongoing' | 'upcoming' | 'completed' | 'cancelled' | 'pending_payment'

  const STATUS_CONFIG: Record<
    StatusKey,
    { bgClass: string; iconClass: string; badgeBg: string; icon: React.ReactNode; labelKey: string }
  > = {
    ongoing: {
      bgClass: 'primaryLightBg',
      iconClass: 'primaryColor!',
      badgeBg: 'primaryLightBg',
      icon: <PiClockFill className="text-xl" />,
      labelKey: 'stayInProgress',
    },
    upcoming: {
      bgClass: 'successLightBg',
      iconClass: 'successColor!',
      badgeBg: 'successLightBg',
      icon: <PiCheckCircleFill className="text-xl" />,
      labelKey: 'bookingConf',
    },
    completed: {
      bgClass: 'warningLightBg',
      iconClass: 'warningColor!',
      badgeBg: 'warningLightBg',
      icon: <PiClockFill className="text-xl" />,
      labelKey: 'stayCompleted',
    },
    cancelled: {
      bgClass: 'errorLightBg',
      iconClass: 'errorColor!',
      badgeBg: 'errorLightBg',
      icon: <PiXCircle className="text-xl" />,
      labelKey: isMobile ? 'cancelledBooking' : 'cancelledOn',
    },
    pending_payment: {
      bgClass: 'warningLightBg',
      iconClass: 'warningColor!',
      badgeBg: 'warningLightBg',
      icon: <PiClock className="text-xl" />,
      labelKey: 'pendingPayment',
    },
  }

  const {
    booking_number,
    status,
    property,
    check_in,
    check_out,
    check_in_time,
    check_out_time,
    cancelled_at,
    is_cancellable,
    refund,
    review,
    currency_symbol,
    cancellation,
  } = booking

  const statusKey = (status as StatusKey) in STATUS_CONFIG ? (status as StatusKey) : 'upcoming'
  const config = STATUS_CONFIG[statusKey]
  const totalNights = getTotalNights(check_in, check_out)
  const totalDays = totalNights + 1
  const dayOfStay = status === 'ongoing' ? getDayOfStay(check_in) : null
  const detailsHref = `/${langCode}/my-bookings/${booking_number}`

  const statusLabel =
    status === 'cancelled'
      ? `${t(config.labelKey)} ${cancelled_at && !isMobile ? formateDatePretty(cancelled_at) : ''}`
      : t(config.labelKey)

  const dateInfo =
    status === 'ongoing' && dayOfStay
      ? `Day ${dayOfStay} of ${totalNights} ${t('nights')}`
      : `${formateDatePretty(check_in)} – ${formateDatePretty(check_out)} · ${totalNights} ${t('night')} / ${totalDays} ${t('days')}`

  return (
    <div className="bg-white rounded-2xl border overflow-hidden p-4 space-y-4">

      {/* ── Mobile header: Booking ID + status badge ── */}
      <Link href={detailsHref}>
        <div className="flex items-center justify-between gap-2 md:hidden">
          <div>
            <Typography variant="caption" className="primaryColor! font-medium block">{t('bookingId')}</Typography>
            <Typography variant="desc2" weight="semibold" className="textPrimaryColor!">#{booking_number}</Typography>
          </div>
          <div className={`${config.badgeBg} flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0`}>
            <span className={config.iconClass}>{config.icon}</span>
            <Typography variant="caption" weight="semibold" className={`${config.iconClass}!`}>
              {statusLabel}
            </Typography>
          </div>
        </div>
      </Link>

      <Divider className='mt-4 md:hidden' />

      {/* ── Property row ── */}
      <Link href={detailsHref}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Image: smaller on mobile */}
            <div className="shrink-0 w-24 h-20 md:w-30 md:h-25 relative rounded-xl overflow-hidden">
              <ImagePreview
                src={property.image}
                alt={property.name}
                objectFit="cover"
                rounded="xl"
              />
            </div>
            <div className=''>
              <RoomDetailsSingleHotel
                name={property.name}
                location={property.address}
                rating={property.rating}
                reviews={property.review_count}
                roomsCard={false}
                bookingCard={true}
              />
            </div>
          </div>
          {/* Booking ID — desktop only */}
          <div className="text-right shrink-0 hidden md:block">
            <Typography variant="caption" className="primaryColor! font-medium">{t('bookingId')}</Typography>
            <Typography variant="desc2" weight="semibold" className="textPrimaryColor!">#{booking_number}</Typography>
          </div>
        </div>
      </Link>

      <Divider className='mt-4' />

      {/* ── Status bar ── */}
      <Link href={detailsHref}>
        <div className={`${config.bgClass} hidden md:flex items-center justify-between p-4 rounded-2xl gap-2 between-768-991:flex-col between-768-991:items-start`}>
          {/* Desktop: icon + label */}
          <div className={`hidden md:flex items-center gap-2 ${config.iconClass}`}>
            {config.icon}
            <Typography variant="caption" weight="medium" className={`textPrimaryColor! ${config.iconClass}!`}>
              {statusLabel}
            </Typography>
          </div>
          {/* Mobile: just date info fills full width */}
          <Typography variant="caption" weight='bold' className="textPrimaryColor! md:ltr:ml-auto md:text-right w-full md:w-auto between-768-991:ml-0 between-768-991:text-left">
            {dateInfo}
          </Typography>
        </div>
      </Link>

    

      <Divider className='hidden md:block md:mt-4' />

      {/* ── Actions ── */}
      {
        <div className="hidden md:flex items-start justify-between gap-3 py-2 flex-wrap">
            {/* ── upcoming extras ── */}
      {status === 'upcoming' && (
        <Link href={detailsHref}>
          <div className="pt-3 space-y-4">
            {/* Desktop: inline format */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex gap-1.5">
                <span className="mt-2.5 w-1 h-1 rounded-full bg-black shrink-0" />
                <Typography variant="caption" className="textPrimaryColor!">
                  {t('checkIn')}: {t('from')} {formatTime(check_in_time)}
                </Typography>
              </div>
              <div className="flex gap-1.5">
                <span className="mt-2.5 w-1 h-1 rounded-full bg-black shrink-0" />
                <Typography variant="caption" className="textPrimaryColor!">
                  {t('checkOut')}: {t('until')} {formatTime(check_out_time)}
                </Typography>
              </div>
            </div>
            {/* Mobile: two-column stacked format */}
            <div className="grid grid-cols-2 gap-4 md:hidden">
              <div className='flex flex-col border-r'>
                <Typography variant="caption" className="textSecondaryColor!">
                  {t('checkIn')} {t('from')}
                </Typography>
                <Typography variant="caption" weight="medium" className="textPrimaryColor! mt-0.5">
                  {formatTime(check_in_time)},{formateDatePretty(check_in)}
                </Typography>
              </div>
              <div className='flex flex-col justify-end items-end'>
                <Typography variant="caption" className="textSecondaryColor!">
                  {t('checkOut')} {t('from')}
                </Typography>
                <Typography variant="caption" weight="medium" className="textPrimaryColor! mt-0.5">
                  {formatTime(check_out_time)},{formateDatePretty(check_out)}
                </Typography>
              </div>
            </div>
            {is_cancellable && (
              <div className="flex items-center gap-1.5 bodyBg p-2 rounded-lg textPrimaryColor! border md:w-max">
                <PiCheck className="text-xl" />
                <Typography variant="caption" className="textPrimaryColor!">
                  {t('freeCancelationUntill')} {formateDatePretty(cancellation?.cancellation_deadline)} ({cancellation?.refund_percentage}% {t('refund')})
                </Typography>
              </div>
            )}
          </div>
        </Link>
      )}
          {/* ── Cancelled refund note ── */}
          {status === 'cancelled' && refund && (
            <div className="">
              <Typography variant="caption" className="textPrimaryColor!">
                · {currency_symbol}{(refund as any)?.amount} {t('refundProcessingDesc')}
              </Typography>
            </div>
          )}

          {/* Left actions */}
          <div className="flex items-center gap-3 flex-wrap">
            {status === 'completed' && (
              <AddEditReviewModal
                booking={booking}
                nights={totalNights}
                triggerLabel={t("writeReview")}
                existingReview={booking?.review}
                setRefetchTrigger={setRefetchTrigger}
              />
            )}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4 ltr:ml-auto flex-wrap">
            {status === 'upcoming' && is_cancellable && (
              <Button variant="text" className="primaryColor! p-0" size='md' onClick={() => setCancelModalOpen(true)}>
                {t('cancelBooking')}
              </Button>
            )}
            {status === 'completed' && (
              <Link href={`/${langCode}/properties/${propertySlug}`}>
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<PiClockCounterClockwise className="text-xl" />}
                >
                  {t('bookAgain')}
                </Button>
              </Link>
            )}

            <Link href={detailsHref}>
              <Button
                variant="primary"
                size="md"
                rightIcon={<PiArrowRight className="text-xl rtl:rotate-180" />}
              >
                {t('bookingDetails')}
              </Button>
            </Link>
          </div>
        </div>
      }
      {
        (refund || status === 'completed') &&
        <div className="md:hidden items-start justify-between gap-3 py-3 flex-wrap">
          {/* ── Cancelled refund note ── */}
          {status === 'cancelled' && refund && (
            <div className="">
              <Typography variant="caption" className="textPrimaryColor!">
                · {currency_symbol}{(refund as any)?.amount} {t('refundProcessingDesc')}
              </Typography>
            </div>
          )}

          {/* Left actions */}
          <div className="flex items-center gap-3 flex-wrap">
            {status === 'completed' && (
              <AddEditReviewModal
                booking={booking}
                nights={totalNights}
                triggerLabel={t("writeReview")}
                existingReview={booking?.review}
                setRefetchTrigger={setRefetchTrigger}
              />
            )}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4 ml-auto flex-wrap">
            {status === 'upcoming' && is_cancellable && (
              <Button variant="text" className="primaryColor! p-0" size='md' onClick={() => setCancelModalOpen(true)}>
                {t('cancelBooking')}
              </Button>
            )}
            {status === 'completed' && (
              <Link href={`/${langCode}/properties/${propertySlug}`}>
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<PiClockCounterClockwise className="text-xl" />}
                >
                  {t('bookAgain')}
                </Button>
              </Link>
            )}

            <Link href={detailsHref}>
              <Button
                variant="primary"
                size="md"
                rightIcon={<PiArrowRight className="text-xl rtl:rotate-180" />}
              >
                {t('bookingDetails')}
              </Button>
            </Link>
          </div>
        </div>
      }

      <CancelBookingConfimationModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        bookingNumber={booking_number}
        setRefetchTrigger={setRefetchTrigger}
      />
    </div>
  )
}

export default BookingCard
