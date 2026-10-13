import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { queryConfig } from '@/lib/queryConfig'
import { getBlogs } from '@/api/server/getBlogs';
import { getBlogsQueryKey } from '@/hooks/queries/blogs/useBlogs';
import Blogs from '@/components/pagesComponent/blogs/Blogs'
import JsonLd from '@/components/Schema/JsonLd'
import { generateMetaInfo, getSchemaMarkup } from '@/hooks/useGenerateMetaInfo'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ langCode: string }> }): Promise<Metadata> {
    const { langCode } = await params;

    return generateMetaInfo({
        page: 'blogs',
        language_code: langCode,
    })
}

const Page = async ({ params }: { params: Promise<{ langCode: string }> }) => {

    const { langCode } = await params;

    const schemaMarkup = await getSchemaMarkup({
        page: "blogs",
        language_code: langCode
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: queryConfig } });

    // Default (unfiltered, page 1) filters — must match Blogs.tsx's computed filters/page for a hydration hit.
    await queryClient.prefetchQuery({
        queryKey: getBlogsQueryKey({ category_id: NaN, search: "" }, 1),
        queryFn: () => getBlogs(),
    });

    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Blogs />
            </HydrationBoundary>
            {schemaMarkup && <JsonLd data={schemaMarkup} />}
        </>
    )
}

export default Page
