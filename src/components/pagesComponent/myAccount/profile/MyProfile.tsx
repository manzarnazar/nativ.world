'use client'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrorMessage'
import { useState, useCallback, useRef, useEffect } from 'react'
import { z } from 'zod'
import { useSelector, useDispatch } from 'react-redux'
import { ConfirmationResult, signInWithPhoneNumber } from 'firebase/auth'
import { toast } from '@/lib/toast';
import { PiEnvelope, PiLock, PiPlusCircle, PiUser } from 'react-icons/pi'

import Layout from '@/components/layout/Layout'
import ProfileLayout from '../ProfileLayout'
import { Typography } from '@/components/storyBook/atoms/Typography'
import Input from '@/components/storyBook/atoms/Input/Input'
import { Button } from '@/components/storyBook/atoms/Button'
import ImagePreview from '@/components/storyBook/atoms/ImagePreview'
import ImageCropModal from '@/components/modalsAndSheets/ImageCropModal'

import { useTranslation } from '@/hooks/useTranslation'
import { useRecaptcha } from '@/hooks/useRecaptcha'
import { useUpdateProfile } from '@/hooks/queries/profile/useUpdateProfile'
import { userDataSelector, setUserData } from '@/redux/reducers/userSlice'
import { demoModeSelector, settingsSelector } from '@/redux/reducers/settingsSlice'
import { userDetailsType } from '@/types/GlobalTypes'
import { getUserDetailsApi, sendEmailOtpApi, verifyOtpApi } from '@/api/client/apiRoutes'
import { firebaseAuth } from '@/utils/Firebase'
import { PhoneInput } from '@/components/storyBook/atoms/PhoneInput'
import { isValidPhoneNumber } from 'libphonenumber-js'

declare global {
    interface Window {
        confirmationResult: ConfirmationResult
    }
}

type Step = 'form' | 'email-otp' | 'phone-otp'

interface ProfileForm {
    name: string
    email: string
    phone: string
    dial_code: string
    country_code: string
}

type ProfileErrors = Partial<Record<'name' | 'email' | 'phone', string>>

// API stores dial_code with a leading '+', PhoneInput works with digits only
const stripPlus = (v: string) => v.replace(/^\+/, '')

