'use client'
import { useTranslation } from '@/hooks/useTranslation'
import { usePathname, useParams } from 'next/navigation'
import Link from 'next/link'
import appleStore from '@/assets/images/apple-store.png'
import playStore from '@/assets/images/play-store.png'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import LanguageModal from '../modalsAndSheets/LanguageModal'
import CurrencyModal from '../modalsAndSheets/CurrencyModal'
import ImagePreview from '../storyBook/atoms/ImagePreview'
import { useSelector } from 'react-redux'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice'
import { settingsSelector } from '@/redux/reducers/settingsSlice'

const Footer = () => {

    const { t } = useTranslation();
    const pathname = usePathname();
    const params = useParams();
    const reduxLangCode = useSelector(currentLangCodeSelector);
    const langCode = (params?.langCode as string) ?? reduxLangCode ?? 'en';

    const setttingsData = useSelector(settingsSelector);

    const socialsMedia = setttingsData?.social_media_links
    const footerDesc = setttingsData?.web_config?.footer_description
    const appStoreUrl = setttingsData?.app_config?.appstore_url
    const playStoreUrl = setttingsData?.app_config?.playstore_url

    const companyLinks = [
        {
            id: 1,
            name: t('home'),
            link: `/${langCode}`
        },
        {
            id: 2,
            name: t('aboutUs'),
            link: `/${langCode}/about-us`
        },
        {
            id: 3,
            name: t('contactUs'),
            link: `/${langCode}/contact-us`
        },
        {
            id: 4,
            name: t('blogs'),
            link: `/${langCode}/blogs`
        },
    ];

    const supportLinks = [
        {
            id: 1,
            name: t('helpSupport'),
            link: `/${langCode}/help-support`
        },
        {
            id: 2,
            name: t('cancellationRefunds'),
            link: `/${langCode}/cancellation-refunds`
        },
        {
            id: 3,
            name: t('termsConditions'),
            link: `/${langCode}/terms-conditions`
        },
        {
            id: 4,
            name: t('privacyPolicy'),
            link: `/${langCode}/privacy-policy`
        },
        {
            id: 5,
            name: t('platformPolicy'),
            link: `/${langCode}/platform-policy`
        },
    ];


    const isHomePage = pathname === '/' || pathname === `/${langCode}`;

    return (
        <footer className={`${!isHomePage ? 'hidden md:block' : ''} pb-24 md:pb-0`}>
            <div className='bodyBg md:hidden py-6'>
                <div className="container flex flex-col gap-3">
                    <h3 className="text-lg font-medium">{t('downloadMobileApp')}</h3>
                    <div className="flex gap-4">
                        <Link href={playStoreUrl || "#"} target='_blank'>
                            <ImagePreview
                                src={playStore}
                                alt="Get it on Google Play"
                                className="w-40 h-auto rounded-lg"
                            />
                        </Link>
                        <Link href={appStoreUrl || "#"} target='_blank'>
                            <ImagePreview
                                src={appleStore}
                                alt="Get it on Google Play"
                                className="w-40 h-auto rounded-lg"
                            />
                        </Link>
                    </div>
                </div>
            </div>

            <div className='w-full secondaryBg text-white pt-8 md:pt-20'>
                <div className="container">
                    {/* Desktop Footer Grid */}
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-8 md:pb-10 border-b border-[var(--neutral-800)]">

                        {/* About Us Section */}
                        <div className="flex flex-col gap-8">
                            <h3 className="text-lg sm:text-xl font-bold text-white">{t('aboutUs')}</h3>
                            <p className="leading-relaxed opacity-70">
                                {footerDesc}
                            </p>
                            {
                                (socialsMedia?.length ?? 0) > 0 &&
                                <div className="space-y-2">
                                    <h4 className="text-base font-bold text-white">{t('followUs')}</h4>
                                    <div className="flex gap-3 flex-wrap">
                                        {
                                            socialsMedia?.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={item.link}
                                                    className="w-10 h-10 rounded-full bg-[#1f202e] flex items-center justify-center text-white hover:primaryBg transition-all duration-300 hover:shadow-[0px_6px_18px_-4px_#fff] "
                                                >
                                                    <ImagePreview src={item.image} alt={item.id.toString()} className='w-6! h-6! object-contain' />
                                                </Link>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                        </div>

                        {/* Company Section */}
                        <div className="flex flex-col gap-8">
                            <h3 className="text-lg sm:text-xl font-bold text-white">{t('company')}</h3>
                            <ul className="flex flex-col gap-4">
                                {
                                    companyLinks?.map((item) => (
                                        <li key={item.id} className='relative'>
                                            <Link href={item.link} className="text-[var(--neutral-50)] opacity-70 hover:primaryColor hover:opacity-100 transition-all duration-300 ml-0 hover:ml-3 before:absolute before:content-[''] before:w-1 before:h-1 before:rounded-full before:primaryBg before:top-1/2 before:-translate-y-1/2 before:left-0 before:transition-all before:duration-300 before:opacity-0 hover:before:opacity-100">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        {/* Support & Policies Section */}
                        <div className="flex flex-col gap-8">
                            <h3 className="text-lg sm:text-xl font-bold text-white">{t('supprtPolicies')}</h3>
                            <ul className="flex flex-col gap-4">
                                {
                                    supportLinks?.map((item) => (
                                        <li key={item.id} className='relative'>
                                            <Link href={item.link} className="text-[var(--neutral-50)] opacity-70 hover:primaryColor hover:opacity-100 transition-all duration-300 ml-0 hover:ml-3 before:absolute before:content-[''] before:w-1 before:h-1 before:rounded-full before:primaryBg before:top-1/2 before:-translate-y-1/2 before:left-0 before:transition-all before:duration-300 before:opacity-0 hover:before:opacity-100">
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        {/* Get the Mobile App Section */}
                        <div className="flex flex-col gap-8">
                            <h3 className="text-lg sm:text-xl font-bold text-white">{t('getTheMobileApp')}</h3>
                            <p className="leading-relaxed opacity-70">
                                {t('discoverStays')}
                            </p>
                            <div className="flex gap-4 max-1199:flex-wrap">
                                <Link href={playStoreUrl || "#"} target='_blank'>
                                    <ImagePreview
                                        src={playStore}
                                        alt="Get it on Google Play"
                                        className="w-40 h-auto rounded-lg"
                                    />
                                </Link>
                                <Link href={appStoreUrl || "#"} target='_blank'>
                                    <ImagePreview
                                        src={appleStore}
                                        alt="Get it on Google Play"
                                        className="w-40 h-auto rounded-lg"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* mobile footer  */}
                    <div className="grid md:hidden grid-cols-1 gap- pb-4 border-b border-[var(--neutral-800)]">

                        {/* About Us Section */}
                        <Accordion type="single" collapsible defaultValue="item-1">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className='[&>svg]:text-white'><h3 className="text-lg font-bold text-white min-h-12">{t('aboutUs')}</h3></AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-8">

                                        <p className="leading-relaxed opacity-70">
                                            {footerDesc}
                                        </p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Company Section */}
                        <Accordion type="single" collapsible defaultValue="item-1">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className='[&>svg]:text-white'>
                                    <h3 className="text-lg text-white">{t('company')}</h3>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-8">
                                        <ul className="flex flex-col gap-4">
                                            {
                                                companyLinks?.map((item) => (
                                                    <li key={item.id} className='relative'>
                                                        <Link href={item.link} className="min-h-12 py-2 text-[var(--neutral-50)] opacity-70 hover:primaryColor hover:opacity-100 transition-all duration-300 ml-0 hover:ml-3 before:absolute before:content-[''] before:w-1 before:h-1 before:rounded-full before:primaryBg before:top-1/2 before:-translate-y-1/2 before:left-0 before:transition-all before:duration-300 before:opacity-0 hover:before:opacity-100">
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* Support & Policies Section */}
                        <Accordion type="single" collapsible defaultValue="item-1">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className='[&>svg]:text-white'>
                                    <h3 className="text-lg font-bold text-white min-h-12">{t('supprtPolicies')}</h3></AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-col gap-8">
                                        <ul className="flex flex-col gap-4">
                                            {
                                                supportLinks?.map((item) => (
                                                    <li key={item.id} className='relative'>
                                                        <Link href={item.link} className="min-h-12 py-2 text-[var(--neutral-50)] opacity-70 hover:primaryColor hover:opacity-100 transition-all duration-300 ml-0 hover:ml-3 before:absolute before:content-[''] before:w-1 before:h-1 before:rounded-full before:primaryBg before:top-1/2 before:-translate-y-1/2 before:left-0 before:transition-all before:duration-300 before:opacity-0 hover:before:opacity-100">
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible defaultValue="item-1">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className='[&>svg]:text-white'><h3 className="text-lg font-bold text-white min-h-12">{t('followUs')}</h3></AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex gap-3 flex-wrap">
                                        {
                                            socialsMedia?.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={item.link}
                                                    className="w-10 h-10 rounded-full bg-[#1f202e] flex items-center justify-center text-white hover:primaryBg transition-all duration-300 hover:shadow-[0px_6px_18px_-4px_#fff] "
                                                >
                                                    <ImagePreview src={item.image} alt={item.id.toString()} className='w-6! h-6! object-contain' />
                                                </Link>
                                            ))
                                        }
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* Copyright Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-5 md:py-10 gap-4">
                        <p className="text-white">
                            {t('copyRight')} © {new Date().getFullYear()} <span className='font-semibold'>{process.env.NEXT_PUBLIC_WEB_NAME || ''}</span>.{t('allRightsReserved')}
                        </p>
                        <div className="flex gap-3">
                            <LanguageModal footer={true} />
                            <CurrencyModal footer={true} />
                        </div>
                    </div>
                </div>
            </div>
        </footer >
    )
}

export default Footer
