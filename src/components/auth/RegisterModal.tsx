'use client'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrorMessage'
import { useCallback, useEffect, useState } from "react"
import { useRegisterUserData } from "@/contexts/RegisterUserData"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "@/hooks/useTranslation"
import { PiUserCircle, PiLock, PiEye, PiEyeSlash, PiEnvelope, PiGift, PiCheckCircleFill } from "react-icons/pi"
import Divider from "../storyBook/atoms/Divider"
import Input from "../storyBook/atoms/Input/Input"
import { Button } from "../storyBook/atoms/Button"
import { Typography } from "../storyBook/atoms/Typography"
import { useIsMobile } from "@/hooks/useMobile"
import { sendEmailOtpApi, updateProfileApi } from "@/api/client/apiRoutes"
import { toast } from '@/lib/toast';
import { useDispatch, useSelector } from "react-redux"
import { setUserData, userDataSelector } from "@/redux/reducers/userSlice"
import { userDetailsType } from "@/types/GlobalTypes"
import { isNewUserSelector, setIsNewUser } from "@/redux/reducers/userSlice"
import { referralSettingsSelector } from "@/redux/reducers/settingsSlice"
// ─── Firebase Phone Auth Imports ──────────────────────────────────────────────
import { ConfirmationResult, signInWithPhoneNumber } from "firebase/auth"
import { firebaseAuth } from "@/utils/Firebase"
import { useRecaptcha } from "@/hooks/useRecaptcha"
import AgreedConditionsText from "./AgreedConditionsText"
import { PhoneInput } from "../storyBook/atoms/PhoneInput"
import { isValidPhoneNumber } from 'libphonenumber-js'


type RegisterErrors = Partial<Record<string, string>>

type RegisterModalProps = {
    openRegisterModal: boolean;
    setOpenRegisterModal: (open: boolean) => void;
    handleCloseModal: (modal: 'signin' | 'register') => void
    handleOpenModal: (modal: 'signin' | 'register') => void
    continueWithEmail: boolean;
    setOpenOtpModal: () => void;
}

declare global {
    interface Window {
        confirmationResult: ConfirmationResult;
    }
}


