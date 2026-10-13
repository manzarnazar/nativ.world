import MyVouchers from '@/components/pagesComponent/myAccount/myVouchers/MyVouchers'
import WithAuth from '@/components/hoc/WithAuth'

const Page = () => {
    return (
        <WithAuth>
            <MyVouchers />
        </WithAuth>
    )
}

export default Page
