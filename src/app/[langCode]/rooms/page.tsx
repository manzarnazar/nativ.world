import { Suspense } from "react"
import PropertyPage from "@/components/pagesComponent/property/PropertyPage"
import { generateMetaInfo, getSchemaMarkup } from "@/hooks/useGenerateMetaInfo"
import { Metadata } from "next"
import JsonLd from "@/components/Schema/JsonLd"
import Layout from "@/components/layout/Layout"
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { queryConfig } from "@/lib/queryConfig"
import { getRooms } from "@/api/server/getRooms"
import { getRoomsQueryKey } from "@/hooks/queries/useRooms"
import { getSettingsServer } from "@/api/server/getSettingsServer"
import { cookies } from "next/headers"
import { BASIC_DETAILS_COOKIE_NAME } from "@/utils/basicDetailsCookie"
import { BasicDetails } from "@/hooks/queries/useSettings"

export async function generateMetadata({ params }: { params: Promise<{ langCode: string }> }): Promise<Metadata> {
    const { langCode } = await params;
    return generateMetaInfo({
        page: 'rooms',
        language_code: langCode,
    })
}

const Page = async ({ params, searchParams }: {
    params: Promise<{ langCode: string }>;
    searchParams: Promise<{ adults?: string; children?: string; rooms?: string; }>;
}) => {
    const { langCode } = await params;
    const { adults, children, rooms } = await searchParams;

    const cookieStore = await cookies();
    const basicDetailsCookieValue = cookieStore.get(BASIC_DETAILS_COOKIE_NAME)?.value;
    let basicDetails: BasicDetails | null = null;
    if (basicDetailsCookieValue) {
        try {
            basicDetails = JSON.parse(basicDetailsCookieValue) as BasicDetails;
        } catch {
            basicDetails = null;
        }
    }

    if (!basicDetails) {
        const settings = await getSettingsServer();
        basicDetails = settings?.data?.basic_details ?? null;
    }

    const propertySlug = basicDetails?.slug;

    const schemaMarkup = await getSchemaMarkup({
        page: "rooms",
        language_code: langCode
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: queryConfig } });

    // Must match the exact filter shape that PropertyPage.tsx's useRooms() sends on first
    // render — React Query does a deep-equality key check, so any extra/missing field
    // causes a cache miss and triggers a second client fetch.
    // PropertyPage.tsx lines 221-232 always include: property_slug, rooms, adults, children,
    // min_price, max_price, amenities, sort_by (+ conditional check_in/check_out).
    // check_in/check_out are omitted server-side (isFromSearch is false on first paint).
    const roomsFilters = {
        property_slug: propertySlug,          // bookingDetails.location on the client
        rooms: rooms ? Number(rooms) : 1,     // bookingDetails.rooms default = 1
        adults: adults ? Number(adults) : 2,  // bookingDetails.adults default = 2
        children: children ? Number(children) : 0, // bookingDetails.childrenCount default = 0
        min_price: 0,                         // sidebarFilter.minPrice default = ''→0
        max_price: 0,                         // sidebarFilter.maxPrice default = ''→0
        amenities: '',                        // sidebarFilter.amenities default = ''
        // sort_by: undefined,                   // sortBy state default = undefined
    };

    await queryClient.prefetchQuery({
        queryKey: getRoomsQueryKey(roomsFilters, 1, null),
        queryFn: () => getRooms(roomsFilters, 1),
    });

    return (
        <>
            <Suspense fallback={<Layout><></></Layout>}>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <PropertyPage />
                </HydrationBoundary>
            </Suspense>
            {schemaMarkup && <JsonLd data={schemaMarkup} />}
        </>
    )
}

export default Page
