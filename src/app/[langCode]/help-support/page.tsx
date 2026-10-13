import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryConfig } from "@/lib/queryConfig";
import { getHelpSupport } from "@/api/server/getHelpSupport";
import { getHelpSupportQueryKey } from "@/hooks/queries/useHelpSupport";
import HelpSupport from "@/components/pagesComponent/helpSupport/HelpSupport"
import JsonLd from "@/components/Schema/JsonLd"
import { generateMetaInfo, getSchemaMarkup } from "@/hooks/useGenerateMetaInfo"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ langCode: string }> }): Promise<Metadata> {
    const { langCode } = await params;
    return generateMetaInfo({
        page: 'help-support',
        language_code: langCode,
    })
}

const Page = async ({ params }: { params: Promise<{ langCode: string }> }) => {

    const { langCode } = await params;

    const schemaMarkup = await getSchemaMarkup({
        page: "help-support",
        language_code: langCode
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: queryConfig } });

    // Base content (how-it-works + topics) — must match HelpSupport.tsx's useHelpSupport({ limit: 8 }) call for a hydration hit.
    await queryClient.prefetchQuery({
        queryKey: getHelpSupportQueryKey({ limit: 8 }),
        queryFn: () => getHelpSupport({ limit: 8 }),
    });

    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <HelpSupport />
            </HydrationBoundary>
            {schemaMarkup && <JsonLd data={schemaMarkup} />}
        </>
    )
}

export default Page
