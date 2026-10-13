'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { PiArrowLeft } from 'react-icons/pi'

import AccountTabs from './AccountTabs'
import { Typography } from '@/components/storyBook/atoms/Typography'
import { Breadcrumb } from '@/components/storyBook/molecules/Breadcrumb'
import { useTranslation } from '@/hooks/useTranslation'

interface ProfileLayoutProps {
    children: React.ReactNode
    title: string
    /** Optional element rendered next to the title (e.g. Preferences button) */
    headerAction?: React.ReactNode
    notificationsPage?: boolean
}

const ProfileLayout = ({ children, title, headerAction, notificationsPage }: ProfileLayoutProps) => {

    const { t } = useTranslation();
    const router = useRouter();
    const isMyBookings = title === t("myBookings");

    return (
        <>
            {/* ── MOBILE ─────────────────────────────────────── */}
            <div className="md:hidden flex flex-col min-h-screen bg-white">

                {/* Sticky top bar — same height/style as Breadcrumb */}
                <div className="flex items-center gap-3 px-4 bg-white border-b border-gray-100 sticky top-0 z-10 h-14">
                    {
                        !isMyBookings &&
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="w-8 h-8 flexCenter shrink-0"
                        >
                            <PiArrowLeft size={22} />
                        </button>
                    }
                    <Typography variant="h6" weight="semibold" className="flex-1">
                        {title}
                    </Typography>
                    {headerAction && <div className={`${notificationsPage ? 'shrink-0 block' : 'shrink-0 hidden md:block'}`}>{headerAction}</div>}
                </div>

                {/* Page content */}
                <div className="flex-1">
                    {children}
                </div>
            </div>

            {/* ── TABLET + DESKTOP ───────────────────────────── */}
            <div className="hidden md:block">
                <Breadcrumb activeLabel={title} />
                <div className="grid grid-cols-12 container commonPY commonGap">
                    {/* Sidebar — visible from md (tablet) upward */}
                    <div className="col-span-4 min-1200:col-span-3 sticky top-[110px] self-start">
                        <AccountTabs />
                    </div>
                    {/* Content */}
                    <div className="col-span-8 min-1200:col-span-9">
                        <div className="bg-white rounded-2xl space-y-4">
                            <div className="flex items-center justify-between px-6 py-5 border-b">
                                <Typography variant="h5" weight="semibold">{title}</Typography>
                                {headerAction && <div>{headerAction}</div>}
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileLayout
