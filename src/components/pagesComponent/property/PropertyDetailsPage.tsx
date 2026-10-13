'use client'

import { useState, useEffect, Suspense, useCallback } from "react"
import SearchBar from "../../commonComponents/SearchBar"
import Layout from "../../layout/Layout"
import RoomDetailsSingleHotel from "../../storyBook/atoms/RoomDetailsSingleHotel"
import Divider from "../../storyBook/atoms/Divider"
import PropertyPrice from "../../storyBook/atoms/PropertyPrice"
import { Button } from "../../storyBook/atoms/Button"
import { useTranslation } from "@/hooks/useTranslation"
import { PiArrowLeft, PiArrowRight, PiPlay } from "react-icons/pi"
import ImagePreview from "../../storyBook/atoms/ImagePreview"
import LightBox from "../../lightBox/LightBox"
import { AboutProperty } from "../../storyBook/atoms/AboutProperty"
import { Amenities } from "../../storyBook/atoms/Amenities"
import RateAndReviews from "../../storyBook/organisms/RateAndReviews/RateAndReviews"
import ShareModal from "../../modalsAndSheets/ShareModal"
import GalleryModal from "../../modalsAndSheets/GalleryModal"
import ReserveCard from "../../storyBook/organisms/ReserveNowCard/ReserveCard"
import { RoomImgsSlider } from "../../storyBook/atoms/RoomImgsSlider"
import WishlistBtn from "../../storyBook/atoms/WishlistBtn"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Typography } from "../../storyBook/atoms/Typography"
import ReserveRoomModal from "../../modalsAndSheets/ReserveRoomModal"
import MobileTabsbar from "../../storyBook/atoms/mobileTabsbar/MobileTabsbar"
import { useDispatch, useSelector } from "react-redux"
import { selectedRoomSelector, selectedRoomType, setSelectedRoom } from "@/redux/reducers/helpersReducer"
import { businessModeSelector } from "@/redux/reducers/settingsSlice"
import { BasicDetails } from "@/hooks/queries/useSettings"
import { PropertiesApiResponse } from "@/hooks/queries/usePropertyDetails"
import { HotelPolicies } from "../../storyBook/atoms/HotelPolicies"
import { useIsMobile } from "@/hooks/useMobile"
import SearchCard from "../../storyBook/organisms/searchCard"
import { Room, useRooms } from "@/hooks/queries/useRooms"
import { useNearbyPlaces } from "@/hooks/queries/useNearbyPlaces"
import Pagination from "../../storyBook/atoms/Pagination"
import { PaginationType } from "@/types/GlobalTypes"
import { bookingDetailsSelector } from "@/redux/reducers/bookingDetailsSlice"
import { formateDateForApi } from "@/utils/helpers"
import SearchCardSkeleton from "../../skeletons/SearchCardSkeleton"
import { Carousel, CarouselContent, CarouselItem } from "../../ui/carousel"

import DeepLinkSheet from "../../modalsAndSheets/DeepLinkSheet"
import { isLoginSelector } from "@/redux/reducers/userSlice"
import { currentLangCodeSelector } from "@/redux/reducers/languageSlice"
import RoomDetailsModal from "../../modalsAndSheets/RoomDetailsModal"
import NearbyPlaces from "./nearPlaces/NearbyPlaces"
import NoDataFound from "@/components/systemStates/NoDataFound"
import { Facility } from "@/api/server/getHomePageContent"

