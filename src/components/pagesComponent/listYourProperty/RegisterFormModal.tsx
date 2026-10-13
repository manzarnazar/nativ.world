'use client'
import { useCallback, useEffect, useState } from "react"
import { z } from "zod"
import { format } from "date-fns"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formateDate, formateDateForApi, parseCustomDate } from "@/utils/helpers"
import { useTranslation } from "@/hooks/useTranslation"
import { PiUserCircle, PiLock, PiEye, PiEyeSlash, PiEnvelope, PiCheckCircleFill, PiCalendarBlank } from "react-icons/pi"
import { useIsMobile } from "@/hooks/useMobile"
// ─── Firebase Phone Auth Imports ──────────────────────────────────────────────
import { ConfirmationResult } from "firebase/auth"
import { isValidPhoneNumber } from 'libphonenumber-js'
import Divider from '@/components/storyBook/atoms/Divider'
import Input from '@/components/storyBook/atoms/Input/Input'
import { Typography } from '@/components/storyBook/atoms/Typography'
import { Button } from '@/components/storyBook/atoms/Button'
import AgreedConditionsText from '@/components/auth/AgreedConditionsText'
import { PhoneInput } from '@/components/storyBook/atoms/PhoneInput'
import { toast } from "@/lib/toast"
import { parnterRegisterApi } from "@/api/client/apiRoutes"
import { useRegisterUserData } from "@/contexts/RegisterUserData"
import type { modalTypes } from "./PartnerRegistrationModals"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { currentLangCodeSelector } from "@/redux/reducers/languageSlice"


type RegisterErrors = Partial<Record<string, string>>

type RegisterFormModalProps = {
    handleCloseModal: (modal: modalTypes) => void
    continueWithEmail: boolean;
    open: boolean;
}

declare global {
    interface Window {
        confirmationResult: ConfirmationResult;
    }
}


