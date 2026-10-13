import Layout from '@/components/layout/Layout'
import BookingDetailsPageSkeleton from '@/components/skeletons/pages/BookingDetailsPageSkeleton'
import React from 'react'

const Loading = () => {
    return (
        <Layout>
            <BookingDetailsPageSkeleton />
        </Layout>
    )
}

export default Loading