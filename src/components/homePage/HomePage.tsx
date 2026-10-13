'use client'
import Layout from "../layout/Layout"
import Slider from "./sections/Slider"
import { useSelector } from "react-redux"
import { businessModeSelector } from "@/redux/reducers/settingsSlice"
import { BasicDetails } from "@/hooks/queries/useSettings"
import SingleModeHome from "./SingleModeHome"
import MultiModeHome from "./MultiModeHome"
import { HomePageSectionsApiResponse } from "@/api/server/getHomePageSections"
import { HomepageContentApiResponse } from "@/api/server/getHomePageContent"
import { EventsApiResponse } from "@/api/server/getEvents"
import { BannersApiResponse } from "@/api/server/getBanners"
import { RoomsApiResponse } from "@/hooks/queries/useRooms"
import { PropertiesApiResponse } from "@/hooks/queries/useProperties"

interface HomePageProps {
    bannersData: BannersApiResponse | null
    singleModeData: HomepageContentApiResponse | null;
    multiModeData: HomePageSectionsApiResponse | null;
    eventsData: EventsApiResponse | null
    roomsData: RoomsApiResponse | null
    propertiesData: PropertiesApiResponse | null
}

const HomePage = ({ bannersData, singleModeData, multiModeData, eventsData, roomsData, propertiesData }: HomePageProps) => {

    const businessMode = useSelector(businessModeSelector) as BasicDetails;
    const isSingleHotel = businessMode?.business_mode === 'single';

    return (
        <Layout>
            <Slider bannersData={bannersData} />
            {
                isSingleHotel ?
                    <SingleModeHome homePageContentData={singleModeData} eventsData={eventsData} roomsData={roomsData} propertiesData={propertiesData} />
                    :
                    <MultiModeHome homePageSectionsData={multiModeData} />
            }
        </Layout>
    )
}

export default HomePage
