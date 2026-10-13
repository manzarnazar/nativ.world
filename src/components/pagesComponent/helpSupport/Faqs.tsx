'use client'

import { useEffect, useRef, useState } from "react"
import Layout from "@/components/layout/Layout"
import { HelpSupportApiResponse } from "@/hooks/queries/useHelpSupport"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Typography } from "@/components/storyBook/atoms/Typography"
import MobileBreadcrum from "@/components/storyBook/molecules/mobileBreadcrum/MobileBreadcrum"
import { useTranslation } from "@/hooks/useTranslation"
import NoDataFound from "@/components/systemStates/NoDataFound"
import { useSearchParams } from "next/navigation"
import Divider from "@/components/storyBook/atoms/Divider"

interface FaqsProps {
    faqsData: HelpSupportApiResponse | null
}

const Faqs = ({ faqsData }: FaqsProps) => {
    const { t } = useTranslation()
    const [activeId, setActiveId] = useState<number | null>(null)
    const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({})
    const isProgrammaticScroll = useRef(false)
    const searchParams = useSearchParams()
    const topicParam = searchParams.get("topic")


    // const { data, isLoading, isError, error } = useHelpSupport({ type: faqType ? faqType : '' })
    const topics = faqsData?.data?.topics_and_faqs ?? []
    const isError = faqsData?.error

    useEffect(() => {
        if (isError) {
            console.log("error help-support api =>", faqsData?.message);
        }
    }, [isError])

    useEffect(() => {
        if (topics.length === 0) return
        if (topicParam) {
            const matched = topics.find((topic) => topic.slug === topicParam)
            if (matched) {
                setActiveId(matched.id)
                isProgrammaticScroll.current = true
                sectionRefs.current[matched.id]?.scrollIntoView({ behavior: "smooth", block: "start" })
                const finalize = () => {
                    setActiveId(matched.id)
                    isProgrammaticScroll.current = false
                }
                if ('onscrollend' in document) {
                    document.addEventListener('scrollend', finalize, { once: true })
                } else {
                    setTimeout(finalize, 1000)
                }
                return
            }
        }
        setActiveId(topics[0].id)
    }, [topics, topicParam])

    useEffect(() => {
        if (topics.length === 0) return
        const handleScroll = () => {
            if (isProgrammaticScroll.current) return
            let newActiveId: number | null = null
            for (const topic of [...topics].reverse()) {
                const el = sectionRefs.current[topic.id]
                if (!el) continue
                if (el.getBoundingClientRect().top <= window.innerHeight * 0.4) {
                    newActiveId = topic.id
                    break
                }
            }
            if (newActiveId) setActiveId(newActiveId)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [topics])

    const scrollToTopic = (id: number) => {
        setActiveId(id)
        isProgrammaticScroll.current = true
        sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" })
        const finalize = () => { isProgrammaticScroll.current = false }
        if ('onscrollend' in document) {
            document.addEventListener('scrollend', finalize, { once: true })
        } else {
            setTimeout(finalize, 1000)
        }
    }

    return (
        <Layout>
            <MobileBreadcrum title={t('faqs')} />
            <div className="relative after:absolute after:inset-0 after:w-1/4 lg:after:bg-white after:z-1">

                <section className="container relative z-2">
                    <div className="grid grid-cols-12 commonGap">

                        {/* ── Left Sidebar ── */}
                        <div className="hidden lg:block col-span-4 commonPY border-r bg-white">
                            <aside className="flex flex-col gap-2 shrink-0 sticky top-34 p-7.5">
                                <Typography variant="h5" weight="semibold" className="mb-2">
                                    {t('allTopics')}
                                </Typography>
                                {
                                    topics.map((topic, idx) => (
                                        <button
                                            key={topic.id}
                                            onClick={() => scrollToTopic(topic.id)}
                                            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeId === topic.id
                                                ? "primaryBg text-white"
                                                : "hover:bg-gray-100 textPrimaryColor"
                                                }`}
                                        >
                                            {idx + 1}. {topic.title}
                                        </button>
                                    ))
                                }
                            </aside>
                        </div>

                        {/* ── FAQ Sections ── */}
                        <div className="flex-1 flex flex-col gap-6 col-span-12 lg:col-span-8 commonPY">
                            {isError || topics.length === 0 ? (
                                <NoDataFound />
                            ) : (
                                topics.map((topic, idx) => (
                                    <div
                                        key={topic.id}
                                        ref={(el) => { sectionRefs.current[topic.id] = el }}
                                        className="border rounded-2xl p-4 md:p-6 bg-white overflow-x-hidden space-y-6"
                                    >
                                        <div>
                                            <Typography variant="h5" weight="semibold" className="mb-4 textPrimaryColor!">
                                                {idx + 1}. {topic.title}
                                            </Typography>
                                            <Divider width="bleed" />
                                        </div>
                                        {topic.faqs?.length > 0 ? (
                                            <Accordion type="single" collapsible className="w-full space-y-6">
                                                {topic.faqs.map((faq) => (
                                                    <AccordionItem key={faq.id} value={String(faq.id)} className="border! px-4 rounded-2xl">
                                                        <AccordionTrigger className="text-sm md:text-base font-medium textPrimaryColor! hover:no-underline!">
                                                            {faq.question}
                                                        </AccordionTrigger>
                                                        <AccordionContent className="text-sm textSecondaryColor! leading-relaxed pt-2 border-t">
                                                            {faq.answer}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        ) : (
                                            <Typography variant="desc2" weight="regular" className="textSecondaryColor!">
                                                {t('noFaqsAvailable')}
                                            </Typography>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    )
}

export default Faqs
