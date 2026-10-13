'use client'
import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { PiTag, PiGift, PiCopy, PiCheck, PiArrowLeft } from 'react-icons/pi'
import { Button } from '../storyBook/atoms/Button'
import { useTranslation } from '@/hooks/useTranslation'
import { toast } from '@/lib/toast';
import { Skeleton } from '@/components/ui/skeleton'
import { OfferItem, useGetOffers } from '@/hooks/queries/bookings/useGetOffers'
import { useIsMobile } from '@/hooks/useMobile'
import Divider from '../storyBook/atoms/Divider'
import { Typography } from '../storyBook/atoms/Typography'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSelector } from 'react-redux'
import { selectedRoomSelector } from '@/redux/reducers/helpersReducer'

const LIMIT = 2

interface CouponAndReferalCodeProps {
    open: boolean
    onClose: () => void
    onApply: (code: string) => void
}

type TabType = 'coupon' | 'referral'

const OfferCodeCard = ({
    item,
    onRedeem,
    couponCard
}: {
    item: OfferItem
    onRedeem: (code: string) => void
    couponCard?: boolean
}) => {

    const { t } = useTranslation();
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(item.code)
        setCopied(true)
        toast.success(t('copied'))
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`border border-border rounded-2xl p-4 space-y-3 ${couponCard ? 'bodyBg' : ''}`}>
            {item.title ? (
                <div>
                    <p className="font-semibold textPrimaryColor">{item.title}</p>
                    <p className="textSecondaryColor text-sm">{item.description}</p>
                </div>
            ) : (
                <p className="textPrimaryColor text-sm font-medium">{item.description}</p>
            )}
            <div className="flex items-center justify-between border border-border rounded-lg px-3 py-2 bg-white">
                <span className="textPrimaryColor text-sm font-medium">{item.code}</span>
                <button onClick={handleCopy} className="textSecondaryColor hover:textPrimaryColor transition-colors">
                    {copied ? <PiCheck className="text-lg successColor" /> : <PiCopy className="text-lg" />}
                </button>
            </div>
            <div className="flex items-center justify-between">
                <div className='space-y-1'>
                    <p className="text-sm textSecondaryColor">{t('expiresOn')}</p>
                    <p className="text-sm font-semibold textPrimaryColor">{item.expires_at}</p>
                </div>
                <Button
                    variant="primary"
                    size="md"
                    onClick={() => onRedeem(item.code)}
                    children={t('redeem')}
                />
            </div>
        </div>
    )
}

const CardSkeleton = () => (
    <div className="border border-border rounded-2xl p-4 space-y-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-9 w-full rounded-lg" />
        <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-9 w-20 rounded-full" />
        </div>
    </div>
)

const CouponAndReferalCode = ({ open, onClose, onApply, propertySlug }: CouponAndReferalCodeProps & { propertySlug?: string }) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState<TabType>('coupon')
    const [inputCode, setInputCode] = useState('')
    const [offset, setOffset] = useState(0)
    const [allItems, setAllItems] = useState<OfferItem[]>([])
    const [hasMore, setHasMore] = useState(true);

    const { property } = useSelector(selectedRoomSelector)

    const { data, isLoading } = useGetOffers({ type: activeTab, scope: 'active', limit: LIMIT, offset, property_slug: property?.slug || propertySlug })

    // Reset on tab change
    useEffect(() => {
        setOffset(0)
        setAllItems([])
        setHasMore(true)
    }, [activeTab])

    // Append or replace items based on offset from API response
    useEffect(() => {
        if (!data?.data?.items) return
        const { items, pagination } = data.data
        if (pagination.offset === 0) {
            setAllItems(items)
        } else {
            setAllItems(prev => [...prev, ...items])
        }
        setHasMore(pagination.has_more)
    }, [data])

    const fetchMore = () => {
        setOffset(prev => prev + LIMIT)
    }

    const handleApply = () => {
        if (!inputCode.trim()) return
        onApply(inputCode.trim())
        setInputCode('')
    }

    const isCouponTab = activeTab === 'coupon';

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className={`overflow-x-hidden overscroll-y-auto ${isMobile ? 'max-w-full! max-h-full! h-full! rounded-none' : 'max-w-150!'} flex flex-col gap-6`}>
                {/* Header */}
                <DialogHeader>
                    <div className="flex flex-col gap-y-4">

                        <div className="flex items-center gap-6">
                            {
                                <DialogClose asChild>
                                    <span className="md:hidden">
                                        <PiArrowLeft className="text-2xl" />
                                    </span>
                                </DialogClose>
                            }
                            <DialogTitle className="text-lg font-semibold textPrimaryColor">
                                {t('offerCodes')}
                            </DialogTitle>
                        </div>
                        {
                            isMobile &&
                            <Divider width='bleed' />
                        }
                    </div>
                </DialogHeader>

                <div
                    id="coupon-modal-scroll"
                    className="space-y-4 md:max-h-200 overflow-y-auto overflow-x-hidden customScrollbar"
                >
                    {/* Tabs */}
                    <div className="flex border border-border overflow-hidden p-2 rounded-lg gap-2 primaryLightBg">
                        <button
                            onClick={() => setActiveTab('coupon')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${isCouponTab ? 'primaryBg text-white' : 'bg-white textSecondaryColor hover:primaryLightBg'}`}
                        >
                            <PiTag className="text-xl" />
                            {t('couponCode')}
                        </button>
                        <button
                            onClick={() => setActiveTab('referral')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${!isCouponTab ? 'primaryBg text-white' : 'bg-white textSecondaryColor hover:primaryLightBg'}`}
                        >
                            <PiGift className="text-xl" />
                            {t('referralCode')}
                        </button>
                    </div>

                    {/* Code input row */}
                    <div className="flex items-center border border-border rounded-lg overflow-hidden px-4 py-2 md:py-3 gap-2">
                        <input
                            type="text"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value?.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                            placeholder={t('enterCode')}
                            className="flex-1 bg-transparent outline-none text-sm textPrimaryColor placeholder:textSecondaryColor py-2"
                        />
                        <Button
                            variant={isMobile ? 'text' : "secondary"}
                            size="md"
                            className={`rounded-full! shrink-0 ${isMobile ? "primaryColor!" : ""}`}
                            onClick={handleApply}
                            children={isMobile ? t('apply') : isCouponTab ? t('applyCoupon') : t('applyReferral')}
                        />
                    </div>

                    <Divider width='bleed' />

                    {/* Instructions — coupon tab only */}
                    {isCouponTab && (
                        <div className="space-y-1.5">
                            <p className="font-semibold textPrimaryColor">
                                {t('instruction')}
                            </p>
                            <ul className="space-y-1">
                                <li className="flex gap-2">
                                    <span className="shrink-0">•</span>
                                    <span>{t('couponInstructionOne')}</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="shrink-0">•</span>
                                    <span>{t('couponInstructionTwo')}</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Cards list */}
                    {isLoading && offset === 0 ? (
                        <div className="space-y-3 pb-2">
                            <CardSkeleton />
                            <CardSkeleton />
                        </div>
                    ) : allItems.length > 0 ? (
                        <InfiniteScroll
                            dataLength={allItems.length}
                            next={fetchMore}
                            hasMore={hasMore}
                            loader={
                                <div className="space-y-3 pt-3">
                                    <CardSkeleton />
                                </div>
                            }
                            scrollableTarget="coupon-modal-scroll"
                            className="space-y-3 pb-2"
                        >
                            {allItems.map((item) => (
                                <OfferCodeCard key={item.id} item={item} onRedeem={onApply} couponCard={isCouponTab} />
                            ))}
                        </InfiniteScroll>
                    ) : (
                        <div className="h-72 flexCenter">
                            <Typography variant="h5">
                                {t('noDataFound')}
                            </Typography>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CouponAndReferalCode
