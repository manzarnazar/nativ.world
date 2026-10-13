import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { queryConfig } from '@/lib/queryConfig';
import { getHelpSupport } from '@/api/server/getHelpSupport';
import { getHelpSupportQueryKey } from '@/hooks/queries/useHelpSupport';
import Faqs from '@/components/pagesComponent/helpSupport/Faqs'
import JsonLd from '@/components/Schema/JsonLd'
import { generateMetaInfo, getSchemaMarkup } from '@/hooks/useGenerateMetaInfo'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ langCode: string }> }): Promise<Metadata> {
    const { langCode } = await params;
    return generateMetaInfo({
        page: 'help-support-faq',
        language_code: langCode,
    })
}

const Page = async ({ params, searchParams }:
    {
        params: Promise<{ langCode: string }>
        searchParams: Promise<{ type?: string }>;
    }) => {
    const { langCode } = await params;
    const { type } = await searchParams;

    const schemaMarkup = await getSchemaMarkup({
        page: "help-support-faq",
        language_code: langCode
    });

    const faqsData = await getHelpSupport({ type: type ? type : '' })

    return (
        <>
            <Faqs faqsData={faqsData} />
            {schemaMarkup && <JsonLd data={schemaMarkup} />}
        </>
    )
}

export default Page
