'use client'
import { useCallback, useState } from "react"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from "@/hooks/useTranslation"
import { PiCheckCircleFill, PiEye, PiEyeSlash, PiLock } from "react-icons/pi"
import Divider from "../storyBook/atoms/Divider"
import Input from "../storyBook/atoms/Input/Input"
import { Button } from "../storyBook/atoms/Button"
import { Typography } from "../storyBook/atoms/Typography"
import AgreedConditionsText from "./AgreedConditionsText"
import { useIsMobile } from "@/hooks/useMobile"
import { resetPasswordApi } from "@/api/client/apiRoutes"
import { toast } from '@/lib/toast';
import { useRegisterUserData } from "@/contexts/RegisterUserData"

type ForgotPassErrors = Partial<Record<string, string>>

interface ResetPassModalProps {
    openResetPassModal: boolean;
    handleCloseModal: () => void;
}

const ResetPassModal = ({ openResetPassModal, handleCloseModal }: ResetPassModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const [errors, setErrors] = useState<ForgotPassErrors>({})
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    // ─── Zod Schema (inside component for t() access) ────────────────────────
    const forgotPassSchema = z.object({
        password: z.string()
            .min(8, t('passwordMinLength'))
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])/, t('passwordComplexity') || "Password must contain at least one letter, one number and one special character"),
        confirmPassword: z.string().min(1, t('confirmPasswordRequired')),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t('passwordsDoNotMatch'),
        path: ['confirmPassword'],
    })

    const { registerFormData: formData, setRegisterFormData: setFormData } = useRegisterUserData();
    const [password, setpassword] = useState({
        password: "",
        confirmPassword: "",
    })

    const passwordRules = [
        { label: t('passwordMinLength'), met: password.password.length >= 8 },
        { label: t('passwordHasLetter'), met: /[A-Za-z]/.test(password.password) },
        { label: t('passwordHasNumber'), met: /\d/.test(password.password) },
        { label: t('passwordHasSpecial'), met: /[^A-Za-z0-9]/.test(password.password) },
    ]

    const identifier = formData.email ? formData.email : formData.phone.slice(formData.country_code.length);

    const handleValidateForm = useCallback((): boolean => {
        const result = forgotPassSchema.safeParse({ password: password.password, confirmPassword: password.confirmPassword })
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
    }, [identifier, forgotPassSchema])


    const handleResetPass = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // First validate the form
        const isValid = handleValidateForm()
        if (!isValid) return

        try {
            setLoading(true)

            const response = await resetPasswordApi({
                identifier,
                dial_code: formData.dialCode,
                password: password.password,
                ...(formData.phone ? { firebase_id_token: formData.verifyToken } : { verification_token: formData.verifyToken }),
                password_confirmation: password.confirmPassword,
            })

            if (response && !response.error) {
                toast.success(t('resetPasswordSuccess'))
                handleCloseModal()
                setpassword({ password: "", confirmPassword: "" })
                setFormData((prev) => ({ ...prev, email: '', phone: '', country_code: "", dialCode: "", isForgotPass: false, verifyToken: "" }))
            } else {
                toast.error(response?.message || t('resetPasswordFailed'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setLoading(false)
        }
    }


    return (
        <Dialog open={openResetPassModal} onOpenChange={handleCloseModal}>
            <DialogContent className={`overflow-x-hidden overflow-y-auto overscroll-y-contain ${isMobile ? 'max-w-full! max-h-full! h-full! rounded-none justify-between' : 'max-w-150!'} flex flex-col gap-6`}>
                <div className="flex flex-col gap-6">
                    <DialogHeader>
                        <DialogTitle>{t('resetPassword')}</DialogTitle>
                    </DialogHeader>
                    <Divider width="bleed" />
                    <div className="flex flex-col gap-6">

                        {/* Form */}
                        <form onSubmit={handleResetPass}>
                            <div className="flex flex-col gap-6">
                                {/* Password */}
                                <div className="flex flex-col gap-2">
                                    <Input
                                        label={t('newPass')}
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
                                        value={password.password}
                                        onChange={(e) => setpassword(prev => ({ ...prev, password: e.target.value }))}
                                        className="bodyBg rounded-lg textPrimaryColor"
                                        error={errors.password}
                                    />
                                    {password.password.length > 0 && (
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

                                {/* Confirm Password */}
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
                                    value={password.confirmPassword}
                                    onChange={(e) => setpassword(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="bodyBg rounded-lg textPrimaryColor"
                                    error={errors.confirmPassword}
                                />

                                {/* Submit */}
                                <div className="flexColCenter gap-3">
                                    <Button variant="primary" size="md" type="submit" className="w-full" loading={loading}>
                                        {t('resetMyPassword')}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Terms Footer */}
                <AgreedConditionsText />
            </DialogContent>
        </Dialog>
    )
}

export default ResetPassModal
