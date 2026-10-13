import PropertyDetailsPage from "@/components/pagesComponent/property/PropertyDetailsPage"
import { getRoomDetails } from "@/api/server/getRoomDetails"
import { getNearbyPlaces } from "@/api/server/getNearbyPlaces"
import { getReviews } from "@/api/server/getReviews"
import { getSettingsServer } from "@/api/server/getSettingsServer"
import Layout from "@/components/layout/Layout"
import NoDataFound from "@/components/systemStates/NoDataFound"
import JsonLd from "@/components/Schema/JsonLd"
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { queryConfig } from "@/lib/queryConfig"
import { cookies } from "next/headers"
import { BASIC_DETAILS_COOKIE_NAME } from "@/utils/basicDetailsCookie"
import { BasicDetails } from "@/hooks/queries/useSettings"

export async function generateMetadata({ params }: { params: Promise<{ slug: string, langCode: string }> }) {
    const { slug, langCode } = await params
    const room = await getRoomDetails({ slug })
    const data = room?.data

    const seoData = data?.items?.[0]?.room_type

    return {
        title: seoData?.meta_title || process.env.NEXT_PUBLIC_TITLE,
        description: seoData?.meta_description || process.env.NEXT_PUBLIC_DESCRIPTION,
        keywords: seoData?.meta_keywords || process.env.NEXT_PUBLIC_KEYWORDS,
        openGraph: {
            title: seoData?.meta_title || process.env.NEXT_PUBLIC_TITLE,
            description: seoData?.meta_description || process.env.NEXT_PUBLIC_DESCRIPTION,
            images: process.env.NEXT_PUBLIC_IMAGE,
            type: "website",
            siteName: process.env.NEXT_PUBLIC_WEB_NAME,
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: seoData?.meta_title || process.env.NEXT_PUBLIC_TITLE,
            description: seoData?.meta_description || process.env.NEXT_PUBLIC_DESCRIPTION,
            images: process.env.NEXT_PUBLIC_IMAGE,
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_WEB_URL}/${langCode}/rooms/${slug}`,
        },
    }
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const resData = await getRoomDetails({ slug });
    const roomDetails = resData?.data?.items?.[0]

    const schemaMarkup = roomDetails?.room_type?.schema_markup
        ? (() => { try { return JSON.parse(roomDetails?.room_type?.schema_markup) } catch { return null } })()
        : null;

    if (resData?.error) {
        return (
            <Layout>
                <div className='h-screen flexCenter'>
                    <NoDataFound />
                </div>
            </Layout>
        )
    }


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

    const isSingleHotel = basicDetails?.business_mode === 'single' && basicDetails?.no_of_properties === 1;

    const queryClient = new QueryClient({ defaultOptions: { queries: queryConfig } });
    if (propertySlug && isSingleHotel) {
        await queryClient.prefetchQuery({
            queryKey: ["nearbyPlaces", propertySlug],
            queryFn: () => getNearbyPlaces({ slug: propertySlug }),
        });
    }

    // Must match RateAndReviews' filters when propertySlug/sort default to the same values
    // it computes on the client's first render (PropertyDetailsPage.tsx passes this same
    // propertySlug down, roomsSlug = roomDetails.room_type.slug, sortBy defaults 'newest_first').
    const reviewsFilters = {
        property_slug: propertySlug,
        room_type_slug: roomDetails?.room_type?.slug,
        sort: 'newest_first',
    };
    if (propertySlug && roomDetails?.room_type?.slug) {
        await queryClient.prefetchInfiniteQuery({
            queryKey: ["reviews", reviewsFilters],
            initialPageParam: 0,
            queryFn: () => getReviews(reviewsFilters),
        });
    }

    return (
        <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <PropertyDetailsPage roomResData={roomDetails} propertySlug={propertySlug} />
            </HydrationBoundary>
            {schemaMarkup && <JsonLd data={schemaMarkup} />}
        </div>
    )
}

export default Page
