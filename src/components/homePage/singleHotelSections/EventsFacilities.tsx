'use client'

import { useEffect, useState } from 'react'
import { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import SectionInfo from '@/components/storyBook/molecules/SectionInfo'
import SwiperBullets from '@/components/storyBook/atoms/SwiperBullets'
import EventCard from '@/components/storyBook/organisms/EventCard'
import { getDirection } from '@/utils/helpers'
import { useTranslation } from '@/hooks/useTranslation'
import { motion } from 'framer-motion'
import { itemVariants } from '@/lib/motionVariants'
import { EventsApiResponse } from '@/api/server/getEvents'


interface EventsFacilitiesProps {
    eventsData: EventsApiResponse | null
}

const EventsFacilities = ({ eventsData }: EventsFacilitiesProps) => {

    const { t } = useTranslation();

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

    const events = eventsData?.data?.items ?? [];
    const error = eventsData?.error;

    useEffect(() => {
        if (error) {
            console.log('error => ', eventsData?.message)
        }
    }, [error]);

    useEffect(() => {
        if (error) {
            console.log("error in events api =>", error);
        }
    }, [error]);

    useEffect(() => {
        if (!api) return

        setCurrent(api.selectedScrollSnap())
        setScrollSnaps(api.scrollSnapList())

        const onSelect = () => setCurrent(api.selectedScrollSnap())
        const onReInit = () => {
            setScrollSnaps(api.scrollSnapList())
            setCurrent(api.selectedScrollSnap())
        }

        api.on('select', onSelect)
        api.on('reInit', onReInit)

        return () => {
            api.off('select', onSelect)
            api.off('reInit', onReInit)
        }
    }, [api]);

    return (
        (events?.length > 0) &&
        <section className='bodyBg commonPY'>
            <div className="container">
                <div className='space-y-6 sm:space-y-8 md:space-y-12'>

                    {/* Section Header */}
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <SectionInfo
                            badge={t('EventsBadge')}
                            title={t('EventsTitle')}
                            desc={t('EventsDesc')}
                            isCenter={true}
                        />
                    </motion.div>

                    {/* Carousel */}
                    <Carousel
                        opts={{ align: 'start', loop: false }}
                        className='w-full'
                        setApi={setApi}
                        dir={getDirection()}
                    >
                        <CarouselContent className='-ml-4 md:-ml-6'>
                            {
                                events.map((event) => (
                                    <CarouselItem
                                        key={event.id}
                                        className='pl-4 md:pl-6 basis-[75%] md:basis-[85%] lg:basis-[85%] xl:basis-[70%]'
                                    >
                                        <motion.div
                                            variants={itemVariants}
                                            initial="hidden"
                                            whileInView="show"
                                            viewport={{ once: true, amount: 0.2 }}
                                        >
                                            <EventCard
                                                event={event}
                                            />
                                        </motion.div>
                                    </CarouselItem>
                                ))
                            }
                        </CarouselContent>

                        {/* Bullets */}
                        {scrollSnaps.length > 1 && (
                            <SwiperBullets count={scrollSnaps.length} current={current} api={api} />
                        )}
                        <div className='hidden 2xl:flex items-center justify-center gap-4 mt-8'>
                            <CarouselPrevious className='absolute inset-y-0 translate-y-0 top-[40%] -left-16  h-10 w-10 border-black rtl:rotate-180' />
                            <CarouselNext className='absolute inset-y-0 translate-y-0 top-[40%]  -right-16 h-10 w-10 border-black rtl:rotate-180' />
                        </div>
                    </Carousel>


                </div>
            </div>
        </section>
    )
}

export default EventsFacilities
