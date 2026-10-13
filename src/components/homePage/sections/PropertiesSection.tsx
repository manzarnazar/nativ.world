'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import { PiCaretRight } from 'react-icons/pi'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice'
import PropertiesSliderSection from './PropertiesSliderSection'
import VerticalCard from '@/components/storyBook/molecules/PropertyCard/verticalCard'
import PropertyCardSkeleton from '@/components/skeletons/PropertyCardSkeleton'
import SectionInfo from '@/components/storyBook/molecules/SectionInfo'
import { Button } from '@/components/storyBook/atoms/Button'
import { listVariants, itemVariants } from '@/lib/motionVariants'
import { Property } from '@/hooks/queries/useProperties'

export interface PropertiesSectionProps {
    title: string;
    properties: Property[];
    isLoading?: boolean;
    citySlug?: string;
    countryId?: number;
    isPropertySection?: boolean
}


const PropertiesSection = ({ title, properties, isLoading = false, citySlug = '', countryId, }: PropertiesSectionProps) => {

    const { t } = useTranslation()
    const router = useRouter()
    const langCode = useSelector(currentLangCodeSelector)

    if (!isLoading && properties.length === 0) return null

    const handleRedirectDetailPage = (property: Property) => {
        router.push(`/${langCode}/properties/${property.slug}`)
    }

    const url = `/${langCode}/properties${citySlug || countryId
            ? `?${[
                citySlug && `citySlug=${encodeURIComponent(citySlug)}`,
                countryId && `countryId=${encodeURIComponent(countryId)}`,
            ]
                .filter(Boolean)
                .join("&")}`
            : ""
        }`;

    return (
        <>
            <section className="hidden sm:block container commonMT">
                <motion.div
                    className="flex items-center justify-between mb-7"
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <SectionInfo title={title} />
                    {
                        properties?.length > 5 &&
                        <div className='flexCenter'>
                            <Link href={url} className='flexCenter gap-2'>
                                <Button variant='outline' size='md' children={t('exploreAllStays')} rightIcon={<PiCaretRight className='text-2xl' />} />
                            </Link>
                        </div>
                    }
                </motion.div>
                <motion.div
                    className="grid sm:grid-cols-2 lg:grid-cols-3 between-1200-1399:grid-cols-4 xl:grid-cols-5 commonGap"
                    variants={listVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <PropertyCardSkeleton key={i} />
                        ))
                        : properties?.slice(0, 5)?.map((property) => (
                            <motion.div
                                key={property.id}
                                className='cursor-pointer'
                                variants={itemVariants}
                                onClick={() => handleRedirectDetailPage(property)}
                            >
                                <VerticalCard property={property} />
                            </motion.div>
                        ))}
                </motion.div>
            </section>
            <section className="sm:hidden">
                <PropertiesSliderSection title={title} properties={properties} isLoading={isLoading} isPropertySection={true} citySlug={citySlug} countryId={countryId} />
            </section>
        </>
    )
}

export default PropertiesSection
