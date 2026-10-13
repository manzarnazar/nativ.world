'use client'

import { useEffect, useState } from 'react'
import { X, Download, Share } from 'lucide-react'
import Image from 'next/image'
import logo from '@/assets/images/eStay.svg'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'pwa-install-dismissed'

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isInStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
  )
}

function isMobile() {
  return window.innerWidth < 768
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOSDevice, setIsIOSDevice] = useState(false)

  useEffect(() => {
    if (!isMobile()) return
    if (isInStandaloneMode()) return
    if (sessionStorage.getItem(DISMISS_KEY)) return

    const ios = isIOS()
    setIsIOSDevice(ios)

    if (ios) {
      setShowBanner(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    sessionStorage.setItem(DISMISS_KEY, '1')
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg border border-gray-100">
        <Image
          src={logo}
          alt="eStay"
          width={40}
          height={40}
          className="rounded-xl shrink-0 object-contain"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-tight">Install eStay</p>
          {isIOSDevice ? (
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">
              Tap <Share size={11} className="inline mb-0.5" /> then &ldquo;Add to Home Screen&rdquo;
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">
              Add to home screen for quick access
            </p>
          )}
        </div>
        {!isIOSDevice && (
          <button
            onClick={handleInstall}
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-black px-3 py-1.5 text-xs font-medium text-white"
          >
            <Download size={12} />
            Install
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-600"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
