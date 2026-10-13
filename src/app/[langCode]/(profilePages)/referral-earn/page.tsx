import ReferralEarn from '@/components/pagesComponent/myAccount/referralEarn/ReferralEarn'
import WithAuth from '@/components/hoc/WithAuth'

const Page = () => {
    return (
        <WithAuth>
            <ReferralEarn />
        </WithAuth>
    )
}

export default Page
