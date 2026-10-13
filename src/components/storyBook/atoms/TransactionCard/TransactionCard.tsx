import React from 'react'
import Badge from '../Badge/Badge'
import { TransactionCardProps } from './TransactionCard.type'
import { formatLocalDate, formatLocalTime } from '@/utils/helpers'
import Divider from '../Divider'
import { statusVariantMap } from '@/components/pagesComponent/myAccount/transactions/Transactions'

const TransactionCard: React.FC<TransactionCardProps> = ({
    bookingNumber,
    status,
    date,
    description,
    amount,
    currencySymbol,
    type,
    transactionId,
    t,
}) => {
    const formattedDate = `${formatLocalDate(date)}, ${formatLocalTime(date)}`

    const isCredit = type === 'credit'
    const amountColor = isCredit ? 'text-green-600' : 'text-red-500'
    const amountPrefix = isCredit ? '+ ' : '- '

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col gap-3">
            {/* Booking ID + Status */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-xs textSecondaryColor leading-4">{t('bookingId')}</p>
                    <p className="text-sm font-medium primaryColor leading-5 truncate">{bookingNumber}</p>
                </div>
                <Badge
                    label={status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                    variant={statusVariantMap[status.toLowerCase()] ?? 'neutral'}
                    size="md"
                    rounded="lg"
                    className='rounded-sm'
                />
            </div>

            <Divider />

            {/* Date */}
            <div className="flex flex-col gap-0.5">
                <p className="text-xs textSecondaryColor leading-4">{t('transactionId')}</p>
                <p className="text-sm font-medium leading-5">{transactionId}</p>
            </div>
            {/* Date */}
            <div className="flex flex-col gap-0.5">
                <p className="text-xs textSecondaryColor leading-4">{t('date')}</p>
                <p className="text-sm font-medium leading-5">{formattedDate}</p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-0.5">
                <p className="text-xs textSecondaryColor leading-4">{t('description')}</p>
                <p className="text-sm font-medium leading-5 line-clamp-1">{description}</p>
            </div>

              <Divider />

            {/* Amount */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{t('amount')}</p>
                <p className={`text-sm font-medium text-right ${amountColor}`}>
                    {amountPrefix}{currencySymbol}{parseFloat(amount).toLocaleString()}
                </p>
            </div>
        </div>
    )
}

export default TransactionCard
