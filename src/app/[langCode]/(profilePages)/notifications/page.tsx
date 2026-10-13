import Notifications from '@/components/pagesComponent/myAccount/notifications/Notifications'
import WithAuth from '@/components/hoc/WithAuth'

const Page = () => {
    return (
        <WithAuth>
            <Notifications />
        </WithAuth>
    )
}

export default Page
