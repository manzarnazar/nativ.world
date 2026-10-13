import MyProfile from '@/components/pagesComponent/myAccount/profile/MyProfile'
import WithAuth from '@/components/hoc/WithAuth'

const Page = () => {
    return (
        <WithAuth>
            <MyProfile />
        </WithAuth>
    )
}

export default Page
