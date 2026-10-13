'use client'

import { useState, useCallback } from 'react'
import { z } from 'zod'
import { PiEye, PiEyeSlash, PiLock, PiCheckCircleFill } from 'react-icons/pi'
import { toast } from '@/lib/toast';
import { useSelector } from 'react-redux'

import Layout from '@/components/layout/Layout'
import ProfileLayout from '../ProfileLayout'
import Input from '@/components/storyBook/atoms/Input/Input'
import { Button } from '@/components/storyBook/atoms/Button'
import { Typography } from '@/components/storyBook/atoms/Typography'

import { useTranslation } from '@/hooks/useTranslation'
import { useChangePassword } from '@/hooks/queries/profile/useChangePassword'
import { demoModeSelector } from '@/redux/reducers/settingsSlice'
import { userDataSelector } from '@/redux/reducers/userSlice'
import { userDetailsType } from '@/types/GlobalTypes'

interface PasswordForm {
    current_password: string
    password: string
    password_confirmation: string
}

type PasswordErrors = Partial<Record<keyof PasswordForm, string>>
type ShowFields = Record<keyof PasswordForm, boolean>

const INITIAL_FORM: PasswordForm = {
    current_password: '',
    password: '',
    password_confirmation: '',
}

const AccountSecurity = () => {
    const { t } = useTranslation()
    const { mutate: changePassword, isPending } = useChangePassword()
    const demoMode = useSelector(demoModeSelector)
    const userDetails = useSelector(userDataSelector) as userDetailsType
    const isDemoRestricted = demoMode && userDetails?.is_demo_account

    const [form, setForm] = useState<PasswordForm>(INITIAL_FORM)
    const [errors, setErrors] = useState<PasswordErrors>({})
    const [show, setShow] = useState<ShowFields>({
        current_password: false,
        password: false,
        password_confirmation: false,
    })

    const schema = useCallback(() => z.object({
        current_password: z.string().min(1, t('currentPasswordRequired')),
        password: z.string().min(8, t('passwordMinLength')),
        password_confirmation: z.string().min(1, t('confirmPasswordRequired')),
    }).refine((d) => d.password === d.password_confirmation, {
        message: t('passwordsDoNotMatch'),
        path: ['password_confirmation'],
    }), [t])

    const validate = useCallback((): boolean => {
        const result = schema().safeParse(form)
        if (!result.success) {
            const fieldErrors: PasswordErrors = {}
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof PasswordForm
                if (!fieldErrors[field]) fieldErrors[field] = err.message
            })
            setErrors(fieldErrors)
            return false
        }
        setErrors({})
        return true
    }, [form, schema])

    const handleChange = (field: keyof PasswordForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    const toggleShow = (field: keyof PasswordForm) =>
        setShow(prev => ({ ...prev, [field]: !prev[field] }))

    const handleSubmit = () => {
        if (!validate()) return
        changePassword(form, {
            onSuccess: () => {
                toast.success(t('passwordChanged'))
                setForm(INITIAL_FORM)
                setErrors({})
            },
            onError: (err) => {
                toast.error(err.message || t('passwordChangeFailed'))
            },
        })
    }

    const eyeIcon = (field: keyof PasswordForm) =>
        show[field] ? <PiEye size={18} /> : <PiEyeSlash size={18} />

    const passwordRules = [
        { label: t('passwordMinLength'), met: form.password.length >= 8 },
        { label: t('passwordHasLetter'), met: /[A-Za-z]/.test(form.password) },
        { label: t('passwordHasNumber'), met: /\d/.test(form.password) },
        { label: t('passwordHasSpecial'), met: /[^A-Za-z0-9]/.test(form.password) },
    ]

    const formFields = (
        <div className="space-y-5">
            <Input label={t('currentPassword')} required fullWidth
                type={show.current_password ? 'text' : 'password'} placeholder="••••••"
                leftIcon={<PiLock size={18} />} rightIcon={eyeIcon('current_password')}
                onRightIconClick={() => toggleShow('current_password')}
                value={form.current_password} onChange={handleChange('current_password')}
                error={errors.current_password}
                disabled={isDemoRestricted}
            />
            <div className="flex flex-col gap-2">
                <Input label={t('newPassword')} required fullWidth
                    type={show.password ? 'text' : 'password'} placeholder="••••••"
                    leftIcon={<PiLock size={18} />} rightIcon={eyeIcon('password')}
                    onRightIconClick={() => toggleShow('password')}
                    value={form.password} onChange={handleChange('password')}
                    error={errors.password}
                    disabled={isDemoRestricted}
                />
                {form.password.length > 0 && (
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
            <Input label={t('confirmPassword')} required fullWidth
                type={show.password_confirmation ? 'text' : 'password'} placeholder="••••••"
                leftIcon={<PiLock size={18} />} rightIcon={eyeIcon('password_confirmation')}
                onRightIconClick={() => toggleShow('password_confirmation')}
                value={form.password_confirmation} onChange={handleChange('password_confirmation')}
                error={errors.password_confirmation}
                disabled={isDemoRestricted}
            />
        </div>
    )

    return (
        <Layout>
            <ProfileLayout title={t('accountSecurity')}>

                {isDemoRestricted && (
                    <div className="mx-4 md:mx-6 mt-4 px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                        {t('demoModeRestriction')}
                    </div>
                )}

                {/* Mobile form */}
                <div className="md:hidden px-4 py-6 pb-32">
                    {formFields}
                </div>

                {/* Desktop form */}
                <div className="hidden md:block p-6 space-y-5">
                    {formFields}
                    <div className="flex justify-end">
                        <Button variant="primary" onClick={handleSubmit} loading={isPending} disabled={!!isDemoRestricted} className="rounded-full!">
                            {t('changePassword')}
                        </Button>
                    </div>
                </div>

            </ProfileLayout>

            {/* Mobile fixed bottom button */}
            <div className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 pt-3 pb-6">
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    loading={isPending}
                    disabled={!!isDemoRestricted}
                    className="w-full rounded-full! py-2! px-4!"
                >
                    {t('changePassword')}
                </Button>
            </div>
        </Layout>
    )
}

export default AccountSecurity
