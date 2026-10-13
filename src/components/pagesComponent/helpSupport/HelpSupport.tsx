'use client'
import { useState, useEffect, useRef } from "react"
import Layout from "../../layout/Layout"
import { Typography } from "../../storyBook/atoms/Typography"
import { Button } from "../../storyBook/atoms/Button"
import { useTranslation } from "@/hooks/useTranslation"
import { PiMagnifyingGlass, PiArrowRight, PiCaretRight } from "react-icons/pi"
import MobileBreadcrum from "../../storyBook/molecules/mobileBreadcrum/MobileBreadcrum"
import Divider from "../../storyBook/atoms/Divider"
import { useHelpSupport } from "@/hooks/queries/useHelpSupport"
import { Skeleton } from "@/components/ui/skeleton"
import NoDataFound from "@/components/systemStates/NoDataFound"
import Link from "next/link"
import { useSelector } from "react-redux"
import { currentLangCodeSelector } from "@/redux/reducers/languageSlice"
import { motion } from "framer-motion"
import { listVariants, itemVariants } from "@/lib/motionVariants"

const HelpSupport = () => {

    const { t } = useTranslation();
    const langCode = useSelector(currentLangCodeSelector);
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [showDropdown, setShowDropdown] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        setShowDropdown(!!searchQuery)
    }, [searchQuery])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const { data, isLoading } = useHelpSupport({ search: debouncedSearch });
    const { data: baseData, isLoading: baseLoading, isError: baseError, error } = useHelpSupport({ limit: 8 });

    useEffect(() => {
        if (baseError) {
            console.log("error =>", error?.message);
        }
    }, [baseError])

    const howItWorks = baseData?.data?.how_it_works
    const helpByTopics = baseData?.data?.items

    const searchResults = data?.data?.topics_and_faqs ?? []

    const handleSearch = (e: React.SyntheticEvent) => {
        e.preventDefault()
    }

    return (
        <Layout>
            <MobileBreadcrum title={t('helpSupport')} />

            {/* ── Search Section ── */}
            <section className="hidden md:block primaryLightBg py-10 md:py-16 lg:py-20">
                <div className="container flex flex-col gap-4 md:gap-6">

                    <motion.div
                        className="flex flex-col gap-2"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <Typography variant="h2" weight="semibold" className="textPrimaryColor!">
                            {t('helpSupportTitle')}
                        </Typography>
                        <Typography variant="subtitle2" weight="medium" className="textSecondaryColor!">
                            {t('helpSupportDesc')}
                        </Typography>
                    </motion.div>

                    {/* Search Bar + Dropdown */}
                    <motion.div
                        ref={searchRef}
                        className="relative w-full max-w-xl md:max-w-2xl"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <form onSubmit={handleSearch}>
                            <div className="flex items-center bg-white rounded-full border border-black overflow-hidden pl-4 md:pl-5 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-(--primary-color) focus-within:primaryBorder transition-all duration-200">
                                <PiMagnifyingGlass className="text-xl md:text-2xl textSecondaryColor shrink-0" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => searchQuery && setShowDropdown(true)}
                                    placeholder={t('helpSearchPlaceholder')}
                                    className="flex-1 px-3 md:px-4 py-1.5 text-sm md:text-base bg-transparent outline-none placeholder:textSecondaryColor textPrimaryColor"
                                />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    className="rounded-full! shrink-0"
                                >
                                    {t('search')}
                                </Button>
                            </div>
                        </form>

                        {/* Search Results Dropdown */}
                        {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border z-50 max-h-96 overflow-y-auto customScrollbar">
                                {isLoading ? (
                                    <div className="p-4 flex flex-col gap-2">
                                        {[...Array(3)].map((_, i) => (
                                            <Skeleton key={i} className="h-10 w-full rounded-lg" />
                                        ))}
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="flex flex-col">
                                        {searchResults.map((topic) => (
                                            topic.faqs?.length > 0 && (
                                                <div key={topic.id}>
                                                    {/* Topic header */}
                                                    <div className="px-4 py-2.5 primaryLightBg">
                                                        <Typography variant="h6" weight="semibold" className="primaryColor! first-letter:capitalize">
                                                            {topic.title}
                                                        </Typography>
                                                    </div>
                                                    {/* FAQs */}
                                                    {topic.faqs.map((faq, faqIdx) => (
                                                        <div key={faq.id}>
                                                            <Link href={`/${langCode}/help-support/faqs?topic=${topic.slug}`} onClick={() => setShowDropdown(false)}>
                                                                <div className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer">
                                                                    <Typography variant="desc1" weight="regular" className="textPrimaryColor! line-clamp-1 flex-1 pr-2">
                                                                        {faq.question}
                                                                    </Typography>
                                                                    <PiCaretRight className="text-base textSecondaryColor shrink-0" />
                                                                </div>
                                                            </Link>
                                                            {faqIdx < topic.faqs.length - 1 && <Divider />}
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 text-center">
                                        <Typography variant="desc1" weight="regular" className="textSecondaryColor!">
                                            {t('noDataFound')}
                                        </Typography>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {
                baseLoading ?
                    <>
                        <section className="hidden md:block bg-white py-20">
                            <div className="container space-y-6 md:space-y-10">
                                <div className="flex flex-col gap-2">
                                    <Typography variant="h2" weight="semibold" className="textPrimaryColor!">
                                        {t('howItWorksTitle')}
                                    </Typography>
                                    <Typography variant="subtitle2" weight="medium" className="textSecondaryColor!">
                                        {t('howItWorksDesc')}
                                    </Typography>
                                </div>
                                <div className="rounded-2xl overflow-hidden border">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                                        {[...Array(4)].map((_, indx) => {
                                            const borderClasses = [
                                                'border-b sm:border-r lg:border-b-0',
                                                'border-b lg:border-b-0 lg:border-r',
                                                'border-b sm:border-b-0 sm:border-r',
                                                '',
                                            ][indx];

                                            return (
                                                <div key={indx} className={`p-5 md:p-6 flex flex-col gap-4 ${borderClasses}`}>
                                                    <Skeleton className="w-11 h-11 md:w-12 md:h-12 rounded-full" />
                                                    <div className="flex flex-col gap-2">
                                                        <Skeleton className="h-4 w-3/4 rounded-md" />
                                                        <Skeleton className="h-3 w-full rounded-md" />
                                                        <Skeleton className="h-3 w-5/6 rounded-md" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>

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
                                                <Skeleton className="h-[1px] w-full" />
                                            </div>
                                            <Skeleton className="h-4 w-24 rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                    :
                    !baseError && howItWorks && helpByTopics &&
                        (howItWorks?.length > 0 || helpByTopics?.length > 0) ?
                        <>
                            {howItWorks?.length > 0 &&
                                <section className="hidden md:block bg-white py-20">
                                    <div className="container space-y-6 md:space-y-10">
                                        <motion.div
                                            className="flex flex-col gap-2"
                                            variants={itemVariants}
                                            initial="hidden"
                                            whileInView="show"
                                            viewport={{ once: true, amount: 0.2 }}
                                        >
                                            <Typography variant="h2" weight="semibold" className="textPrimaryColor!">
                                                {t('howItWorksTitle')}
                                            </Typography>
                                            <Typography variant="subtitle2" weight="medium" className="textSecondaryColor!">
                                                {t('howItWorksDesc')}
                                            </Typography>
                                        </motion.div>
                                        <div className="rounded-2xl overflow-hidden border">
                                            <motion.div
                                                className="lg:flex items-center grid grid-cols-1 sm:grid-cols-2 "
                                                variants={listVariants}
                                                initial="hidden"
                                                whileInView="show"
                                                viewport={{ once: true, amount: 0.2 }}
                                            >
                                                {howItWorks.map((step, indx) => {
                                                    const borderClasses = [
                                                        'border-b sm:border-r lg:border-b-0 last:border-0',
                                                        'border-b lg:border-b-0 lg:border-r last:border-0',
                                                        'border-b sm:border-b-0 sm:border-r last:border-0',
                                                        '',
                                                    ][indx]

                                                    return (
                                                        <motion.div key={indx} className={`p-5 md:p-6 flex flex-col gap-4 ${borderClasses}`} variants={itemVariants}>
                                                            <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-base md:text-lg">
                                                                {indx + 1}
                                                            </div>
                                                            <div className="flex flex-col gap-1.5">
                                                                <Typography variant="h5" weight="semibold" className="textPrimaryColor! first-letter:capitalize line-clamp-1">
                                                                    {step?.title}
                                                                </Typography>
                                                                <Typography variant="desc2" weight="regular" className="first-letter:capitalize line-clamp-2">
                                                                    {step?.description}
                                                                </Typography>
                                                            </div>
                                                        </motion.div>
                                                    )
                                                })}
                                            </motion.div>
                                        </div>
                                    </div>
                                </section>
                            }

                            {helpByTopics?.length > 0 &&
                                <section className="hidden md:block container py-20">
                                    <div className="space-y-6 md:space-y-10">
                                        <motion.div
                                            className="flex items-center justify-between"
                                            variants={itemVariants}
                                            initial="hidden"
                                            whileInView="show"
                                            viewport={{ once: true, amount: 0.2 }}
                                        >
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
                                                <Link href={`/${langCode}/help-support/faqs`}>
                                                    <Button variant="primary" rightIcon={<PiArrowRight className="text-2xl rtl:rotate-180" />}>
                                                        {t('viewAll')}
                                                    </Button>
                                                </Link>
                                            }
                                        </motion.div>
                                        <motion.div
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                                            variants={listVariants}
                                            initial="hidden"
                                            whileInView="show"
                                            viewport={{ once: true, amount: 0.2 }}
                                        >
                                            {helpByTopics?.slice(0, 6)?.map((topic, index) => (
                                                <motion.div key={index} className="bg-white rounded-2xl border p-3 md:p-4 flex flex-col gap-3 justify-between overflow-hidden items-start" variants={itemVariants}>
                                                    <div className="flex flex-col gap-1.5">
                                                        <Typography variant="h5" weight="semibold" className="textPrimaryColor! first-letter:capitalize line-clamp-1">
                                                            {topic?.title}
                                                        </Typography>
                                                        <Typography variant="desc2" weight="regular" className="first-letter:capitalize line-clamp-2">
                                                            {topic?.description}
                                                        </Typography>
                                                    </div>
                                                    <Divider width="bleed" />
                                                    <Link href={`/${langCode}/help-support/faqs?topic=${topic?.slug}`}>
                                                        <Button variant="text" size="md" rightIcon={<PiArrowRight className="text-base rtl:rotate-180" />} className="primaryColor!">
                                                            {t('readFaqs')}
                                                        </Button>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                </section>
                            }
                        </>
                        :
                        <NoDataFound />
            }


            <div className="flex md:hidden flex-col gap-6 mt-4 container pb-4">

                {/* ── Search Bar ── */}
                <section>
                    <div className="flex items-center rounded-full border border-black overflow-hidden pl-4 pr-4 py-3 focus-within:ring-2 focus-within:ring-(--primary-color) focus-within:primaryBorder transition-all duration-200">
                        <PiMagnifyingGlass className="text-xl textSecondaryColor shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('helpSearchPlaceholder')}
                            className="flex-1 px-3 text-sm bg-transparent outline-none placeholder:textSecondaryColor textPrimaryColor"
                        />
                    </div>
                </section>

                {
                    isLoading && searchQuery ?
                        <>
                            <section className="flex flex-col">
                                {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 py-4 px-3 border rounded-xl mb-3"
                                    >
                                        {/* Text */}
                                        <div className="flex-1 flex flex-col gap-2">
                                            <Skeleton className="h-4 w-3/4 rounded-md" />
                                            <Skeleton className="h-3 w-full rounded-md" />
                                            <Skeleton className="h-3 w-5/6 rounded-md" />
                                        </div>

                                        {/* Arrow placeholder */}
                                        <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                                    </div>
                                ))}
                            </section>

                            <section className="flex flex-col gap-4">
                                {/* Title */}
                                <Skeleton className="h-6 w-40 rounded-md" />

                                <div className="flex flex-col">
                                    {[...Array(4)].map((_, indx) => (
                                        <div key={indx}>
                                            <div className="flex items-start gap-4 py-4">
                                                {/* Circle */}
                                                <Skeleton className="w-10 h-10 rounded-full shrink-0" />

                                                {/* Content */}
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <Skeleton className="h-4 w-2/3 rounded-md" />
                                                    <Skeleton className="h-3 w-full rounded-md" />
                                                    <Skeleton className="h-3 w-5/6 rounded-md" />
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            {indx < 3 && <Skeleton className="h-[1px] w-full" />}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                        :
                        searchQuery ? (
                            searchResults.length > 0 ? (
                                <section className="flex flex-col">
                                    {searchResults.filter(topic => topic.faqs?.length > 0).map((topic) => (
                                        <div key={topic.id}>
                                            <Typography variant="h6" weight="semibold" className="primaryColor! first-letter:capitalize px-1 mb-1">
                                                {topic.title}
                                            </Typography>
                                            {topic.faqs.map((faq) => (
                                                <Link key={faq.id} href={`/${langCode}/help-support/faqs?topic=${topic.slug}`}>
                                                    <button className="flex items-center gap-3 py-4 px-3 border rounded-xl mb-3 w-full text-left cursor-pointer">
                                                        <div className="flex-1 flex flex-col gap-1">
                                                            <Typography variant="h6" weight="semibold" className="textPrimaryColor! first-letter:capitalize line-clamp-1">
                                                                {faq.question}
                                                            </Typography>
                                                        </div>
                                                        <PiCaretRight className="text-lg textSecondaryColor shrink-0" />
                                                    </button>
                                                </Link>
                                            ))}
                                        </div>
                                    )
                                    )}
                                </section>
                            ) : (
                                <NoDataFound />
                            )
                        ) : !baseError && howItWorks && helpByTopics &&
                            (howItWorks?.length > 0 || helpByTopics?.length > 0) ?
                            <>
                                <motion.section
                                    className="flex flex-col"
                                    variants={listVariants}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}
                                >
                                    {helpByTopics?.slice(0, 6)?.map((topic, index) => (
                                        <motion.div key={index} variants={itemVariants}>
                                            <Link href={`/${langCode}/help-support/faqs?topic=${topic?.slug}`}>
                                                <button
                                                    className="flex items-center gap-3 py-4 px-3 border rounded-xl mb-3 text-left cursor-pointer w-full"
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
                                        </motion.div>
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
                                </motion.section>
                                <section className="flex flex-col gap-4">
                                    <Typography variant="h3" weight="semibold" className="textPrimaryColor!">
                                        {t('howItWorksTitle')}
                                    </Typography>

                                    <motion.div
                                        className="flex flex-col"
                                        variants={listVariants}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true, amount: 0.2 }}
                                    >
                                        {howItWorks?.map((step, indx) => (
                                            <motion.div key={indx} variants={itemVariants}>
                                                <div className="flex items-start gap-4 py-4">
                                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                        {indx + 1}
                                                    </div>
                                                    <div className="flex flex-col gap-1 flex-1">
                                                        <Typography variant="h6" weight="semibold" className="textPrimaryColor! first-letter:capitalize line-clamp-1">
                                                            {step?.title}
                                                        </Typography>
                                                        <Typography variant="desc2" weight="regular" className="text-xs! first-letter:capitalize line-clamp-2">
                                                            {step?.description}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                {indx < howItWorks?.length - 1 && <Divider />}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </section>
                            </>
                            :
                            <NoDataFound />

                }


            </div>

        </Layout >
    )
}

export default HelpSupport
