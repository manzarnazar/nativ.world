'use client'
import { useState, useCallback, useEffect, useMemo } from "react"
import { z } from "zod"
import { useTranslation } from "@/hooks/useTranslation"
import { Typography } from "@/components/storyBook/atoms/Typography"
import Input from "@/components/storyBook/atoms/Input/Input"
import { PiUserCircle, PiEnvelope, PiArrowRight, PiCheckCircleFill } from "react-icons/pi"
import Image, { StaticImageData } from "next/image"
import Divider from "@/components/storyBook/atoms/Divider"
import { Button } from "@/components/storyBook/atoms/Button"
import { useIsMobile } from "@/hooks/useMobile"
import { useBookingDetails } from "@/contexts/BookingDetails"
import { useDispatch, useSelector } from "react-redux"
import { bookingIdSelector, bookingLockIdSelector, bookingSummarySelector, couponCodeSelector, isRedirectToPaymentGatewaySelector, payAtPropertySelector, selectedRoomSelector, setBookingId, setBookingSummary, setIsRedirectToPaymentGateway, setPayAtProperty } from "@/redux/reducers/helpersReducer"
import { ConfirmBookingData, ConfirmBookingFilters, useConfirmBooking } from "@/hooks/queries/useConfirmBookings"
import { toast } from '@/lib/toast';
import { userDataSelector } from "@/redux/reducers/userSlice"
import { bookingDetailsSelector } from "@/redux/reducers/bookingDetailsSlice"
import BookingPaymentStatusModal from "@/components/modalsAndSheets/BookingPaymentStatusModal"
import { formateDateForApi, getPercentage } from "@/utils/helpers"
import { useConfirmBookingsWithPayment } from "@/hooks/queries/bookings/useConfirmBookingsWithPayment"
import { useSearchParams } from "next/navigation"
import flutterwave from "@/assets/images/flutterwave.png"
import stripe from "@/assets/images/stripe.png"
import razorpay from "@/assets/images/razorpay.png"
import { useBookingQuote } from "@/hooks/queries/useBookingQuote"
import CancellationComp from "@/components/storyBook/organisms/CancellationComp"
import { PhoneInput } from "@/components/storyBook/atoms/PhoneInput"
import { settingsSelector } from "@/redux/reducers/settingsSlice"
import { isValidPhoneNumber } from "libphonenumber-js"

export type PaymentGateway = "razorpay" | "stripe" | "flutterwave"

