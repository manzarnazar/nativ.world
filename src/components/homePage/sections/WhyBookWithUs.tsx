'use client'
import Icon1 from '@/assets/images/verifyStays.svg'
import Icon2 from '@/assets/images/securePayment.svg'
import Icon3 from '@/assets/images/confimation.svg'
import Icon4 from '@/assets/images/support.svg'
import { PiArrowRight, PiBuildings } from 'react-icons/pi'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslation } from '@/hooks/useTranslation'
import SectionInfo from '@/components/storyBook/molecules/SectionInfo'
import { Typography } from '@/components/storyBook/atoms/Typography'
import ImagePreview from '@/components/storyBook/atoms/ImagePreview'
import Divider from '@/components/storyBook/atoms/Divider'
import { useSelector } from 'react-redux'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice'
import { listVariants, itemVariants } from '@/lib/motionVariants'


const WhyBookWithUs = () => {

    const { t } = useTranslation();
    const langCode = useSelector(currentLangCodeSelector);

    const features = [
        {
            icon: Icon1,
            title: t('verifiedStaysTitle'),
            description: t('verifiedStaysDesc'),
        },
        {
            icon: Icon2,
            title: t('securePaymentsTitle'),
            description: t('securePaymentsDesc'),
        },
        {
            icon: Icon3,
            title: t('instantConfirmationTitle'),
            description: t('instantConfirmationDesc'),
        },
        {
            icon: Icon4,
            title: t('dedicatedSupportTitle'),
            description: t('dedicatedSupportDesc'),
        },
    ]

    return (
        <section className="max-md:mt-0 commonMT commonPY pb-12">
            <div className="container">
                <div className='grid grid-cols-1 gap-6'>
                    {/* Header */}
                    <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <SectionInfo title={t('whyBookUs')} desc={t('whyBookUsDesc')} />
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        className="grid grid-cols-2 min-1200:grid-cols-4 gap-6 sm:commonGap"
                        variants={listVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {features.map((feature, index) => {
                            return (
                                <motion.div
                                    key={index}
                                    className="primaryLightBg rounded-2xl max-575:p-3 between-1200-1399:p-4 p-6 flex flex-col gap-4 md:gap-6 lg:commonGap border primaryLightBorderColor"
                                    variants={itemVariants}
                                >
                                    {/* Icon */}
                                    <div className="w-12 h-12 md:w-24 md:h-24 bg-white rounded-full flexCenter">
                                        <ImagePreview src={feature.icon} alt={feature.title} className='w-6 h-6 sm:w-12 sm:h-12' />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-4 min-1200:gap-6 mt-4 sm:mt-8 min-1200:mt-36">
                                        <Typography variant='h3' children={feature.title} weight='semibold' />
                                        <Divider className='bg-[#D1E3FA]!' />
                                        <Typography variant='desc2' children={feature.description} weight='medium' />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>

                    {/* CTA Banner */}
                    <motion.div
                        className="bg-white rounded-2xl p-4 between-992-1199:p-4 md:p-6 flex flex-col lg:flex-row items-center justify-between gap-4 border primaryLightBorderColor"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="flex items-center gap-4 flex-wrap">
                            {/* User Avatars */}
                            <div className="flexCenter primaryBg h-14 w-14 rounded-xl text-white">
                                <PiBuildings size={24} />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col">
                                <Typography variant='h4' children={t('turnPropertyInBookingMagnet')} weight='semibold' />
                                <Typography variant='desc2' children={t('connetWithTravelers')} />
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link href={`/${langCode}/list-your-property`} className="primaryBtn btn_md between-992-1199:text-base md:btn_lg flexCenter gap-2 w-full text-center lg:w-fit ">
                            {t('listYourProperty')}
                            <PiArrowRight className="text-2xl rtl:rotate-180" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default WhyBookWithUs
