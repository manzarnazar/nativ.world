import Layout from '@/components/layout/Layout'
import TransactionsPageSkeleton from '@/components/skeletons/pages/TransactionsPageSkeleton'

const Loading = () => {
    return (
        <Layout>
            <TransactionsPageSkeleton />
        </Layout>
    )
}

export default Loading