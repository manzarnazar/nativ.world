'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import Layout from '@/components/layout/Layout'
import ProfileLayout from '../ProfileLayout'
import Badge from '@/components/storyBook/atoms/Badge/Badge'
import Pagination from '@/components/storyBook/atoms/Pagination'
import EmptyStatus from '@/components/commonComponents/EmptyStatus'
import { useTransactions, TransactionItem } from '@/hooks/queries/transactions/useTransactions'
import { PaginationType } from '@/types/GlobalTypes'
import { formatLocalDate, formatLocalTime, formatPriceHelper } from '@/utils/helpers'
import TransactionCard from '@/components/storyBook/atoms/TransactionCard'

const PER_PAGE_OPTIONS = [5, 10, 25, 50]

export const statusVariantMap: Record<string, 'success' | 'error' | 'info' | 'neutral'> = {
    success: 'success',
    failed: 'error',
    cancelled: 'error',
    pending: 'info',
    expired: 'error',
    flagged: 'info',
}


/* ── Skeleton row ───────────────────────────────────── */
const SkeletonRow = () => (
    <tr className="border-b border-gray-100">
        {Array.from({ length: 7 }).map((_, i) => (
            <td key={i} className="px-5 py-5">
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </td>
        ))}
    </tr>
)


/* ── Main component ─────────────────────────────────── */
const Transactions = () => {
    const { t } = useTranslation()
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)

    const { data, isLoading, error, isError } = useTransactions(currentPage, perPage)
    const pagination: PaginationType | undefined = data?.data?.pagination
    const items: TransactionItem[] = data?.data?.items ?? []
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

    useEffect(() => {
        if (isError) {
            console.log("error =>", error?.message);
        }
    }, [isError])

    return (
        <Layout>
            <ProfileLayout title={t('transactions')}>

                {/* ── DESKTOP / TABLET: table ─────────────────── */}
                <div className="hidden md:block p-5">
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200" style={{ backgroundColor: '#E8F1FD' }}>
                                        {['#', t('bookingInfo'), t('transactionId'), t('description'), t('amount'), t('status'), t('dateAndTime')].map((h) => (
                                            <th key={h} className="px-6 py-3 ltr:text-left rtl:text-right text-sm font-semibold text-gray-900 whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

                                    {!isLoading && items.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center">
                                                <EmptyStatus
                                                    type="noDataFound"
                                                    title={t('noTransactionsFoundTitle')}
                                                    description={t('noTransactionsFoundDescription')}
                                                />
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading && items.map((item, index) => (
                                        <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 textSecondaryColor">
                                                {(currentPage - 1) * perPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="primaryColor font-medium">ID: {item.booking_number}</p>
                                                {/* <p className="text-xs textSecondaryColor truncate max-w-36">{item.property_name}</p> */}
                                            </td>
                                            <td className="px-6 py-4 textSecondaryColor font-medium">{item.transaction_id || "-"}</td>
                                            <td className="px-6 py-4 font-medium textSecondaryColor">{item.description}</td>
                                            <td className={`    px-6 py-4 font-medium ${item.type === 'credit' ? 'successColor' : 'errorColor'}`}>
                                                {/* {item.currency_symbol}{parseFloat(item.amount).toLocaleString()} */}
                                                {item.type === 'credit' ? '+' : '-'}{item?.currency_symbol}{formatPriceHelper(Number(item?.amount))}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    label={item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                                                    variant={statusVariantMap[item.status.toLowerCase()] ?? 'neutral'}
                                                    size="lg"
                                                    rounded="lg"
                                                />
                                            </td>
                                            <td className="px-6 py-4 textSecondaryColor whitespace-nowrap font-medium">
                                                {`${formatLocalDate(item.created_at)} `}- <span className="font-normal!">{formatLocalTime(item.created_at)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer row: Showing Result + Pagination */}
                        <div className="border-t border-gray-200 px-5 py-4 flex items-center justify-between bg-white">
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
                        </div>
                    </div>
                </div>

                {/* ── MOBILE: cards ───────────────────────────── */}
                <div className="md:hidden px-4 py-4 pb-6 space-y-3">
                    {isLoading && Array.from({ length: 4 }).map((_, i) => (
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

                    {!isLoading && items.length === 0 && (
                        <EmptyStatus
                            type="noDataFound"
                            title={t('noTransactionsFoundTitle')}
                            description={t('noTransactionsFoundDescription')}
                        />
                    )}

                    {!isLoading && items.map((item, index) => (
                        <TransactionCard
                            key={item.id}
                            bookingNumber={item.booking_number}
                            status={item.status}
                            date={item.created_at}
                            description={item.description}
                            amount={item.amount}
                            currencySymbol={item.currency_symbol}
                            type={item.type}
                            transactionId={item?.transaction_id}
                            
                            t={t}
                        />
                    ))}

                    {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            siblingCount={1}
                            className="justify-center mt-4"
                        />
                    )}
                </div>

            </ProfileLayout>
        </Layout>
    )
}

export default Transactions
