'use client'

import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import {
    PiBell,
    PiCaretRight,
    PiCurrencyInr,
    PiGift,
    PiGlobe,
    PiHandshake,
    PiInfo,
    PiNewspaper,
    PiPencilSimple,
    PiPhone,
    PiQuestion,
    PiShieldCheck,
    PiShieldStar,
    PiSignOut,
    PiTag,
    PiTrash,
    PiUserCircle,
    PiVault,
    PiWallet,
    PiWarning,
} from 'react-icons/pi'
import { GrCurrency } from "react-icons/gr";


import Layout from '@/components/layout/Layout'
import { Typography } from '@/components/storyBook/atoms/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { userDataSelector, isLoginSelector } from '@/redux/reducers/userSlice'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice'
import { businessModeSelector, referralSettingsSelector, languagesSelector } from '@/redux/reducers/settingsSlice'
import { currentCurreyCodeSelector } from '@/redux/reducers/currencySlice'
import { useCurrencies } from '@/hooks/queries/general/useCurrencies'
import { BasicDetails } from '@/hooks/queries/useSettings'
import { userDetailsType } from '@/types/GlobalTypes'
import LogoutConfModal from '@/components/modalsAndSheets/LogoutConfModal'
import CurrencyModal from '@/components/modalsAndSheets/CurrencyModal'
import LanguageModal from '@/components/modalsAndSheets/LanguageModal'
import SigninModal from '@/components/auth/SigninModal'
import RegisterModal from '@/components/auth/RegisterModal'
import ForgotPassModal from '@/components/auth/ForgotPassModal'
import OtpModal from '@/components/auth/OtpModal'
import ResetPassModal from '@/components/auth/ResetPassModal'
import { RegisterUserDataProvider } from '@/contexts/RegisterUserData'
import { modalTypes } from '@/components/auth/AuthModals'
import { useEffect, useState } from 'react'

interface SectionItem {
    labelKey: string
    label?: string
    icon: React.ReactNode
    href?: string
    onClick?: () => void
}

interface Section {
    titleKey: string
    items: SectionItem[]
}

const MobileAccountPage = () => {
    const { t } = useTranslation()
    const router = useRouter()
    const userDetails = useSelector(userDataSelector) as userDetailsType
    const isLogin = useSelector(isLoginSelector)
    const langCode = useSelector(currentLangCodeSelector)
    const businessMode = useSelector(businessModeSelector) as BasicDetails
    const isSingleHotel = businessMode?.business_mode === 'single'
    const referralSettings = useSelector(referralSettingsSelector)
    const currencyCode = useSelector(currentCurreyCodeSelector)
    const languages = useSelector(languagesSelector)
    const { data: currenciesData } = useCurrencies()
    const currencies = currenciesData?.data?.items || []
    const [openLogout, setOpenLogout] = useState(false)
    const [openCurrency, setOpenCurrency] = useState(false)
    const [openLanguage, setOpenLanguage] = useState(false)
    const [continueWithEmail, setContinueWithEmail] = useState(false)
    const [openModals, setOpenModals] = useState({
        sigin: false, register: false, forgotPass: false, otp: false, resetPass: false,
    })
    const handleOpenModal = (modal: modalTypes) => {
        const key = modal === 'signin' ? 'sigin' : modal
        setOpenModals(prev => ({ ...prev, [key]: true }))
    }
    const handleCloseModal = (modal: modalTypes) => {
        const key = modal === 'signin' ? 'sigin' : modal
        setOpenModals(prev => ({ ...prev, [key]: false }))
    }

    const lc = langCode ? `/${langCode}` : ''

    // Desktop: redirect to My Bookings (account page is mobile-only)
    // Use window.innerWidth directly — isMobile starts as false (!!undefined) which would
    // incorrectly trigger the redirect on mobile before the hook resolves.
    useEffect(() => {
        if (window.innerWidth >= 768) {
            router.replace(`${lc}/my-bookings`)
        }
    }, [lc, router])

    const userName = userDetails?.name ?? ''
    const userEmail = userDetails?.email ?? ''
    const initial = userName.charAt(0).toUpperCase()
    const avatar = userDetails?.profile as string | null

    const authSections: Section[] = [
        {
            titleKey: 'rewardPayment',
            items: [
                { labelKey: 'transactions', icon: <PiWallet size={20} />, href: `${lc}/transactions` },
                ...(referralSettings?.enabled ? [{ labelKey: 'refrEarn', icon: <PiGift size={20} />, href: `${lc}/referral-earn` }] : []),
                { labelKey: 'myVouchers', icon: <PiTag size={20} />, href: `${lc}/my-vouchers` },
            ],
        },
        {
            titleKey: 'accountPreferences',
            items: [
                { labelKey: 'accountSecurity', icon: <PiShieldCheck size={20} />, href: `${lc}/account-security` },
                ...(currencies.length > 1 ? [{ labelKey: 'changeCurrency', label: currencyCode ?? t('changeCurrency'), icon: <GrCurrency size={20} />, onClick: () => setOpenCurrency(true) }] : []),
                ...(languages?.length > 1 ? [{ labelKey: 'language', icon: <PiGlobe size={20} />, onClick: () => setOpenLanguage(true) }] : []),
                { labelKey: 'notifications', icon: <PiBell size={20} />, href: `${lc}/notifications` },
            ],
        },
        ...(!isSingleHotel ? [{
            titleKey: 'partnerBusiness',
            items: [
                { labelKey: 'listYourProperty', icon: <PiHandshake size={20} />, href: `/${langCode}/list-your-property` },
            ],
        }] : []),
        {
            titleKey: 'supportInfo',
            items: [
                { labelKey: 'blogs', icon: <PiNewspaper size={20} />, href: `${lc}/blogs` },
                { labelKey: 'aboutUs', icon: <PiInfo size={20} />, href: `${lc}/about-us` },
                { labelKey: 'helpSupport', icon: <PiQuestion size={20} />, href: `${lc}/help-support` },
                { labelKey: 'contactUs', icon: <PiPhone size={20} />, href: `${lc}/contact-us` },
            ],
        },
        {
            titleKey: 'legalAppControl',
            items: [
                { labelKey: 'cancellationRefunds', icon: <PiVault size={20} />, href: `${lc}/cancellation-refunds` },
                { labelKey: 'termsConditions', icon: <PiNewspaper size={20} />, href: `${lc}/terms-conditions` },
                { labelKey: 'privacyPolicy', icon: <PiShieldStar size={20} />, href: `${lc}/privacy-policy` },
                { labelKey: 'platformPolicy', icon: <PiWarning size={20} />, href: `${lc}/platform-policy` },
                { labelKey: 'deleteAccount', icon: <PiTrash size={20} />, href: `${lc}/delete-account` },
                { labelKey: 'logout', icon: <PiSignOut size={20} />, onClick: () => setOpenLogout(true) },
            ],
        },
    ]

    const guestSections: Section[] = [
        {
            titleKey: 'accountPreferences',
            items: [
                ...(currencies.length > 1 ? [{ labelKey: 'changeCurrency', label: currencyCode ?? t('changeCurrency'), icon: <GrCurrency size={20} />, onClick: () => setOpenCurrency(true) }] : []),
                ...(languages?.length > 1 ? [{ labelKey: 'language', icon: <PiGlobe size={20} />, onClick: () => setOpenLanguage(true) }] : []),
            ],
        },
        ...(!isSingleHotel ? [{
            titleKey: 'partnerBusiness',
            items: [
                { labelKey: 'listYourProperty', icon: <PiHandshake size={20} />, href: `/${langCode}/list-your-property` },
            ],
        }] : []),
        {
            titleKey: 'supportInfo',
            items: [
                { labelKey: 'blogs', icon: <PiNewspaper size={20} />, href: `${lc}/blogs` },
                { labelKey: 'aboutUs', icon: <PiInfo size={20} />, href: `${lc}/about-us` },
                { labelKey: 'helpSupport', icon: <PiQuestion size={20} />, href: `${lc}/help-support` },
                { labelKey: 'contactUs', icon: <PiPhone size={20} />, href: `${lc}/contact-us` },
            ],
        },
        {
            titleKey: 'legalAppControl',
            items: [
                { labelKey: 'cancellationRefunds', icon: <PiVault size={20} />, href: `${lc}/cancellation-refunds` },
                { labelKey: 'termsConditions', icon: <PiNewspaper size={20} />, href: `${lc}/terms-conditions` },
                { labelKey: 'privacyPolicy', icon: <PiShieldStar size={20} />, href: `${lc}/privacy-policy` },
                { labelKey: 'platformPolicy', icon: <PiWarning size={20} />, href: `${lc}/platform-policy` },
            ],
        },
    ]

    const sections = (isLogin ? authSections : guestSections).filter(section => section.items.length > 0)

    return (
        <Layout>
            {/* Mobile only */}
            <div className="md:hidden min-h-screen bg-gray-50 pb-24">

                {/* Page title — same style as Breadcrumb nav */}
                <nav className="bg-white h-14 border-b flex items-center mb-4">
                    <div className="container">
                        <Typography variant="h5" weight="semibold">{t('myProfile')}</Typography>
                    </div>
                </nav>

                {/* User card / Guest banner */}
                {isLogin ? (
                    <div className="mx-4 mb-4 primaryLightBg rounded-2xl px-4 py-4 flex items-center gap-3">
                        {avatar ? (
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                <img src={avatar} alt={userName} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <span className="primaryBg text-white w-12 h-12 flexCenter text-xl font-semibold rounded-full shrink-0">
                                {initial}
                            </span>
                        )}
                        <div className="flex-1 min-w-0">
                            <Typography variant="desc1" weight="semibold" className="textPrimaryColor! capitalize truncate">
                                {userName}
                            </Typography>
                            <Typography variant="caption" className="textSecondaryColor! truncate">
                                {userEmail}
                            </Typography>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.push(`${lc}/my-profile`)}
                            className="flex items-center gap-1 text-xs font-medium shrink-0 bg-white p-2 rounded-lg"
                        >
                            {t('edit')} <PiPencilSimple size={12} />
                        </button>
                    </div>
                ) : (
                    <div className="mx-4 mb-4 primaryLightBg rounded-2xl px-4 py-4 flex items-center gap-3">
                        <span className="primaryBg text-white w-12 h-12 flexCenter text-xl rounded-full shrink-0">
                            <PiUserCircle size={28} />
                        </span>
                        <div className="flex-1 min-w-0">
                            <Typography variant="desc1" weight="semibold" className="textPrimaryColor!">
                                {t('guestLogin')}
                            </Typography>
                            <Typography variant="caption" className="textSecondaryColor!">
                                {t('guestLoginDesc')}
                            </Typography>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleOpenModal('signin')}
                            className="text-sm font-medium shrink-0 whitespace-nowrap bg-white p-2 rounded-lg"
                        >
                            {t('login')}
                        </button>
                    </div>
                )}

                {/* Sections */}
                <div className="space-y-5 px-4">
                    {sections.map((section) => (
                        <div key={section.titleKey}>
                            <p className="text-sm font-medium textSecondaryColor mb-2 px-1">
                                {t(section.titleKey)}
                            </p>
                            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                                {section.items.map((item) => {
                                    const inner = (
                                        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 last:border-b-0">
                                            <span className="textSecondaryColor shrink-0">{item.icon}</span>
                                            <span className="flex-1 text-sm textPrimaryColor">{item.label ?? t(item.labelKey)}</span>
                                            <PiCaretRight size={16} className="textSecondaryColor shrink-0" />
                                        </div>
                                    )
                                    if (item.onClick) {
                                        return (
                                            <button key={item.labelKey} type="button" onClick={item.onClick} className="w-full text-left">
                                                {inner}
                                            </button>
                                        )
                                    }
                                    return (
                                        <Link key={item.labelKey} href={item.href!}>
                                            {inner}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop fallback */}
            <div className="hidden md:block container commonPY">
                <div className="bg-white rounded-2xl p-6">
                    <Typography variant="h5" weight="semibold" className="mb-4">{t('myProfile')}</Typography>
                    <p className="textSecondaryColor text-sm">{t('selectFromSidebar')}</p>
                </div>
            </div>

            <LogoutConfModal open={openLogout} setOpen={setOpenLogout} />
            <CurrencyModal open={openCurrency} onOpenChange={setOpenCurrency} />
            <LanguageModal open={openLanguage} onOpenChange={setOpenLanguage} />

            <RegisterUserDataProvider>
                <SigninModal
                    openSigninModal={openModals.sigin}
                    handleOpenModal={handleOpenModal}
                    handleCloseModal={handleCloseModal}
                    continueWithEmail={continueWithEmail}
                    setContinueWithEmail={setContinueWithEmail}
                    handleOpenRegisterModal={() => handleOpenModal('register')}
                    hideTrigger
                />
                <RegisterModal
                    openRegisterModal={openModals.register}
                    setOpenRegisterModal={(open) => open ? handleOpenModal('register') : handleCloseModal('register')}
                    handleCloseModal={handleCloseModal}
                    handleOpenModal={handleOpenModal}
                    continueWithEmail={continueWithEmail}
                    setOpenOtpModal={() => handleOpenModal('otp')}
                />
                <OtpModal
                    openOtpModal={openModals.otp}
                    handleOpenModal={handleOpenModal}
                    handleCloseModal={handleCloseModal}
                    setOpenRegisterModal={() => handleOpenModal('register')}
                    openResetPassModal={() => handleOpenModal('resetPass')}
                />
                <ForgotPassModal
                    openForgotPassModal={openModals.forgotPass}
                    handleOpenModal={handleOpenModal}
                    handleCloseModal={handleCloseModal}
                    setOpenOtpModal={() => handleOpenModal('otp')}
                    continueWithEmail={continueWithEmail}
                />
                <ResetPassModal
                    openResetPassModal={openModals.resetPass}
                    handleCloseModal={() => handleCloseModal('resetPass')}
                />
            </RegisterUserDataProvider>
        </Layout>
    )
}

export default MobileAccountPage
