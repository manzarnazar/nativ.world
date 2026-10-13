'use client'
import { Button } from '@/components/storyBook/atoms/Button'
import SectionInfo from '@/components/storyBook/molecules/SectionInfo'
import { useTranslation } from '@/hooks/useTranslation'
import ImagePreview from '@/components/storyBook/atoms/ImagePreview'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice'
import { motion } from 'framer-motion'
import { listVariants, itemVariants } from '@/lib/motionVariants'
import { Amenity } from '@/api/server/getHomePageContent'

interface HotelServicesProps {
    bgWhite?: boolean;
    loading?: boolean;
    amenities: Amenity[]
}

const HotelServices = ({ bgWhite, amenities }: HotelServicesProps) => {

    const { t } = useTranslation();
    const allServices = amenities;

    const limit = 8

    const langCode = useSelector(currentLangCodeSelector);

    const pathname = usePathname();
    const isHomePage = pathname === `/${langCode}`;
    const [visibleCount, setVisibleCount] = useState(limit);

    const services = isHomePage ? allServices?.slice(0, limit) : allServices?.slice(0, visibleCount);
    const hasMore = !isHomePage && visibleCount < allServices?.length;

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + limit);
    };

    return (
        allServices?.length > 0 &&
        <section className={`commonPY ${bgWhite ? 'bg-white' : 'bodyBg'}`}>
            <div className="container space-y-10">
                <div>
                    <SectionInfo badge={t('hotelServices')} title={t('hotelServicesTitle')} desc={t('hotelServicesDesc')} isCenter={true} />
                </div>
                <motion.div
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 md:commonGap'
                    variants={listVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <>
                        {services?.map((facility) => (
                            <motion.div key={facility?.id} className='bg-white flex items-center gap-4 md:flex-col md:items-center md:gap-10 rounded-2xl border p-4 md:py-12 md:px-6' variants={itemVariants} initial="hidden" animate="show">
                                {/* Icon — small on mobile, large on desktop */}
                                <span className='w-12 h-12 md:w-28 md:h-28 shrink-0 rounded-2xl flexCenter bodyBg text-xl md:text-5xl'>
                                    <ImagePreview src={facility?.facility?.icon} alt={facility?.facility?.name} className='w-7! h-7! md:w-12! md:h-12!' />
                                </span>
                                {/* Text — left-aligned mobile, centered desktop */}
                                <div className='flex flex-col gap-1 md:gap-4 md:items-center md:text-center'>
                                    <h3 className='font-semibold text-sm md:text-xl'>{facility?.facility?.name}</h3>
                                    <p className='text-xs md:text-base textSecondaryColor'>{facility?.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </>
                </motion.div>

                <div className='flexCenter'>
                    {
                        bgWhite ?
                            hasMore ? (
                                <Button
                                    variant='primary'
                                    size='md'
                                    children={t('loadMore')}
                                    onClick={handleLoadMore}
                                />
                            )
                                :
                                allServices?.length > limit ?
                                    <Button
                                        variant='primary'
                                        size='md'
                                        children={t('showLess')}
                                        onClick={() => setVisibleCount(limit)}
                                    />
                                    : null
                            :
                            allServices?.length > limit &&
                            <Link href={`/${langCode}/about-us`}>
                                <Button variant='primary' size='md' children={t('discoverMore')} />
                            </Link>
                    }
                </div>
            </div>
        </section>
    )
}

export default HotelServices