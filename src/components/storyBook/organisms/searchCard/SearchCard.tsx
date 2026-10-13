'use client';
import React, { useEffect, useState } from 'react';
import ImagePreview from '../../atoms/ImagePreview';
import RoomDetailsSingleHotel from '../../atoms/RoomDetailsSingleHotel';
import RoomFeatures from '../../atoms/roomFeatures';
import WishlistBtn from '../../atoms/WishlistBtn';
import RoomHotelCardFooter from '../../molecules/roomHotelCardFooter';
import { SearchCardProps } from './SearchCard.type';
import Divider from '../../atoms/Divider';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setBookingLockId, setIsRedirectToPaymentGateway, setLoginModalState, setReserveNowClicked, setSelectedRoom } from '@/redux/reducers/helpersReducer';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Room, RoomProperty } from '@/hooks/queries/useRooms';
import { Property } from '@/hooks/queries/useProperties';
import { useIsMobile } from '@/hooks/useMobile';
import { PiImage } from 'react-icons/pi';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/lib/toast';
import { useLockBooking } from '@/hooks/queries/useLockBooking';
import { formateDate, formateDateForApi, parseCustomDate } from '@/utils/helpers';
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice';
import { isLoginSelector } from '@/redux/reducers/userSlice';
import ReserveRoomModal from '@/components/modalsAndSheets/ReserveRoomModal';

const VISIBLE_COUNT = 3;

