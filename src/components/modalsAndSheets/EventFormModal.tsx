'use client'
import { useState, useCallback, useEffect } from "react"
import { z } from "zod"
import { useTranslation } from "@/hooks/useTranslation"
import { Button } from "../storyBook/atoms/Button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"
import { useIsMobile } from "@/hooks/useMobile"
import {
    PiArrowLeft,
    PiUser,
    PiEnvelope,
    PiMapPin,
} from "react-icons/pi"
import Divider from "../storyBook/atoms/Divider"
import { Typography } from "../storyBook/atoms/Typography"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import Input from "../storyBook/atoms/Input/Input"
import { useEventInquiry } from "@/hooks/queries/useEventQuiries"
import { toast } from '@/lib/toast';
import { useSelector } from "react-redux"
import { userDataSelector } from "@/redux/reducers/userSlice"
import { usePropertiesDropdown } from "@/hooks/queries/usePropertiesDropdown"
import { PhoneInput } from "../storyBook/atoms/PhoneInput"
import { settingsSelector } from "@/redux/reducers/settingsSlice"
import { isValidPhoneNumber } from "libphonenumber-js"

const MAX_MSG_LENGTH = 500

type EventFormErrors = Partial<Record<string, string>>

interface EventFormModalProps {
    eventId?: number;
}

