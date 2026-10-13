import Layout from "@/components/layout/Layout";
import BlogDetailsSkeleton from "@/components/skeletons/pages/BlogsDetailsSkeleton";

export default function Loading() {
    return <Layout>
        <BlogDetailsSkeleton />
    </Layout>
}