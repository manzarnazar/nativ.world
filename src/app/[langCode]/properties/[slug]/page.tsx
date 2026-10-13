import PropertyDetailsPage from "@/components/pagesComponent/property/PropertyDetailsPage"
import { getPropertyDetails } from "@/api/server/getPropertyDetails"
import { getNearbyPlaces } from "@/api/server/getNearbyPlaces"
import { getReviews } from "@/api/server/getReviews"
import Layout from "@/components/layout/Layout"
import NoDataFound from "@/components/systemStates/NoDataFound"
import JsonLd from "@/components/Schema/JsonLd"
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { queryConfig } from "@/lib/queryConfig"

export async function generateMetadata({ params }: { params: Promise<{ slug: string, langCode: string }> }) {
    const { slug, langCode } = await params
    const property = await getPropertyDetails({ slug })
    const data = property?.data

    return {
        title: data?.meta_title || process.env.NEXT_PUBLIC_TITLE,
        description: data?.meta_description || process.env.NEXT_PUBLIC_DESCRIPTION,
        keywords: data?.meta_keywords || process.env.NEXT_PUBLIC_KEYWORDS,
        openGraph: {
            title: data?.meta_title || process.env.NEXT_PUBLIC_TITLE,
            description: data?.meta_description || process.env.NEXT_PUBLIC_DESCRIPTION,
            images: process.env.NEXT_PUBLIC_IMAGE,
            type: "website",
            siteName: process.env.NEXT_PUBLIC_WEB_NAME,
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: data?.meta_title || process.env.NEXT_PUBLIC_TITLE,
            description: data?.meta_description || process.env.NEXT_PUBLIC_DESCRIPTION,
            images: process.env.NEXT_PUBLIC_IMAGE,
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_WEB_URL}/${langCode}/properties/${slug}`,
        },
    }
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const resData = await getPropertyDetails({ slug });

    const schemaMarkup = resData?.data?.schema_markup
        ? (() => { try { return JSON.parse(resData.data.schema_markup) } catch { return null } })()
        : null;

    const queryClient = new QueryClient({ defaultOptions: { queries: queryConfig } });
    if (slug) {
        await queryClient.prefetchQuery({
            queryKey: ["nearbyPlaces", slug],
            queryFn: () => getNearbyPlaces({ slug }),
        });

        // Must match RateAndReviews' filters on the client's first render — property page
        // passes roomsPage=false, so it filters by property_slug only, no room_type_slug.
        const reviewsFilters = { property_slug: slug, sort: 'newest_first' };
        await queryClient.prefetchInfiniteQuery({
            queryKey: ["reviews", reviewsFilters],
            initialPageParam: 0,
            queryFn: () => getReviews(reviewsFilters),
        });
    }

    return (
        <div>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <PropertyDetailsPage propertyResData={resData} />
            </HydrationBoundary>
            {schemaMarkup && <JsonLd data={schemaMarkup} />}
        </div>
    )
}

export default Page