const SearchCard: React.FC<SearchCardProps> = ({
    item,
    className = '',
    roomsTypeCard = false,
    propertyData,
    setRoomsModal
}) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isMobile = useIsMobile();

    // const businessMode = useSelector(businessModeSelector) as BasicDetails
    // const roomsPage = businessMode?.business_mode === "single" && businessMode?.no_of_properties === 1;
    const pathname = usePathname();
    const roomsPage = pathname.includes('/rooms');

    const langCode = useSelector(currentLangCodeSelector);
    const isLogin = useSelector(isLoginSelector);

    const router = useRouter();
    const searchParams = useSearchParams();

    const roomsData = item as Room;
    const propertiesData = item as Property;

    const [location, setLocation] = useState('')
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 1),
    })
    const [guests, setGuests] = useState({
        rooms: 1,
        adults: 2,
        childrenCount: 0,
        pets: false
    });

    const [openReserveModal, setOpenReserveModal] = useState(false);

    // Hydrate state from URL params on mount
    useEffect(() => {
        const parseDate = (param: string | null): Date | undefined => {
            return parseCustomDate(param) ?? undefined;
        };

        const locationParam = searchParams.get('location');
        if (locationParam) {
            setLocation(locationParam);
        }

        const checkIn = parseDate(searchParams.get('checkIn'));

        const checkOut = parseDate(searchParams.get('checkOut'));
        if (checkIn || checkOut) {
            setDate({ from: checkIn, to: checkOut });
        }

        const rooms = Number(searchParams.get('rooms'));
        const adults = Number(searchParams.get('adults'));
        const childrenCount = Number(searchParams.get('childrenCount'));
        const pets = searchParams.get('pets') === 'true';

        if (searchParams.get('rooms') || searchParams.get('adults')) {
            setGuests({
                rooms: rooms || 1,
                adults: adults || 2,
                childrenCount: childrenCount || 0,
                pets,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const { mutate: lockBooking, isPending: lockBookingLoading } = useLockBooking();

    const handleReserveNow = () => {

        if (!isLogin) {
            dispatch(setLoginModalState(true));
            return;
        }

        lockBooking({
            property_room_id: item?.id,
            check_in: formateDateForApi(date?.from),
            check_out: formateDateForApi(date?.to),
            rooms: guests?.rooms,
        }, {
            onSuccess: (data) => {
                if (data?.data?.lock_id) {
                    dispatch(setBookingLockId(data.data.lock_id))
                    dispatch(setReserveNowClicked(true))
                    dispatch(setIsRedirectToPaymentGateway(false))
                    router.push(`/confirm-booking?status=processing`)
                } else {
                    toast.error(t('lockIdNotFound'))
                }
            },
            onError: (error) => {
                console.log('error in lock booking api =>', error)
                toast.error(error.message)
            },
        })
    }

    const handleRedirectDetailPage = (slug?: string, selectRoom?: boolean, reserverNow?: boolean) => {

        if (!isLogin && selectRoom) {
            dispatch(setLoginModalState(true));
            return;
        }

        if (selectRoom || reserverNow) {
            dispatch(setSelectedRoom({ room: item as Room, property: propertyData as RoomProperty }))
            if (reserverNow) {
                handleReserveNow()
            }
            return
        }

        const checkIn = formateDate(date?.from)
        const checkOut = formateDate(date?.to)

        if (roomsPage) {
            dispatch(setSelectedRoom({ room: item as Room, property: propertyData as RoomProperty }))
            window.open(`/${langCode}/rooms/${slug}?${location ? `location=${location}&` : ''}checkIn=${checkIn}&checkOut=${checkOut}&rooms=${guests.rooms}&adults=${guests.adults}&childrenCount=${guests.childrenCount}&pets=${guests.pets}`, '_blank')
            return
        }

        if (roomsPage || roomsTypeCard) {
            setRoomsModal?.(item as Room)
            return
        }
        window.open(`/${langCode}/properties/${slug}?${location ? `location=${location}&` : ''}checkIn=${checkIn}&checkOut=${checkOut}&rooms=${guests.rooms}&adults=${guests.adults}&childrenCount=${guests.childrenCount}&pets=${guests.pets}`, '_blank')
    }


    const handleOpenReserveModal = () => {
        if (!isLogin) {
            dispatch(setLoginModalState(true));
            return;
        }
        dispatch(setSelectedRoom({ room: item as Room, property: propertyData as RoomProperty }))
        setOpenReserveModal(true)

    }



    if (roomsPage || roomsTypeCard) {
        return (
            <div className={`border rounded-2xl overflow-hidden bg-white ${className} cursor-pointer`} onClick={() => handleRedirectDetailPage(roomsData?.slug)}>
                {/* Top section */}
                <div className="flex gap-4 p-4 flex-wrap md:flex-nowrap">
                    {/* Image */}
                    <div className={`shrink-0 w-full md:w-67.5 h-57.5 relative pr-4 after:hidden after:md:block after:absolute after:inset-0 after:border-r after:h-[130%] after:-top-5 after:border-gray-200 after:z-1`}>
                        <ImagePreview
                            src={roomsData?.room_type?.images[0]?.url}
                            alt={roomsData?.room_type?.name}
                            objectFit="cover"
                            rounded="2xl"
                            aspectRatio="square"
                        />
                        {
                            roomsData?.room_type?.images?.length > 0 &&
                            <div className='flexCenter gap-1 text-white absolute bottom-2 right-6 font-medium text-sm bg-[#00000099] w-24.5 h-10 rounded-xl border border-[#555555]'>
                                <PiImage className='text-xl' />
                                <span>
                                    {roomsData?.room_type?.images?.length}
                                </span>
                                <span>
                                    {t('photos')}
                                </span>
                            </div>
                        }
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-4 w-full overflow-hidden">
                        <RoomDetailsSingleHotel
                            name={roomsData?.room_type?.name}
                            rating={roomsData?.rating}
                            reviews={roomsData?.reviews_count}
                            maxGuests={`${roomsData?.room_type?.max_guests} ${t('guest')}${(roomsData?.room_type?.max_guests ?? 0) > 1 ? 's' : ''}`}
                            bedType={roomsData?.room_type?.bed_type}
                            roomSize={roomsData?.room_size}
                            detailPage={roomsTypeCard}
                            roomsCard={roomsTypeCard || roomsPage}
                        />
                        {
                            (isMobile || roomsTypeCard || roomsPage) &&
                            <Divider width='bleed' className='' />
                        }
                        <div className={`${!roomsTypeCard && 'md:mt-4'} ${isMobile && roomsTypeCard ? 'h-40' : ''}`}>
                            <RoomFeatures
                                features={roomsData?.room_type?.facilities}
                                visibleCount={VISIBLE_COUNT}
                                roomsCard={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer — price + actions */}
                <RoomHotelCardFooter
                    currency={roomsData?.converted_currency_symbol}
                    price={roomsData?.converted_base_price_per_night}
                    roomsCard={true}
                    roomsTypeCard={roomsTypeCard}
                    roomSlug={roomsData?.slug}
                    handleRedirectDetailPage={handleRedirectDetailPage}
                    isAvailable={roomsData?.is_available}
                    setRoomsModal={setRoomsModal ? () => setRoomsModal(roomsData) : undefined}
                    handleOpenReserveModal={handleOpenReserveModal}
                />
                <div onClick={(e) => e.stopPropagation()}>
                    <ReserveRoomModal roomsPage={true} open={openReserveModal} close={setOpenReserveModal} />
                </div>
            </div>
        );
    }
    return (
        <div className={`border rounded-2xl overflow-hidden bg-white ${className} cursor-pointer`} onClick={() => handleRedirectDetailPage(propertiesData?.slug)}>
            <div className="flex gap-4 p-4 flex-wrap propertyCard">
                {/* Image with wishlist overlay */}
                <div className={`shrink-0 w-full md:w-75 h-62.5 relative propertyImg`}>
                    <ImagePreview
                        src={propertiesData?.image}
                        alt={propertiesData?.name}
                        objectFit="cover"
                        rounded="2xl"
                        aspectRatio="square"
                    />
                    <WishlistBtn slug={propertiesData?.slug} isWishlisted={propertiesData?.is_favorited} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-4 md:justify-between ">
                    <div className="flex  flex-col gap-4">
                        <RoomDetailsSingleHotel
                            name={propertiesData?.name}
                            location={`${propertiesData?.street_address},${propertiesData?.city}`}
                            rating={propertiesData?.rating || 0}
                            reviews={propertiesData?.reviews_count}
                            roomsCard={roomsPage}
                        />
                        <RoomFeatures features={propertiesData?.facilities} visibleCount={VISIBLE_COUNT} extraCount={propertiesData?.more_facilities_count} />
                    </div>

                    {/* Feature chips */}

                    {/* Price + CTA */}
                    <RoomHotelCardFooter
                        currency={propertiesData?.converted_currency_symbol}
                        price={propertiesData?.converted_starting_price}
                        lockBookingLoading={lockBookingLoading}

                    />
                </div>
            </div>
        </div>
    );
};

export default SearchCard;
