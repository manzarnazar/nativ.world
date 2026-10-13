import Layout from '@/components/layout/Layout'
import MyBookingsPageSkeleton from '@/components/skeletons/pages/MyBookingsPageSkeleton'

const Loading = () => {
    return (
        <Layout>
            <MyBookingsPageSkeleton />
        </Layout>
    )
}

export default Loading