'use client'

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { settingsSelector } from "@/redux/reducers/settingsSlice"
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerDescription,
} from "@/components/ui/drawer"
import { Button } from "../storyBook/atoms/Button"
import { Typography } from "../storyBook/atoms/Typography"
import { useTranslation } from "@/hooks/useTranslation"
import ImagePreview from "../storyBook/atoms/ImagePreview"
import { useIsMobile } from "@/hooks/useMobile"

const DeepLinkSheet = () => {
    const { t } = useTranslation()
    const settings = useSelector(settingsSelector)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [open, setOpen] = useState(false)
    const [notInstalled, setNotInstalled] = useState(false)

    const isShare = searchParams.get('share') === 'true'
    const isMobile = useIsMobile();

    useEffect(() => {
        if (isShare && isMobile) setOpen(true)
    }, [isShare, isMobile])

    const appConfig = settings?.app_config
    const branding = settings?.branding

    if (!isShare || !appConfig || !isMobile) return null

    const query = searchParams.toString() ? `?${searchParams.toString()}` : ''
    const deepLinkUrl = `estay://${window.location.host}${pathname}${query}`

    const isAndroid = /android/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '')
    const isIos = /iphone|ipad|ipod/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '')

    const handleOpenInApp = () => {
        console.log('[DeepLink] handleOpenInApp triggered')
        console.log('[DeepLink] deepLinkUrl:', deepLinkUrl)
        console.log('[DeepLink] userAgent:', navigator.userAgent)
        console.log('[DeepLink] platform:', { isAndroid, isIos })
        console.log('[DeepLink] appConfig:', {
            app_scheme: appConfig.app_scheme,
            playstore_url: appConfig.playstore_url,
            appstore_url: appConfig.appstore_url,
        })

        window.location.href = deepLinkUrl
        console.log('[DeepLink] deep link fired:', deepLinkUrl)

        const timer = setTimeout(() => {
            console.log('[DeepLink] fallback timer fired — document.hidden:', document.hidden)
            if (!document.hidden) {
                console.log('[DeepLink] page still visible → app NOT installed → switching sheet content')
                setNotInstalled(true)
            } else {
                console.log('[DeepLink] page hidden → app opened successfully')
            }
        }, 1500)

        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log('[DeepLink] visibilitychange: hidden → app opened, clearing fallback timer')
                clearTimeout(timer)
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    const handleClose = () => {
        setOpen(false)
        setNotInstalled(false)
    }

    return (
        <Drawer open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
            <DrawerContent className="p-6 pb-10">
                <DrawerTitle className="sr-only">
                    {notInstalled ? t('appNotInstalled') : t('openInApp')}
                </DrawerTitle>
                <DrawerDescription className="sr-only">
                    {notInstalled ? t('downloadAppForBetterExperience') : t('betterExperienceInApp')}
                </DrawerDescription>

                <div className="flex flex-col items-center gap-5 pt-2">
                    {branding?.logo && (
                        <ImagePreview
                            src={branding.logo}
                            alt="app logo"
                            size="xl"
                            objectFit="contain"
                            rounded='xl'
                            className=""
                        />
                    )}

                    {notInstalled ? (
                        <>
                            <div className="text-center space-y-1">
                                <Typography variant="h5" weight="semibold">
                                    {t('appNotInstalled')}
                                </Typography>
                                <Typography variant="caption" className="text-gray-500 text-sm">
                                    {t('downloadAppForBetterExperience')}
                                </Typography>
                            </div>
                            <div className="flex flex-col gap-3 w-full">
                                {(isAndroid || (!isAndroid && !isIos)) && appConfig.playstore_url && (
                                    <Button
                                        variant="primary"
                                        className="w-full py-3"
                                        onClick={() => { window.location.href = appConfig.playstore_url! }}
                                    >
                                        {t('getOnPlayStore')}
                                    </Button>
                                )}
                                {(isIos || (!isAndroid && !isIos)) && appConfig.appstore_url && (
                                    <Button
                                        variant="primary"
                                        className="w-full py-3"
                                        onClick={() => { window.location.href = appConfig.appstore_url! }}
                                    >
                                        {t('getOnAppStore')}
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full py-3"
                                    onClick={handleClose}
                                >
                                    {t('cancel')}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="text-center space-y-1">
                                <Typography variant="h5" weight="semibold">
                                    {t('openInApp')}
                                </Typography>
                                <Typography variant="caption" className="text-gray-500 text-sm">
                                    {t('betterExperienceInApp')}
                                </Typography>
                            </div>
                            <div className="flex flex-col gap-3 w-full">
                                <Button
                                    variant="primary"
                                    className="w-full py-3"
                                    onClick={handleOpenInApp}
                                >
                                    {t('openInApp')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full py-3"
                                    onClick={handleClose}
                                >
                                    {t('continueInBrowser')}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default DeepLinkSheet
