'use client'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useTranslation } from "@/hooks/useTranslation"
import { PiCaretRight } from "react-icons/pi"
import Link from "next/link"
import { currentLangCodeSelector } from "@/redux/reducers/languageSlice"
import HorizontalCard from "@/components/storyBook/molecules/PropertyCard/horizontalCard"
import VerticalCard from "@/components/storyBook/molecules/PropertyCard/verticalCard"
import PropertyCardSkeleton from "@/components/skeletons/PropertyCardSkeleton"
import SectionInfo from "@/components/storyBook/molecules/SectionInfo"
import { getDirection } from "@/utils/helpers"
import { PropertiesSectionProps } from "./PropertiesSection"
import { Property } from "@/hooks/queries/useProperties"


const PropertiesSliderSection = ({ title, properties, isLoading = false, isPropertySection, citySlug = '', countryId }: PropertiesSectionProps) => {

    const { t } = useTranslation()
    const router = useRouter()
    const langCode = useSelector(currentLangCodeSelector)

    if (!isLoading && properties?.length === 0) return null

    const handleRedirectDetailPage = (property: Property) => {
        router.push(`/${langCode}/properties/${property.slug}`)
    }

    const exploreAllHref = `/${langCode}/properties${citySlug || countryId
            ? `?${[
                citySlug && `citySlug=${encodeURIComponent(citySlug)}`,
                countryId && `countryId=${encodeURIComponent(countryId)}`,
            ]
                .filter(Boolean)
                .join("&")}`
            : ""
        }`;

    const skeletonItems = Array.from({ length: 5 })

    return (
        <section className={`container commonMT`}>

            {/* Desktop Carousel — HorizontalCard (md and above) */}
            <Carousel
                opts={{ align: "start", loop: false }}
                className="w-full hidden md:block"
                dir={getDirection()}
            >
                <div className="flex items-center justify-between mb-7">
                    <SectionInfo title={title} />
                    {isPropertySection ? (
                        <Link href={exploreAllHref} className='primaryColor flexCenter gap-2'>
                            {t('exploreAllStays')}
                            <PiCaretRight className='text-2xl' />
                        </Link>
                    ) :
                        properties?.length > 3 &&
                        (
                            <div className="flexCenter gap-4">
                                <CarouselPrevious className="left-0 relative sm:h-10 sm:w-10 translate-y-0 rtl:rotate-180" />
                                <CarouselNext className="right-0 relative sm:h-10 sm:w-10 translate-y-0 rtl:rotate-180" />
                            </div>
                        )}
                </div>
                <CarouselContent className="-ml-7">
                    {isLoading
                        ? skeletonItems.map((_, i) => (
                            <CarouselItem
                                key={i}
                                className="pl-[30px] basis-full sm:basis-[60%] md:basis-[60%] lg:basis-[50%] between-1200-1399:basis-2/5 2xl:basis-1/3"
                            >
                                <PropertyCardSkeleton horizontal />
                            </CarouselItem>
                        ))
                        : properties?.map((property) => (
                            <CarouselItem
                                key={property.id}
                                className="pl-[30px] basis-full sm:basis-[60%] md:basis-[60%] lg:basis-[50%] between-1200-1399:basis-2/5 2xl:basis-1/3 cursor-pointer"
                                onClick={() => handleRedirectDetailPage(property)}
                            >
                                <HorizontalCard property={property} />
                            </CarouselItem>
                        ))}
                </CarouselContent>
            </Carousel>

            {/* Mobile Carousel — VerticalCard (below md) */}
            <Carousel
                opts={{ align: "start", loop: false }}
                className="w-full md:hidden"
            >
                <div className="flex items-center justify-between mb-7 flex-wrap gap-y-3">
                    <h2 className="text-lg sm:text-2xl font-medium">
                        {title}
                    </h2>
                    {isPropertySection ? (
                        <Link href={exploreAllHref} className='primaryColor flexCenter gap-2'>
                            {t('exploreAllStays')}
                            <PiCaretRight className='text-2xl' />
                        </Link>
                    ) :
                        properties?.length > 3 &&
                        (
                            <div className="flexCenter gap-4">
                                <CarouselPrevious className="left-0 relative h-8 w-8 translate-y-0" />
                                <CarouselNext className="right-0 relative h-8 w-8 translate-y-0" />
                            </div>
                        )}
                </div>
                <CarouselContent className="-ml-2">
                    {isLoading
                        ? skeletonItems.map((_, i) => (
                            <CarouselItem
                                key={i}
                                className="pl-4 basis-[70%]"
                            >
                                <PropertyCardSkeleton />
                            </CarouselItem>
                        ))
                        : properties?.map((property) => (
                            <CarouselItem
                                key={property.id}
                                className="pl-4 basis-[70%] cursor-pointer"
                                onClick={() => handleRedirectDetailPage(property)}
                            >
                                <VerticalCard property={property} sliderSect={true} />
                            </CarouselItem>
                        ))}
                </CarouselContent>
            </Carousel>

        </section>
    )
}

export default PropertiesSliderSection
