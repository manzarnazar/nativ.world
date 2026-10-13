'use client'
import AboutUs from "./singleHotelSections/AboutUs"
import HotelServices from "./singleHotelSections/HotelServices"
import SelectRooms from "./singleHotelSections/SelectRooms"
import HowItWorks from "./singleHotelSections/HowItWorks"
import EventsFacilities from "./singleHotelSections/EventsFacilities"
import Testimonials from "./singleHotelSections/Testimonials"
import { useEffect } from "react"
import { AboutUsContent, HomepageContentApiResponse } from "@/api/server/getHomePageContent"
import { EventsApiResponse } from "@/api/server/getEvents"
import { RoomsApiResponse } from "@/hooks/queries/useRooms"
import { PropertiesApiResponse } from "@/hooks/queries/useProperties"

interface MultiModeHomeProps {
  homePageContentData: HomepageContentApiResponse | null;
  eventsData: EventsApiResponse | null
  roomsData: RoomsApiResponse | null
  propertiesData: PropertiesApiResponse | null
}

const SingleModeHome = ({ homePageContentData, eventsData, roomsData, propertiesData }: MultiModeHomeProps) => {

  const homepageContent = homePageContentData;
  const error = homePageContentData?.error;

  useEffect(() => {
    if (error) {
      console.log('error => ', homePageContentData?.message)
    }
  }, [error]);

  const aboutUs = homepageContent?.data?.about_us;
  const amenities = homepageContent?.data?.amenities;
  const testimonials = homepageContent?.data?.featured_reviews;

  return (
    <div className="bg-white -mt-14 py-10 lg:py-24 md:py-16">
      <AboutUs aboutUsData={aboutUs as AboutUsContent} />
      <HotelServices amenities={amenities || []} />
      <SelectRooms roomsData={roomsData} propertiesData={propertiesData} />
      <HowItWorks />
      <EventsFacilities eventsData={eventsData} />
      <Testimonials testimonials={testimonials || []} />
    </div>
  )
}

export default SingleModeHome