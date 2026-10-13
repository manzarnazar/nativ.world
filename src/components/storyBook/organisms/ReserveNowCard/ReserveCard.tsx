'use client'
import { useEffect, useRef, useState } from "react"
import { addMonths, subMonths } from "date-fns"
import ImagePreview from "../../atoms/ImagePreview"
import RoomDetailsSingleHotel from "../../atoms/RoomDetailsSingleHotel"
import Divider from "../../atoms/Divider"
import Input from "../../atoms/Input/Input"
import { PiUsers, PiCaretDown, PiCalendarDots, PiTag, PiCheckCircleFill, PiArrowRight, PiTimer, PiCaretLeft, PiCaretRight, PiInfo, PiDoorOpen, PiLockKey, PiPencilSimple } from "react-icons/pi"
import { GuestSelector } from "../../../commonComponents/GuestSelector"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "../../atoms/Button"
import BookingSummary from "../../atoms/BookingSummary"
import { Typography } from "../../atoms/Typography"
import { useIsMobile } from "@/hooks/useMobile"
import { useBookingDetails } from "@/contexts/BookingDetails"
import { useBookingQuote } from "@/hooks/queries/useBookingQuote"
import { useDispatch, useSelector } from "react-redux"
import { bookingSummarySelector, couponCodeSelector, reserveNowClickedSelector, selectedRoomSelector, setBookingLockId, setBookingSummary, setCouponCode, setIsRedirectToPaymentGateway, setLoginModalState, setPayAtProperty, setReserveNowClicked } from "@/redux/reducers/helpersReducer"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from '@/lib/toast';
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { usePathname, useRouter } from "next/navigation"
import { formateDate, formateDateForApi, formateDatePretty, parseCustomDate } from "@/utils/helpers"
import RoomFeatures from "../../atoms/roomFeatures"
import PropertyCard from "@/components/pagesComponent/confirmBooking/PropertyCard"
import { useLockBooking } from "@/hooks/queries/useLockBooking"
import CouponAndReferalCode from "@/components/modalsAndSheets/CouponAndReferalCodeModal"
import CancellationComp from "@/components/storyBook/organisms/CancellationComp"
import { isLoginSelector } from "@/redux/reducers/userSlice"
import { currentCurrencySelector } from "@/redux/reducers/currencySlice"
import { bookingDetailsSelector } from "@/redux/reducers/bookingDetailsSlice"

