'use client'
import { useState, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { useTranslation } from "@/hooks/useTranslation"
import { PiEnvelope, PiPhone, PiArrowRight } from "react-icons/pi"
import { sendEmailOtpApi } from "@/api/client/apiRoutes"
import { toast } from '@/lib/toast';
import { useIsMobile } from "@/hooks/useMobile"
import { useSelector } from "react-redux"
import { useRegisterUserData } from "@/contexts/RegisterUserData"
import { firebaseAuth } from "@/utils/Firebase"
import { settingsSelector } from "@/redux/reducers/settingsSlice"
import { isValidPhoneNumber } from "libphonenumber-js";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrorMessage"
import { ConfirmationResult, signInWithPhoneNumber } from "firebase/auth"
import { useRecaptcha } from "@/hooks/useRecaptcha"
import { modalTypes } from "./PartnerRegistrationModals"
import Divider from "@/components/storyBook/atoms/Divider"
import Input from "@/components/storyBook/atoms/Input/Input"
import { PhoneInput } from "@/components/storyBook/atoms/PhoneInput"
import { Typography } from "@/components/storyBook/atoms/Typography"
import { Button } from "@/components/storyBook/atoms/Button"
import Link from "next/link"

type SigninErrors = Partial<Record<string, string>>

declare global {
    interface Window {
        confirmationResult: ConfirmationResult;
    }
}

interface RegisterWithModalProps {
    openRegisterWithModal: boolean;
    handleOpenModal: (modal: modalTypes) => void;
    handleCloseModal: (modal: modalTypes) => void;
    continueWithEmail: boolean;
    setContinueWithEmail: (value: boolean) => void;
    hideTrigger?: boolean;
}

const RegisterWithModal = ({ openRegisterWithModal, handleOpenModal, handleCloseModal, continueWithEmail, setContinueWithEmail, hideTrigger = false }: RegisterWithModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const auth = firebaseAuth
    const settingsData = useSelector(settingsSelector);
    const allowMethods = settingsData?.general_config?.allow_auth_methods;
    const isPhoneLoginAllowed = allowMethods?.includes("phone");
    const isEmailLoginAllowed = allowMethods?.includes("email_password");

    const { registerFormData: formData, setRegisterFormData: setFormData } = useRegisterUserData();

    const [errors, setErrors] = useState<SigninErrors>({})
    const [loading, setLoading] = useState<boolean>(false)

    const isPhoneFlow = !continueWithEmail
    const { generateRecaptcha, clearRecaptcha } = useRecaptcha(openRegisterWithModal && isPhoneFlow)

    // ─── Zod Schema (inside component for t() access) ────────────────────────
    const emailSchema = z.object({
        email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
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
        if (isPhoneFlow) {
            return validatePhoneNumber()
        }

        const result = emailSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: SigninErrors = {}
            result.error.issues.forEach((err: z.ZodIssue) => {
                const field = err.path[0] as string
                if (!fieldErrors[field]) fieldErrors[field] = err.message
            })
            setErrors(fieldErrors)
            return false
        }
        setErrors({})
        return true
    }, [formData, emailSchema, isPhoneFlow])

    // ─── Firebase: send OTP via Firebase phone auth ───────────────────────────
    const sendFirebaseOtp = useCallback(async () => {
        try {
            setLoading(true)

            const fullPhone = `+${formData.phone}`

            const recaptchaVerifier = generateRecaptcha()
            if (!recaptchaVerifier) {
                toast.error(t('somethingWentWrong'))
                return
            }

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                fullPhone,
                recaptchaVerifier
            )

            window.confirmationResult = confirmationResult
            toast.success(t('optSent'))
            handleOpenModal('otp')
            handleCloseModal('registerWith')
        } catch (error: any) {
            toast.error(getFirebaseErrorMessage(error, t, 'otpSentFailed'))
            // Reset reCAPTCHA so user can retry
            clearRecaptcha()
        } finally {
            setLoading(false)
        }
    }, [formData.phone, generateRecaptcha, clearRecaptcha, t, auth, handleOpenModal, handleCloseModal])

    const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = handleValidateForm()
        if (!isValid) return

        if (isPhoneFlow) {
            await sendFirebaseOtp()
            return
        }

        try {
            setLoading(true)

            const response = await sendEmailOtpApi({
                email: formData.email,
                purpose: "partner_registration",
            })

            if (response && !response.error) {
                toast.success(response?.message)
                handleOpenModal('otp')
                handleCloseModal('registerWith')
            } else {
                toast.error(response?.message || t('otpSentFailed'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setLoading(false)
        }
    }

    const handleSwitchToPhone = () => {
        setContinueWithEmail(false)
        setErrors({})
        setFormData(prev => ({
            ...prev,
            email: "",
            phone: "",
            dialCode: settingsData?.general_config?.country_dial_code,
            country_code: settingsData?.general_config?.country_code,
        }))
    }

    const handleSwitchToEmail = () => {
        setContinueWithEmail(true)
        setErrors({})
        setFormData(prev => ({
            ...prev,
            phone: "",
            dialCode: settingsData?.general_config?.country_dial_code,
            country_code: settingsData?.general_config?.country_code,
            email: "",
        }))
    }

    return (
        <Dialog open={openRegisterWithModal} onOpenChange={(open) => {
            if (open) handleOpenModal('registerWith');
            else handleCloseModal('registerWith');
        }}>
            {!hideTrigger && (
                <DialogTrigger className="secondaryBg text-white btn_md flexCenter gap-2">
                    {t('startListingNow')} <PiArrowRight className='text-xl rtl:rotate-180' />
                </DialogTrigger>
            )}
            <DialogContent className={`overflow-x-hidden overflow-y-auto overscroll-y-contain ${isMobile ? 'max-w-full! max-h-full! h-full! rounded-none justify-between' : 'max-w-150!'} flex flex-col gap-6 `}>
                <div id='recaptcha-container-otp-modal' style={{ display: 'none' }} />
                <div className="flex flex-col gap-6">

                    <DialogHeader>
                        <DialogTitle>{t('registerAsPartner')}</DialogTitle>
                        {
                            (isPhoneLoginAllowed || isEmailLoginAllowed) &&
                            <DialogDescription>
                                {t('registerAsPartnerDesc')}
                            </DialogDescription>
                        }
                    </DialogHeader>
                    <Divider width="bleed" />
                    <div className="flex flex-col gap-6">
                        {
                            (isPhoneLoginAllowed || isEmailLoginAllowed) &&
                            <form onSubmit={handleSendOtp}>
                                <div className="flex flex-col gap-6">
                                    <AnimatePresence mode="wait">
                                        {continueWithEmail ? (
                                            <motion.div
                                                key="email"
                                                initial={{ x: 40, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: -40, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                            >
                                                <Input
                                                    label={t('email')}
                                                    fullWidth
                                                    required
                                                    type="email"
                                                    variant="default"
                                                    leftIcon={<PiEnvelope className="text-xl textSecondaryColor" />}
                                                    placeholder="e.g, JackWilliams11@gmail.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                    className="bodyBg rounded-lg textPrimaryColor"
                                                    error={errors.email}
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="phone"
                                                initial={{ x: -40, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: 40, opacity: 0 }}
                                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                            >
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Submit */}
                                    <div className="flexColCenter gap-2">
                                        <Button variant="primary" size="md" type="submit" className="w-full" loading={loading}>
                                            {t('sendOtp')}
                                        </Button>
                                        <Typography variant="caption" className="flexCenter gap-1 textPrimaryColor!">
                                            {t('alreadyPartner')}
                                            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/public/partner/login`} target="_blank" className="cursor-pointer flexCenter">
                                                <Typography variant="caption" className="primaryColor! font-medium text-base!">
                                                    {t('signIn')}
                                                </Typography>
                                            </Link>
                                        </Typography>
                                    </div>

                                </div>
                            </form>
                        }

                        {/* OR Divider */}
                        {
                            (isPhoneLoginAllowed || isEmailLoginAllowed) && (isEmailLoginAllowed && isPhoneLoginAllowed) &&
                            <div className="flex items-center gap-4">
                                <div className="flex-1 border-t border-dashed border-gray-300" />
                                <Typography variant="caption" className="textSecondaryColor bodyBg w-10 h-10 flexCenter rounded-full border text-sm!">
                                    {t('or')}
                                </Typography>
                                <div className="flex-1 border-t border-dashed border-gray-300" />
                            </div>
                        }
                        <div className="flex flex-col gap-6">
                            {/* Social Login Buttons */}
                            <div className="flex flex-col gap-4">
                                {
                                    isPhoneLoginAllowed && continueWithEmail ?
                                        <Button
                                            variant="outline"
                                            size="md"
                                            className="border-[#EDEDED]!"
                                            leftIcon={<PiPhone className="text-xl" />}
                                            onClick={handleSwitchToPhone}
                                        >
                                            {t('continueWithPhone')}
                                        </Button>
                                        :
                                        isEmailLoginAllowed && isPhoneLoginAllowed &&
                                        <Button
                                            variant="outline"
                                            size="md"
                                            className="border-[#EDEDED]!"
                                            leftIcon={<PiEnvelope className="text-xl" />}
                                            onClick={handleSwitchToEmail}
                                        >
                                            {t('continueWithEmail')}
                                        </Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent >
        </Dialog >
    )
}

export default RegisterWithModal
