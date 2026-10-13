import { getAboutUsPageContent } from '@/api/server/getAboutUsPageContent';
import { getHomePageContent } from '@/api/server/getHomePageContent';
import { getPropertyDetails } from '@/api/server/getPropertyDetails';
import { getSettingsServer } from '@/api/server/getSettingsServer';
import AboutUsPage from '@/components/pagesComponent/AboutUsPage'
import JsonLd from '@/components/Schema/JsonLd'
import { BasicDetails } from '@/hooks/queries/useSettings';
import { generateMetaInfo, getSchemaMarkup } from '@/hooks/useGenerateMetaInfo'
import { BASIC_DETAILS_COOKIE_NAME } from '@/utils/basicDetailsCookie';
import { Metadata } from 'next'
import { cookies } from 'next/headers';

export async function generateMetadata({ params }: { params: Promise<{ langCode: string }> }): Promise<Metadata> {
    const { langCode } = await params;

    return generateMetaInfo({
        page: 'about-us',
        language_code: langCode,
    })
}

const Page = async ({ params }: { params: Promise<{ langCode: string }> }) => {

    const { langCode } = await params;
    const aboutUsContentData = await getAboutUsPageContent();
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

    const isSingleHotel = basicDetails?.business_mode === 'single' && basicDetails?.no_of_properties === 1;

    let homePageContentData = null;

    if (isSingleHotel) {
        homePageContentData = await getHomePageContent();
    }

    const amenities = homePageContentData?.data?.amenities;
    const testimonials = homePageContentData?.data?.featured_reviews;

    const propertyData = isSingleHotel && basicDetails?.slug
        ? await getPropertyDetails({ slug: basicDetails.slug })
        : null;

    const galleryImgs = propertyData?.data?.images?.primary ?? [];

    const schemaMarkup = await getSchemaMarkup({
        page: "about-us",
        language_code: langCode
    });

    return (
        <>
            <AboutUsPage aboutUsContent={aboutUsContentData} amenities={amenities || []} testimonials={testimonials || []} galleryImgs={galleryImgs} />
            {schemaMarkup && <JsonLd data={schemaMarkup} />}
        </>
    )
}

export default Page
