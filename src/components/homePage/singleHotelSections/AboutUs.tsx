'use client'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { PiPhone } from 'react-icons/pi'
import SectionInfo from '@/components/storyBook/molecules/SectionInfo'
import ImagePreview from '@/components/storyBook/atoms/ImagePreview'
import { useSelector } from 'react-redux'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice'
import { motion } from 'framer-motion'
import { listVariants, itemVariants } from '@/lib/motionVariants'
import { AboutUsContent } from '@/api/server/getHomePageContent'

const AboutUs = ({ aboutUsData }: { aboutUsData: AboutUsContent }) => {

    const { t } = useTranslation();
    const langCode = useSelector(currentLangCodeSelector);

    return (
        aboutUsData?.title &&
        <section className='container commonPY'>
            <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20"
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div className='space-y-8 lg:space-y-10 order-2 sm:order-1' variants={itemVariants}>
                    <SectionInfo badge={t('aboutUs')} title={aboutUsData?.title} desc={aboutUsData?.description} showInRichText={true} />
                    <div className='flex flex-col gap-6'>

                        <div className='flex items-center'>
                            <Link href={`/${langCode}/about-us`} className='primaryBtn btn_md sm:btn_lg'>{aboutUsData?.button_text}</Link>
                            <Link href={`tel:${aboutUsData?.contact_no}`} className='btn_lg hidden sm:flexCenter gap-2'>
                                <span className='bg-black text-2xl text-white p-3 rounded-full'><PiPhone /></span>
                                <span className='font-semibold'>{aboutUsData?.contact_no}</span>
                            </Link>

                        </div>
                    </div>
                </motion.div>

                <motion.div className='flexCenter order-1 sm:order-2' variants={itemVariants}>
                    <ImagePreview src={aboutUsData?.image} className='w-full max-h-[278px] sm:max-h-[600px]' rounded='2xl' alt={aboutUsData?.title} />
                </motion.div>
            </motion.div>

        </section>
    )
}

export default AboutUs
