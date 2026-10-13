'use client'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrorMessage'
import { useState, useRef, useEffect, useCallback } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { modalTypes } from "./PartnerRegistrationModals"
import { useIsMobile } from "@/hooks/useMobile"
import { toast } from '@/lib/toast';
import { sendEmailOtpApi, verifyOtpApi } from "@/api/client/apiRoutes"
import { useRegisterUserData } from "@/contexts/RegisterUserData"

// ─── Firebase Phone Auth Imports ──────────────────────────────────────────────
import { signInWithPhoneNumber, getAuth } from "firebase/auth"
import { useRecaptcha } from "@/hooks/useRecaptcha"
import { useTranslation } from '@/hooks/useTranslation'
import Divider from '@/components/storyBook/atoms/Divider'
import { Typography } from '@/components/storyBook/atoms/Typography'
import { Button } from '@/components/storyBook/atoms/Button'

interface OtpModalProps {
    openOtpModal: boolean;
    handleOpenModal: (modal: modalTypes) => void;
    handleCloseModal: (modal: modalTypes) => void;
    setOpenRegisterWithModal: () => void;
}

const OtpModal = ({ openOtpModal, handleOpenModal, handleCloseModal, setOpenRegisterWithModal }: OtpModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const { registerFormData: formData, setRegisterFormData: setFormData, } = useRegisterUserData();

    const auth = getAuth()

    const OTP_LENGTH = 6
    const RESEND_TIMER = 120

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
    const [resendTimer, setResendTimer] = useState(RESEND_TIMER)
    const [canResend, setCanResend] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [loading, setLoading] = useState<boolean>(false)


    // Determine which flow to use
    const isPhoneFlow = Boolean(formData.phone)

    const { generateRecaptcha, clearRecaptcha } = useRecaptcha(openOtpModal && isPhoneFlow)

    // ─── Firebase: send OTP via Firebase phone auth ───────────────────────────
    const sendFirebaseOtp = useCallback(async () => {
        try {
            setLoading(true)

            const fullPhone = `+${formData.phone}`

            clearRecaptcha()
            const recaptchaVerifier = generateRecaptcha()
            if (!recaptchaVerifier) {
                toast.error(t('failedToGenerateRecaptcha'))
                return
            }

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                fullPhone,
                recaptchaVerifier
            )

            window.confirmationResult = confirmationResult
            toast.success(t('optSent'))
        } catch (error: any) {
            toast.error(getFirebaseErrorMessage(error, t, 'otpSentFailed'))
            // Reset reCAPTCHA so user can retry
            clearRecaptcha()
        } finally {
            setLoading(false)
        }
    }, [formData.country_code, formData.phone, generateRecaptcha, clearRecaptcha, t, auth])

    // ─── Firebase: verify OTP entered by user ────────────────────────────────
    const verifyFirebaseOtp = useCallback(async () => {
        if (!window.confirmationResult) {
            toast.error(t('otpSessionExpired'))
            return
        }

        try {
            setLoading(true)
            const result = await window.confirmationResult.confirm(otp.join(''))
            const firebaseIdToken = await result.user.getIdToken()

            toast.success(t('otpVerificationSuccess'))
            setFormData((prev) => ({ ...prev, verifyToken: firebaseIdToken }))
            if (formData.isForgotPass) {
                handleCloseModal('otp');
                setOtp(Array(OTP_LENGTH).fill(''))
            }
            else {
                // Hand off straight to registration using the Firebase ID token
                handleOpenModal('register')
            }


        } catch (error: any) {
            toast.error(getFirebaseErrorMessage(error, t, 'otpVerificationFailed'))
        } finally {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp])


    // Reset timer and OTP every time modal opens
    useEffect(() => {
        if (openOtpModal) {
            setResendTimer(RESEND_TIMER)
            setCanResend(false)
            setOtp(Array(OTP_LENGTH).fill(''))
        }
    }, [openOtpModal])

    // ─── Countdown Timer (unchanged) ─────────────────────────────────────────
    useEffect(() => {
        if (resendTimer <= 0) {
            setCanResend(true)
            return
        }
        const interval = setInterval(() => {
            setResendTimer(prev => prev - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [resendTimer])

    const formatResendTimer = (timeInSeconds: number) => {
        if (timeInSeconds < 60) {
            return `${timeInSeconds} ${t('seconds')}`;
        }
        const m = Math.floor(timeInSeconds / 60);
        const s = timeInSeconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // ─── OTP Input Handlers (unchanged) ──────────────────────────────────────
    const handleChange = useCallback((index: number, value: string) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }, [otp])

    const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }, [otp])

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
        if (!pastedData) return

        const newOtp = [...otp]
        pastedData.split('').forEach((char, i) => {
            newOtp[i] = char
        })
        setOtp(newOtp)

        const focusIndex = Math.min(pastedData.length, OTP_LENGTH - 1)
        inputRefs.current[focusIndex]?.focus()
    }, [otp])

    const isOtpComplete = otp.every(digit => digit !== '')

    const handleChangeNumber = () => {
        handleCloseModal('otp');
        setOtp(Array(OTP_LENGTH).fill(''))
        setOpenRegisterWithModal();
    }

    // ─── Resend: branches on phone vs email ──────────────────────────────────
    const handleResend = async () => {
        setResendTimer(RESEND_TIMER)
        setCanResend(false)
        setOtp(Array(OTP_LENGTH).fill(''))
        inputRefs.current[0]?.focus()

        if (isPhoneFlow) {
            await sendFirebaseOtp()
            return
        }

        // ── Existing email OTP resend (unchanged) ────────────────────────────
        try {
            setLoading(true)

            const response = await sendEmailOtpApi({
                email: formData.email,
                purpose: formData.isForgotPass ? "password_reset" : "registration",
            })

            if (response && !response.error) {
                // toast.success(t('optSent'))
                toast.success(response?.message)
            } else {
                toast.error(response?.message || t('otpSentFailed'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setLoading(false)
        }
    }

    // ─── Verify: branches on phone vs email ──────────────────────────────────
    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isPhoneFlow) {
            await verifyFirebaseOtp()
            return
        }

        // ── Existing email OTP verify (unchanged) ────────────────────────────
        try {
            setLoading(true)

            const response = await verifyOtpApi({
                identifier: formData.email,
                otp: otp.join(''),
                purpose: 'partner_registration',
            })

            if (response && !response.error) {
                toast.success(t('otpVerificationSuccess'))
                setFormData((prev) => ({ ...prev, verifyToken: response?.data?.verification_token }))
                handleCloseModal('otp');
                setOtp(Array(OTP_LENGTH).fill(''))
                setOpenRegisterWithModal();
                handleOpenModal('register')
            } else {
                toast.error(response?.message || t('otpVerificationFailed'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setLoading(false)
        }
    }

    const handleCloseOptModal = () => {
        handleCloseModal('otp');
        setOtp(Array(OTP_LENGTH).fill(''))
        setFormData((prev) => ({ ...prev, isForgotPass: false }))
    }

    return (
        <Dialog open={openOtpModal} onOpenChange={(open) => {
            if (open) handleOpenModal('otp');
            else handleCloseOptModal();
        }}>
            <DialogContent className={`overflow-x-hidden overflow-y-auto overscroll-y-contain ${isMobile ? 'max-w-full! max-h-full! h-full! rounded-none justify-between' : 'max-w-150!'} flex flex-col gap-6`}>

                <div id='recaptcha-container-otp-modal' style={{ display: 'none' }} />

                <div className="flex flex-col gap-6">
                    <DialogHeader>
                        <DialogTitle>{t('otpVerification')}</DialogTitle>
                    </DialogHeader>
                    <Divider width="bleed" />

                    <div className="flex flex-col gap-6">
                        <div className="space-y-2">

                            <Typography variant="h6" weight="medium">{t('otpVerificationCode')}</Typography>
                            {/* Description with phone number and change link */}
                            <div className="flex items-center justify-between gap-y-4 gap-2 flex-wrap">
                                <Typography variant="caption" className="textSecondaryColor">
                                    {t('enterOtpCodeSentTo')} <span className="font-semibold textPrimaryColor">{formData.email ? formData.email : `+${formData.dialCode} ${formData.phone.slice(formData.country_code.length)}`}</span>
                                </Typography>
                                <Button variant="ghost" type="button" size="sm" className="primaryColor! cursor-pointer whitespace-nowrap primaryLightBg! shrink-0" onClick={handleChangeNumber}>
                                    {
                                        formData.email ? t('changeEmail') : t('changeNumber')
                                    }
                                </Button>
                            </div>
                        </div>
                        <form onSubmit={handleVerify} className="flex flex-col gap-6">

                            {/* OTP Input Boxes */}
                            <div className="flex items-center justify-between">
                                {otp.map((digit, index) => (
                                    <div key={index} className="flex items-center gap-1 sm:gap-2 md:gap-4">
                                        <input
                                            ref={(el) => { inputRefs.current[index] = el }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={index === 0 ? handlePaste : undefined}
                                            className="w-9 h-9 sm:w-11 sm:h-12 md:w-14.5 md:h-14.5 text-center text-base sm:text-lg font-semibold border border-black rounded-lg textPrimaryColor focus:primaryBorder focus:ring-1 focus:ring-(--primary-color) focus:outline-none focus:shadow-[0px_0px_0px_3px_var(--primary-color-50)] transition-all duration-200"
                                            aria-label={`OTP digit ${index + 1}`}
                                        />
                                        {index < OTP_LENGTH - 1 && (
                                            <span className="textSecondaryColor text-base sm:text-lg font-medium">-</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                {/* Verify OTP Button */}
                                <Button
                                    variant="primary"
                                    size="md"
                                    className="w-full"
                                    disabled={!isOtpComplete || loading}
                                    // onClick={handleVerify}
                                    type="submit"
                                    loading={loading}
                                >
                                    {t('verifyOtp')}
                                </Button>

                                {/* Resend Code Timer */}
                                <div className="flex items-center justify-center">
                                    {canResend ? (
                                        <button type="button" onClick={handleResend}>
                                            <Typography variant="caption" className="primaryColor! font-medium cursor-pointer">
                                                {t('resendCode')}
                                            </Typography>
                                        </button>
                                    ) : (
                                        <Typography variant="caption" className="textPrimaryColor">
                                            {t('resendCodeIn')} <span className="primaryColor! font-semibold">{formatResendTimer(resendTimer)}</span>
                                        </Typography>
                                    )}
                                </div>
                            </div>
                        </form>


                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default OtpModal