const EventFormModal = ({ eventId }: EventFormModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const settings = useSelector(settingsSelector);

    const { data: propertiesData } = usePropertiesDropdown("", 100, 0);
    const properties = propertiesData?.items;
    const isSingleHotel = properties?.length === 1;
    const userDetails = useSelector(userDataSelector);

    const [formData, setFormData] = useState({
        name: userDetails?.name || "",
        email: userDetails?.email || "",
        phone: userDetails?.dial_code && userDetails?.phone ? `${userDetails.dial_code}${userDetails.phone}` : "",
        countryCode: userDetails?.country_code || "",
        dialCode: userDetails?.dial_code || "",
        hotelLocation: "",
        message: "",
    });

    // this useEffect is used to update the formData state whenever the userDetails change. It ensures that the form is pre-filled with the user's information if available.
    useEffect(() => {
        setFormData({
            name: userDetails?.name || "",
            email: userDetails?.email || "",
            phone: userDetails?.dial_code && userDetails?.phone ? `${userDetails.dial_code}${userDetails.phone}` : "",
            countryCode: userDetails?.country_code || settings?.general_config?.country_code,
            dialCode: userDetails?.dial_code || settings?.general_config?.country_dial_code,
            hotelLocation: "",
            message: "",
        })
    }, [userDetails])

    const [errors, setErrors] = useState<EventFormErrors>({})
    const [open, setOpen] = useState(false)

    const {
        mutate: eventInquiry,
        isPending: loading,
    } = useEventInquiry();

    // ─── Zod Schema (inside component for t() access) ────────────────────────
    const eventFormSchema = z.object({
        name: z.string().min(2, t('nameMinLength')),
        email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
        phone: z.string().min(8, t('phoneMinLength')),
        message: z
            .string()
            .max(MAX_MSG_LENGTH, `${t('messageMaxLength')}`)
            .optional(),
    })

    const handleChangePhone = (value: string, data: any) => {
        const dialCode = data.dialCode;
        const countryCode = data.countryCode;
        setFormData(prev => ({
            ...prev,
            phone: value,
            countryCode: countryCode,
            dialCode: dialCode,
        }))
    }

    const validatePhoneNumber = (): boolean => {
        if (!isValidPhoneNumber(`+${formData.phone}`)) {
            setErrors(prev => ({ ...prev, phone: t("firebaseInvalidPhone") }))
            return false;
        }
        return true;
    }

    const handleValidateForm = useCallback((): boolean => {
        if (!validatePhoneNumber()) {
            return false
        }

        const result = eventFormSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: EventFormErrors = {}
            result.error.issues.forEach((err: z.ZodIssue) => {
                const field = err.path[0] as string
                if (!fieldErrors[field]) fieldErrors[field] = err.message
            })
            setErrors(fieldErrors)
            return false
        }
        setErrors({})
        return true
    }, [formData, eventFormSchema])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const isValid = handleValidateForm()
        if (!isValid) return

        const phoneNumber = formData.phone.slice(formData.dialCode.length);

        eventInquiry({
            event_id: eventId,
            name: formData.name,
            email: formData.email,
            dial_code: `+${formData.dialCode}`,
            phone: phoneNumber,
            message: formData.message,
            property_slug: formData.hotelLocation,
        }, {
            onSuccess: (data) => {
                toast.success(t('inquirySuccess'))
                setOpen(false)
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    countryCode: "",
                    dialCode: "",
                    hotelLocation: "",
                    message: "",
                })
            },
            onError: (error) => {
                console.log('error in event form inquiry api =>', error)
                toast.error(error.message)
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="btn_md md:btn_lg bg-black text-white hover:primaryBg">
                {t('inquiryNow')}
            </DialogTrigger>

            <DialogContent className={`overflow-y-auto overflow-x-hidden ${isMobile ? 'max-w-full! max-h-full! h-full! [&>.closeBtn]:hidden rounded-none' : 'max-w-[800px]!'} flex flex-col`}>
                <DialogHeader className='block'>
                    <div className="flex flex-col gap-y-4">
                        <div className="flex items-center gap-4">
                            <DialogClose asChild>
                                <span className="md:hidden cursor-pointer">
                                    <PiArrowLeft className="text-2xl" />
                                </span>
                            </DialogClose>
                            <div className="space-y-2">
                                {
                                    isMobile ?
                                        <DialogTitle className="mb-0">{t('eventQuery')}</DialogTitle>
                                        :
                                        <DialogTitle>{t('planYourEvent')}</DialogTitle>
                                }
                                <Typography variant="caption" className="textSecondaryColor hidden md:block">
                                    {t('planYourEventDesc')}
                                </Typography>
                            </div>
                        </div>
                        <Divider width='bleed' />
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">

                    {/* Name */}
                    <Input
                        label={t('name')}
                        required
                        fullWidth
                        variant="default"
                        leftIcon={<PiUser className="text-xl textSecondaryColor" />}
                        placeholder="e.g, Jack Williams"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bodyBg rounded-lg textPrimaryColor"
                        error={errors.name}
                    />

                    {/* Email */}
                    <Input
                        label={t('email')}
                        required
                        fullWidth
                        type="email"
                        variant="default"
                        leftIcon={<PiEnvelope className="text-xl textSecondaryColor" />}
                        placeholder="e.g, JackWilliams11@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bodyBg rounded-lg textPrimaryColor"
                        error={errors.email}
                    />

                    {/* Phone Number */}
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


                    {
                        !isSingleHotel &&
                        <div className="w-full">
                            <label className="block text-sm md:text-base font-medium mb-1.5">
                                {t('hotelLocation')}
                            </label>
                            <Select value={formData.hotelLocation} onValueChange={(v) => setFormData(prev => ({ ...prev, hotelLocation: v }))}>
                                <SelectTrigger className="w-full h-auto border-gray-300 bodyBg rounded-lg px-4 py-3 text-sm textPrimaryColor focus:ring-2 focus:ring-(--primary-color) focus:primaryBorder">
                                    <div className="flex items-center gap-3 flex-1">
                                        <PiMapPin className="text-xl textSecondaryColor shrink-0" />
                                        <SelectValue placeholder="e.g, Bhuj, Ahmedabad" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="z-999999">
                                    <SelectGroup>
                                        {
                                            properties?.map((property) => {
                                                return <SelectItem key={property?.id} value={property?.slug}>
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-semibold text-gray-900 text-base first-letter:uppercase">{property.name}</span>
                                                        <span className="text-xs text-gray-500 font-normal">{property.city}{property.city ? ',' : ''} {property.country}</span>
                                                    </div>
                                                </SelectItem>
                                            })
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    }


                    {/* Message */}
                    <div className="w-full">
                        <label className="block text-sm md:text-base font-medium mb-1.5">
                            {t('message')}
                        </label>
                        <textarea
                            rows={5}
                            maxLength={MAX_MSG_LENGTH}
                            placeholder={t('messagePlaceholder')}
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            className={`w-full border bodyBg rounded-lg px-4 py-3 text-sm placeholder:textSecondaryColor textPrimaryColor focus:outline-none focus:ring-2 focus:ring-(--primary-color) focus:primaryBorder resize-none transition-all duration-200 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        <div className="flex items-center justify-between mt-1">
                            {errors.message
                                ? <p className="text-xs errorColor">{errors.message}</p>
                                : <span />}
                            <Typography variant="caption" className="textSecondaryColor text-xs">
                                {formData.message.length} / {MAX_MSG_LENGTH}
                            </Typography>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 mt-auto pt-2">
                        <DialogClose asChild>
                            <Button variant="outline" size="md" type="button">
                                {t('cancel')}
                            </Button>
                        </DialogClose>
                        <Button variant="primary" size="md" type="submit" loading={loading}>
                            {t('inquiryNow')}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog >
    )
}

export default EventFormModal
