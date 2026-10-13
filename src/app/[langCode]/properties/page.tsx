import { Suspense } from "react"
import PropertyPage from "@/components/pagesComponent/property/PropertyPage"
import { generateMetaInfo, getSchemaMarkup } from "@/hooks/useGenerateMetaInfo"
import { Metadata } from "next"
import JsonLd from "@/components/Schema/JsonLd"
import Layout from "@/components/layout/Layout"
import PropertyPageSkeleton from "@/components/skeletons/pages/PropertyPageSkeleton"
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { queryConfig } from "@/lib/queryConfig"
import { getProperties } from "@/api/server/getProperties"
import { getPropertiesQueryKey } from "@/hooks/queries/useProperties"
import { getSettingsServer } from "@/api/server/getSettingsServer"
import { cookies } from "next/headers"
import { BASIC_DETAILS_COOKIE_NAME } from "@/utils/basicDetailsCookie"
import type { BasicDetails } from "@/hooks/queries/useSettings"

export async function generateMetadata({ params }: { params: Promise<{ langCode: string }> }): Promise<Metadata> {
    const { langCode } = await params;
    return generateMetaInfo({
        page: 'hotels',
        language_code: langCode,
    })
}

const Page = async ({ params, searchParams }: {
    params: Promise<{ langCode: string }>;
    searchParams: Promise<{ adults?: string; children?: string; citySlug?: string; rooms?: string; pets?: string }>;
}) => {
    const { langCode } = await params;
    const { adults, children, citySlug, rooms, pets } = await searchParams

    const schemaMarkup = await getSchemaMarkup({
        page: "hotels",
        language_code: langCode
    });

    const queryClient = new QueryClient({ defaultOptions: { queries: queryConfig } });

    // isMultiMode is NOT always false on first render — settings.data is preloaded into redux
    // server-side (see src/app/layout.tsx's preloadedState), so businessMode is already the
    // real value by the time PropertyPage.tsx's useProperties() call fires on mount. Re-derive
    // it the same way here so the multi-mode-gated fields line up too, instead of just
    // adults/children. basic_details is cookied client-side (Layout.tsx) since it's small;
    // fall back to the full settings fetch when the cookie hasn't been set yet (first cold visit).

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

    const isMultiMode = basicDetails?.business_mode === 'multi';

    // Matches the filters PropertyPage.tsx's useProperties() call fires with on a true cold
    // first render:
    // - adults/children: from the URL when present, else the bookingDetails redux defaults
    //   (adults:2, children:0) — bookingDetails itself isn't preloaded server-side.
    // - city_slug: PropertyPage.tsx's citySlug state lazy-inits from the same searchParams.
    // - rooms/pets: from the URL when present (PropertyPage.tsx reads both the same way, like
    //   adults/children), else the bookingDetails redux defaults (rooms:1, pets:false).
    // - property_type_id/ratings/rules: sidebarFilter defaults (all empty) — not URL-driven
    //   on the client, so left as fixed defaults here too.
    // - lat/lng end up undefined either side (latLong/selectedLocation are null pre-hydration),
    //   so they're equivalent to omitted and left out here.
    // check_in/check_out (isFromSearch) and sidebar price/amenities/sort filters are still
    // false/empty on first paint regardless of the URL, and a restored currency is still async
    // (redux-persist) — all left out. Any mismatch just falls back to a normal client fetch.
    const propertiesFilters = {
        adults: adults ? Number(adults) : 2,
        amenities: '',
        children: children ? Number(children) : 0,
        min_price: 0,
        max_price: 0,
        pay_at_property: 0,
        ...(isMultiMode && {
            city_slug: citySlug || '',
            pets: pets !== undefined ? pets === 'true' : false,
            property_type_id: [],
            rooms: rooms ? Number(rooms) : 1,
            ratings: [],
            rules: '',
        }),
    };
    await queryClient.prefetchQuery({
        queryKey: getPropertiesQueryKey(propertiesFilters, 1, null),
        queryFn: () => getProperties(propertiesFilters, 1),
    });

    return (
        <>
            <Suspense fallback={<Layout><PropertyPageSkeleton /></Layout>}>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <PropertyPage />
                </HydrationBoundary>
            </Suspense>
            {schemaMarkup && <JsonLd data={schemaMarkup} />}
        </>
    )
}

export default Page
