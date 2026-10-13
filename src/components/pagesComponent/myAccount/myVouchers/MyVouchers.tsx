'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import Layout from '@/components/layout/Layout'
import ProfileLayout from '../ProfileLayout'
import Badge from '@/components/storyBook/atoms/Badge/Badge'
import Pagination from '@/components/storyBook/atoms/Pagination'
import EmptyStatus from '@/components/commonComponents/EmptyStatus'
import { useGetOffers, OfferItem } from '@/hooks/queries/bookings/useGetOffers'
import { OffersPagination } from '@/hooks/queries/bookings/useGetOffers'
import { formateDatePretty } from '@/utils/helpers'

const PER_PAGE_OPTIONS = [5, 10, 25, 50]

const statusVariantMap: Record<string, 'success' | 'error' | 'warning' | 'neutral'> = {
    completed: 'success',
    active: 'success',
    expired: 'error',
    inactive: 'error',
    pending: 'warning',
}

const SkeletonRow = () => (
    <tr className="border-b border-gray-100">
        {Array.from({ length: 8 }).map((_, i) => (
            <td key={i} className="px-6 py-4">
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </td>
        ))}
    </tr>
)

const MyVouchers = () => {
    const { t } = useTranslation()
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)

    const { data, isLoading, isError, error } = useGetOffers({
        type: 'referral',
        scope: 'inactive',
        limit: perPage,
        offset: (currentPage - 1) * perPage,
    });

    useEffect(() => {
        if (isError) {
            console.log("error =>", error?.message);
        }
    }, [isError])

    const loading = isLoading
    const pagination: OffersPagination | undefined = data?.data?.pagination
    const items: OfferItem[] = data?.data?.items ?? []
    const totalPages = pagination?.last_page ?? 1
    const total = pagination?.total ?? 0

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const handlePerPageChange = (val: number) => {
        setPerPage(val)
        setCurrentPage(1)
    }

    const headers = [
        '#',
        t('voucherCode'),
        t('discount'),
        t('referee'),
        t('receivedDate'),
        t('expiryDate'),
        t('bookingId'),
        t('status'),
    ]

    return (
        <Layout>
            <ProfileLayout title={t('myVouchers')}>

                {/* DESKTOP table */}
                <div className="hidden md:block p-5">
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200" style={{ backgroundColor: '#E8F1FD' }}>
                                        {headers.map((h) => (
                                            <th key={h} className="px-6 py-3 tr:text-left rtl:text-right text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

                                    {!loading && items.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center">
                                                <EmptyStatus type="noDataFound" title={t('noVouchersYet')} description={t('noVouchersYetDesc')} />
                                            </td>
                                        </tr>
                                    )}

                                    {!loading && items.map((item, index) => {
                                        const receivedDate = formateDatePretty(item.received_at ?? item.created_at ?? '')
                                        const expiryDate = formateDatePretty(item.expires_at ?? '')
                                        const bookingRef = item.booking_number ?? (item.booking_id ? String(item.booking_id) : null)

                                        return (
                                            <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 textSecondaryColor">
                                                    {(currentPage - 1) * perPage + index + 1}
                                                </td>
                                                <td className="px-6 py-4 font-medium textPrimaryColor">{item.code}</td>
                                                <td className="px-6 py-4 textSecondaryColor">{item.discount_label}</td>
                                                <td className="px-6 py-4 textPrimaryColor">{item.referee ?? '—'}</td>
                                                <td className="px-6 py-4 textSecondaryColor whitespace-nowrap">{receivedDate || '—'}</td>
                                                <td className="px-6 py-4 textSecondaryColor whitespace-nowrap">{expiryDate || '—'}</td>
                                                <td className="px-6 py-4">
                                                    {bookingRef
                                                        ? <span className="primaryColor font-medium">{bookingRef}</span>
                                                        : <span className="textSecondaryColor">—</span>
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        label={item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                                                        variant={statusVariantMap[item.status.toLowerCase()] ?? 'neutral'}
                                                        size="sm"
                                                        rounded="lg"
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        {(loading || items.length > 0) && <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-2 text-sm textSecondaryColor">
                                <span>{t('showingResult')}</span>
                                <select
                                    value={perPage}
                                    onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                    className="border border-gray-200 rounded-md px-2 py-1 text-sm textPrimaryColor focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
                                >
                                    {PER_PAGE_OPTIONS.map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                                <span>{t('of')} {total}</span>
                            </div>
                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                                siblingCount={1}
                            />
                        </div>}
                    </div>
                </div>

                {/* MOBILE cards */}
                <div className="md:hidden px-4 py-4 pb-6 space-y-3">
                    {loading && Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse">
                            <div className="flex justify-between">
                                <div className="h-4 w-32 bg-gray-100 rounded" />
                                <div className="h-6 w-16 bg-gray-100 rounded-full" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {[1, 2, 3, 4].map(n => <div key={n} className="h-8 bg-gray-100 rounded" />)}
                            </div>
                        </div>
                    ))}

                    {!loading && items.length === 0 && <EmptyStatus type="noDataFound" title={t('noVouchersYet')} description={t('noVouchersYetDesc')} />}

                    {!loading && items.map((item) => {
                        const receivedDate = formateDatePretty(item.received_at ?? item.created_at ?? '')
                        const expiryDate = formateDatePretty(item.expires_at ?? '')
                        const bookingRef = item.booking_number ?? (item.booking_id ? String(item.booking_id) : null)

                        return (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-semibold textPrimaryColor">{item.code}</p>
                                    <Badge
                                        label={item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                                        variant={statusVariantMap[item.status.toLowerCase()] ?? 'neutral'}
                                        size="sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-xs textSecondaryColor">{t('discount')}</p>
                                        <p className="textPrimaryColor font-medium">{item.discount_label}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs textSecondaryColor">{t('referee')}</p>
                                        <p className="textPrimaryColor">{item.referee ?? '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs textSecondaryColor">{t('receivedDate')}</p>
                                        <p className="textPrimaryColor">{receivedDate || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs textSecondaryColor">{t('expiryDate')}</p>
                                        <p className="textPrimaryColor">{expiryDate || '—'}</p>
                                    </div>
                                    {bookingRef && (
                                        <div>
                                            <p className="text-xs textSecondaryColor">{t('bookingId')}</p>
                                            <p className="primaryColor font-medium">{bookingRef}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            siblingCount={1}
                            className="justify-center mt-2"
                        />
                    )}
                </div>

            </ProfileLayout>
        </Layout>
    )
}

export default MyVouchers
