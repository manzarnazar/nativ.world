
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Divider from "../storyBook/atoms/Divider"
import PropertyInfo from "../storyBook/atoms/PropertyInfo"
import { PiArrowLeft, PiArrowRight } from "react-icons/pi"
import { useTranslation } from "@/hooks/useTranslation"
import GalleryContent from "../storyBook/atoms/GalleryContent"
import LightBox from "../lightBox/LightBox"
import { useRef, useState, useMemo } from "react"
import { GalleryGroup } from "@/hooks/queries/usePropertyDetails"
import { LightBoxImage } from "../lightBox/LightBox"

type GalleryModalProps = {
    galleryImgs: GalleryGroup[]
    propertyName: string
    propertyLocation: string
}

const ALL_ID = '__all__'

const GalleryModal = ({ galleryImgs = [], propertyName, propertyLocation }: GalleryModalProps) => {

    const { t } = useTranslation();
    const scrollRef = useRef<HTMLDivElement>(null)

    // Gallery tabs
    const allTab = { id: ALL_ID, label: t('allPhotos') }
    const groupTabs = galleryImgs.map(g => ({ id: g.group, label: g.group }))
    const tabs = [allTab, ...groupTabs]
    const [activeTab, setActiveTab] = useState(allTab.id)

    // Lightbox state — lifted here so it's category-aware
    const [lbOpen, setLbOpen] = useState(false)
    const [lbGroupId, setLbGroupId] = useState<string>(ALL_ID)
    const [lbIndex, setLbIndex] = useState(0)

    // Images for current lightbox group
    const lbImages: LightBoxImage[] = useMemo(() => {
        if (lbGroupId === ALL_ID) {
            return galleryImgs.flatMap(g => g.images.map(img => ({ src: img.url, alt: img.url, media_type: img.media_type })))
        }
        const group = galleryImgs.find(g => g.group === lbGroupId)
        return group?.images.map(img => ({ src: img.url, alt: img.url, media_type: img.media_type })) ?? []
    }, [lbGroupId, galleryImgs])

    // Offset index for "All Photos" mode — when clicking inside a group, find global index
    const openLightbox = (groupId: string, localIndex: number) => {
        if (groupId === ALL_ID) {
            setLbGroupId(ALL_ID)
            setLbIndex(localIndex)
        } else {
            setLbGroupId(groupId)
            setLbIndex(localIndex)
        }
        setLbOpen(true)
    }

    const handleGroupChange = (groupId: string, imageIndex: number) => {
        setLbGroupId(groupId)
        setLbIndex(imageIndex)
    }

    const handleTabClick = (id: string) => {
        setActiveTab(id)
        if (id === ALL_ID) {
            scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }
        const el = document.getElementById(id)
        if (el && scrollRef.current) {
            scrollRef.current.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
        }
    }

    const visibleGroups = activeTab === ALL_ID ? galleryImgs : galleryImgs.filter(g => g.group === activeTab)

    return (
        <>
            <Dialog>
                <DialogTrigger className="btn_sm md:btn_md lg:btn bg-[#0000004D] text-white md:bg-white flexCenter gap-2 absolute md:inset-0 md:w-fit md:h-fit md:m-auto md:textPrimaryColor! z-10!">
                    <span>{t('seeAllPhotos')}</span>
                    <PiArrowRight className="md:text-2xl text-base rtl:rotate-180" />
                </DialogTrigger>

                <DialogContent className="overflow-hidden max-w-full! min-w-full! max-h-full! h-full! rounded-none border-0! shadow-none! flex flex-col p-0 gap-0 [&>.closeBtn]:hidden [&>.closeBtn]:md:flexCenter [&>.closeBtn]:md:top-4 ltr:[&>.closeBtn]:md:right-4 rtl:[&>.closeBtn]:md:left-4">

                    {/* Accessible hidden title */}
                    <VisuallyHidden>
                        <DialogTitle>{propertyName} — {t('allPhotos')}</DialogTitle>
                        <DialogDescription>{propertyLocation}</DialogDescription>
                    </VisuallyHidden>

                    {/* Header */}
                    <DialogHeader className="shrink-0 px-4 md:px-6 pt-4 md:pt-6 pb-0">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <DialogClose asChild>
                                    <button className="md:hidden p-1 -ml-1">
                                        <PiArrowLeft className="text-2xl" />
                                    </button>
                                </DialogClose>
                                <PropertyInfo name={propertyName} location={propertyLocation} className="[&>h3]:font-semibold" />
                            </div>
                            <Divider />
                        </div>
                    </DialogHeader>

                    {/* Category tabs */}
                    <div className="shrink-0 border-b border-gray-100 bg-white">
                        <div className="flex overflow-x-auto no-scrollbar px-4 md:px-6">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`shrink-0 px-4 py-3 text-sm md:text-base font-medium border-b-2 -mb-px transition-colors first-letter:capitalize ${activeTab === tab.id ? 'primaryBorder primaryColor' : 'border-transparent textSecondaryColor'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable gallery */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto">
                        <div className="px-4 md:px-6 py-6 space-y-8">
                            {visibleGroups.map((group, index) => (
                                <div key={group.group}>
                                    <GalleryContent
                                        label={group.group}
                                        galleryImg={group.images}
                                        id={group.group}
                                        onImageClick={(localIndex) => openLightbox(group.group, localIndex)}
                                    />
                                    {index < visibleGroups.length - 1 && <div className="mt-8"><Divider /></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* LightBox inside Dialog so Radix focus trap doesn't block clicks */}
                    <LightBox
                        images={lbImages}
                        isOpen={lbOpen}
                        currentIndex={lbIndex}
                        onClose={() => setLbOpen(false)}
                        onIndexChange={setLbIndex}
                        groups={galleryImgs}
                        activeGroupId={lbGroupId}
                        onGroupChange={handleGroupChange}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default GalleryModal
