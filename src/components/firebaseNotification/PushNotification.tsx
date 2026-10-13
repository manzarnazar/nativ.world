'use client'
import React, { useEffect } from 'react'
import 'firebase/messaging'
import { toast } from '@/lib/toast';
import useFirebaseData from '../../utils/Firebase'
import { useTranslation } from '@/hooks/useTranslation'
import { useRouter } from 'next/navigation'

const BOOKING_TYPES = ['booking', 'refund_completed', 'refund_failed', 'booking_updates', 'reminders', 'payments', 'refund_updates'];

function getNotificationUrl(data: Record<string, string> | undefined): string | null {
  if (!data) return null;
  const type = data.type;
  if (type === 'marketing') return data.redirect_url || '/';
  const bookingId = data.booking_id;
  if (BOOKING_TYPES.includes(type) && bookingId) {
    return `/en/my-bookings/${bookingId}`;
  }
  return null;
}

const PushNotificationLayout = ({ children }: { children: React.ReactNode }) => {
  const { fetchToken, onMessageListener } = useFirebaseData()
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    fetchToken(() => {}, () => {})
  }, [])

  useEffect(() => {
    onMessageListener((payload) => {
      try {
        const url = getNotificationUrl(payload.data as Record<string, string>)
        const title = payload.notification?.title || payload.data?.title || 'Notification'
        const body = payload.notification?.body || payload.data?.body || ''
        const image = payload.data?.image || payload.notification?.image
        toast.success(title, {
          description: body,
          image: image || undefined,
          onClick: url ? () => {
            if (url.startsWith('http://') || url.startsWith('https://')) {
              window.open(url, '_blank', 'noopener,noreferrer');
            } else {
              router.push(url);
            }
          } : undefined,
        })
      } catch (err) {
        console.error('Error handling foreground notification:', err)
      }
    }).catch((err) => {
      console.error('Error setting up foreground notification listener:', err)
    })
  }, [])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .catch((err) => {
          console.error('Service Worker registration failed: ', err)
        })
    }
  }, [])

  return <div>{children}</div>
}

export default PushNotificationLayout
