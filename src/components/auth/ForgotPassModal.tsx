'use client'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrorMessage'
import { useCallback, useState } from "react"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "@/hooks/useTranslation"
import { PiEnvelope } from "react-icons/pi"
import Divider from "../storyBook/atoms/Divider"
import Input from "../storyBook/atoms/Input/Input"
import { Button } from "../storyBook/atoms/Button"
import { Typography } from "../storyBook/atoms/Typography"
import AgreedConditionsText from "./AgreedConditionsText"
import { modalTypes } from "./AuthModals"
import { useIsMobile } from "@/hooks/useMobile"
import { sendEmailOtpApi } from "@/api/client/apiRoutes"
import { toast } from '@/lib/toast';
import { useRegisterUserData } from "@/contexts/RegisterUserData"
import { firebaseAuth } from "@/utils/Firebase"
import { useRecaptcha } from "@/hooks/useRecaptcha"
import { signInWithPhoneNumber } from "firebase/auth"
import { PhoneInput } from "../storyBook/atoms/PhoneInput"
import { isValidPhoneNumber } from 'libphonenumber-js'

type ForgotPassErrors = Partial<Record<string, string>>

interface ForgotPassModalProps {
    openForgotPassModal: boolean;
    handleOpenModal: (modal: modalTypes) => void;
    handleCloseModal: (modal: modalTypes) => void;
    setOpenOtpModal: () => void;
    continueWithEmail: boolean;
}

const ForgotPassModal = ({ openForgotPassModal, handleOpenModal, handleCloseModal, setOpenOtpModal, continueWithEmail }: ForgotPassModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const [errors, setErrors] = useState<ForgotPassErrors>({})
    const [loading, setLoading] = useState<boolean>(false)

    // ─── Zod Schema (inside component for t() access) ────────────────────────
    const forgotPassSchema = z.object({
        ...(continueWithEmail ? { email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')) } : { phone: z.string().min(8, t('phoneMinLength')) }),
    });

    const auth = firebaseAuth;

    // Determine which flow to use
    const isPhoneFlow = !continueWithEmail;
    const { generateRecaptcha, clearRecaptcha } = useRecaptcha(openForgotPassModal && isPhoneFlow)

    const { registerFormData: formData, setRegisterFormData: setFormData } = useRegisterUserData();

    const identifier = formData.email ? formData.email : formData.phone.slice(formData.country_code.length);

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

        const result = forgotPassSchema.safeParse(
            continueWithEmail ? { email: formData.email } : { phone: formData.phone }
        )
        if (!result.success) {
            const fieldErrors: ForgotPassErrors = {}
            result.error.issues.forEach((err: z.ZodIssue) => {
                const field = err.path[0] as string
                if (!fieldErrors[field]) fieldErrors[field] = err.message
            })
            setErrors(fieldErrors)
            return false
        }
        setErrors({})
        return true
    }, [identifier, forgotPassSchema,continueWithEmail])


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
            setOpenOtpModal()
            handleCloseModal('forgotPass')
        } catch (error: any) {
            toast.error(getFirebaseErrorMessage(error, t, 'otpSentFailed'))
            console.log('error in send otp firebase =>', error)
            // Reset reCAPTCHA so user can retry
            clearRecaptcha()
        } finally {
            setLoading(false)
        }
    }, [formData.phone, generateRecaptcha, clearRecaptcha, t, auth, setOpenOtpModal, handleCloseModal])



    const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // First validate the form
        const isValid = handleValidateForm()
        if (!isValid) return

        setFormData((prev) => ({ ...prev, isForgotPass: true }))

        if (isPhoneFlow) {
            await sendFirebaseOtp()
            return
        }

        try {
            setLoading(true)

            const response = await sendEmailOtpApi({
                email: identifier,
                purpose: "password_reset",
            })

            if (response && !response.error) {
                toast.success(response?.message)
                setOpenOtpModal()
                handleCloseModal('forgotPass')
            } else {
                toast.error(response?.message || t('otpSentFailed'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setLoading(false)
        }
    }


    return (
        <Dialog open={openForgotPassModal} onOpenChange={(open) => {
            if (open) handleOpenModal('forgotPass');
            else handleCloseModal('forgotPass');
        }}>
            <DialogContent className={`overflow-x-hidden overflow-y-auto overscroll-y-contain ${isMobile ? 'max-w-full! max-h-full! h-full! rounded-none justify-between' : 'max-w-150!'} flex flex-col gap-6`}>
                <div id='recaptcha-container-otp-modal' style={{ display: 'none' }} />
                <div className="flex flex-col gap-6">
                    <DialogHeader>
                        <DialogTitle>{t('resetPassword')}</DialogTitle>
                    </DialogHeader>
                    <Divider width="bleed" />
                    <div className="flex flex-col gap-6">
                        {/* Subtitle */}
                        <div>
                            <Typography variant="h6" weight="medium" className="textPrimaryColor!">
                                {t('forgotPasswordQuestion')}
                            </Typography>
                            <Typography variant="caption" weight="regular" className="mt-1 text-sm!">
                                {continueWithEmail ? t('forgotPasswordDesc') : t('forgotPasswordDescPhone')}
                            </Typography>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSendOtp}>
                            <div className="flex flex-col gap-6">
                                {
                                    continueWithEmail ?
                                        <Input
                                            label={t('email')}
                                            fullWidth
                                            required
                                            type="email"
                                            variant="default"
                                            leftIcon={<PiEnvelope className="text-xl textSecondaryColor" />}
                                            placeholder="e.g, JackWilliams11@gmail.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bodyBg rounded-lg textPrimaryColor"
                                            error={errors.email}
                                        />
                                        :
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
                                }

                                {/* Submit */}
                                <div className="flexColCenter gap-3">
                                    <Button variant="primary" size="md" type="submit" className="w-full" loading={loading}>
                                        {t('resetMyPassword')}
                                    </Button>
                                    <span
                                        className="textPrimaryColor cursor-pointer"
                                        onClick={() => { handleCloseModal('forgotPass'); handleOpenModal('signin'); }}
                                    >
                                        {t('backToLogin')}
                                    </span>
                                </div>
                            </div>
                        </form>

                        {/* Terms Footer */}
                    </div>
                </div>
                <AgreedConditionsText />
            </DialogContent>
        </Dialog>
    )
}

export default ForgotPassModal
