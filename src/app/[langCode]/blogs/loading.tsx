import Layout from '@/components/layout/Layout'
import BlogsPageSkeleton from '@/components/skeletons/pages/BlogsPageSkeleton'

const Loading = () => {
    return (
        <Layout>
            <BlogsPageSkeleton />
        </Layout>
    )
}

export default Loading