import ConfirmBooking from '@/components/pagesComponent/confirmBooking/ConfirmBooking'
import { Suspense } from 'react'

const Page = () => {
    return (
        <Suspense>
            <ConfirmBooking />
        </Suspense>
    )
}

export default Page
