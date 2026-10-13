import MyBookings from '@/components/pagesComponent/myAccount/bookings/MyBookings'
import WithAuth from '@/components/hoc/WithAuth'

const Page = () => {
    return (
        <WithAuth>
            <MyBookings />
        </WithAuth>
    )
}

export default Page