const ReserveCard = ({ isPayAtProperty = false, petsAllowed = false, propertySlug, isActive = true }: { isPayAtProperty?: boolean, petsAllowed?: boolean, propertySlug?: string, isActive?: boolean }) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const pathName = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const isConfirmBookingPage = pathName?.includes('/confirm-booking');

    const selectedRoom = useSelector(selectedRoomSelector);
    const roomDetails = selectedRoom?.room;
    const couponCode = useSelector(couponCodeSelector);
    const isReserveNowClicked = useSelector(reserveNowClickedSelector);
    const isLogin = useSelector(isLoginSelector);
    const bookingDetails = useSelector(bookingDetailsSelector);

    const currentCurrency = useSelector(currentCurrencySelector);

    const [calendarOpen, setCalendarOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [step, setStep] = useState<'checkIn' | 'checkOut'>('checkIn')

    const { bookingData, setBookingData } = useBookingDetails();

    const [localCouponCode, setLocalCouponCode] = useState(couponCode || '');
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [removeAutoPromoCode, setRemoveAutoPromoCode] = useState(false)


    // Clear coupon when room changes (not on initial mount — this instance may be
    // remounting with a room that was already selected, e.g. the mobile reserve sheet
    // reopening, and clearing the coupon there would re-trigger an unnecessary quote call)
    const prevRoomId = useRef(roomDetails?.id);
    useEffect(() => {
        if (isConfirmBookingPage) return;
        if (roomDetails?.id && prevRoomId.current !== undefined && prevRoomId.current !== roomDetails.id) {
            dispatch(setCouponCode(''))
            setLocalCouponCode('')
            setRemoveAutoPromoCode(false)
        }
        prevRoomId.current = roomDetails?.id;
    }, [roomDetails?.id])

    // update booking details in context when reserve now is clicked from guest selector in reserve card
    useEffect(() => {
        if (isReserveNowClicked) {
            setBookingData(prev => ({ ...prev, bookingDetails }))
            dispatch(setReserveNowClicked(false))
        }
    }, [isReserveNowClicked])

    // Reset step to checkIn whenever calendar opens
    useEffect(() => {
        if (!calendarOpen) return;
        setStep('checkIn');
        const parsed = parseCustomDate(bookingData.checkIn);
        if (parsed) setCurrentMonth(parsed);
    }, [calendarOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync calendar month when checkIn changes (calendar already open)
    useEffect(() => {
        if (!calendarOpen) return;
        const parsed = parseCustomDate(bookingData.checkIn);
        if (parsed) setCurrentMonth(parsed);
    }, [bookingData?.checkIn]);

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentMonth(prev => subMonths(prev, 1))
    }

    const handleNextMonth = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentMonth(prev => addMonths(prev, 1))
    }

    // ✅ Use parseCustomDate — it handles "d-M-yyyy" format correctly
    const checkInDate = parseCustomDate(bookingData.checkIn) ?? undefined;
    const checkOutDate = parseCustomDate(bookingData.checkout) ?? undefined;

    // react-day-picker always sorts range: { from: min, to: max }.
    // Resolve actual clicked date: if from === existingCheckIn → user clicked after (use to), else user clicked before (use from).
    const resolveClickedDate = (
        date: { from?: Date; to?: Date },
        existingCheckIn: Date | null
    ): Date | undefined => {
        if (!date.from) return undefined;
        if (!existingCheckIn) return date.from;
        const sameAsCheckIn = date.from.getTime() === existingCheckIn.getTime();
        return sameAsCheckIn ? (date.to ?? date.from) : date.from;
    };

    const handleSelect = (date: { from?: Date; to?: Date } | undefined) => {
        if (!date?.from) return;
        const existingCheckIn = parseCustomDate(bookingData.checkIn);

        if (step === 'checkIn') {
            const clicked = resolveClickedDate(date, existingCheckIn);
            if (!clicked) return;
            setBookingData({ ...bookingData, checkIn: formateDate(clicked), checkout: '' });
            setStep('checkOut');
        } else {
            const clicked = resolveClickedDate(date, existingCheckIn);
            if (!clicked) return;
            if (existingCheckIn && clicked > existingCheckIn) {
                setBookingData({ ...bookingData, checkout: formateDate(clicked) });
                setCalendarOpen(false);
                setStep('checkIn');
            } else {
                // Clicked before/on checkIn → treat as new checkIn
                setBookingData({ ...bookingData, checkIn: formateDate(clicked), checkout: '' });
            }
        }
    };

    const summaryData = useSelector(bookingSummarySelector);
    const [isError, setIsError] = useState(false);

    const {
        mutate: getQuote,
        isPending: isLoading,
    } = useBookingQuote();

    const getBookingQuote = () => {

        getQuote({
            property_room_id: roomDetails?.id,
            check_in: formateDateForApi(bookingData.checkIn),
            check_out: formateDateForApi(bookingData.checkout),
            adults: bookingData.adults,
            children: bookingData.childrenCount,
            rooms: bookingData.rooms,
            has_pets: bookingData.pets,
            coupon_code: couponCode,
            skip_auto_promo: removeAutoPromoCode
        }, {
            onSuccess: (data) => {
                if (data) {
                    const promoCode = data?.data?.promo_code?.code;
                    if (promoCode && couponCode === '') {
                        dispatch(setCouponCode(promoCode))
                    }
                    dispatch(setBookingSummary(data?.data))

                    dispatch(setPayAtProperty({
                        enabled: data?.data?.property?.pay_at_property,
                        advancePercentage: data?.data?.property?.advance_percentage,
                        totalAmount: data?.data?.pricing?.total_amount,
                    }))
                    setIsError(false)
                }
            },
            onError: (error) => {
                console.log('error in lock booking api =>', error)
                toast.error(error.message)
                setIsError(true)
            },
        })
    }

    useEffect(() => {
        if (!isActive) return;
        if ((roomDetails?.id && bookingData && !isConfirmBookingPage && isLogin && bookingData.checkIn && bookingData.checkout) || removeAutoPromoCode || isReserveNowClicked) {
            getBookingQuote();
            if (isReserveNowClicked) {
                dispatch(setReserveNowClicked(false))
            }
        }
    }, [
        isActive,
        roomDetails?.id,
        bookingData.checkIn,
        bookingData.checkout,
        bookingData.adults,
        bookingData.childrenCount,
        bookingData.rooms,
        bookingData.pets,
        couponCode,
        isConfirmBookingPage,
        removeAutoPromoCode,
        isReserveNowClicked,
        isLogin,
        currentCurrency
    ]);

    const { mutate: lockBooking, isPending: lockBookingLoading } = useLockBooking();

    const handleReserveNow = () => {
        lockBooking({
            property_room_id: roomDetails?.id,
            check_in: formateDateForApi(bookingData.checkIn),
            check_out: formateDateForApi(bookingData.checkout),
            rooms: bookingData.rooms,
        }, {
            onSuccess: (data) => {
                dispatch(setIsRedirectToPaymentGateway(false))
                if (data?.data?.lock_id) {
                    dispatch(setBookingLockId(data.data.lock_id))
                    router.replace('/confirm-booking?status=processing')
                } else {
                    toast.error(t('lockIdNotFound'))
                }
            },
            onError: (error) => {
                console.log('error in lock booking api =>', error)
                toast.error(error.message)
                dispatch(setIsRedirectToPaymentGateway(false))
            },
        })
    }

    const handleApplyCouponCode = (code: string) => {
        setRemoveAutoPromoCode(true)
        dispatch(setCouponCode(code))
        setLocalCouponCode(code)
        setShowCouponModal(false)
    }

    const handleRemoveCouponCode = () => {
        setRemoveAutoPromoCode(true)
        dispatch(setCouponCode(''))
        setLocalCouponCode('');
    }

    if (!isLogin) {
        return (
            <div className="w-full bg-white rounded-2xl p-6 border border-border flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-full primaryLightBg flexCenter">
                    <PiLockKey className="text-2xl primaryColor" />
                </div>
                <div className="space-y-1">
                    <Typography variant="h6" weight="semibold" children={t('loginToBook')} />
                    <Typography variant="desc1" className="textSecondaryColor!" children={t('loginToBookDesc')} />
                </div>
                <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    children={t('login')}
                    onClick={() => dispatch(setLoginModalState(true))}
                />
            </div>
        )
    }

    if (!roomDetails || Object.keys(roomDetails).length === 0) {
        return (
            <div className="w-full bg-white rounded-2xl p-6 border border-border flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-full primaryLightBg flexCenter">
                    <PiDoorOpen className="text-2xl primaryColor" />
                </div>
                <div className="space-y-1">
                    <Typography variant="h6" weight="semibold" children={t('selectRoomToBook')} />
                    <Typography variant="desc1" className="textSecondaryColor!" children={t('selectRoomToBookDesc')} />
                </div>
            </div>
        )
    }

    return (
        <>
            <div className={`bg-white rounded-2xl md:p-4 ${isConfirmBookingPage ? '' : 'max-h-200 overflow-auto customScrollbar'}`}>
                <div className="space-y-6 md:space-y-4">

                    <div className="space-y-2">
                        <div className="space-y-6 md:hidden">
                            <PropertyCard />
                            <Typography variant="h6" className="text-base! md:hidden" weight="medium" children={t('selectedRoom')} />
                        </div>
                        <div className="flex gap-4 p-4 md:p-0 rounded-2xl md:rounded-none border md:border-none max-375:flex-wrap">
                            <div className={`shrink-0 w-25 h-21.25`}>
                                <ImagePreview
                                    src={roomDetails?.room_type?.images?.[0]?.url}
                                    alt={roomDetails?.room_type?.name}
                                    objectFit="cover"
                                    rounded="2xl"
                                    aspectRatio="square"
                                />
                            </div>
                            <div className="flex flex-col gap-4 w-full">
                                <RoomDetailsSingleHotel
                                    name={roomDetails?.room_type?.name}
                                    rating={roomDetails?.rating}
                                    reviews={roomDetails?.reviews_count}
                                    maxGuests={`${roomDetails?.room_type?.max_guests} adult${(roomDetails?.room_type?.max_guests ?? 0) > 1 ? 's' : ''}`}
                                    bedType={roomDetails?.room_type?.bed_type}
                                    roomSize={roomDetails?.room_size}
                                    roomsCard={true}
                                    reserveCard={true}
                                />

                                <RoomFeatures roomsCard={true} features={roomDetails?.room_type?.facilities} visibleCount={2} extraCount={roomDetails?.room_type?.facilities?.length - 2} showViewMoreModal={true} />
                            </div>
                        </div>
                    </div>

                    <Divider />

                    {
                        isConfirmBookingPage ?
                            <div className="bodyBg rounded-2xl border w-full overflow-hidden">
                                {/* Check In / Check Out Row */}
                                <div className="grid grid-cols-2 divide-x divide-gray-200">
                                    {/* Check In */}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-sm font-medium textSecondaryColor mb-1">
                                            <PiCalendarDots className="text-xl" />
                                            <span className="">{t('checkIn')}</span>
                                        </div>
                                        <p className="font-medium">{formateDatePretty(bookingData?.checkIn)}</p>
                                    </div>

                                    {/* Check Out */}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 text-sm font-medium textSecondaryColor mb-1">
                                            <PiCalendarDots className="text-xl" />
                                            <span className="">{t('checkOut')}</span>
                                        </div>
                                        <p className="font-medium">{formateDatePretty(bookingData?.checkout)}</p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200" />

                                {/* Guest & Rooms Row */}
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-sm font-medium textSecondaryColor mb-1">
                                        <PiUsers className="text-xl" />
                                        <span className="">{t('guestsAndRooms')}</span>
                                    </div>
                                    <p className="font-medium">
                                        {bookingData.rooms} {t(bookingData.rooms > 1 ? 'rooms' : 'room')}, {bookingData.adults} {t('adults')}, {bookingData.childrenCount} {t('children')}, {bookingData.pets ? t('pets') : ''}
                                    </p>
                                </div>
                            </div>
                            :
                            <div className="space-y-2">
                                <Typography variant="h6" className="text-base! md:hidden" weight="medium" children={t('yourBookingDetails')} />
                                <div className="flex flex-col gap-6 p-4 md:p-0 rounded-2xl md:rounded-none border md:border-none">

                                    {/* ── Date Range Picker ── */}
                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <div className="flex flex-col gap-1.5 w-full cursor-pointer">
                                                <label className="text-sm font-medium textPrimaryColor">
                                                    {t('dates')} <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex items-center justify-between gap-3 border rounded-lg px-3 py-1.5 bodyBg">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <PiCalendarDots className="text-xl textSecondaryColor shrink-0" />
                                                        <span className="text-sm textPrimaryColor truncate">
                                                            {bookingData?.checkIn && bookingData?.checkout
                                                                ? `${formateDatePretty(bookingData.checkIn)} - ${formateDatePretty(bookingData.checkout)}`
                                                                : t('selectDate')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0 text-sm font-medium textPrimaryColor bg-white p-2 rounded-lg border">
                                                        <span>{t('edit')}</span>
                                                        <PiPencilSimple className="text-base" />
                                                    </div>
                                                </div>
                                            </div>
                                        </PopoverTrigger>

                                        <PopoverContent
                                            className="w-auto p-0 border-none shadow-none rounded-2xl"
                                            align="start"
                                            // Keeps the popover from closing when clicking inside the calendar
                                            onInteractOutside={() => setCalendarOpen(false)}
                                        >
                                            <div className="bg-white rounded-2xl p-4 shadow-xl border relative">
                                                {/* Prev month button */}
                                                <div className="absolute top-6 left-4 z-20">
                                                    <button
                                                        onClick={handlePrevMonth}
                                                        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                                    >
                                                        <PiCaretLeft className="text-lg" />
                                                    </button>
                                                </div>
                                                {/* Next month button */}
                                                <div className="absolute top-6 right-4 z-20">
                                                    <button
                                                        onClick={handleNextMonth}
                                                        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                                    >
                                                        <PiCaretRight className="text-lg" />
                                                    </button>
                                                </div>

                                                <Calendar
                                                    initialFocus
                                                    mode="range"
                                                    showOutsideDays={false}
                                                    month={currentMonth}
                                                    onMonthChange={setCurrentMonth}
                                                    selected={{ from: checkInDate, to: checkOutDate }}
                                                    onSelect={handleSelect}
                                                    numberOfMonths={isMobile ? 1 : 2}
                                                    weekStartsOn={1}
                                                    disabled={{ before: new Date() }}
                                                    modifiers={{ sunday: { dayOfWeek: [0] } }}
                                                    modifiersClassNames={{ sunday: "errorColor" }}
                                                    className="p-0"
                                                    classNames={{
                                                        month: "space-y-4",
                                                        caption: "flex justify-center pt-1 relative items-center mb-4",
                                                        caption_label: "text-base font-semibold",
                                                        nav: "hidden",
                                                        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] last:errorColor",
                                                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 [&:nth-child(7)]:errorColor",
                                                        day_range_end: "day-range-end",
                                                        day_selected: "primaryBg! !text-white hover:!bg-[var(--primary-color)] hover:!text-white focus:!bg-[var(--primary-color)] focus:!text-white",
                                                        day_today: "bg-accent text-accent-foreground",
                                                        day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                                                        day_disabled: "text-muted-foreground opacity-50",
                                                        day_range_middle: "!aria-selected:bg-[var(--primary-color-50)] !aria-selected:text-black",
                                                        day_hidden: "invisible",
                                                    }}
                                                />
                                            </div>
                                        </PopoverContent>
                                    </Popover>

                                    <GuestSelector
                                        trigger={
                                            <div role="button" tabIndex={0} className="cursor-pointer w-full">
                                                <Input
                                                    label={t('guestsAndRooms')}
                                                    required
                                                    fullWidth
                                                    variant="default"
                                                    leftIcon={<PiUsers className="text-xl textSecondaryColor pointer-events-none" />}
                                                    rightIcon={<PiCaretDown className="text-xl textSecondaryColor pointer-events-none" />}
                                                    placeholder={`${bookingData.rooms} ${t(bookingData.rooms > 1 ? 'rooms' : 'room')}, ${bookingData.adults} ${t('adults')}, ${bookingData.childrenCount} ${t('children')}${bookingData.pets ? `, ${bookingData.pets} ${t('pets')}` : ''}`}
                                                    readOnly
                                                    className="bodyBg rounded-lg pointer-events-none placeholder:textSecondaryColor textPrimaryColor"
                                                />
                                            </div>
                                        }
                                        reserveCard={true}
                                        setBookingDetailsReserveCard={setBookingData}
                                        petsAllowed={petsAllowed}
                                    />
                                </div>
                            </div>
                    }


                    {/* rest of the JSX below is completely unchanged */}
                    <Divider />
                    <div className="flex flex-col gap-3">
                        {!couponCode ? (
                            <>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2 textPrimaryColor font-medium">
                                        <PiTag className="text-[22px]" />
                                        <span className="text-[15px]">{t('applyOfferCode')}</span>
                                    </div>
                                    <span
                                        className="primaryColor text-sm font-medium cursor-pointer hover:underline"
                                        onClick={() => setShowCouponModal(true)}
                                    >
                                        {t('viewCoupons')}
                                    </span>
                                </div>
                                <div className="border border-border rounded-lg py-3 px-4 flex items-center bg-white w-full justify-between">
                                    <input
                                        type="text"
                                        placeholder={t('enterCode')}
                                        value={localCouponCode}
                                        onChange={(e) => setLocalCouponCode(e.target.value.toUpperCase())}
                                        className="between-1200-1399:w-1/2 bg-transparent outline-none text-[15px] placeholder:textSecondaryColor textPrimaryColor"
                                    />
                                    <Button variant={`${isMobile ? 'text' : 'secondary'}`}
                                        onClick={() => { handleApplyCouponCode(localCouponCode) }}
                                        size="md"
                                        className={`w-max ${isMobile ? 'text-sm p-0! primaryColor!' : ''} ${isLoading ? 'hover:bg-black!' : ''}`}
                                        children={t('applyCoupon')}
                                        disabled={isLoading}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 font-medium mb-1">
                                    <PiCheckCircleFill className="text-[22px] successColor" />
                                    <span className="text-[15px] textPrimaryColor">{t('codeApplied')}</span>
                                </div>
                                <div className="border border-border rounded-xl p-4 flex justify-between items-center bg-white mt-1">
                                    <span className="font-bold text-base textPrimaryColor">{couponCode}</span>
                                    <span
                                        onClick={() => { handleRemoveCouponCode() }}
                                        className="errorColor text-[15px] font-medium cursor-pointer hover:underline"
                                    >
                                        {t('remove')}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                    <Divider />
                    {
                        !isConfirmBookingPage &&
                        <CancellationComp
                            cancellationPolicy={summaryData?.cancellation_policy}
                            variant="column"
                        />
                    }
                    {
                        isLoading ?
                            <div className="rounded-2xl border bg-white p-5 space-y-5">
                                <Skeleton className="h-62 w-full rounded-xl" />
                            </div>
                            :
                            !isError && summaryData &&
                            <div className="space-y-2">
                                <Typography variant="h6" className="text-base! md:hidden" weight="medium" children={t('priceBreaddown')} />
                                <BookingSummary isPayAtProperty={isPayAtProperty} />
                                {
                                    isConfirmBookingPage && isPayAtProperty &&
                                    <div className="warningLightBg flex items-center gap-2 rounded-lg p-2">
                                        <PiInfo className="text-lg warningColor!" />
                                        <Typography variant="caption" weight="medium" className="textPrimaryColor! text-xs!">
                                            {t('payRemainingAmtAtProperty')}
                                        </Typography>
                                    </div>
                                }
                            </div>
                    }
                    <div className="w-full space-y-2">
                        {
                            !isError && summaryData && !isConfirmBookingPage &&
                            <Button variant="primary" children={t('reserveNow')} loading={lockBookingLoading} size="md" onClick={handleReserveNow} rightIcon={<PiArrowRight className="text-2xl rtl:rotate-180" />} className="w-full" />
                        }
                        {
                            !isConfirmBookingPage &&
                            <CancellationComp
                                cancellationPolicy={summaryData?.cancellation_policy}
                                variant="row"
                            />
                        }
                    </div>
                </div>
            </div>

            <CouponAndReferalCode
                open={showCouponModal}
                onClose={() => setShowCouponModal(false)}
                onApply={(code) => {
                    handleApplyCouponCode(code)
                }}
                propertySlug={propertySlug}
            />
        </>
    )
}

export default ReserveCard