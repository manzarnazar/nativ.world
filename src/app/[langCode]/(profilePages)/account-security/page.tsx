import AccountSecurity from '@/components/pagesComponent/myAccount/accountSecurity/AccountSecurity'
import WithAuth from '@/components/hoc/WithAuth'

const Page = () => {
    return (
        <WithAuth>
            <AccountSecurity />
        </WithAuth>
    )
}

export default Page
