'use client'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { Suspense, useEffect, useState } from "react"
import SearchBar from "@/components/commonComponents/SearchBar"
import ImagePreview from "@/components/storyBook/atoms/ImagePreview"
import { useSelector } from "react-redux"
import { businessModeSelector } from "@/redux/reducers/settingsSlice"
import { useIsMobile } from "@/hooks/useMobile"
import { getDirection } from "@/utils/helpers"
import Autoplay from "embla-carousel-autoplay"
import Fade from "embla-carousel-fade"
import { BannersApiResponse } from "@/api/server/getBanners"

interface SliderProps {
    bannersData: BannersApiResponse | null
}

const Slider = ({ bannersData }: SliderProps) => {

    const businessMode = useSelector(businessModeSelector)
    const isSingleHotel = businessMode?.business_mode === 'single';

    const isMobile = useIsMobile();

    const [mounted, setMounted] = useState(false)
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    const banners = bannersData?.data ?? [];
    const isError = bannersData?.error ?? [];

    useEffect(() => {
        if (isError) {
            console.log("Banner API Error:", bannersData?.message);
        }
    }, [isError])

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!api) return

        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    const resolvedIsSingleHotel = isSingleHotel;
    const resolvedIsMobile = mounted ? isMobile : false;

    const handleRedirect = (url: string) => () => {
        if (!url) return
        window.open(url, '_blank')
    }

    return (
        <section className={`${resolvedIsSingleHotel ? 'w-full max-md:container' : 'max-1680:!container 2xl:w-[98%] mx-auto md:mt-14 rounded-2xl'} flex flex-col-reverse md:block`}>
            {banners.length > 0 ? (
                <Carousel className="relative" setApi={setApi} dir={getDirection()} opts={{
                    duration: 40,
                }} plugins={[
                    Fade(),
                    Autoplay({
                        delay: 4000,
                    }),
                ]}>
                    <CarouselContent>
                        {banners.map((item, index) => (
                            <CarouselItem key={item?.id} className={`relative ${item?.target_url ? 'cursor-pointer' : ''}`} onClick={handleRedirect(item?.target_url)}>
                                {/* Background Image with Overlay */}
                                <div className={`relative overflow-hidden ${resolvedIsSingleHotel ? '' : 'rounded-2xl'}`}>
                                    <div className="absolute inset-0 bg-black/20 rounded-2xl z-0" />
                                    <ImagePreview
                                        src={item?.image}
                                        alt={item?.title || `slider-${index + 1}`}
                                        className={`aspect-1920/750! transition-transform ease-out max-md:rounded-2xl`}
                                        rounded={`${resolvedIsSingleHotel ? 'none' : resolvedIsMobile ? '2xl' : '2xl'}`}
                                        objectFit="cover"
                                        loading="eager"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Buttons - Hidden on Mobile */}
                    {
                        banners?.length > 1 && <>
                            <CarouselPrevious className="hidden md:flex left-4 md:left-8 w-10 h-10 rtl:rotate-180" />
                            <CarouselNext className="hidden md:flex right-4 md:right-8 w-10 h-10 rtl:rotate-180" />
                        </>
                    }

                    {/* Pagination Dots - Visible on Mobile */}
                    <div className="py-4 flexCenter gap-1 md:hidden">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${current === index
                                    ? 'w-6 primaryBg'
                                    : 'w-2 bg-[var(--neutral-300)]'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </Carousel>
            ) : null}
            <div className={`md:mb-0 md:-mt-10 relative z-1 md:pb-0  ${banners?.length < 1 ? "mt-30! md:mt-24!" : "mt-24 pb-8"}`}>
                <Suspense>
                    <SearchBar homePage={true} />
                </Suspense>
            </div>
        </section>
    )
}

export default Slider