const RegisterFormModal = ({ open, handleCloseModal, continueWithEmail }: RegisterFormModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const partnerPanelUrl = `${process.env.NEXT_PUBLIC_API_URL}/public/partner/login`
    const router = useRouter();
    const langCode = useSelector(currentLangCodeSelector);

    const { registerFormData: contextData, resetRegisterFormData } = useRegisterUserData();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        country_code: contextData?.country_code,
        dialCode: contextData?.dialCode,
        phone: contextData?.phone,
        email: contextData?.email,
        dob: '',
        password: "",
        confirmPassword: ""
    })


    const [verificationToken, setVerificationToken] = useState<string | undefined>()

    const isPhoneFlow = Boolean(formData.phone)

    const [errors, setErrors] = useState<RegisterErrors>({})
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [dobPickerOpen, setDobPickerOpen] = useState<boolean>(false)

    const today = new Date()
    const maxDob = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
    const minDob = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())

    const passwordRules = [
        { label: t('passwordMinLength'), met: formData.password.length >= 8 },
        { label: t('passwordHasLetter'), met: /[A-Za-z]/.test(formData.password) },
        { label: t('passwordHasNumber'), met: /\d/.test(formData.password) },
        { label: t('passwordHasSpecial'), met: /[^A-Za-z0-9]/.test(formData.password) },
    ]

    // ─── Zod Schema (inside component for t() access) ────────────────────────
    const registerSchema = z.object({
        firstName: z.string().min(1, t('firstNameRequired')),
        lastName: z.string().min(1, t('lastNameRequired')),
        ...(continueWithEmail
            ? {
                email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
                phone: z.string().optional().or(z.literal('')),
            }
            : {
                phone: z.string().min(8, t('phoneMinLength')),
                email: z.string().email(t('invalidEmail')).optional().or(z.literal('')),
            }
        ),
        dob: z.string().min(1, t('dateOfBirthRequired')),
        password: z.string()
            .min(8, t('passwordMinLength'))
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])/, t('passwordComplexity') || "Password must contain at least one letter, one number and one special character"),
        confirmPassword: z.string().min(1, t('confirmPasswordRequired')),
    }).refine((data) => {
        return (data as any).password === (data as any).confirmPassword;
    }, {
        message: t('passwordsDoNotMatch'),
        path: ['confirmPassword'],
    })

    const handleChangePhone = (value: string, data: any) => {
        const dialCode = data.dialCode;
        const countryCode = data.countryCode;
        setFormData(prev => ({
            ...prev,
            phone: value,
            country_code: countryCode,
            dialCode: dialCode
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
        if (!continueWithEmail && !validatePhoneNumber()) {
            return false
        }

        const result = registerSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: RegisterErrors = {}
            result.error.issues.forEach((err: z.ZodIssue) => {
                const field = err.path[0] as string
                if (!fieldErrors[field]) fieldErrors[field] = err.message
            })
            setErrors(fieldErrors)
            return false
        }
        setErrors({})
        return true
    }, [formData, registerSchema, continueWithEmail])

    const handleClose = () => {
        handleCloseModal('register')
    }

    const handleRegisterParnter = async (e: React.FormEvent) => {
        e.preventDefault()

        // First validate the form
        const isValid = handleValidateForm()
        if (!isValid) return

        try {
            setLoading(true)

            const phoneNumber = formData.phone.slice(formData.country_code.length)

            const response = await parnterRegisterApi({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: phoneNumber,
                dial_code: `+${formData.dialCode}`,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
                ...(!isPhoneFlow && { verification_token: verificationToken }),
                firebase_id_token: verificationToken,
                dob: formateDateForApi(formData.dob),
            })

            if (response && !response.error) {
                window.open(partnerPanelUrl, '_blank')
                router.push(`/${langCode}`)

                resetRegisterFormData()
                handleClose()
                setFormData({
                    firstName: '',
                    lastName: '',
                    country_code: "",
                    dialCode: "",
                    phone: "",
                    email: "",
                    dob: '',
                    password: "",
                    confirmPassword: "",
                })
            } else {
                toast.error(response?.message || t('registrationFailed'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log(contextData)
        setFormData({
            firstName: '',
            lastName: '',
            country_code: contextData?.country_code,
            dialCode: contextData?.dialCode,
            phone: contextData?.phone,
            email: contextData?.email,
            dob: '',
            password: "",
            confirmPassword: "",
        })
        setVerificationToken(contextData?.verifyToken)
    }, [contextData])


    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className={`overflow-x-hidden overflow-y-auto overscroll-y-contain ${isMobile ? 'max-w-full! max-h-full! h-full! rounded-none justify-between' : 'max-w-200!'} flex flex-col gap-6`}>
                <div id='recaptcha-container-otp-modal' style={{ display: 'none' }} />
                <div className="flex flex-col gap-6">
                    <DialogHeader>
                        <DialogTitle>{t('signupWith')} {continueWithEmail ? t('emailAdd') : t('phoneNumber')}</DialogTitle>
                        <DialogDescription className="">
                            {t('createYourAccWith')} <span className="lowercase">{continueWithEmail ? t('emailAdd') : t('phoneNumber')}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <Divider width="bleed" />
                    <div className="flex flex-col gap-6">
                        <form
                            onSubmit={handleRegisterParnter}
                        >
                            <div className="flex flex-col gap-6">

                                {/* First Name / Last Name */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label={t('firstName')}
                                        required
                                        fullWidth
                                        type="text"
                                        variant="default"
                                        leftIcon={<PiUserCircle className="text-xl textSecondaryColor" />}
                                        placeholder="e.g, Jack"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        className="bodyBg rounded-lg textPrimaryColor"
                                        error={errors.firstName}
                                    />
                                    <Input
                                        label={t('lastName')}
                                        required
                                        fullWidth
                                        type="text"
                                        variant="default"
                                        leftIcon={<PiUserCircle className="text-xl textSecondaryColor" />}
                                        placeholder="e.g, Williams"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        className="bodyBg rounded-lg textPrimaryColor"
                                        error={errors.lastName}
                                    />
                                </div>

                                {/* Phone Number */}
                                <PhoneInput
                                    label={t('phoneNumber')}
                                    required={!continueWithEmail}
                                    fullWidth
                                    value={formData.phone}
                                    onChange={handleChangePhone}
                                    enableSearch
                                    searchPlaceholder="Search country..."
                                    error={errors.phone}
                                    disabled={!continueWithEmail}
                                />

                                {/* Email */}
                                <Input
                                    label={t('email')}
                                    required={continueWithEmail}
                                    fullWidth
                                    type="email"
                                    variant="default"
                                    leftIcon={<PiEnvelope className="text-xl textSecondaryColor" />}
                                    placeholder="e.g, JackWilliams11@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="bodyBg rounded-lg textPrimaryColor"
                                    error={errors.email}
                                    disabled={continueWithEmail}
                                />

                                {/* Date of Birth */}
                                <Popover open={dobPickerOpen} onOpenChange={setDobPickerOpen}>
                                    <PopoverTrigger asChild>
                                        <div className="cursor-pointer">
                                            <Input
                                                label={t('dateOfBirth')}
                                                required
                                                fullWidth
                                                readOnly
                                                type="text"
                                                variant="default"
                                                rightIcon={<PiCalendarBlank className="text-xl textSecondaryColor" />}
                                                placeholder="e.g, 04/02/2026"
                                                value={formData.dob ? format(parseCustomDate(formData.dob) as Date, 'dd/MM/yyyy') : ''}
                                                className="bodyBg rounded-lg textPrimaryColor cursor-pointer"
                                                error={errors.dob}
                                                helperText={t('dobHelperText')}
                                            />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 z-100000000!" align="start">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown"
                                            selected={parseCustomDate(formData.dob) ?? undefined}
                                            defaultMonth={parseCustomDate(formData.dob) ?? maxDob}
                                            startMonth={minDob}
                                            endMonth={maxDob}
                                            disabled={{ after: maxDob, before: minDob }}
                                            onSelect={(date) => {
                                                if (!date) return
                                                setFormData(prev => ({ ...prev, dob: formateDate(date) }))
                                                setDobPickerOpen(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                {/* Password */}
                                {
                                    <div className="flex flex-col gap-2">
                                        <Input
                                            label={t('password')}
                                            required
                                            fullWidth
                                            type={showPassword ? "text" : "password"}
                                            variant="default"
                                            leftIcon={<PiLock className="text-xl textSecondaryColor" />}
                                            rightIcon={
                                                showPassword
                                                    ? <PiEye className="text-xl textSecondaryColor" />
                                                    : <PiEyeSlash className="text-xl textSecondaryColor" />
                                            }
                                            onRightIconClick={() => setShowPassword(prev => !prev)}
                                            placeholder="••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            className="bodyBg rounded-lg textPrimaryColor"
                                        />
                                        {formData.password.length > 0 && (
                                            <div className="flex flex-col gap-1.5 px-1">
                                                {passwordRules.map((rule) => (
                                                    <div key={rule.label} className="flex items-center gap-2">
                                                        {rule.met
                                                            ? <PiCheckCircleFill className="text-base shrink-0 successColor" />
                                                            : <span className="w-4 h-4 shrink-0 rounded-full border-2 border-gray-300 inline-block" />
                                                        }
                                                        <Typography variant="caption" className={rule.met ? 'successColor!' : 'textSecondaryColor!'}>
                                                            {rule.label}
                                                        </Typography>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                }

                                {/* Confirm Password */}
                                {
                                    <Input
                                        label={t('confirmPassword')}
                                        required
                                        fullWidth
                                        type={showConfirmPassword ? "text" : "password"}
                                        variant="default"
                                        leftIcon={<PiLock className="text-xl textSecondaryColor" />}
                                        rightIcon={
                                            showConfirmPassword
                                                ? <PiEye className="text-xl textSecondaryColor" />
                                                : <PiEyeSlash className="text-xl textSecondaryColor" />
                                        }
                                        onRightIconClick={() => setShowConfirmPassword(prev => !prev)}
                                        placeholder="••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        className="bodyBg rounded-lg textPrimaryColor"
                                        error={errors.confirmPassword}
                                    />
                                }

                                {/* Submit */}
                                <div className="flexColCenter gap-2">
                                    <Button variant="primary" size="md" type="submit" className="w-full" loading={loading}>
                                        {t('continue')}
                                    </Button>
                                    <div className="mt-2">
                                        <Typography variant="caption" className="flexCenter gap-1 textPrimaryColor!">
                                            {t('alreadyHaveAcc')}
                                            <Link href={partnerPanelUrl} target="_blank"
                                                className="cursor-pointer flexCenter">
                                                <Typography variant="caption" className="primaryColor! font-medium">
                                                    {t('signIn')}
                                                </Typography>
                                            </Link>
                                        </Typography>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
                <AgreedConditionsText listPropPage={true} />
            </DialogContent>
        </Dialog>
    )
}

export default RegisterFormModal
