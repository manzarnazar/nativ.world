import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogDescription
} from "@/components/ui/dialog"
import { useTranslation } from '@/hooks/useTranslation'
import { PiArrowLeft, PiArrowRight, PiBed, PiCalendarDots, PiCheckCircleFill, PiHeadset, PiReceipt, PiUsers, PiXCircleFill } from 'react-icons/pi';
import { useIsMobile } from "@/hooks/useMobile";
import { Typography } from "../storyBook/atoms/Typography";
import PropertyCard from "../pagesComponent/confirmBooking/PropertyCard";
import BookingSummary from "../storyBook/atoms/BookingSummary";
import { Button } from "../storyBook/atoms/Button";
import { ConfirmBookingData } from "@/hooks/queries/useConfirmBookings";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { bookingIdSelector, bookingSummarySelector, resetBookingDetailsHelper } from "@/redux/reducers/helpersReducer";
import { useBookingDetails } from "@/contexts/BookingDetails";
import { formateDatePretty } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { currentLangCodeSelector } from "@/redux/reducers/languageSlice";
import { useDownloadInvoice } from "@/hooks/useDownloadInvoice";
import { useRetryPayment } from "@/hooks/queries/bookings/useRetyPayment";
import { toast } from '@/lib/toast';

interface BookingPaymentStatusModalProps {
    isOpen: boolean,
    setIsOpen: (value: boolean) => void
    paymentStatus?: string | null;
    gatewayType?: string;
    paymentType?: string;
}

