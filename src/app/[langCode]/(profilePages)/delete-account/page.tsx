import DeleteAccount from '@/components/pagesComponent/myAccount/deleteAccount/DeleteAccount'
import WithAuth from '@/components/hoc/WithAuth'

const Page = () => {
    return (
        <WithAuth>
            <DeleteAccount />
        </WithAuth>
    )
}

export default Page
