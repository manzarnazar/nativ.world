'use client'
import { useState, useCallback } from "react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import RoomDetailsSingleHotel from "../storyBook/atoms/RoomDetailsSingleHotel";
import { useTranslation } from "@/hooks/useTranslation";
import { Room, RoomProperty } from "@/hooks/queries/useRooms";
import Divider from "../storyBook/atoms/Divider";
import { Typography } from "../storyBook/atoms/Typography";
import IconLabel from "../storyBook/atoms/IconLabel";
import ImagePreview from "../storyBook/atoms/ImagePreview";
import { useIsMobile } from "@/hooks/useMobile";
import RoomHotelCardFooter from "../storyBook/molecules/roomHotelCardFooter";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModalState, setSelectedRoom } from "@/redux/reducers/helpersReducer";
import RateAndReviews from "../storyBook/organisms/RateAndReviews/RateAndReviews";
import { PiArrowLeft } from "react-icons/pi";
import { isLoginSelector } from "@/redux/reducers/userSlice";
import { getDirection } from "@/utils/helpers";

interface RoomDetailsModalProps {
    open: boolean;
    onClose: () => void;
    roomDetails: Room;
    propertyData?: RoomProperty;
}

const RoomDetailsModal = ({ open, onClose, roomDetails, propertyData }: RoomDetailsModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const dispatch = useDispatch();
    const isLogin = useSelector(isLoginSelector);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [api, setApi] = useState<CarouselApi>();

    const images = roomDetails?.room_type?.images || [];

    const handleSetApi = useCallback((carouselApi: CarouselApi) => {
        setApi(carouselApi);
        carouselApi?.on("select", () => {
            setCurrentIndex(carouselApi.selectedScrollSnap());
        });
    }, []);

    const scrollToIndex = (index: number) => {
        api?.scrollTo(index);
    };

    const handleSelectRoom = () => {
        if (!isLogin) {
            dispatch(setLoginModalState(true));
            return;
        }
        dispatch(setSelectedRoom({ room: roomDetails, property: propertyData as RoomProperty }))
        onClose();
    }


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className={`overflow-x-hidden overflow-y-auto ${isMobile ? 'max-w-full! max-h-full! h-full! [&>.closeBtn]:hidden rounded-none' : 'max-w-max! xl:max-w-300!'} flex flex-col p-0`} onClick={(e) => e.stopPropagation()}>
                <div className="p-6 flex flex-col gap-6">
                    <DialogHeader>
                        <div className="flex items-center gap-4 pb-2 md:pb-0">
                            {
                                <DialogClose asChild>
                                    <span className="md:hidden bodyBg rounded-full p-2">
                                        <PiArrowLeft className="text-2xl" />
                                    </span>
                                </DialogClose>
                            }
                            <DialogTitle>{roomDetails?.room_type?.name}</DialogTitle>
                        </div>
                        <DialogDescription>
                            <RoomDetailsSingleHotel
                                name={''}
                                maxGuests={`${roomDetails?.room_type?.max_guests} ${t('guest')}${(roomDetails?.room_type?.max_guests ?? 0) > 1 ? 's' : ''}`}
                                bedType={roomDetails?.room_type?.bed_type}
                                roomSize={roomDetails?.room_size}
                                roomsModal={true}
                            />
                        </DialogDescription>
                    </DialogHeader>
                    <Divider width="bleed" />
                    <div className="flex flex-col gap-6">
                        {images.length > 0 && (
                            <div className="bodyBg p-4 md:p-6 rounded-2xl flex flex-col gap-6">
                                {/* Main carousel */}
                                <Carousel setApi={handleSetApi} className="w-full" opts={{ loop: true }} dir={getDirection()}>
                                    <CarouselContent>
                                        {images.map((img, idx) => (
                                            <CarouselItem key={idx} className="">
                                                <ImagePreview
                                                    className="w-[522px]! h-[435px]!"
                                                    src={img.url}
                                                    alt={`${roomDetails?.room_type?.name} ${idx + 1}`}
                                                    objectFit="cover"
                                                    rounded="xl"
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="left-2 h-10 w-10 bg-black! text-white! border-0! hover:bg-black/80! rtl:rotate-180" />
                                    <CarouselNext className="right-2 h-10 w-10 bg-black! text-white! border-0! hover:bg-black/80! rtl:rotate-180" />
                                </Carousel>

                                {/* Thumbnails */}
                                {images.length > 1 && (
                                    <div className="flexCenter gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => scrollToIndex(idx)}
                                                className={`shrink-0 w-24 h-20 rounded-xl overflow-hidden border-4 transition-colors ${idx === currentIndex ? 'border-white' : 'border-transparent'}`}
                                            >
                                                <ImagePreview
                                                    src={img.url}
                                                    alt={`thumb ${idx + 1}`}
                                                    objectFit="cover"
                                                    aspectRatio="square"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            {
                                roomDetails?.room_type?.facilities?.length > 0 &&
                                <Typography variant="desc1" weight="semibold" className="textPrimaryColor!">{t('roomFeaturesInc')}</Typography>
                            }
                            <div className="grid grid-cols-2 md:grid-cols-3 commonGap w-full">
                                {roomDetails?.room_type?.facilities?.map((amenity, index) => (
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
                        </div>
                        <RateAndReviews roomsSlug={roomDetails?.room_type?.slug} modal={true} className="border-t pt-6" isPropertyRoomsModal={true} />
                    </div>
                </div>
                <div className="sticky bottom-0 w-full">
                    <RoomHotelCardFooter
                        currency={roomDetails?.converted_currency_symbol}
                        price={roomDetails?.converted_base_price_per_night}
                        roomsCard={true}
                        roomsTypeCard={true}
                        roomSlug={roomDetails?.slug}
                        isAvailable={roomDetails?.is_available}
                        handleRedirectDetailPage={handleSelectRoom}
                        roomsModal={true}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default RoomDetailsModal