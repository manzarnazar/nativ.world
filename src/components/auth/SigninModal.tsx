'use client'
import { useState, useCallback, useEffect } from "react"
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
import { PiUserCircle, PiLock, PiEye, PiEyeSlash, PiEnvelope, PiPhone } from "react-icons/pi"
import { FcGoogle } from "react-icons/fc"
import { FaApple } from "react-icons/fa"
import Divider from "../storyBook/atoms/Divider"
import Input from "../storyBook/atoms/Input/Input"
import { Button } from "../storyBook/atoms/Button"
import { Typography } from "../storyBook/atoms/Typography"
import AgreedConditionsText from "./AgreedConditionsText"
import { modalTypes } from "./AuthModals"
import { userLoginApi, userLoginWithGoogleApi } from "@/api/client/apiRoutes"
import { toast } from '@/lib/toast';
import { useIsMobile } from "@/hooks/useMobile"
import { useDispatch, useSelector } from "react-redux"
import { useClearUserCache } from "@/hooks/useClearUserCache"
import { setAuthTokenCookie } from "@/utils/authToken"
import { setFirebaseToken, setToken, setUserData } from "@/redux/reducers/userSlice"
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth"
import { firebaseAuth } from "@/utils/Firebase"
import { setIsNewUser } from "@/redux/reducers/userSlice"
import { settingsSelector, fcmTokenSelector } from "@/redux/reducers/settingsSlice"
import { PhoneInput } from "../storyBook/atoms/PhoneInput"
import { isValidPhoneNumber } from "libphonenumber-js";

type SigninErrors = Partial<Record<string, string>>

interface SigninModalProps {
    openSigninModal: boolean;
    handleOpenModal: (modal: modalTypes) => void;
    handleCloseModal: (modal: modalTypes) => void;
    continueWithEmail: boolean;
    setContinueWithEmail: (value: boolean) => void;
    handleOpenRegisterModal: () => void;
    hideTrigger?: boolean;
}

const SigninModal = ({ openSigninModal, handleOpenModal, handleCloseModal, continueWithEmail, setContinueWithEmail, handleOpenRegisterModal, hideTrigger = false }: SigninModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const dispatch = useDispatch();
    const auth = firebaseAuth
    const { clearUserCache } = useClearUserCache()
    const settingsData = useSelector(settingsSelector);
    const fcmToken = useSelector(fcmTokenSelector);
    const demoMode = settingsData?.general_config?.demo_mode;
    const allowMethods = settingsData?.general_config?.allow_auth_methods;
    const isPhoneLoginAllowed = allowMethods?.includes("phone");
    const isEmailLoginAllowed = allowMethods?.includes("email_password");
    const isGoogleLoginAllowed = allowMethods?.includes("google");
    const isAppleLoginAllowed = allowMethods?.includes("apple");

    const [formData, setFormData] = useState({
        countryCode: settingsData?.general_config?.country_code ?? '',
        dialCode: settingsData?.general_config?.country_dial_code ?? '',
        phone: "",
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState<SigninErrors>({})
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    // ─── Zod Schema (inside component for t() access) ────────────────────────
    const signinSchema = continueWithEmail
        ? z.object({
            email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
            password: z.string().min(8, t('passwordMinLength')),
        })
        : z.object({
            phone: z.string().min(8, t('phoneMinLength')),
            password: z.string().min(8, t('passwordMinLength')),
        })

    const handleChangePhone = (value: string, data: any) => {
        const dialCode = data.dialCode;
        const countryCode = data.countryCode;
        setFormData(prev => ({
            ...prev,
            phone: value,
            countryCode: countryCode,
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
        const result = signinSchema.safeParse(formData)
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
    }, [formData, signinSchema, continueWithEmail])

    const handleUserLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        // First validate the form
        const isValid = handleValidateForm()
        if (!isValid) return

        try {
            setLoading(true)

            const phoneNumber = formData.phone.slice(formData.countryCode.length)

            const identifier = continueWithEmail ? formData.email : phoneNumber

            const response = await userLoginApi({
                identifier,
                ...(!continueWithEmail && { dial_code: `+${formData.dialCode}`}),
                password: formData.password,
                fcm_token: fcmToken,
                platform: "web",
            })

            if (response && !response.error) {
                toast.success(t('loginSuccess'))
                clearUserCache()
                dispatch(setUserData(response?.data?.user));
                dispatch(setToken(response?.data?.token));
                setAuthTokenCookie(response?.data?.token);
                handleCloseModal('signin')
                setFormData({
                    countryCode: "",
                    dialCode: "",
                    phone: "",
                    email: "",
                    password: "",
                })
            } else {
                toast.error(response?.message || t('loginFailed'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setLoading(false)
        }
    }

    // ─── Shared handler for both Google & Apple social logins ────────────────
    const handleUserLoginWithGoogle = async (idToken: string, name: string, provider: string) => {
        try {
            setLoading(true)

            const response = await userLoginWithGoogleApi({
                id_token: idToken,
                name,
                provider,
                fcm_token: fcmToken,
                platform: "web",
            })

            if (response && !response.error) {

                const isNewsUser = response.data.is_new_user
                clearUserCache()
                dispatch(setUserData(response?.data?.user));
                dispatch(setToken(response?.data?.token));
                setAuthTokenCookie(response?.data?.token);

                if (isNewsUser) {
                    dispatch(setIsNewUser(true))
                    handleCloseModal('signin')
                    handleOpenRegisterModal()
                }
                else {
                    toast.success(t('loginSuccess'))
                    handleCloseModal('signin')
                    setFormData({
                        countryCode: "",
                        dialCode: "",
                        phone: "",
                        email: "",
                        password: "",
                    })
                }
            } else {
                toast.error(response?.message || t('loginFailed'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setLoading(false)
        }
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
            .then(async response => {
                const idToken = await response?.user?.getIdToken();
                dispatch(setFirebaseToken(idToken || ''));
                await handleUserLoginWithGoogle(idToken || '', response?.user?.displayName || '', 'google')
            })
            .catch(err => {
                toast.error(err.message)
            })
    }

    // ─── Apple Sign-In ────────────────────────────────────────────────────────
    const signInWithApple = async () => {
        const provider = new OAuthProvider('apple.com')
        // Request name + email scopes so we can capture the user's display name
        provider.addScope('email')
        provider.addScope('name')

        await signInWithPopup(auth, provider)
            .then(async response => {
                const idToken = await response?.user?.getIdToken();
                dispatch(setFirebaseToken(idToken || ''));
                // Apple only sends the display name on the very first sign-in;
                // fall back to the email prefix when it's unavailable.
                const displayName =
                    response?.user?.displayName ||
                    response?.user?.email?.split('@')[0] ||
                    ''
                await handleUserLoginWithGoogle(idToken || '', displayName, 'apple')
            })
            .catch(err => {
                toast.error(err.message)
            })
    }

    useEffect(() => {
        if (!isPhoneLoginAllowed) {
            setContinueWithEmail(true)
        }
        else if (isPhoneLoginAllowed && continueWithEmail) {
            setContinueWithEmail(false)
        }
    }, [allowMethods])

    const demoCreds = {
        phone: "919898765432",
        dialCode: "91",
        countryCode: "in",
        password: "wrteam@123",
    }

    const handleSwitchToPhone = () => {
        setContinueWithEmail(false)
        setErrors({})
        setFormData(prev => ({
            ...prev,
            email: "",
            phone: demoMode ? demoCreds.phone : "",
            dialCode: demoMode ? demoCreds.dialCode : settingsData?.general_config?.country_dial_code,
            countryCode: demoMode ? demoCreds.countryCode : settingsData?.general_config?.country_code,
            password: demoMode ? demoCreds.password : "",
        }))
    }

    const handleSwitchToEmail = () => {
        setContinueWithEmail(true)
        setErrors({})
        setFormData(prev => ({
            ...prev,
            phone: "",
            dialCode: settingsData?.general_config?.country_dial_code,
            countryCode: settingsData?.general_config?.country_code,
            email: "",
            password: "",
        }))
    }

    useEffect(() => {
        if (openSigninModal && demoMode && isPhoneLoginAllowed) {
            setContinueWithEmail(false)
            setFormData(prev => ({
                ...prev,
                phone: demoCreds.phone,
                dialCode: demoCreds.dialCode,
                countryCode: demoCreds.countryCode,
                password: demoCreds.password,
            }))
        }
    }, [openSigninModal, demoMode])

    return (
        <Dialog open={openSigninModal} onOpenChange={(open) => {
            if (open) handleOpenModal('signin');
            else handleCloseModal('signin');
        }}>
            {!hideTrigger && (
                <DialogTrigger className="primaryBtn btn_md flexCenter gap-2">
                    <PiUserCircle size={24} /> {t('loginSignUp')}
                </DialogTrigger>
            )}
            <DialogContent className={`overflow-x-hidden overflow-y-auto overscroll-y-contain ${isMobile ? 'max-w-full! max-h-full! h-full! rounded-none justify-between' : 'max-w-150!'} flex flex-col gap-6 `}>
                <div className="flex flex-col gap-6">

                    <DialogHeader>
                        <DialogTitle>{t('signInOrCreateAcc')}</DialogTitle>
                        {
                            (isPhoneLoginAllowed || isEmailLoginAllowed) &&
                            <DialogDescription>
                                {continueWithEmail ? t('signInOrCreateAccDescEmail') : t('signInOrCreateAccDescPhone')}
                            </DialogDescription>
                        }
                    </DialogHeader>
                    <Divider width="bleed" />
                    <div className="flex flex-col gap-6">
                        {
                            (isPhoneLoginAllowed || isEmailLoginAllowed) &&
                            <form onSubmit={handleUserLogin}>
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

                                    {/* Password */}
                                    <div className="space-y-2.5">
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
                                            error={errors.password}
                                        />
                                        <div className="flex items-center justify-end" onClick={() => { handleCloseModal('signin'); handleOpenModal('forgotPass'); }}>
                                            <Typography variant="caption" className="textPrimaryColor! font-semibold cursor-pointer">
                                                {t('forgotPassword')}
                                            </Typography>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="flexColCenter gap-2">
                                        <Button variant="primary" size="md" type="submit" className="w-full" loading={loading}>
                                            {t('continue')}
                                        </Button>
                                        <Typography variant="caption" className="flexCenter gap-1 textPrimaryColor!">
                                            {t('dontHaveAcc')}
                                            <span onClick={() => { handleCloseModal('signin'); handleOpenModal('register'); }} className="cursor-pointer flexCenter">
                                                <Typography variant="caption" className="primaryColor! font-medium text-base!">
                                                    {t('registerNow')}
                                                </Typography>
                                            </span>
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

                                {
                                    isGoogleLoginAllowed &&
                                    <Button
                                        variant="outline"
                                        size="md"
                                        className="border-[#EDEDED]!"
                                        leftIcon={<FcGoogle className="text-xl" />}
                                        onClick={signInWithGoogle}
                                    >
                                        {t('continueWithGoogle')}
                                    </Button>
                                }

                                {
                                    isAppleLoginAllowed &&
                                    <Button
                                        variant="outline"
                                        size="md"
                                        className="border-[#EDEDED]!"
                                        leftIcon={<FaApple className="text-xl" />}
                                        onClick={signInWithApple}
                                    >
                                        {t('continueWithApple')}
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* Terms Footer */}
                <AgreedConditionsText />
            </DialogContent >
        </Dialog >
    )
}

export default SigninModal