const BookingPaymentStatusModal: React.FC<BookingPaymentStatusModalProps> = ({ isOpen, setIsOpen, paymentStatus, gatewayType, paymentType }) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const router = useRouter();

    const currentLangCode = useSelector(currentLangCodeSelector);
    const bookingConfrData = useSelector(bookingSummarySelector);
    const bookingId = useSelector(bookingIdSelector);

    const bookingStatus = paymentStatus;
    const { bookingData } = useBookingDetails();
    const { handleDownloadInvoice, invoiceLoading } = useDownloadInvoice();

    const handleRedirectDetailsPage = () => {
        setIsOpen(false);
        dispatch(resetBookingDetailsHelper());
        router.push(`${currentLangCode}/my-bookings/${bookingId}`);
    }


    const { mutate: retryPayment, isPending: isLoading } = useRetryPayment();

    const dispatch = useDispatch();

    const handleRetryPayment = () => {

        retryPayment(
            {
                bookingNumber: bookingId!,
            },
            {
                onSuccess: (data) => {
                    window.open(data.data.payment?.payment_url)
                },
                onError: (error) => {
                    toast.error(error.message)
                },
            }
        )
    }

    const handleClose = () => {
        setIsOpen(false);
        handleRedirectDetailsPage();
        router.push(`${currentLangCode}/my-bookings`);
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className={`overflow-x-hidden overscroll-y-auto [&>.closeBtn]:bg-white [&>.closeBtn]:top-10 ltr:[&>.closeBtn]:right-10! rtl:[&>.closeBtn]:left-10! ${isMobile ? 'max-w-full! max-h-full! h-full! [&>.closeBtn]:hidden rounded-none' : ''} flex flex-col customScrollbar`} onClick={(e) => e.stopPropagation()}>
                <DialogHeader className='block md:hidden'>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-6">
                            {
                                <DialogClose asChild>
                                    <span className="">
                                        <PiArrowLeft className="text-2xl" />
                                    </span>
                                </DialogClose>
                            }
                        </div>
                        <DialogTitle>{t('bookingConfirmation')}</DialogTitle>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    <div className={`flex items-center ${bookingStatus === 'success' ? 'successLightBg' : 'errorLightBg'} w-full p-3 md:p-6 gap-4  md:pt-17 rounded-2xl`}>
                        <span className={`flexCenter shrink-0 w-14 h-14 md:w-16 md:h-16 ${bookingStatus === 'success' ? 'successBg' : 'errorBg'} text-white rounded-2xl`}>
                            {
                                bookingStatus === 'success' ? <PiCheckCircleFill className="text-2xl md:text-4xl" /> : <PiXCircleFill className="text-2xl md:text-4xl" />
                            }
                        </span>

                        <div className="flex flex-col gap-1">
                            <DialogTitle className="text-sm md:text-base">{bookingStatus === 'success' ? t('bookingConf') : t('bookingFail')}</DialogTitle>
                            <DialogDescription className="text-xs md:text-sm">{bookingStatus === 'success' ? t('bookingConfDesc') : t('bookingFailDesc')}</DialogDescription>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Typography
                            variant="h6"
                            weight="medium"
                            className="textPrimaryColor!"
                        >
                            {bookingStatus === 'success' ? t("bookingSummary") : t("possibleReseason")}
                        </Typography>

                        {
                            bookingStatus === 'success' ?
                                <div className="border rounded-2xl p-4 space-y-4">
                                    <div>
                                        <PropertyCard bookingModal={true} />
                                    </div>
                                    <div className="primaryLightBg p-4 flex items-center justify-between border primaryLightBorderColor rounded-2xl">
                                        <div className="flexCenter gap-2">
                                            <span className="w-10 h-10 rounded-full primaryBg flexCenter text-white">
                                                <PiBed className="text-xl md:text-2xl" />
                                            </span>
                                            <Typography variant="caption" weight="medium" className="textPrimaryColor!">
                                                {bookingConfrData?.room?.name}
                                            </Typography>
                                        </div>

                                        <Typography variant="caption" weight="medium" className="primaryColor!">
                                            {`${bookingConfrData?.stay?.nights} ${t('night')} (${bookingConfrData?.stay?.rooms} ${t(bookingConfrData?.stay?.rooms > 1 ? 'rooms' : 'room')})`}
                                        </Typography>

                                    </div>
                                    <div className="primaryLightBg rounded-2xl border w-full overflow-hidden">
                                        <div className="grid grid-cols-2 divide-x divide-gray-300">
                                            <div className="p-5">
                                                <div className="flex items-center gap-2 text-sm font-medium textSecondaryColor mb-1">
                                                    <PiCalendarDots className="text-xl" />
                                                    <span className="">{t('checkIn')}</span>
                                                </div>
                                                <p className="font-medium">{formateDatePretty(bookingData?.checkIn)}</p>
                                            </div>

                                            <div className="p-5">
                                                <div className="flex items-center gap-2 text-sm font-medium textSecondaryColor mb-1">
                                                    <PiCalendarDots className="text-xl" />
                                                    <span className="">{t('checkOut')}</span>
                                                </div>
                                                <p className="font-medium">{formateDatePretty(bookingData?.checkout)}</p>
                                            </div>
                                        </div>

                                        <div className="border-t primaryLightBorderColor" />
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 text-sm font-medium textSecondaryColor mb-1">
                                                <PiUsers className="text-xl" />
                                                <span className="">{t('guestsAndRooms')}</span>
                                            </div>
                                            <p className="font-medium">
                                                {bookingData?.rooms} {t(bookingData?.rooms > 1 ? 'rooms' : 'room')}, {bookingData?.adults} {t('adults')}, {bookingData?.childrenCount} {t('children')}
                                                {bookingData.pets ? `, ${bookingData.pets} ${t('pets')}` : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="border rounded-2xl p-4 space-y-4">
                                    <ul className="pl-4">
                                        <li className="textSecondaryColor list-disc">{t('insufficientBalance')}</li>
                                        <li className="textSecondaryColor list-disc">{t('payTimeout')}</li>
                                        <li className="textSecondaryColor list-disc">{t('bankOrNetIssue')}</li>
                                    </ul>
                                </div>
                        }


                    </div>
                    {
                        bookingStatus === 'success' &&
                        <BookingSummary paymentStatusModal={true} />
                    }


                    <div className={`${isMobile ? 'fixed w-full bg-white p-4' : ''}`}>
                        {
                            bookingStatus === 'success' ?
                                <div className={`flex items-center justify-between gap-4 ${isMobile ? 'pr-12.5' : 'container'}`}>
                                    <Button variant="secondary" leftIcon={<PiReceipt className="text-xl md:text-2xl hidden md:block" />} className={`w-full ${isMobile ? 'truncate line-clamp-1' : ''}`} size={isMobile ? 'md' : 'lg'} onClick={() => handleDownloadInvoice(bookingId ?? '')} loading={invoiceLoading} disabled={invoiceLoading}>
                                        {t('downloadInvoice')}
                                    </Button>
                                    <Button variant="primary" rightIcon={<PiArrowRight className="text-xl md:text-2xl hidden md:block rtl:rotate-180" />} className={`w-full ${isMobile ? 'truncate line-clamp-1' : ''}`} size={isMobile ? 'md' : 'lg'} onClick={handleRedirectDetailsPage}>
                                        {t('viewBooking')}
                                    </Button>
                                </div>
                                :
                                <div className={`flex items-center flex-col  gap-2 container`}>
                                    <Button variant="primary" rightIcon={<PiArrowRight className="text-xl md:text-2xl hidden md:block rtl:rotate-180" />} className={`w-full ${isMobile ? 'truncate line-clamp-1' : ''}`} size={isMobile ? 'md' : 'lg'}
                                        onClick={handleRetryPayment}
                                        loading={isLoading}
                                        disabled={isLoading}
                                    >
                                        {t('retryPayment')}
                                    </Button>
                                    <div className="flexCenter gap-1">
                                        <PiHeadset />
                                        <Typography variant="caption" className="textSecondaryColor!" weight="regular">
                                            {t('needSupport')} <Link href="/contact-us" className="primaryColor! underline cursor-pointer font-medium">{t('contactSupport')}</Link>
                                        </Typography>
                                    </div>

                                </div>
                        }
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BookingPaymentStatusModal
