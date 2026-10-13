'use client'
import { PiArrowRight, PiCaretRight } from 'react-icons/pi'
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '../layout/Layout'
import { Typography } from '../storyBook/atoms/Typography'
import ImagePreview from '../storyBook/atoms/ImagePreview'
import { useSelector } from 'react-redux';
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice';
import propertyImage from '@/assets/images/listPropertyImage.png'
import { Button } from '../storyBook/atoms/Button';
import { useIsMobile } from '@/hooks/useMobile';
import Link from 'next/link';
import Divider from '../storyBook/atoms/Divider';
import { Skeleton } from '@/components/ui/skeleton';
import { useHelpSupport } from '@/hooks/queries/useHelpSupport';
import RegistratoinModals from './listYourProperty/PartnerRegistrationModals';

const ListYourProperty = () => {

    const { t } = useTranslation();
    const langCode = useSelector(currentLangCodeSelector);
    const isMobile = useIsMobile();

    const { data: baseData, isLoading: baseLoading } = useHelpSupport({ limit: 8, type: 'partner' });
    const helpByTopics = baseData?.data?.items

    const steps = [
        { num: '01', title: t('listPropertyStep1Title'), desc: t('listPropertyStep1Desc') },
        { num: '02', title: t('listPropertyStep2Title'), desc: t('listPropertyStep2Desc') },
        { num: '03', title: t('listPropertyStep3Title'), desc: t('listPropertyStep3Desc') },
        { num: '04', title: t('listPropertyStep4Title'), desc: t('listPropertyStep4Desc') },
    ];

    return (
        <Layout>
            <section className='commonPY bg-white'>
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 items-center">
                        <div className='space-y-6 lg:space-y-8 order-2 lg:order-1 h-full'>
                            <div className='space-y-2 sm:space-y-3'>
                                <Typography variant='h3' weight='bold'>{t('listPropertyTitle')}</Typography>
                                <Typography variant='desc1' weight='regular'>{t('listPropertyDesc')}</Typography>
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                {steps.map((step) => (
                                    <div key={step.num} className='primaryLightBg primaryLightBorderColor! border rounded-2xl p-4 sm:p-6 flex flex-col gap-3'>
                                        <span className='w-12 h-12 rounded-full primaryBg text-white flexCenter'>

                                            <Typography variant='h5' weight='semibold'>{step.num}</Typography>
                                        </span>
                                        <div className='flex flex-col gap-1'>
                                            <Typography variant='h5' weight='bold'>{step.title}</Typography>
                                            <Typography variant='desc2' weight='regular'>{step.desc}</Typography>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <RegistratoinModals />
                        </div>

                        <div className='flexCenter order-1 lg:order-2'>
                            <ImagePreview src={propertyImage.src} className='w-full h-60 sm:h-90 lg:h-159 aspect-770/636' rounded='2xl' alt={t('listPropertyTitle')} />
                        </div>
                    </div>
                </div>
            </section>
            {baseLoading ?
                <section className="hidden md:block container py-20">
                    <div className="space-y-6 md:space-y-10">
                        <div className="flex flex-col gap-2">
                            <Typography variant="h2" weight="semibold" className="textPrimaryColor!">
                                {t('helpByTopicsTitle')}
                            </Typography>
                            <Typography variant="subtitle2" weight="medium" className="textSecondaryColor!">
                                {t('helpByTopicsDesc')}
                            </Typography>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="bg-white rounded-2xl border p-3 md:p-4 flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="h-4 w-2/3 rounded-md" />
                                        <Skeleton className="h-3 w-full rounded-md" />
                                        <Skeleton className="h-3 w-5/6 rounded-md" />
                                    </div>
                                    <div className="my-2">
                                        <Skeleton className="h-px w-full" />
                                    </div>
                                    <Skeleton className="h-4 w-24 rounded-md" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                :
                helpByTopics && helpByTopics.length > 0 &&
                <section className="hidden md:block container py-20">
                    <div className="space-y-6 md:space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <Typography variant="h2" weight="semibold" className="textPrimaryColor!">
                                    {t('helpByTopicsTitle')}
                                </Typography>
                                <Typography variant="subtitle2" weight="medium" className="textSecondaryColor!">
                                    {t('helpByTopicsDesc')}
                                </Typography>
                            </div>
                            {
                                helpByTopics.length > 6 &&
                                <Link href={`/${langCode}/help-support/faqs?type=partner`}>
                                    <Button variant="primary" rightIcon={<PiArrowRight className="text-2xl rtl:rotate-180" />}>
                                        {t('viewAll')}
                                    </Button>
                                </Link>
                            }
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {helpByTopics?.slice(0, 6)?.map((topic, index) => (
                                <div key={index} className="bg-white rounded-2xl border p-3 md:p-4 flex flex-col gap-3 justify-between overflow-hidden items-start" >
                                    <div className="flex flex-col gap-1.5">
                                        <Typography variant="h5" weight="semibold" className="textPrimaryColor! first-letter:capitalize line-clamp-1">
                                            {topic?.title}
                                        </Typography>
                                        <Typography variant="desc2" weight="regular" className="first-letter:capitalize line-clamp-2">
                                            {topic?.description}
                                        </Typography>
                                    </div>
                                    <Divider width="bleed" />
                                    <Link href={`/${langCode}/help-support/faqs?type=partner&topic=${topic?.slug}`}>
                                        <Button variant="text" size="md" rightIcon={<PiArrowRight className="text-base rtl:rotate-180" />} className="primaryColor!">
                                            {t('readFaqs')}
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            }

            {!baseLoading && helpByTopics && helpByTopics.length > 0 &&
                <div className='bodyBg commonPY md:hidden'>
                    <div className="flex flex-col gap-6 container pb-4">
                        <section className="flex flex-col">
                            <div className="flex flex-col gap-2 mb-6">
                                <Typography variant="h2" weight="semibold" className="textPrimaryColor!">
                                    {t('helpByTopicsTitle')}
                                </Typography>
                                <Typography variant="subtitle2" weight="medium" className="textSecondaryColor!">
                                    {t('helpByTopicsDesc')}
                                </Typography>
                            </div>

                            {helpByTopics?.slice(0, 6)?.map((topic, index) => (
                                <Link key={index} href={`/${langCode}/help-support/faqs?type=partner&topic=${topic?.slug}`}>
                                    <button
                                        className="flex items-center gap-3 py-4 px-3 border rounded-xl mb-3 text-left cursor-pointer w-full bg-white"
                                    >
                                        <div className="flex-1 flex flex-col gap-1">
                                            <Typography variant="h6" weight="semibold" className="textPrimaryColor! first-letter:capitalize line-clamp-1">
                                                {topic?.title}
                                            </Typography>
                                            <Typography variant="desc2" weight="regular" className="text-xs! first-letter:capitalize line-clamp-2">
                                                {topic?.description}
                                            </Typography>
                                        </div>
                                        <PiCaretRight className="text-lg textSecondaryColor shrink-0" />
                                    </button>
                                </Link>
                            ))}

                            {
                                helpByTopics.length > 6 &&
                                <div className="flexCenter">
                                    <Link href={`/${langCode}/help-support/faqs`}>
                                        <Button variant="primary" rightIcon={<PiArrowRight className="text-2xl rtl:rotate-180" />}>
                                            {t('viewAll')}
                                        </Button>
                                    </Link>
                                </div>
                            }
                        </section>
                    </div>
                </div>
            }
        </Layout>
    )
}

export default ListYourProperty
