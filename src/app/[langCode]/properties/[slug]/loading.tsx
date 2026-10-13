import Layout from "@/components/layout/Layout"
import PropertyDetailsPageSkeleton from "@/components/skeletons/pages/PropertyDetailsPageSkeleton"

export default function Loading() {
    return (
        <Layout>
            <PropertyDetailsPageSkeleton />
        </Layout>
    )
}
