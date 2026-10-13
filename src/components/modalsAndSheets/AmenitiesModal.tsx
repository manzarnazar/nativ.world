import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { useTranslation } from '@/hooks/useTranslation'
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi';
import Divider from '../storyBook/atoms/Divider';
import IconLabel from "../storyBook/atoms/IconLabel";
import { useIsMobile } from "@/hooks/useMobile";
import ImagePreview from "../storyBook/atoms/ImagePreview";
import { Facility } from "@/api/server/getHomePageContent";

interface AmenitiesProps {
    amenities: Facility[]
    isHotelPage?: boolean
    showViewMoreModal?: boolean
    extraCount?: number
}

const AmenitiesModal: React.FC<AmenitiesProps> = ({ amenities, isHotelPage, showViewMoreModal, extraCount }) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    return (
        amenities && amenities?.length > 0 &&
        <Dialog>
            <DialogTrigger className={`btn_md lg:btn_lg primaryColor flexCenter  p-0! ${isHotelPage ? 'text-sm! gap-1 mt-5' : 'gap-2'}`} onClick={(e) => e.stopPropagation()}>
                <span className={`${showViewMoreModal ? 'text-sm!' : ''}`}>{showViewMoreModal ? `${t('view')} ${extraCount}+ ${t('more')}` : t('seeAllAmenities')}</span>
                {!showViewMoreModal && <PiArrowRight className={` ${isHotelPage ? 'text-lg' : 'text-2xl'} rtl:rotate-180`} />}
            </DialogTrigger>
            <DialogContent className={`overflow-x-hidden overscroll-y-auto ${isMobile ? 'max-w-full! max-h-full! h-full! [&>.closeBtn]:hidden rounded-none' : 'max-w-max!'} flex flex-col`} onClick={(e) => e.stopPropagation()}>
                <DialogHeader className='block'>
                    <div className="flex flex-col gap-y-4">
                        <div className="flex items-center gap-6">
                            {
                                <DialogClose asChild>
                                    <span className="md:hidden">
                                        <PiArrowLeft className="text-2xl" />
                                    </span>
                                </DialogClose>
                            }
                            <DialogTitle>{t('amenities')}</DialogTitle>
                        </div>
                        <Divider width='bleed' />
                    </div>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 commonGap w-full  py-5">
                    {amenities?.map((amenity, index) => (
                        <IconLabel
                            key={index}
                            icon={
                                <span className="bodyBg border rounded-lg p-2 md:p-3 flex items-center justify-center shrink-0 h-9.5 w-9.5 md:h-12.5 md:w-12.5">
                                    <ImagePreview src={amenity?.icon} alt={amenity?.name} className='h-5.5 w-5.5 md:w-6 md:h-6' />
                                </span>
                            }
                            label={amenity?.name}
                            className="gap-4 text-sm sm:text-base"
                        />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AmenitiesModal
