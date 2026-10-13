'use client'

import {
    PiBell,
    PiGift,
    PiHeart,
    PiShieldCheck,
    PiSignOut,
    PiTag,
    PiTicket,
    PiTrash,
    PiUserCircle,
    PiWallet,
} from 'react-icons/pi'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import IconLabel from '@/components/storyBook/atoms/IconLabel'
import { useTranslation } from '@/hooks/useTranslation'
import { usePathname, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { userDataSelector } from '@/redux/reducers/userSlice'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice'
import { businessModeSelector, referralSettingsSelector } from '@/redux/reducers/settingsSlice'
import { userDetailsType } from '@/types/GlobalTypes'
import LogoutConfModal from '@/components/modalsAndSheets/LogoutConfModal'
import { useState } from 'react'
import { Typography } from '@/components/storyBook/atoms/Typography'
import ImagePreview from '@/components/storyBook/atoms/ImagePreview'

interface NavItem {
    href: string
    labelKey: string
    icon: React.ReactNode
}


const AccountTabs = () => {
    const { t } = useTranslation()
    const pathname = usePathname()
    const router = useRouter()
    const langCode = useSelector(currentLangCodeSelector)
    const userDetails = useSelector(userDataSelector) as userDetailsType
    const referralSettings = useSelector(referralSettingsSelector)
    const [openLogout, setOpenLogout] = useState(false)

    const businessMode = useSelector(businessModeSelector);
    const isMultiMode = businessMode?.business_mode === 'multi';

    const BASE_NAV_ITEMS: NavItem[] = [
        { href: '/my-bookings', labelKey: 'myBooking', icon: <PiTicket size={20} /> },
        { href: '/my-profile', labelKey: 'myProfile', icon: <PiUserCircle size={20} /> },
        { href: '/account-security', labelKey: 'accountSecurity', icon: <PiShieldCheck size={20} /> },
        { href: '/transactions', labelKey: 'transactions', icon: <PiWallet size={20} /> },
        ...(isMultiMode ? [{ href: '/wishlist', labelKey: 'wishlist', icon: <PiHeart size={20} /> }] : []),
        { href: '/referral-earn', labelKey: 'refrEarn', icon: <PiGift size={20} /> },
        { href: '/my-vouchers', labelKey: 'myVouchers', icon: <PiTag size={20} /> },
        { href: '/notifications', labelKey: 'notifications', icon: <PiBell size={20} /> },
        { href: '/delete-account', labelKey: 'deleteAccount', icon: <PiTrash size={20} /> },
    ]

    const navItems = referralSettings?.enabled
        ? BASE_NAV_ITEMS
        : BASE_NAV_ITEMS.filter(item => item.href !== '/referral-earn')

    const userName = userDetails?.name ?? ''
    const userEmail = userDetails?.email ?? ''
    const initial = userName.charAt(0).toUpperCase()

    const activeTab = navItems.find((item) => pathname.includes(item.href))?.href ?? navItems[0].href

    const handleTabChange = (value: string) => {
        router.push(`/${langCode}${value}`)
    }

    return (
        <>
            <div className="bg-white rounded-2xl border overflow-hidden p-4 space-y-4">

                {/* User card */}
                <div className="primaryLightBg flex flex-col items-center gap-4 py-6 px-4 rounded-xl">
                    {userDetails?.profile ? (
                        <ImagePreview
                            src={userDetails.profile as string}
                            alt={userName}
                            size="sm"
                            rounded="full"
                            objectFit="cover"
                            bordered
                            borderColor="secondary"
                            containerClassName="!w-20 !h-20 !border-white"
                        />
                    ) : (
                        <span suppressHydrationWarning className="primaryBg text-white w-20 h-20 flexCenter text-2xl font-semibold rounded-full border-2 border-white">
                            {initial}
                        </span>
                    )}
                    <div className="text-center w-full min-w-0 px-2">
                        <Typography variant="h6" weight="semibold" className="textPrimaryColor! capitalize truncate">
                            {userName}
                        </Typography>
                        <Typography variant="caption" className="textSecondaryColor! break-all leading-tight">
                            {userEmail}
                        </Typography>
                    </div>
                </div>

                {/* Nav tabs */}
                <Tabs
                    orientation="vertical"
                    value={activeTab}
                    onValueChange={handleTabChange}
                    className="w-full"
                >
                    <TabsList className="w-full bg-transparent flex flex-col gap-4 h-auto rounded-none">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.href
                            return (
                                <TabsTrigger
                                    key={item.href}
                                    value={item.href}
                                    disabled={isActive}
                                    className={`w-full justify-start rounded-lg px-0 py-0 h-auto border-none shadow-none text-base font-normal
                    data-[state=active]:shadow-none data-[state=active]:bg-transparent
                    hover:bg-transparent focus-visible:ring-0 focus-visible:outline-none
                    after:hidden disabled:opacity-100 disabled:cursor-default
                  `}
                                >
                                    <IconLabel
                                        icon={item.icon}
                                        label={t(item.labelKey)}
                                        active={isActive}
                                        showHoverEffect={!isActive}
                                        className={`w-full font-medium rounded-lg px-3 py-2.5 [&_svg]:size-6! ${isActive ? 'primaryBg text-white pointer-events-none' : 'textPrimaryColor'}
                    `}
                                    />
                                </TabsTrigger>
                            )
                        })}

                        {/* Logout */}
                        <button
                            onClick={() => setOpenLogout(true)}
                            className="w-full text-left mt-1"
                        >
                            <IconLabel
                                icon={<PiSignOut className='text-2xl' />}
                                label={t('logout')}
                                showHoverEffect={true}
                                className="w-full font-medium textPrimaryColor rounded-lg px-3 py-2.5"
                            />
                        </button>
                    </TabsList>
                </Tabs>
            </div>

            <LogoutConfModal open={openLogout} setOpen={setOpenLogout} />
        </>
    )
}

export default AccountTabs
