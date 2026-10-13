import { getBanners } from "@/api/server/getBanners";
import { getEvents } from "@/api/server/getEvents";
import { getHomePageContent } from "@/api/server/getHomePageContent";
import { getHomePageSections } from "@/api/server/getHomePageSections";
import { getProperties } from "@/api/server/getProperties";
import { getRooms } from "@/api/server/getRooms";
import { getSettingsServer } from "@/api/server/getSettingsServer";
import HomePage from "@/components/homePage/HomePage";
import JsonLd from "@/components/Schema/JsonLd";
import { BasicDetails } from "@/hooks/queries/useSettings";
import { generateMetaInfo, getSchemaMarkup } from "@/hooks/useGenerateMetaInfo";
import { BASIC_DETAILS_COOKIE_NAME } from "@/utils/basicDetailsCookie";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata({ params }: { params: Promise<{ langCode: string }> }): Promise<Metadata> {
  const { langCode } = await params;
  return generateMetaInfo({
    page: 'home',
    language_code: langCode,
  })
}

// Fetch schema markup for SEO
export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ langCode: string }>;
  searchParams: Promise<{ preview_platform?: string }>;
}) {

  const { langCode } = await params;
  const { preview_platform } = await searchParams;
  const platform = preview_platform === 'app' ? 'app' : 'web';

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
  const isSingleHotel = basicDetails?.business_mode === 'single' && basicDetails?.no_of_properties === 1;

  const bannersData = await getBanners();

  let homePageContentData = null;
  let homePageSectionsData = null;
  let eventsData = null;
  let roomsData = null;
  let propertiesData = null;

  if (isMultiMode) {
    homePageSectionsData = await getHomePageSections({ limit: 6, platform });
  } else {
    if (isSingleHotel) {
      [homePageContentData, eventsData, roomsData] = await Promise.all([
        getHomePageContent(),
        getEvents(),
        getRooms({ property_slug: basicDetails?.slug }, 1),
      ]);
    } else {
      [homePageContentData, eventsData, propertiesData] = await Promise.all([
        getHomePageContent(),
        getEvents(),
        getProperties({}, 1),
      ]);
    }
  }

  const schemaMarkup = await getSchemaMarkup({
    page: "home",
    language_code: langCode,
  });

  return (
    <>
      <main>
        <HomePage bannersData={bannersData} singleModeData={homePageContentData} multiModeData={homePageSectionsData} eventsData={eventsData} roomsData={roomsData} propertiesData={propertiesData} />
      </main>
      {schemaMarkup && <JsonLd data={schemaMarkup} />}
    </>

  );
}
