import Transactions from '@/components/pagesComponent/myAccount/transactions/Transactions'
import WithAuth from '@/components/hoc/WithAuth'

const Page = () => {
    return (
        <WithAuth>
            <Transactions />
        </WithAuth>
    )
}

export default Page