const GuetDetailsPaymentOpts = ({ setIsPayAtProperty }: { setIsPayAtProperty: (value: boolean) => void }) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const paymentStatus = searchParams.get('status')

    const settings = useSelector(settingsSelector);
    const bookingLockId = useSelector(bookingLockIdSelector);
    const userData = useSelector(userDataSelector);
    const bookingDetails = useSelector(bookingDetailsSelector);
    const payAtProperty = useSelector(payAtPropertySelector);
    const bookingSummary = useSelector(bookingSummarySelector);
    const isRedirectToPaymentGateway = useSelector(isRedirectToPaymentGatewaySelector);
    const bookingId = useSelector(bookingIdSelector);

    const selectedRoom = useSelector(selectedRoomSelector);
    const roomDetails = selectedRoom?.room;

    const isMultiMode = settings?.basic_details?.business_mode === 'multi';
    const couponCode = useSelector(couponCodeSelector);

    const [showPartialAmountPay, setShowPartialAmountPay] = useState(true)

    useEffect(() => {
        if (isMultiMode && couponCode) {
            setShowPartialAmountPay(false)
        }
        if (!couponCode) {
            setShowPartialAmountPay(true)
        }
    }, [couponCode, isMultiMode])


    const currency = bookingSummary?.pricing?.currency_symbol;
    const totalAmount = bookingSummary?.pricing?.total_amount;
    const isFreeBooking = !totalAmount || totalAmount === 0;

    const { bookingData, setBookingData } = useBookingDetails();

    // ─── Types ────────────────────────────────────────────────────────────────────
    type GuestDetailsErrors = Partial<Record<string, string>>

    type GuestDetailsForm = {
        fullName: string
        email: string
        phone: string
        country_code: string
        dialCode: string
        paymentMethod: PaymentMethod | ""
    }

    type PaymentMethod = "pay_now" | "pay_at_property" | "partial"

    // ─── Zod Schema ───────────────────────────────────────────────────────────────
    const guestDetailsSchema = z.object({
        fullName: z.string().min(2, t("nameMinLength")),
        email: z
            .string()
            .min(1, t("emailRequired"))
            .email(t("invalidEmail")),
        phone: z.string().min(8, t("phoneMinLength")),
        paymentMethod: z.enum(["pay_now", "pay_at_property", "partial"], {
            error: t("paymentMethodRequired"),
        }),
    })

    // ─── Guest Details State ──────────────────────────────────────────────────────
    const [formData, setFormData] = useState<GuestDetailsForm>({
        fullName: userData?.name || "",
        email: userData?.email || "",
        phone: (userData?.dial_code || "") + (userData?.phone || ""),
        country_code: userData?.country_code || settings?.general_config?.country_code,
        dialCode: userData?.dial_code || settings?.general_config?.country_dial_code,
        paymentMethod: "",
    })
    const [errors, setErrors] = useState<GuestDetailsErrors>({})

    // ─── Payment State ────────────────────────────────────────────────────────────
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)

    // ─── Confirm Booking Data State ───────────────────────────────────────────────
    const [confirmBookingData, setConfirmBookingData] = useState<ConfirmBookingFilters>({
        lock_id: bookingLockId!,
        payment_method: "",
        adults: 0,
        children: 0,
        has_pets: false,
        coupon_code: undefined,
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        guest_dial_code: "",

    });

    const [isOpen, setIsOpen] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null)

    const availablePaymentGateways = bookingSummary?.payment?.available_gateways;

    const allGateways: { id: PaymentGateway; name: string; logo: StaticImageData }[] = [
        { id: "flutterwave", name: "Flutterwave", logo: flutterwave },
        { id: "stripe", name: "Stripe", logo: stripe },
        { id: "razorpay", name: "Razorpay", logo: razorpay },
    ]
    const gateways = allGateways.filter(gw => !availablePaymentGateways || availablePaymentGateways.includes(gw.id))

    const availablePaymentMethods = useMemo(() => {
        const methods: PaymentMethod[] = ["pay_now"]
        if (payAtProperty?.enabled && payAtProperty?.advancePercentage > 0 && showPartialAmountPay) {
            methods.push("partial")
        } else if (payAtProperty?.enabled && !isMultiMode) {
            methods.push("pay_at_property")
        }
        return methods
    }, [payAtProperty, showPartialAmountPay, isMultiMode])

    const [bookingConfrData, setbookingConfrData] = useState<ConfirmBookingData>();



    const { mutate: confirmBooking, isPending } = useConfirmBooking();
    const { mutate: confirmBookingWithPaymentGate, isPending: isPendingWithGate } = useConfirmBookingsWithPayment();

    const isPayNow = formData.paymentMethod === "pay_now" || formData.paymentMethod === "partial";

    const paymentLoading = isPayNow ? isPendingWithGate : isPending


    const handleChangePhone = (value: string, data: any) => {
        setFormData((prev) => ({
            ...prev,
            phone: value,
            country_code: data.countryCode,
            dialCode: data.dialCode,
        }))
        setErrors(prev => ({ ...prev, phone: undefined }))
    }

    const validatePhoneNumber = (): boolean => {
        const phoneToValidate = formData.phone.startsWith('+') ? formData.phone : `+${formData.phone}`
        if (!isValidPhoneNumber(phoneToValidate)) {
            setErrors(prev => ({ ...prev, phone: t("firebaseInvalidPhone") }))
            return false;
        }
        return true;
    }

    const validate = useCallback((): boolean => {
        const schema = isFreeBooking
            ? guestDetailsSchema.omit({ paymentMethod: true })
            : guestDetailsSchema;
        const parseData = isFreeBooking
            ? { fullName: formData.fullName, email: formData.email, phone: formData.phone }
            : { fullName: formData.fullName, email: formData.email, phone: formData.phone, paymentMethod: formData.paymentMethod };

        if (!validatePhoneNumber()) {
            return false
        }

        const result = schema.safeParse(parseData)
        if (!result.success) {
            const fieldErrors: GuestDetailsErrors = {}
            result.error.issues.forEach((err: z.ZodIssue) => {
                const field = err.path[0] as string
                if (!fieldErrors[field]) fieldErrors[field] = err.message
            })
            setErrors(fieldErrors)
            return false
        }
        setErrors({})
        return true
    }, [formData, isFreeBooking]);



    const {
        mutate: getQuote,
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
            coupon_code: couponCode
        }, {
            onSuccess: (data) => {
                if (data) {
                    dispatch(setBookingSummary(data?.data))

                    dispatch(setPayAtProperty({
                        enabled: data?.data?.property?.pay_at_property,
                        advancePercentage: data?.data?.property?.advance_percentage,
                        totalAmount: data?.data?.pricing?.total_amount,
                    }))
                }
            },
            onError: (error) => {
                console.log('error in lock booking api =>', error)
                toast.error(error.message)
            },
        })
    }

    useEffect(() => {
        if (isRedirectToPaymentGateway && !paymentStatus) {
            getBookingQuote();
        }

    }, [isRedirectToPaymentGateway, paymentStatus]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const isValid = validate()
        if (!isValid) return

        if (!isFreeBooking && isPayNow && !selectedGateway) {
            setErrors(prev => ({ ...prev, gateway: t("selectPaymentMethod") || "Please select a payment gateway" }))
            return
        }

        const updatedConfirmBookingData: ConfirmBookingFilters = {
            ...confirmBookingData,
            lock_id: bookingLockId!,
            ...(!isFreeBooking && isPayNow && {
                gateway_type: selectedGateway!,
                payment_type: selectedPaymentMethod === 'pay_now' ? 'full' : selectedPaymentMethod!,
            }),
            guest_name: formData.fullName,
            guest_email: formData.email,
            guest_phone: formData.phone.slice(formData.dialCode.length),
            guest_dial_code: `+${formData.dialCode}`,
            ...(!isFreeBooking && !isPayNow && { payment_method: formData.paymentMethod as PaymentMethod }),
            adults: bookingData.adults,
            children: bookingData.childrenCount,
            has_pets: bookingData.pets,
            coupon_code: couponCode
        }

        setConfirmBookingData(updatedConfirmBookingData)

        if (!isFreeBooking && isPayNow && (totalAmount && totalAmount > 0)) {

            // ✅ Call the mutation
            confirmBookingWithPaymentGate(updatedConfirmBookingData, {
                onSuccess: (data) => {
                    window.location.href = data.data.payment?.payment_url
                    dispatch(setBookingId(data?.data?.booking.booking_number))
                    setTimeout(() => {
                        dispatch(setIsRedirectToPaymentGateway(true))
                    }, 2000)
                },
                onError: (error) => {
                    console.log("Booking failed =>", error)
                    toast.error(error.message)
                },
            })
        }
        else {
            confirmBooking(updatedConfirmBookingData, {
                onSuccess: (data) => {
                    setIsOpen(true)
                    setbookingConfrData(data?.data)
                    dispatch(setBookingId(data?.data?.booking.booking_number))
                    setBookingData(bookingDetails)

                },
                onError: (error) => {
                    console.log("Booking failed =>", error)
                    toast.error(error.message)
                },
            });
        }
    }

    useEffect(() => {
        if (paymentStatus !== "processing" && paymentStatus !== null) {
            setIsOpen(true)
        }
    }, [paymentStatus]);

    useEffect(() => {
        if (selectedPaymentMethod === "partial") {
            setIsPayAtProperty(true)
        }
        else {
            setIsPayAtProperty(false)
        }
    }, [selectedPaymentMethod]);

    // Auto-select payment method when only one option available
    useEffect(() => {
        if (!isFreeBooking && availablePaymentMethods.length === 1) {
            const onlyMethod = availablePaymentMethods[0]
            setSelectedPaymentMethod(onlyMethod)
            setFormData(prev => ({ ...prev, paymentMethod: onlyMethod }))
        }
    }, [availablePaymentMethods, isFreeBooking]);

    // Auto-select payment gateway when only one option available
    useEffect(() => {
        if ((selectedPaymentMethod === "pay_now" || selectedPaymentMethod === "partial") && gateways.length === 1) {
            setSelectedGateway(gateways[0].id)
        }
    }, [selectedPaymentMethod, gateways]);

    return (
        <form onSubmit={handleSubmit} className="lg:bg-white col-span-12 lg:col-span-7 md:py-12 md:px-10 flex flex-col gap-6 pb-32 md:pb-0">

            {/* ── Guest Details Card ── */}
            <div className="md:rounded-2xl md:border md:overflow-hidden md:p-4 space-y-4">
                <div className="">
                    <Typography
                        variant="h4"
                        weight="semibold"
                        className="textPrimaryColor! mb-1"
                    >
                        {t("guestDetails")}
                    </Typography>
                    {
                        !isMobile &&
                        <Typography variant="caption" className="textSecondaryColor!" weight="medium">
                            {t("guestDetailsSubtitle")}
                        </Typography>
                    }
                </div>
                {
                    !isMobile &&
                    <Divider width="bleed" />
                }

                <div className="">
                    <div className="flex flex-col gap-5">
                        {/* Row 1: Full Name + Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input
                                label={t("fullName")}
                                required
                                fullWidth
                                type="text"
                                variant="default"
                                leftIcon={<PiUserCircle className="text-xl textSecondaryColor" />}
                                placeholder="e.g, Jack Williams"
                                value={formData.fullName}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                                }
                                className="bodyBg rounded-lg textPrimaryColor"
                                error={errors.fullName}
                            />
                            <Input
                                label={t("email")}
                                required
                                fullWidth
                                type="email"
                                variant="default"
                                leftIcon={<PiEnvelope className="text-xl textSecondaryColor" />}
                                placeholder="e.g, JackWilliams11@gmail.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                                }
                                className="bodyBg rounded-lg textPrimaryColor"
                                error={errors.email}
                            />
                        </div>

                        {/* Row 2: Phone Number (half width) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <PhoneInput
                                label={t('phoneNumber')}
                                required
                                fullWidth
                                value={formData.phone}
                                onChange={handleChangePhone}
                                enableSearch
                                searchPlaceholder="Search country..."
                                error={errors.phone}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Payment Option Card ── */}
            <div className="md:rounded-2xl md:border md:overflow-hidden md:p-4 space-y-4" style={{ display: isFreeBooking ? 'none' : undefined }}>
                <div className="">
                    <Typography
                        variant="h4"
                        weight="semibold"
                        className="textPrimaryColor! mb-1"
                    >
                        {t("paymentOpt")}
                    </Typography>
                    {
                        !isMobile &&
                        <Typography variant="caption" className="textSecondaryColor!" weight="medium">
                            {t("paymentOptDesc")}
                        </Typography>
                    }
                </div>
                {
                    !isMobile &&
                    <Divider width="bleed" />
                }

                <div className="space-y-7.5">
                    <div className="">
                        <div className="flex flex-col gap-3">

                            {/* Pay Now */}
                            <div
                                className={`flex items-start flex-col gap-3 rounded-xl border cursor-pointer transition-colors overflow-hidden primaryLightBorderColor`}
                                onClick={() => {
                                    setSelectedPaymentMethod("pay_now")
                                    setFormData(prev => ({ ...prev, paymentMethod: "pay_now" }))
                                }}
                            >

                                <div className={`${selectedPaymentMethod === "pay_now" && "primaryLightBg"} flex gap-3 w-full px-4 py-3.5`}>

                                    <div className="mt-0.5 shrink-0">
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPaymentMethod === "pay_now"
                                                ? "primaryBorderColor"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {selectedPaymentMethod === "pay_now" && (
                                                <div className="w-2.5 h-2.5 rounded-full primaryBg" />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Typography variant="desc2" weight="semibold" className="textPrimaryColor!">
                                            {t("payNow")}
                                        </Typography>
                                        <Typography variant="caption" className="textSecondaryColor! text-sm!">
                                            {t('pay')} <span className="textPrimaryColor! font-semibold">{currency}{totalAmount}</span> {t("payNowDesc2")}
                                        </Typography>

                                    </div>
                                </div>
                                {/* Inline gateway selection — shown when pay_now is selected */}
                                {selectedPaymentMethod === "pay_now" && (
                                    <div className="flex flex-col gap-3 w-full px-4 py-3.5">
                                        <Typography variant="desc2" weight="semibold" className="textPrimaryColor! text-sm!">
                                            {t("selectPaymentMethod")}
                                        </Typography>
                                        <div className="max-1199:flex! items-center flex-wrap grid grid-cols-3  gap-3 w-full">
                                            {gateways.map((gw) => {
                                                const isSelected = selectedGateway === gw.id
                                                return (
                                                    <div
                                                        key={gw.id}
                                                        onClick={() => {
                                                            setSelectedGateway(gw.id)
                                                            setErrors(prev => ({ ...prev, gateway: undefined }))
                                                        }}
                                                        className={`flex items-center justify-between px-3 py-3 rounded-xl w-full border cursor-pointer transition-colors ${isSelected ? "primaryBorderColor primaryLightBg" : "border-gray-200"}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Image src={gw.logo} alt={gw.name} width={28} height={28} className="object-contain" />
                                                            <Typography variant="caption" weight="semibold" className="textPrimaryColor!">{gw.name}</Typography>
                                                        </div>
                                                        {isSelected
                                                            ? <PiCheckCircleFill className="text-xl primaryColor!" />
                                                            : <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                                                        }
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        {errors.gateway && (
                                            <p className="text-xs errorColor">{errors.gateway}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Pay at Property */}
                            {
                                payAtProperty?.enabled && payAtProperty?.advancePercentage > 0 && showPartialAmountPay ?
                                    <div
                                        className={`flex items-start flex-col gap-3 rounded-xl border cursor-pointer transition-colors overflow-hidden primaryLightBorderColor`}
                                        onClick={() => {
                                            setSelectedPaymentMethod("partial")
                                            setFormData(prev => ({ ...prev, paymentMethod: "partial" }))
                                        }}
                                    >
                                        <div className={`${selectedPaymentMethod === "partial" && "primaryLightBg"} flex gap-3 w-full px-4 py-3.5`}>
                                            <div className="mt-0.5 shrink-0">
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPaymentMethod === "partial"
                                                        ? "primaryBorderColor"
                                                        : "border-gray-300"
                                                        }`}
                                                >
                                                    {selectedPaymentMethod === "partial" && (
                                                        <div className="w-2.5 h-2.5 rounded-full primaryBg" />
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <Typography variant="desc2" weight="semibold" className="textPrimaryColor! capitalize">
                                                    {t("payPartialAmount")}
                                                </Typography>
                                                <Typography variant="caption" className="textSecondaryColor! text-sm!">
                                                    {t('pay')} <span className="textPrimaryColor! font-semibold">{currency}{getPercentage(payAtProperty?.totalAmount, payAtProperty?.advancePercentage)}</span> {t("payNowDesc2")}
                                                </Typography>
                                            </div>
                                        </div>
                                        {selectedPaymentMethod === "partial" && (
                                            <div className="flex flex-col gap-3 w-full px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                                <Typography variant="desc2" weight="semibold" className="textPrimaryColor! text-sm!">
                                                    {t("selectPaymentMethod")}
                                                </Typography>
                                                <div className="max-1199:flex! items-center flex-wrap grid grid-cols-3  gap-3 w-full">
                                                    {gateways.map((gw) => {
                                                        const isSelected = selectedGateway === gw.id
                                                        return (
                                                            <div
                                                                key={gw.id}
                                                                onClick={() => {
                                                                    setSelectedGateway(gw.id)
                                                                    setErrors(prev => ({ ...prev, gateway: undefined }))
                                                                }}
                                                                className={`flex items-center justify-between px-3 py-3 rounded-xl w-full border cursor-pointer transition-colors ${isSelected ? "primaryBorderColor primaryLightBg" : "border-gray-200"}`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Image src={gw.logo} alt={gw.name} width={28} height={28} className="object-contain" />
                                                                    <Typography variant="caption" weight="semibold" className="textPrimaryColor!">{gw.name}</Typography>
                                                                </div>
                                                                {isSelected
                                                                    ? <PiCheckCircleFill className="text-xl primaryColor!" />
                                                                    : <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                {errors.gateway && (
                                                    <p className="text-xs errorColor">{errors.gateway}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    :
                                    payAtProperty?.enabled && !isMultiMode?
                                        <div
                                            className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border cursor-pointer transition-colors ${selectedPaymentMethod === "pay_at_property"
                                                ? "primaryBorderColor"
                                                : "border primaryLightBorderColor"
                                                }`}
                                            onClick={() => {
                                                setSelectedPaymentMethod("pay_at_property")
                                                setFormData(prev => ({ ...prev, paymentMethod: "pay_at_property" }))
                                            }}
                                        >
                                            <div className="mt-0.5 shrink-0">
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPaymentMethod === "pay_at_property"
                                                        ? "primaryBorderColor"
                                                        : "border-gray-300"
                                                        }`}
                                                >
                                                    {selectedPaymentMethod === "pay_at_property" && (
                                                        <div className="w-2.5 h-2.5 rounded-full primaryBg" />
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <Typography variant="desc2" weight="semibold" className="textPrimaryColor!">
                                                    {t("payAtProperty")}
                                                </Typography>
                                                <Typography variant="caption" className="textSecondaryColor!">
                                                    {t("payAtPropertyDesc1")}
                                                </Typography>
                                            </div>
                                        </div>
                                        : null
                            }

                        </div>

                        {/* Payment method validation error */}
                        {errors.paymentMethod && (
                            <p className="mt-2 text-xs errorColor">{errors.paymentMethod}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-2 fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:shadow-none md:bg-transparent md:p-0 md:relative">
                {
                    isMobile ?
                        <Button
                            type="submit"
                            variant="primary"
                            rightIcon={<PiArrowRight className="text-2xl rtl:rotate-180" />}
                            fullWidth
                            size="md"
                            className="text-xl!"
                            loading={paymentLoading}
                        >
                            {t("bookNow")}
                        </Button>
                        :
                        <Button
                            type="submit"
                            variant="primary"
                            rightIcon={<PiArrowRight className="text-2xl rtl:rotate-180" />}
                            fullWidth
                            className="text-xl!"
                            loading={paymentLoading}
                        >
                            {t("bookNow")}
                        </Button>
                }
                {
                    !isFreeBooking &&
                    <CancellationComp
                        cancellationPolicy={bookingSummary?.cancellation_policy}
                        variant="row"
                    />
                }
            </div>

            <BookingPaymentStatusModal isOpen={isOpen} setIsOpen={setIsOpen} paymentStatus={selectedPaymentMethod === 'pay_at_property' || isFreeBooking ? bookingConfrData?.booking?.status === 'confirmed' ? 'success' : 'failed' : paymentStatus} gatewayType={selectedGateway || ''} paymentType={selectedPaymentMethod || ''} />

        </form>
    )
}

export default GuetDetailsPaymentOpts