const RegisterModal = ({ handleCloseModal, handleOpenModal, openRegisterModal, setOpenRegisterModal, continueWithEmail, setOpenOtpModal }: RegisterModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const dispatch = useDispatch();

    const userDetails = useSelector(userDataSelector) as userDetailsType;
    const referralSettings = useSelector(referralSettingsSelector);

    const isNewsUser = useSelector(isNewUserSelector);

    const { registerFormData: formData, setRegisterFormData: setFormData } = useRegisterUserData();
    const auth = firebaseAuth;

    // Determine which flow to use
    const isPhoneFlow = !continueWithEmail && !isNewsUser;
    const { generateRecaptcha, clearRecaptcha } = useRecaptcha(openRegisterModal && isPhoneFlow)

    const [errors, setErrors] = useState<RegisterErrors>({})
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const passwordRules = [
        { label: t('passwordMinLength'), met: formData.password.length >= 8 },
        { label: t('passwordHasLetter'), met: /[A-Za-z]/.test(formData.password) },
        { label: t('passwordHasNumber'), met: /\d/.test(formData.password) },
        { label: t('passwordHasSpecial'), met: /[^A-Za-z0-9]/.test(formData.password) },
    ]

    // ─── Zod Schema (inside component for t() access) ────────────────────────
    const registerSchema = z.object({
        name: z.string().min(1, t('nameRequired')),
        ...(continueWithEmail && !isNewsUser
            ? { email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')) }
            : !isNewsUser ? { phone: z.string().min(8, t('phoneMinLength')) } : {}
        ),
        ...(!isNewsUser ? {
            password: z.string()
                .min(8, t('passwordMinLength'))
                .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])/, t('passwordComplexity') || "Password must contain at least one letter, one number and one special character"),
            confirmPassword: z.string().min(1, t('confirmPasswordRequired')),
        } : {}),
        referralCode: z.string().optional(),
    }).refine((data) => {
        if (!isNewsUser) {
            return (data as any).password === (data as any).confirmPassword;
        }
        return true;
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


    // phone otp code 

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
            handleCloseModal('register')
        } catch (error: any) {
            toast.error(getFirebaseErrorMessage(error, t, 'otpSentFailed'))
            // Reset reCAPTCHA so user can retry
            clearRecaptcha()
        } finally {
            setLoading(false)
        }
    }, [formData.phone, generateRecaptcha, clearRecaptcha, t, auth, setOpenOtpModal, handleCloseModal])


    const updateProfile = async () => {
        try {
            setLoading(true)

            const response = await updateProfileApi({
                name: formData.name,
                referral_code: formData.referralCode
            })

            if (response && !response.error) {
                dispatch(setUserData(response?.data?.user));
                toast.success(t('profileUpdated'))
                handleCloseModal('register')
                dispatch(setIsNewUser(false))
                setFormData({
                    name: "",
                    country_code: "",
                    dialCode: "",
                    phone: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    referralCode: "",
                })
            } else {
                toast.error(response?.message || t('profileUpdateFailed'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setLoading(false)
        }
    }


    const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isNewsUser) {
            await updateProfile()
            return
        }

        // First validate the form
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
                purpose: "registration",
            })

            if (response && !response.error) {
                // toast.success(t('optSent'))
                toast.success(response?.message)
                setOpenOtpModal()
                handleCloseModal('register')
            } else {
                toast.error(response?.message || t('otpSentFailed'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isNewsUser && userDetails?.name) {
            setFormData(prev => ({ ...prev, name: userDetails.name }))
        }
    }, [userDetails?.name])

    return (
        <Dialog open={openRegisterModal} onOpenChange={setOpenRegisterModal}>
            <DialogContent className={`overflow-x-hidden overflow-y-auto overscroll-y-contain ${isMobile ? 'max-w-full! max-h-full! h-full! rounded-none justify-between' : 'max-w-150!'} flex flex-col gap-6`}>
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
                        <form onSubmit={handleSendOtp}>
                            <div className="flex flex-col gap-6">

                                {/* Name */}
                                <Input
                                    label={t('name')}
                                    required
                                    fullWidth
                                    type="text"
                                    variant="default"
                                    leftIcon={<PiUserCircle className="text-xl textSecondaryColor" />}
                                    placeholder="e.g, Jack Williams"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="bodyBg rounded-lg textPrimaryColor"
                                    error={errors.name}
                                />
                                {
                                    continueWithEmail || isNewsUser ?
                                        <Input
                                            label={t('email')}
                                            fullWidth
                                            required
                                            type="email"
                                            variant="default"
                                            leftIcon={<PiEnvelope className="text-xl textSecondaryColor" />}
                                            placeholder="e.g, JackWilliams11@gmail.com"
                                            value={isNewsUser ? userDetails?.email : formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="bodyBg rounded-lg textPrimaryColor"
                                            error={errors.email}
                                            disabled={isNewsUser}
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

                                {/* Password */}
                                {
                                    !isNewsUser &&
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
                                    !isNewsUser &&
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

                                {/* Referral Code */}
                                {referralSettings?.enabled &&
                                    <Input
                                        label={t('referralCode')}
                                        fullWidth
                                        type="text"
                                        variant="default"
                                        leftIcon={<PiGift className="text-xl textSecondaryColor" />}
                                        placeholder="e.g, 542FG6"
                                        value={formData.referralCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value }))}
                                        className="bodyBg rounded-lg textPrimaryColor"
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
                                            <span onClick={() => { handleCloseModal('register'); handleOpenModal('signin'); }} className="cursor-pointer flexCenter">
                                                <Typography variant="caption" className="primaryColor! font-medium">
                                                    {t('signIn')}
                                                </Typography>
                                            </span>
                                        </Typography>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
                <AgreedConditionsText />
            </DialogContent>
        </Dialog>
    )
}

export default RegisterModal
