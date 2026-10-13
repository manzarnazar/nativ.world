export interface TransactionCardProps {
    bookingNumber: string
    transactionId: string
    status: string
    date: string
    description: string
    amount: string
    currencySymbol: string
    type: string
    t: (k: string) => string
}
