'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { toast } from '@/lib/toast';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth'
import { PiEye, PiEyeSlash, PiLock } from 'react-icons/pi'
import Layout from '@/components/layout/Layout'
import ProfileLayout from '../ProfileLayout'
import Input from '@/components/storyBook/atoms/Input/Input'
import { Button } from '@/components/storyBook/atoms/Button'
import { useTranslation } from '@/hooks/useTranslation'
import { userDataSelector, logoutSuccess } from '@/redux/reducers/userSlice'
import { demoModeSelector } from '@/redux/reducers/settingsSlice'
import { queryClient } from '@/lib/queryClient'
import { userDetailsType } from '@/types/GlobalTypes'
import { firebaseAuth } from '@/utils/Firebase'
import { deleteAccountApi } from '@/api/client/apiRoutes'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice';

const DeleteAccount = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const router = useRouter()
    const userDetails = useSelector(userDataSelector) as userDetailsType
    const demoMode = useSelector(demoModeSelector)
    const isDemoRestricted = demoMode && userDetails?.is_demo_account

    const langCode = useSelector(currentLangCodeSelector);

    const isSocialUser =
        userDetails?.auth_provider === 'google' || userDetails?.auth_provider === 'apple'
    const socialProvider = userDetails?.auth_provider as 'google' | 'apple' | undefined

    const [confirmed, setConfirmed] = useState(false)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [passwordError, setPasswordError] = useState('')

    const handleDelete = async () => {
        if (!confirmed) return

        if (!isSocialUser && !password.trim()) {
            setPasswordError(t('passwordRequired'))
            return
        }

        setPasswordError('')
        setLoading(true)

        try {
            if (isSocialUser && socialProvider) {
                // Re-authenticate with Firebase first
                const firebaseProvider =
                    socialProvider === 'google'
                        ? new GoogleAuthProvider()
                        : new OAuthProvider('apple.com')

                await signInWithPopup(firebaseAuth, firebaseProvider)

                // Then call backend
                const res = await deleteAccountApi({ provider: socialProvider })
                if (res?.error === false) {
                    toast.success(t('accountDeletedSuccess'))
                    dispatch(logoutSuccess())
                    queryClient.removeQueries({ queryKey: ['bookingsList'] })
                    queryClient.removeQueries({ queryKey: ['bookingDetails'] })
                    queryClient.removeQueries({ queryKey: ['offers'] })
                    router.push(`/${langCode}`)
                } else {
                    toast.error(res?.message || t('accountDeleteFailed'))
                }
            } else {
                const res = await deleteAccountApi({ password: password.trim() })
                if (res?.error === false) {
                    toast.success(t('accountDeletedSuccess'))
                    dispatch(logoutSuccess())
                    queryClient.removeQueries({ queryKey: ['bookingsList'] })
                    queryClient.removeQueries({ queryKey: ['bookingDetails'] })
                    queryClient.removeQueries({ queryKey: ['offers'] })
                    router.push(`/${langCode}`)
                } else {
                    toast.error(res?.message || t('accountDeleteFailed'))
                }
            }
        } catch {
            toast.error(t('accountDeleteFailed'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Layout>
            <ProfileLayout title={t('deleteAccount')}>
                <div className="p-6 space-y-6">

                    {isDemoRestricted && (
                        <div className="px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                            {t('demoModeRestriction')}
                        </div>
                    )}

                    {/* Header */}
                    <div>
                        <p className="font-semibold text-gray-900">{t('permanentlyDeleteAccount')}</p>
                        <p className="text-sm text-gray-500 mt-1">{t('permanentlyDeleteAccountDesc')}</p>
                    </div>

                    {/* Loss list */}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-900">{t('youWillLoseAccess')}</p>
                        <ul className="space-y-1">
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                {t('loseAccessBookings')}
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                {t('walletBalanceRewards')}
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                {t('loseAccessPreferences')}
                            </li>
                        </ul>
                        <p className="text-sm font-semibold text-gray-900">{t('dataRetainedNotice')}</p>
                    </div>

                    {/* Password input — only for email/phone users */}
                    {!isSocialUser && (
                        <Input
                            label={t('password')}
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (passwordError) setPasswordError('')
                            }}
                            placeholder={t('password')}
                            leftIcon={<PiLock className="text-xl textSecondaryColor" />}
                            rightIcon={showPassword ? <PiEye className="text-xl textSecondaryColor" /> : <PiEyeSlash className="text-xl textSecondaryColor" />}
                            onRightIconClick={() => setShowPassword((p) => !p)}
                            error={passwordError}
                        />
                    )}

                    {/* Confirm checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                            className="mt-0.5 w-4 h-4 shrink-0 accent-red-500 cursor-pointer"
                        />
                        <span className="text-sm text-gray-600">{t('confirmDeleteCheckbox')}</span>
                    </label>

                    {/* Delete button */}
                    <Button
                        variant="danger"
                        size="md"
                        onClick={handleDelete}
                        disabled={!confirmed || loading || !!isDemoRestricted}
                    >
                        {loading ? t('deletingAccount') : t('deleteAccount')}
                    </Button>

                </div>
            </ProfileLayout>
        </Layout>
    )
}

export default DeleteAccount
