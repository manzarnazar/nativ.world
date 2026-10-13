import { getPropertyDetails } from "@/api/server/getPropertyDetails"
import { getSettingsServer } from "@/api/server/getSettingsServer"
import { BasicDetails } from "@/hooks/queries/useSettings"
import { BASIC_DETAILS_COOKIE_NAME } from "@/utils/basicDetailsCookie"
import { cookies } from "next/headers"
import Layout from "../layout/Layout"
import GalleryPageContent from "./GalleryPageContent"
import NoDataFound from "../systemStates/NoDataFound"

const GalleryPage = async () => {

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

  const propertyData = basicDetails?.slug
    ? await getPropertyDetails({ slug: basicDetails.slug })
    : null;

  const galleryImgs = propertyData?.data?.images?.gallery ?? [];

  return (
    <Layout>
      <section className="bg-white commonPY">
        {
          galleryImgs?.length > 0 ?
            <GalleryPageContent galleryImgs={galleryImgs} />
            :
            <NoDataFound />
        }
      </section>
    </Layout>
  )
}

export default GalleryPage