const RoomsDetailsPage = ({ propertyResData, roomResData, propertySlug }: { propertyResData?: PropertiesApiResponse | null, roomResData?: Room | null, propertySlug?: string }) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const router = useRouter();
    const path = usePathname();
    const dispatch = useDispatch();

    const selectedRoom = useSelector(selectedRoomSelector);
    const businessMode = useSelector(businessModeSelector) as BasicDetails;
    const isSingleHotel = businessMode?.business_mode === 'single' && businessMode?.no_of_properties === 1;
    const bookingDetails = useSelector(bookingDetailsSelector);
    const isLogin = useSelector(isLoginSelector);
    const langCode = useSelector(currentLangCodeSelector);

    const roomDetails = roomResData as Room;
    const propertyData = propertyResData?.data

    const roomsPage = path.includes('/rooms');
    const { slug } = useParams<{ slug: string }>();

    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrolled, setScrolled] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [currentPage, setCurrentPage] = useState(1);
    const [modalRoom, setModalRoom] = useState<import("@/hooks/queries/useRooms").Room | null>(null);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const { data: roomsData, isLoading: roomsLoading, error: roomsError, isError: roomsIsError } = useRooms({
        property_slug: slug,
        check_in: formateDateForApi(bookingDetails.checkIn),
        check_out: formateDateForApi(bookingDetails.checkout),
        rooms: bookingDetails.rooms,
        adults: bookingDetails.adults,
        children: bookingDetails.childrenCount,
    }, currentPage, !roomsPage ? true : false);

    const resData = roomsData?.data

    const pagination: PaginationType | undefined = resData?.pagination;
    const totalPages = pagination?.last_page ?? 1;

    useEffect(() => {
        if (roomsIsError) {
            console.log("roomsError =>", roomsError)
        }
    }, [roomsIsError])

    // selectedRoom is redux initialState ({}) until a room is picked from the list — falling
    // back to propertySlug (the room's property slug, passed down from rooms/[slug]/page.tsx's
    // SSR prefetch) keeps this key matching the server prefetch on the very first render.
    const { data: nearbyPlacesData } = useNearbyPlaces(roomsPage ? (selectedRoom?.property?.slug || propertySlug || '') : slug, roomsPage ? businessMode?.business_mode === 'single' && businessMode?.no_of_properties === 1 ? true : false : true);

    const amenitiesData = roomsPage ? roomDetails?.room_type?.facilities : propertyData?.facilities as Facility[]
    const reviewsCount = roomsPage ? roomDetails?.reviews_count : propertyData?.reviews_count
    const roomType = resData && resData?.items?.length > 0;
    const locations = nearbyPlacesData && nearbyPlacesData?.data?.length > 0;
    const policies = propertyData?.rules || [];

    const tabs = [
        { id: 'overview', label: t('overview') },
        ...(roomType ? [{ id: 'roomType', label: t('roomType') }] : []),
        ...(amenitiesData?.length ? [{ id: 'amenities', label: t('amenities') }] : []),
        ...(locations ? [{ id: 'locations', label: t('locations') }] : []),
        ...(policies.length ? [{ id: 'policies', label: t('policies') }] : []),
        ...(reviewsCount ? [{ id: 'reviews', label: t('rateReviews') }] : []),
    ]

    useEffect(() => {
        const updateActive = () => {
            setScrolled(window.scrollY > 10)

            // find tabbar bottom dynamically — no hardcoded heights
            const tabbar = document.getElementById('page-tabbar')
            const threshold = tabbar ? tabbar.getBoundingClientRect().bottom + 8 : 170

            let current = tabs[0]?.id ?? 'overview'
            let closestTop = -Infinity

            for (const { id } of tabs) {
                const el = document.getElementById(id)
                if (!el) continue
                const top = el.getBoundingClientRect().top - threshold
                // section whose top just passed the threshold (≤0) and is closest to it
                if (top <= 0 && top > closestTop) {
                    closestTop = top
                    current = id
                }
            }
            setActiveTab(current)
        }

        // run once on mount to set initial state
        updateActive()

        window.addEventListener('scroll', updateActive, { passive: true })
        return () => window.removeEventListener('scroll', updateActive)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs.length])

    const imagesArr = roomsPage ? roomDetails?.room_type?.images : propertyData?.images.primary;
    const galleryImgs = propertyData?.images?.gallery;

    const lightboxImages = imagesArr?.map((img) => ({
        src: img.url,
        alt: roomsPage ? roomDetails?.room_type?.name : propertyData?.name!,
        media_type: img.media_type,
    })) || [];

    const openLightbox = (index: number) => {
        setCurrentIndex(index)
        setLightboxOpen(true)
    }


    // Clear coupon when room changes
    useEffect(() => {
        if (propertyData?.id) {
            dispatch(setSelectedRoom({} as selectedRoomType))
        }
        // console.log('propertyData?.is_favorited',propertyData)
    }, [propertyData?.id]);

    const propertyLocation = `${propertyData?.street_address},${propertyData?.city},${propertyData?.state},${propertyData?.country?.name}${propertyData?.zip_code ? ` -  ${propertyData?.zip_code}` : ''}`
    const isPetAllowed = roomsPage ? selectedRoom?.property?.pets_allowed : propertyData?.pets_allowed

    if (propertyResData?.error) {
        console.log('error in property details => ', propertyResData?.message)
        return (
            <Layout>
                <div className='h-screen flexCenter'>
                    <NoDataFound />
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="hidden lg:block">
                <Suspense>
                    <SearchBar />
                </Suspense>
            </div>
            <section className={`max-lg:overflow-x-auto bg-white lg:bg-transparent ${selectedRoom?.room?.id ? 'max-lg:pb-28' : ''}`}>
                <div className="relative lg:hidden">
                    <div className={`${scrolled ? 'fixed py-2 bg-white top-0' : 'absolute top-10'} z-12  w-full`}>
                        <div className="container flex items-center justify-between">
                            <div className="flexCenter gap-4">
                                <Button variant={`${scrolled ? 'text' : 'ghost'}`} className={`${scrolled ? 'p-0!' : 'h-10 w-10'}  shrink-0 border-0 hover:bg-transparent focus:ring-0 textPrimaryColor!`} onClick={() => router.back()}>
                                    <PiArrowLeft className='text-2xl' />
                                </Button>
                                {
                                    scrolled &&
                                    <Typography variant="h6" weight="medium" className="text-base! line-clamp-1 break-all">{roomsPage ? roomDetails?.room_type?.name : propertyData?.name}</Typography>
                                }
                            </div>

                            <div className={`flex items-center justify-end gap-3 ${roomsPage ? 'h-10 w-10' : ''}`}>
                                {
                                    !roomsPage &&
                                    <ShareModal bgTransparent={scrolled} />
                                }
                                {
                                    !roomsPage &&
                                    <WishlistBtn className={`relative! top-0! right-0! w-10! h-10! [&>svg]:text-2xl! ${scrolled ? 'border-none' : ''}`} isWishlisted={propertyData?.is_favorited} slug={propertyData?.slug || ''} />
                                }
                            </div>
                        </div>

                    </div>
                    <RoomImgsSlider
                        images={lightboxImages.map((img) => ({ src: img.src, media_type: img.media_type }))}
                        imageClassName="h-[325px]! aspect-390/325!"
                        roomsDetailsPage={true}
                    />
                    {
                        galleryImgs && galleryImgs?.length > 0 &&
                        <div className="absolute bottom-10 z-10 w-full">
                            <div className="container flex justify-end">
                                <GalleryModal galleryImgs={galleryImgs ?? []} propertyName={propertyData?.name || ''} propertyLocation={propertyLocation} />
                            </div>
                        </div>
                    }
                </div>

                <div className="bg-white pt-4 lg:commonPY">
                    <div className="container">
                        <div className="grid grid-cols-1 gap-6 ">
                            <div className="flex items-center justify-between">
                                <RoomDetailsSingleHotel
                                    name={roomsPage ? roomDetails?.room_type?.name : propertyData?.name || ""}
                                    rating={roomsPage ? roomDetails?.rating : propertyData?.rating || 0}
                                    reviews={roomsPage ? roomDetails?.reviews_count : propertyData?.reviews_count || 0}
                                    maxGuests={`${roomDetails?.room_type?.max_guests} adult${(roomDetails?.room_type?.max_guests ?? 0) > 1 ? 's' : ''}`}
                                    bedType={roomDetails?.room_type?.bed_type}
                                    roomSize={roomDetails?.room_size}
                                    detailPage={true}
                                    className="space-y-3"
                                    roomsCard={roomsPage}
                                    location={propertyLocation}
                                    propertyType={propertyData?.property_type?.name}
                                />

                                {
                                    !roomsPage &&
                                    <div className="hidden lg:flexCenter gap-10">
                                        <WishlistBtn className={`relative! top-0! right-0! w-10! h-10! [&>svg]:text-2xl! rounded-xl`} isWishlisted={propertyData?.is_favorited} slug={propertyData?.slug || ''} showLabel={true} />
                                        <div className="hidden lg:block">
                                            <ShareModal />
                                        </div>
                                    </div>
                                }
                            </div>
                            {
                                roomsPage &&
                                <Divider />
                            }
                            {
                                roomsPage &&
                                <div className="hidden lg:flex items-center justify-between flex-wrap gap-y-4">
                                    <PropertyPrice price={roomDetails?.converted_base_price_per_night} currency={roomDetails?.converted_currency_symbol} showTaxLabel={true} detailPage={true} roomsCard={roomsPage} />
                                    <div className="flexCenter gap-10">
                                        {/* <Button variant="text" children={t('save')} leftIcon={<PiHeart className="border rounded-xl w-10 h-10 flexCenter p-2" />} className="gap-3!" /> */}
                                        {
                                            !roomsPage &&
                                            <ShareModal />
                                        }
                                    </div>
                                </div>
                            }
                            <div className="hidden lg:grid grid-cols-2 commonGap">
                                {/* Main large image/video — index 0 */}
                                <div
                                    className="flexCenter cursor-pointer relative"
                                    onClick={() => openLightbox(0)}
                                >
                                    {imagesArr?.[0]?.media_type === 'video' ? (
                                        <div className="relative w-full aspect-795/663">
                                            <video src={`${imagesArr[0].url}#t=0.1`} className="w-full h-full object-cover rounded-2xl" preload="metadata" playsInline />
                                            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                                                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                                                    <PiPlay className="text-2xl text-black" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <ImagePreview src={imagesArr?.[0]?.url} alt={roomsPage ? roomDetails?.room_type?.name : propertyData?.name!} rounded="2xl" className="aspect-795/663" />
                                    )}
                                </div>
                                {/* 2×2 grid of smaller images/videos — indices 1-4 */}
                                <div className="grid grid-cols-2 commonGap">
                                    {imagesArr?.slice(1, 5).map((elem, idx) => (
                                        <div
                                            key={idx}
                                            className={`${idx === 3 && (roomsPage ? imagesArr?.length ?? 0 : galleryImgs?.length ?? 0) > 0 ? 'after:content-[""] after:absolute after:inset-0 after:bg-black/50 after:rounded-2xl z-1' : ''} cursor-pointer relative`}
                                            onClick={() => openLightbox(idx + 1)}>
                                            {elem.media_type === 'video' ? (
                                                <div className="relative w-full aspect-383/318">
                                                    <video src={`${elem.url}#t=0.1`} className="w-full h-full object-cover rounded-2xl" preload="metadata" playsInline />
                                                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                                                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                                                            <PiPlay className="text-lg text-black" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <ImagePreview src={elem.url} alt={roomsPage ? roomDetails?.room_type?.name : propertyData?.name!} rounded="2xl" className="aspect-383/318" />
                                            )}
                                            {
                                                idx === 3 && (
                                                    roomsPage
                                                        ? (imagesArr?.length ?? 0) > 4 &&
                                                        <button className="btn_sm md:btn_md lg:btn bg-[#0000004D] text-white md:bg-white flexCenter gap-2 absolute md:inset-0 md:w-fit md:h-fit md:m-auto md:textPrimaryColor! z-2">
                                                            <span>{t('seeAllPhotos')}</span>
                                                            <PiArrowRight className="md:text-2xl text-base rtl:rotate-180" />
                                                        </button>
                                                        : (galleryImgs?.length ?? 0) > 0 &&
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <GalleryModal galleryImgs={propertyData?.images?.gallery ?? []} propertyName={propertyData?.name || ''} propertyLocation={propertyLocation} />
                                                        </div>
                                                )
                                            }
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {/* <div id="activeScroll"></div> */}
                {
                    isMobile &&
                    <Divider className="mt-4" />
                }
                <MobileTabsbar
                    tabs={tabs}
                    activeTab={activeTab}
                    fixed={isMobile && scrolled}
                />
                <div className="pb-4 md:pt-6 lg:commonPY container">
                    <div className="grid grid-cols-12 commonGap">
                        <div className="col-span-12 lg:col-span-7 xl:col-span-8 md:space-y-4 bg-white lg:bg-transparent">
                            {/* about property  */}
                            {
                                <div id="overview"><AboutProperty roomsPage={roomsPage} description={roomsPage ? roomDetails?.room_type?.description : propertyData?.description || ""} petsAllowed={isPetAllowed} petPolicy={propertyData?.pet_policy_details || ''} /></div>
                            }

                            {
                                isMobile &&
                                <Divider />
                            }

                            {/* hotels rooms */}
                            {
                                (!roomsPage && (resData?.items && resData?.items?.length > 0)) || roomsLoading ?
                                    <div
                                        id="roomType"
                                        className={`bg-white rounded-2xl md:border ${isMobile ? 'container!' : ''} overflow-hidden py-4 md:p-4 flex flex-col gap-y-4 items-start`}
                                    >
                                        {/* Title */}
                                        <Typography variant="h5" weight="semibold">
                                            {t('roomType')}
                                        </Typography>

                                        {
                                            !isMobile &&
                                            <Divider width='bleed' />
                                        }

                                        <div className="flex flex-col gap-6 w-full">
                                            {
                                                roomsLoading ?
                                                    isMobile ? (
                                                        <Carousel className="w-full">
                                                            <CarouselContent>
                                                                {Array.from({ length: 3 }).map((_, i) => (
                                                                    <div key={i} className="w-full">
                                                                        <SearchCardSkeleton />
                                                                    </div>
                                                                ))}
                                                            </CarouselContent>
                                                        </Carousel>
                                                    ) :
                                                        Array.from({ length: 3 }).map((_, i) => (
                                                            <div key={i} className="w-full">
                                                                <SearchCardSkeleton />
                                                            </div>
                                                        ))
                                                    : isMobile ? (
                                                        <Carousel className="w-full">
                                                            <CarouselContent>
                                                                {resData?.items?.map((room) => (
                                                                    <CarouselItem key={room.id} className="pl-4 basis-[90%]">
                                                                        <SearchCard item={room} propertyData={resData?.property} roomsTypeCard={true} />
                                                                    </CarouselItem>
                                                                ))}
                                                            </CarouselContent>
                                                        </Carousel>
                                                    ) : (
                                                        resData?.items?.map((room) => (
                                                            <div key={room.id}>
                                                                <SearchCard item={room} propertyData={resData?.property} roomsTypeCard={true} setRoomsModal={setModalRoom} />
                                                            </div>
                                                        ))
                                                    )
                                            }

                                            {totalPages > 1 && (
                                                <Pagination
                                                    totalPages={totalPages}
                                                    currentPage={currentPage}
                                                    onPageChange={handlePageChange}
                                                    siblingCount={1}
                                                    className="mt-8 justify-center"
                                                />
                                            )}

                                            {modalRoom && (
                                                <RoomDetailsModal open={!!modalRoom} onClose={() => setModalRoom(null)} roomDetails={modalRoom} propertyData={resData?.property} />
                                            )}

                                        </div>
                                    </div>
                                    : null
                            }

                            {/* amenities */}
                            <div id="amenities">
                                <Amenities amenities={roomsPage ? roomDetails?.room_type?.facilities : propertyData?.facilities as Facility[]} />
                            </div>

                            {
                                isMobile &&
                                <Divider />
                            }

                            {/* nearby places */}
                            {
                                <div id="locations">
                                    <NearbyPlaces
                                        placesGroups={nearbyPlacesData?.data}
                                        lat={propertyData?.latitude}
                                        lng={propertyData?.longitude}
                                    />
                                </div>
                            }

                            {
                                isMobile &&
                                <Divider />
                            }

                            {/* hotel policies */}
                            {
                                !roomsPage &&
                                <div id="policies">
                                    <HotelPolicies policies={propertyData?.rules || []} checkIn={propertyData?.check_in_time} checkOut={propertyData?.check_out_time} />
                                </div>
                            }


                            {
                                isMobile &&
                                <Divider />
                            }

                            <div id="reviews">
                                <RateAndReviews
                                    roomsPage={roomsPage}
                                    propertySlug={roomsPage ? (selectedRoom?.property?.slug || propertySlug) : slug}
                                    roomsSlug={roomsPage ? roomDetails?.room_type?.slug : ''}
                                />
                            </div>

                        </div>
                        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 min-w-0">
                            <div className="sticky top-44 w-full">
                                <ReserveCard petsAllowed={isPetAllowed} propertySlug={propertyData?.slug} />
                            </div>
                        </div>
                    </div>

                </div>

                {
                    roomDetails && Object?.keys(roomDetails).length > 0 && selectedRoom && isLogin &&
                    <div className="fixed bottom-0 lg:hidden bg-white py-3 px-4 w-full z-10 shadow-[0px_8px_20px_0px_#00000014]">
                        <div className="container flex items-center justify-between gap-y-4">
                            <div className="w-min">
                                <PropertyPrice price={roomDetails?.converted_base_price_per_night} currency={roomDetails?.converted_currency_symbol} showTaxLabel={true} detailPage={true} fixedBottom={true} />
                            </div>
                            <ReserveRoomModal />

                        </div>
                    </div>
                }
            </section>

            <LightBox
                images={lightboxImages}
                isOpen={lightboxOpen}
                currentIndex={currentIndex}
                onClose={() => setLightboxOpen(false)}
                onIndexChange={setCurrentIndex}
            />

            <div className="lg:hidden">
                <Suspense>
                    <DeepLinkSheet />
                </Suspense>
            </div>
        </Layout >
    )
}

export default RoomsDetailsPage