const MyProfile = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const userDetails = useSelector(userDataSelector) as userDetailsType
    const demoMode = useSelector(demoModeSelector)
    const isDemoRestricted = demoMode && userDetails?.is_demo_account
    const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

    const settingsData = useSelector(settingsSelector);

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    // rawSrc = original selected file blob URL — kept so user can re-edit crop
    const [rawSrc, setRawSrc] = useState<string | null>(null)
    const [cropOpen, setCropOpen] = useState(false)

    const [formData, setFormData] = useState<ProfileForm>({
        name: '',
        email: '',
        phone: '',
        dial_code: '',
        country_code: '',
    })
    const [errors, setErrors] = useState<ProfileErrors>({})
    const [step, setStep] = useState<Step>('form')
    const [sendingOtp, setSendingOtp] = useState(false)

    const [emailOtp, setEmailOtp] = useState('')
    const [phoneOtp, setPhoneOtp] = useState('')

    const isPhoneOtpStep = step === 'phone-otp'
    const { generateRecaptcha, clearRecaptcha } = useRecaptcha(isPhoneOtpStep)

    useEffect(() => {
        if (!userDetails?.id) return
        const defaultDialCode = stripPlus(settingsData?.general_config?.country_dial_code ?? '')
        const dialCode = stripPlus((userDetails.dial_code as string | null) ?? '')
        const rawPhone = (userDetails.phone as string | null) ?? ''
        setFormData({
            name: userDetails.name ?? '',
            email: userDetails.email ?? '',
            phone: rawPhone ? `${dialCode}${rawPhone}` : defaultDialCode,
            dial_code: rawPhone ? dialCode : defaultDialCode,
            country_code: (userDetails.country_code as string | null) ?? '',
        })
    }, [userDetails?.id])

    const isEmailPrimary = userDetails?.auth_provider === 'email'
    const isPhonePrimary = userDetails?.auth_provider === 'phone'

    const profileSchema = useCallback(() => z.object({
        name: z.string().min(2, t('nameMinLength')),
        email: isEmailPrimary
            ? z.string()
            : z.union([z.string().email(t('invalidEmail')), z.literal('')]),
        phone: isPhonePrimary
            ? z.string()
            : z.union([z.string().min(8, t('phoneMinLength')), z.literal('')]),
    }), [isEmailPrimary, isPhonePrimary, t])

    const validatePhoneNumber = (): boolean => {
        if (!isValidPhoneNumber(`+${stripPlus(formData.phone)}`)) {
            setErrors(prev => ({ ...prev, phone: t("firebaseInvalidPhone") }))
            return false;
        }
        return true;
    }


    const validate = useCallback((): boolean => {
        const nationalPhone = formData.phone.startsWith(formData.dial_code)
            ? formData.phone.slice(formData.dial_code.length)
            : formData.phone
        if (nationalPhone.length > 0 && !validatePhoneNumber()) {
            return false
        }
        const result = profileSchema().safeParse({
            ...formData,
            phone: nationalPhone.length > 0 ? formData.phone : '',
        })
        if (!result.success) {
            const fieldErrors: ProfileErrors = {}
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof ProfileErrors
                if (!fieldErrors[field]) fieldErrors[field] = err.message
            })
            setErrors(fieldErrors)
            return false
        }
        setErrors({})
        return true
    }, [formData, profileSchema])

    // "Change Image" → always pick a new file
    const handleChangeImage = () => fileInputRef.current?.click()

    // Avatar edit button → reopen crop modal with the original raw file
    const handleEditAvatar = () => {
        if (rawSrc) {
            setCropOpen(true)
        } else {
            fileInputRef.current?.click()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 10 * 1024 * 1024) {
            toast.error(t('imageSizeLimit'))
            return
        }
        // Revoke previous raw blob before replacing
        if (rawSrc) URL.revokeObjectURL(rawSrc)
        const objectUrl = URL.createObjectURL(file)
        setRawSrc(objectUrl)
        setCropOpen(true)
        e.target.value = ''
    }

    const handleCropDone = (croppedFile: File) => {
        setAvatarFile(croppedFile)
        if (avatarPreview) URL.revokeObjectURL(avatarPreview)
        setAvatarPreview(URL.createObjectURL(croppedFile))
        setCropOpen(false)
        // rawSrc kept — user can re-open crop modal from avatar click
    }

    const handleCropClose = () => {
        setCropOpen(false)
        // rawSrc kept so user can reopen; only revoke on new file or after save
    }

    const handleChangePhone = (value: string, data: any) => {
        setFormData(prev => ({
            ...prev,
            phone: value,
            country_code: data.countryCode,
            dial_code: data.dialCode,
        }))
    }

    const currentStoredPhone = (() => {
        const dialCode = stripPlus((userDetails?.dial_code as string | null) ?? '')
        const rawPhone = (userDetails?.phone as string | null) ?? ''
        return rawPhone ? `${dialCode}${rawPhone}` : ''
    })()

    const emailChanged = formData.email !== (userDetails?.email ?? '')
    const nationalPhoneEntered = formData.phone.startsWith(formData.dial_code)
        ? formData.phone.slice(formData.dial_code.length).length > 0
        : formData.phone.length > 0
    const phoneChanged = nationalPhoneEntered && formData.phone !== currentStoredPhone

    const saveProfile = async (extra: Record<string, unknown> = {}) => {
        try {
            await updateProfile({
                name: formData.name,
                ...(avatarFile ? { profile: avatarFile } : {}),
                ...extra,
            })
            toast.success(t('profileUpdated'))
            setStep('form')
            setEmailOtp('')
            setPhoneOtp('')
            setAvatarFile(null)
            if (avatarPreview) URL.revokeObjectURL(avatarPreview)
            setAvatarPreview(null)
            if (rawSrc) URL.revokeObjectURL(rawSrc)
            setRawSrc(null)
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || t('profileUpdateFailed'))
        }
    }

    const sendEmailOtp = async () => {
        try {
            setSendingOtp(true)
            const response = await sendEmailOtpApi({ email: formData.email, purpose: 'profile_update' })
            if (response && !response.error) {
                // toast.success(t('optSent'))
                toast.success(response?.message);
                setStep('email-otp')
            } else {
                toast.error(response?.message || t('otpSentFailed'))
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setSendingOtp(false)
        }
    }

    const verifyEmailAndSave = async () => {
        if (!emailOtp || emailOtp.length < 4) {
            toast.error(t('invalidOtp'))
            return
        }
        try {
            setSendingOtp(true)
            const result = await verifyOtpApi({ identifier: formData.email, otp: emailOtp, purpose: 'profile_update' })
            if (result && !result.error) {
                const token = result.data?.token || result.data?.verification_token || ''
                await saveProfile({ email: formData.email, verification_token: token })
            } else {
                toast.error(result?.message || t('otpVerificationFailed'))
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || t('somethingWentWrong'))
        } finally {
            setSendingOtp(false)
        }
    }

    const sendFirebaseOtp = async () => {
        try {
            setSendingOtp(true)
            const fullPhone = `+${stripPlus(formData.phone)}`
            const recaptchaVerifier = generateRecaptcha()
            if (!recaptchaVerifier) {
                toast.error(t('somethingWentWrong'))
                return
            }
            const confirmationResult = await signInWithPhoneNumber(firebaseAuth, fullPhone, recaptchaVerifier)
            window.confirmationResult = confirmationResult
            setStep('phone-otp')
        } catch (err: any) {
            clearRecaptcha()
            toast.error(getFirebaseErrorMessage(err, t, 'somethingWentWrong'))
        } finally {
            setSendingOtp(false)
        }
    }

    const verifyPhoneAndSave = async () => {
        if (!phoneOtp || phoneOtp.length < 6) {
            toast.error(t('invalidOtp'))
            return
        }
        try {
            setSendingOtp(true)
            const result = await window.confirmationResult.confirm(phoneOtp)
            const idToken = await result.user.getIdToken()
            const barePhone = formData.phone.startsWith(formData.dial_code)
                ? formData.phone.slice(formData.dial_code.length)
                : formData.phone
            await saveProfile({
                phone: barePhone,
                dial_code: `+${stripPlus(formData.dial_code)}`,
                country_code: formData.country_code,
                firebase_id_token: idToken,
            })
        } catch (err: any) {
            toast.error(getFirebaseErrorMessage(err, t, 'somethingWentWrong'))
        } finally {
            setSendingOtp(false)
        }
    }


    const handleSubmit = async () => {
        if (!validate()) return
        if (emailChanged && !isEmailPrimary && formData.email) {
            await sendEmailOtp()
            return
        }


        if (phoneChanged && !isPhonePrimary && formData.phone) {
            await sendFirebaseOtp()
            return
        }
        await saveProfile()
    }

    const userName = userDetails?.name ?? ''
    const initial = userName.charAt(0).toUpperCase()
    const currentAvatar = avatarPreview || (userDetails?.profile as string | null)
    const isBusy = isPending || sendingOtp

    /* ── Shared form fields ─────────────────────────────── */
    const formFields = (
        <>
            {step === 'form' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={t('name')}
                            required
                            fullWidth
                            placeholder="e.g, Jack Williams"
                            leftIcon={<PiUser size={18} />}
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            error={errors.name}
                        />
                        <div>
                            <Input
                                label={t('email')}
                                required={isEmailPrimary}
                                fullWidth
                                placeholder="e.g, JackWilliams11@gmail.com"
                                leftIcon={<PiEnvelope size={18} />}
                                rightIcon={isEmailPrimary ? <PiLock size={16} /> : undefined}
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                error={errors.email}
                                disabled={isEmailPrimary}
                            />
                            {isEmailPrimary && (
                                <p className="mt-1 text-xs textSecondaryColor">{t('primaryLoginMethod')}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        {isPhonePrimary ? (
                            <div>
                                <Input value={formData.phone ? `+${formData.phone}` : ''} disabled rightIcon={<PiLock size={16} />} />
                                <p className="mt-1 text-xs textSecondaryColor">{t('primaryLoginMethod')}</p>
                            </div>
                        ) : (
                            <PhoneInput
                                label={t('phoneNumber')}
                                fullWidth
                                value={formData.phone}
                                onChange={handleChangePhone}
                                enableSearch
                                searchPlaceholder="Search country..."
                                error={errors.phone}
                            />

                        )}
                    </div>
                </>
            )}

            {step === 'email-otp' && (
                <div className="space-y-4">
                    <Typography variant="desc1" className="textSecondaryColor!">
                        {t('enterOtpCodeSentTo')} <strong>{formData.email}</strong>
                    </Typography>
                    <Input
                        label={t('otpCode')} required fullWidth
                        placeholder="Enter 6-digit OTP"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                    />
                    <div className="flex justify-end gap-3">
                        <Button variant="text" onClick={() => setStep('form')} className="rounded-lg!">{t('back')}</Button>
                        <Button variant="secondary" onClick={verifyEmailAndSave} loading={isBusy} className="rounded-full!">{t('verifyOtp')}</Button>
                    </div>
                </div>
            )}

            {step === 'phone-otp' && (
                <div className="space-y-4">
                    <Typography variant="desc1" className="textSecondaryColor!">
                        {t('enterOtpCodeSentTo')} <strong>+{formData.phone}</strong>
                    </Typography>
                    <Input
                        label={t('otpCode')} required fullWidth
                        placeholder="Enter 6-digit OTP"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                    />
                    <div className="flex justify-end gap-3">
                        <Button variant="text" onClick={() => { setStep('form'); clearRecaptcha() }} className="rounded-lg!">{t('back')}</Button>
                        <Button variant="secondary" onClick={verifyPhoneAndSave} loading={isBusy} className="rounded-full!">{t('verifyOtp')}</Button>
                    </div>
                </div>
            )}
        </>
    )

    /* ── Hidden file input (shared) ────────────────────── */
    const fileInput = (
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    )


    const handleGetUserDetails = async () => {
        try {

            const response = await getUserDetailsApi();

            if (response && !response.error) {

                dispatch(setUserData(response?.data?.user));

            } else {
                toast.error(response?.message || t('somethingWentWrong'))
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t('somethingWentWrong'))
        }
    }

    useEffect(() => {
        handleGetUserDetails()
    }, []);

    return (
        <Layout>
            <div id="recaptcha-container-otp-modal" />

            <ProfileLayout title={t('myProfile')}>

                {isDemoRestricted && (
                    <div className="mx-4 md:mx-6 mt-4 px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                        {t('demoModeRestriction')}
                    </div>
                )}

                {/* ── Mobile avatar + form ──────────────────────── */}
                <div className="md:hidden pb-32">
                    <div className="flex justify-center pt-8 pb-10">
                        <div className="relative">
                            {currentAvatar ? (
                                <button type="button" onClick={handleEditAvatar} disabled={!!isDemoRestricted} className="block rounded-full overflow-hidden w-28 h-28 disabled:cursor-not-allowed">
                                    <img src={currentAvatar} alt={userName} className="w-full h-full object-cover" />
                                </button>
                            ) : (
                                <span className="primaryBg text-white w-28 h-28 flexCenter text-4xl font-semibold rounded-full">
                                    {initial}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={handleChangeImage}
                                disabled={!!isDemoRestricted}
                                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full flexCenter gap-1 whitespace-nowrap shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PiPlusCircle size={14} />
                                {currentAvatar ? t('changeImage') : t('add')}
                            </button>
                        </div>
                    </div>
                    <div className="px-4 space-y-4">{formFields}</div>
                </div>

                {/* ── Desktop avatar row + form ─────────────────── */}
                <div className="hidden md:block p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        {currentAvatar ? (
                            <button type="button" onClick={handleEditAvatar} disabled={!!isDemoRestricted} className="relative shrink-0 group rounded-full overflow-hidden disabled:cursor-not-allowed disabled:opacity-70" title={t('edit')}>
                                <ImagePreview src={currentAvatar} alt={userName} size="sm" rounded="full" objectFit="cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flexCenter">
                                    <span className="text-white text-[10px] font-medium leading-tight text-center px-1">{t('edit')}</span>
                                </div>
                            </button>
                        ) : (
                            <span className="primaryBg text-white w-16 h-16 flexCenter text-2xl font-semibold rounded-full shrink-0">{initial}</span>
                        )}
                        <div className="flex-1 min-w-0">
                            <Typography variant="desc1" weight="semibold" className="textPrimaryColor!">Hi, {userName}</Typography>
                            <Typography variant="caption" className="textSecondaryColor!">{t('uploadProfilePicture')}</Typography>
                        </div>
                        <Button variant="primary" onClick={handleChangeImage} disabled={!!isDemoRestricted} className="rounded-full! shrink-0">{t('changeImage')}</Button>
                    </div>
                    {formFields}
                    {step === 'form' && (
                        <div className="flex justify-end">
                            <Button variant="primary" onClick={handleSubmit} loading={isBusy} disabled={!!isDemoRestricted} className="rounded-full!">{t('updateProfile')}</Button>
                        </div>
                    )}
                </div>

            </ProfileLayout>

            {/* Shared hidden file input */}
            {fileInput}

            {/* Mobile fixed bottom button */}
            {step === 'form' && (
                <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 pt-3 pb-6">
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        loading={isBusy}
                        disabled={!!isDemoRestricted}
                        className="w-full rounded-full! py-2! px-4!"
                    >
                        {t('updateProfile')}
                    </Button>
                </div>
            )}

            {rawSrc && (
                <ImageCropModal open={cropOpen} imageSrc={rawSrc} onClose={handleCropClose} onCropDone={handleCropDone} />
            )}
        </Layout>
    )
}

export default MyProfile
