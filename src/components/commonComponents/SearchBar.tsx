"use client"
import { createPortal } from "react-dom"
import { useState, useEffect } from 'react'
import { PiMagnifyingGlass, PiMapPin, PiCalendar, PiUsers, PiPlanet, PiGpsFix, PiCalendarDots, PiPencilSimple } from 'react-icons/pi'
import { useTranslation } from '@/hooks/useTranslation'
import { LocationSearch, LocationSkeleton } from './LocationSearch'
import InfiniteScroll from 'react-infinite-scroll-component'
import { DateRangePicker } from './DateRangePicker'
import { GuestSelector } from './GuestSelector'
import { format } from "date-fns"
import { PiArrowLeft, PiMinus, PiPlus } from 'react-icons/pi'
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Button } from "../storyBook/atoms/Button"
import { formateDate, formateDatePretty, parseCustomDate } from "@/utils/helpers"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { businessModeSelector, latLongSelector, selectedLocationSelector, setLatLong } from "@/redux/reducers/settingsSlice"
import { BasicDetails } from "@/hooks/queries/useSettings"
import { bookingDetailsSelector, setBookingDetails } from "@/redux/reducers/bookingDetailsSlice"
import { PropertyDropdown, usePropertiesDropdown } from "@/hooks/queries/usePropertiesDropdown"
import { currentLangCodeSelector } from "@/redux/reducers/languageSlice"
import { toast } from "@/lib/toast"
import { setIsFromSearch, setProperties, setSelectedPropertyCountryId } from "@/redux/reducers/helpersReducer"
import { MultiLocationSearch } from "./MultiLocationSearch"

const LIMIT = 15

const SearchBar = ({ homePage }: { homePage?: boolean }) => {

    const { t } = useTranslation();

    const businessMode = useSelector(businessModeSelector) as BasicDetails;
    const isSingleHotel = businessMode?.business_mode === 'single' && businessMode?.no_of_properties === 1;
    const isSingleHotelModule = businessMode?.business_mode === 'single';

    const langCode = useSelector(currentLangCodeSelector);
    const selectedLocation = useSelector(selectedLocationSelector);
    const latLong = useSelector(latLongSelector);
    const { latitude, longitude } = latLong;
    const isCurrentLocatoin = latitude != null && longitude != null;

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const bookingDetails = useSelector(bookingDetailsSelector);

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [offset, setOffset] = useState(0)
    const [allItems, setAllItems] = useState<PropertyDropdown[]>([])
    const [hasMore, setHasMore] = useState(true)

    const [mobileStep, setMobileStep] = useState(0) // 0: closed, 1: location, 2: dates, 3: guests
    const [selectedDisplay, setSelectedDisplay] = useState<{ name: string; city: string } | null>(null)
    const [mounted, setMounted] = useState(false);
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [mobileDateStep, setMobileDateStep] = useState<'checkIn' | 'checkOut'>('checkIn')

    useEffect(() => {
        setMounted(true);
        const el = document.createElement("div");
        el.id = "mobile-search-wizard-portal";
        // Ensure we add it to the body
        document.body.appendChild(el);
        setPortalRoot(el);
        return () => {
            // Cleanup: remove the node
            if (document.body.contains(el)) {
                document.body.removeChild(el);
            }
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300)
        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        setOffset(0)
        setAllItems([])
        setHasMore(true)
    }, [debouncedSearch])

    const { data: propertiesData, isLoading: propertiesLoading, isError: propertiesError } = usePropertiesDropdown(debouncedSearch, LIMIT, offset)

    useEffect(() => {
        if (!propertiesData?.items) return
        const { items, pagination } = propertiesData
        const validItems = items.filter(item => item.id != null)
        if (pagination?.offset === 0) {
            setAllItems(validItems)
            dispatch(setProperties(validItems)) // Reset selected location when search changes
        } else {
            setAllItems(prev => [...prev, ...validItems])
        }
        setHasMore(pagination?.has_more ?? false)
    }, [propertiesData])

    const fetchMore = () => setOffset(prev => prev + LIMIT)

    const selectedInList = allItems.find(p => p.slug === bookingDetails.location)


    const locationDisplaySingleMode = selectedDisplay
        ? `${selectedDisplay.name}, ${selectedDisplay.city}`
        : selectedInList
            ? `${selectedInList.name}, ${selectedInList.city}`
            : null;

    const locationDisplayMultiMode = selectedLocation && selectedLocation ? `${selectedLocation?.name}, ${selectedLocation?.state}` : t("selectDestination");

    const locationDisplayName = (isSingleHotelModule ? locationDisplaySingleMode : locationDisplayMultiMode) || t("selectDestination")

    // Hydrate state from URL params on mount
    useEffect(() => {
        const parseDate = (param: string | null): Date | null => {
            if (!param) return null;
            const [day, month, year] = param.split('-').map(Number);
            if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
            return new Date(year, month - 1, day);
        };

        if (bookingDetails.location) {
            return; // If bookingDetails are already present, do not update again from URL
        }

        const updates: Record<string, unknown> = {};
        const locationParam = searchParams.get('location');
        if (locationParam) updates.location = locationParam;

        const checkIn = parseDate(searchParams.get('checkIn'));
        const checkOut = parseDate(searchParams.get('checkOut'));
        if (checkIn) updates.checkIn = formateDate(checkIn);
        if (checkOut) updates.checkout = formateDate(checkOut);

        if (searchParams.get('rooms') || searchParams.get('adults')) {
            updates.rooms = Number(searchParams.get('rooms')) || 1;
            updates.adults = Number(searchParams.get('adults')) || 2;
            updates.childrenCount = Number(searchParams.get('childrenCount')) || 0;
            updates.pets = searchParams.get('pets') === 'true';
        }

        if (Object.keys(updates).length > 0) {
            dispatch(setBookingDetails(updates));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Reset date step and jump calendar to checkIn month when entering date step
    useEffect(() => {
        if (mobileStep === 2) {
            setMobileDateStep('checkIn');
            const parsed = parseCustomDate(bookingDetails.checkIn);
            if (parsed) setCurrentMonth(parsed);
        }
    }, [mobileStep]); // eslint-disable-line react-hooks/exhaustive-deps

    const resolveMobileClickedDate = (
        date: { from?: Date; to?: Date },
        existingCheckIn: Date | null
    ): Date | undefined => {
        if (!date.from) return undefined;
        if (!existingCheckIn) return date.from;
        const sameAsCheckIn = date.from.getTime() === existingCheckIn.getTime();
        return sameAsCheckIn ? (date.to ?? date.from) : date.from;
    };

    const handleMobileDateSelect = (date: { from?: Date; to?: Date } | undefined) => {
        if (!date?.from) return;
        const existingCheckIn = parseCustomDate(bookingDetails.checkIn);

        if (mobileDateStep === 'checkIn') {
            const clicked = resolveMobileClickedDate(date, existingCheckIn);
            if (!clicked) return;
            dispatch(setBookingDetails({ ...bookingDetails, checkIn: formateDate(clicked), checkout: '' }));
            setMobileDateStep('checkOut');
        } else {
            const clicked = resolveMobileClickedDate(date, existingCheckIn);
            if (!clicked) return;
            if (existingCheckIn && clicked > existingCheckIn) {
                dispatch(setBookingDetails({ ...bookingDetails, checkout: formateDate(clicked) }));
                setMobileDateStep('checkIn');
            } else {
                dispatch(setBookingDetails({ ...bookingDetails, checkIn: formateDate(clicked), checkout: '' }));
            }
        }
    };

    const handleMobileSearchClick = () => {
        setMobileStep(1)
    }

    const handleBack = () => {
        if (mobileStep > 1) {
            setMobileStep(mobileStep - 1)
        } else {
            setMobileStep(0)
        }
    }

    const handleNext = () => {
        if (mobileStep < 3) {
            if (mobileStep === 2 && (!bookingDetails.checkIn || !bookingDetails.checkout)) {
                toast.error(t('selectCheckInCheckOutFirst'))
                return
            }
            setMobileStep(mobileStep + 1)
        } else {
            if (isSingleHotelModule) {
                handleSearch()
            }
            else {
                handleFindMe()
                setMobileStep(0);
            }
        }
    }

    const updateGuestCount = (type: 'rooms' | 'adults' | 'childrenCount', operation: 'increment' | 'decrement') => {
        let newValue = bookingDetails[type];

        if (operation === 'increment') {
            newValue += 1;
        } else {
            if (newValue > 0) newValue -= 1;
        }

        // Constraints
        if (type === 'rooms' && newValue < 1) newValue = 1;
        if (type === 'adults' && newValue < 1) newValue = 1;

        dispatch(setBookingDetails({ [type]: newValue }));
    };


    const handleSelectLocation = (loc: PropertyDropdown) => {
        dispatch(setBookingDetails({ location: loc?.slug }))
        setSelectedDisplay({ name: loc.name, city: loc.city })
        dispatch(setSelectedPropertyCountryId(loc.country_id))
        handleNext()
    };

    const handleSearch = () => {

        const checkIn = bookingDetails?.checkIn
        const checkOut = bookingDetails?.checkout

        if (isSingleHotelModule) {

            if (!isSingleHotel && !bookingDetails?.location) {
                toast.error(t('selectLocationFirst'))
                return
            }
        }
        else {
            if (!selectedLocation) {
                toast.error(t('selectLocationFirst'))
                return
            }
        }


        if (!checkIn || !checkOut) {
            toast.error(t('selectCheckInCheckOutFirst'))
            return
        }

        if (isSingleHotelModule) {
            router.push(`/${langCode}/rooms?location=${bookingDetails.location}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=${bookingDetails.rooms}&adults=${bookingDetails.adults}&childrenCount=${bookingDetails.childrenCount}`)
        } else {
            router.push(`/${langCode}/properties?location=${bookingDetails.location}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=${bookingDetails.rooms}&adults=${bookingDetails.adults}&childrenCount=${bookingDetails.childrenCount}&pets=${bookingDetails.pets}`)
        }
        setMobileStep(0);

        dispatch(setIsFromSearch(true));
    }


    const handleFindMe = (mobile?: boolean) => {

        if (!navigator.geolocation) {
            toast.error(t('geolocationNotSupported'))
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                dispatch(setLatLong({ latitude, longitude }))
                if (mobile) {
                    setMobileStep(2);
                }
                else {
                    router?.push(`/${langCode}/properties`)
                }
            },
            () => {
                toast.error(t('positionUnavailable'))
            }
        )
    }


    return (
        mounted &&
        <div className={`${homePage ? '' : 'bg-white md:bg-transparent'}`}>
            <div className={`max-md:px-0 container ${homePage ? 'md:-mt-12' : 'py-6'}`}>
                {/* Desktop Search Bar */}
                <div className="max-lg:hidden grid grid-cols-12 bg-white rounded-2xl shadow-[0px_8px_20px_0px_#00000014] border p-6 gap-6">
                    {/* Location */}

                    {
                        !isSingleHotelModule ?
                            <div className='col-span-4 flex items-center justify-baseline border-r rtl:border-l rtl:border-r-0 pr-6'>
                                <div className="flex items-center gap-3 flex-1 transition-colors">
                                    <span className='bg-[var(--neutral-100)] p-2 rounded-full border w-12 h-12 flexCenter'>
                                        <PiPlanet className="textSecondaryColor text-2xl flex-shrink-0" />
                                    </span>
                                    <MultiLocationSearch handleNext={handleNext} />
                                </div>
                                <button aria-label={t('findMe')} className='btn_sm primaryLightBg text-[#0E448B] flexCenter gap-2' onClick={() => handleFindMe()}>
                                    <PiGpsFix className='text-xl' />
                                    <span className='max-1680:hidden'>{t('findMe')}</span>
                                </button>
                            </div>
                            :
                            !isSingleHotel &&
                            <div className='col-span-4 flex items-center justify-baseline border-r rtl:border-l rtl:border-r-0 pr-6'>
                                <div className="flex items-center gap-3 flex-1 transition-colors">
                                    <span className='bg-[var(--neutral-100)] p-2 rounded-full border w-12 h-12 flexCenter'>
                                        <PiPlanet className="textSecondaryColor text-2xl flex-shrink-0" />
                                    </span>
                                    <LocationSearch
                                        items={allItems}
                                        isLoading={propertiesLoading}
                                        offset={offset}
                                        hasMore={hasMore}
                                        fetchMore={fetchMore}
                                        search={search}
                                        onSearchChange={setSearch}
                                        placeholder={t('selectDestination')}
                                    />
                                </div>
                            </div>
                    }

                    {/* Date */}
                    <div className={`${isSingleHotel ? 'col-span-6' : 'col-span-3'} flex items-center justify-baseline border-r rtl:border-l rtl:border-r-0 pr-6`}>
                        <div className="flex items-center gap-3 flex-1 transition-colors">
                            <span className='bg-[var(--neutral-100)] p-2 rounded-full border w-12 h-12 flexCenter'>
                                <PiCalendarDots className="textSecondaryColor text-2xl flex-shrink-0" />
                            </span>
                            <DateRangePicker />
                        </div>
                    </div>

                    {/* Guests & Rooms */}
                    <div className={`${isSingleHotel ? 'col-span-4' : 'col-span-3'} flex items-center justify-baseline border-r rtl:border-l rtl:border-r-0 pr-6`}>
                        <div className="flex items-center gap-3 flex-1 transition-colors">
                            <span className='bg-[var(--neutral-100)] p-2 rounded-full border w-12 h-12 flexCenter'>
                                <PiUsers className="textSecondaryColor text-2xl flex-shrink-0" />
                            </span>
                            <GuestSelector petsAllowed={!isSingleHotelModule} />
                        </div>
                    </div>

                    <div className='col-span-2 flex items-center justify-baseline'>
                        <button aria-label={t('search')} className='btn_md xl:btn_lg bg-black text-white flexCenter gap-2 w-full' onClick={handleSearch}>
                            <PiMagnifyingGlass className='text-xl' />
                            <span className=''>{t('search')}</span>
                        </button>
                    </div>
                </div>



                {/* Mobile Search Bar - Trigger */}
                <div
                    className="flex lg:hidden bg-white rounded-xl border p-4 cursor-pointer items-center justify-between"
                    onClick={handleMobileSearchClick}
                >
                    <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-sm text-gray-800 font-semibold truncate">
                            {
                                isCurrentLocatoin ?
                                    t('currentLocation')
                                    :
                                    locationDisplayName || t("selectDestination")
                            }
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                            {formateDatePretty(bookingDetails.checkIn) + " - " + formateDatePretty(bookingDetails.checkout)
                            } <span className="mx-1">•</span> {bookingDetails.adults + bookingDetails.childrenCount} {t('guests')}
                        </span>
                    </div>
                    <button aria-label={t('search')} className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" onClick={handleNext}>
                        {
                            pathname === '/' || pathname === `/${langCode}` ?
                                <PiMagnifyingGlass className="text-xl" />
                                :
                                <PiPencilSimple className="text-xl" />
                        }
                    </button>
                </div>

                {/* Mobile Search Wizard Overlay */}
                {portalRoot && mobileStep > 0 && createPortal(
                    <div className="fixed inset-0 z-1003 bg-white flex flex-col animate-in slide-in-from-bottom-10 duration-300">
                        {/* Header */}
                        <div className="flex items-center p-4 border-b relative flex-shrink-0">
                            <button onClick={handleBack} className="p-2 -ml-2">
                                <PiArrowLeft className="text-2xl" />
                            </button>
                            <span className="font-semibold text-lg absolute left-1/2 -translate-x-1/2">
                                {mobileStep === 1 && "Where to?"}
                                {mobileStep === 2 && "When's Your Trip"}
                                {mobileStep === 3 && "Who's Coming"}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
                            {mobileStep === 1 && (
                                <div className="flex flex-col h-full bg-white overflow-y-auto">
                                    <div className="p-4 border-b flex-shrink-0">
                                        <div className="flex items-center gap-3 bg-white border rounded-xl px-4 py-3 shadow-sm">
                                            <PiMagnifyingGlass className="text-gray-400 text-xl" />
                                            <input
                                                autoFocus
                                                placeholder="Search by city, hotel, or destinations"
                                                className="flex-1 outline-none text-base"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div id="mobile-location-scroll" className="p-4 flex-1 overflow-y-auto">
                                        {
                                            !isSingleHotelModule &&
                                            <button className="flex items-center gap-4 w-full p-2 mb-6" onClick={() => handleFindMe(true)}>
                                                <div className="bg-blue-50 p-3 rounded-full primaryColor">
                                                    <PiGpsFix className="text-xl" />
                                                </div>
                                                <span className="font-semibold text-base">{t('findHotelNear')}</span>
                                            </button>
                                        }

                                        {
                                            isSingleHotelModule ?
                                                <div className="space-y-4">
                                                    <h3 className="font-bold text-lg">{t('suggestDestination')}</h3>
                                                    <div>

                                                        {propertiesLoading && offset === 0 ? (
                                                            <div className="space-y-1">
                                                                <LocationSkeleton />
                                                                <LocationSkeleton />
                                                                <LocationSkeleton />
                                                                <LocationSkeleton />
                                                            </div>
                                                        ) : propertiesError || allItems.length === 0 ? (
                                                            <p className="text-sm text-gray-500 py-4 text-center">{t('noLocationFound')}</p>
                                                        ) : (
                                                            <InfiniteScroll
                                                                dataLength={allItems.length}
                                                                next={fetchMore}
                                                                hasMore={hasMore}
                                                                loader={
                                                                    <div className="space-y-1 pt-2">
                                                                        <LocationSkeleton />
                                                                    </div>
                                                                }
                                                                scrollableTarget="mobile-location-scroll"
                                                            >
                                                                <div className="space-y-2">
                                                                    {allItems.map((loc) => (
                                                                        <button
                                                                            key={loc?.id}
                                                                            onClick={() => { handleSelectLocation(loc) }}
                                                                            className="flex items-center gap-4 w-full p-2 border-b last:border-0 pb-4"
                                                                        >
                                                                            <div className="bg-blue-50 p-3 rounded-full primaryColor">
                                                                                <PiGpsFix className="text-xl" />
                                                                            </div>
                                                                            <div className="text-left">
                                                                                <div className="font-semibold text-base">{loc?.name}</div>
                                                                                <div className="text-sm text-gray-500">{loc?.city}, {loc?.country}</div>
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </InfiniteScroll>
                                                        )}
                                                    </div>
                                                </div>
                                                :
                                                <MultiLocationSearch mobileView={true} searchMobile={search} handleNext={handleNext} />
                                        }
                                    </div>
                                </div>
                            )}

                            {mobileStep === 2 && (
                                <div className="flex flex-col h-full bg-white">
                                    <div className="p-4 bg-gray-50 flex-shrink-0">
                                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-50 rounded-lg">
                                                    <PiMapPin className="text-xl text-gray-600" />
                                                </div>
                                                <span className="font-bold text-gray-900">
                                                    {
                                                        isCurrentLocatoin ?
                                                            t('currentLocation')
                                                            :
                                                            locationDisplayName || t("selectDestination")
                                                    }
                                                </span>
                                            </div>
                                            <button onClick={() => setMobileStep(1)} className="primaryColor font-semibold text-sm px-2">{t('edit')}</button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-1 overflow-y-auto px-4 pb-4 mt-2">
                                        <Calendar
                                            mode="range"
                                            selected={{ from: parseCustomDate(bookingDetails.checkIn) ?? undefined, to: parseCustomDate(bookingDetails.checkout) ?? undefined }}
                                            onSelect={handleMobileDateSelect}
                                            month={currentMonth}
                                            onMonthChange={setCurrentMonth}
                                            showOutsideDays={false}
                                            className="w-full p-0!"
                                            classNames={{
                                                root: "w-full",
                                                months: "flex flex-col space-y-8 w-full",
                                                month: "space-y-4 w-full",
                                                caption: "block text-center mb-6 relative items-center",
                                                caption_label: "text-lg font-bold textPrimaryColor!",
                                                nav: "flex items-center justify-between absolute w-full z-10 px-2",
                                                button_previous: "h-6 sm:h-10 w-6 sm:w-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 mr-auto",
                                                button_next: "h-6 sm:h-10 w-6 sm:w-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 mr-12",
                                                table: "w-full border-collapse",
                                                head_row: "flex w-full mb-4",
                                                head_cell: "text-gray-500 flex-1 font-medium text-xs last:errorColor text-center",
                                                row: "flex w-full mt-2",
                                                cell: "text-center text-sm p-0 relative flex-1 [&:has([aria-selected])]:bg-[var(--primary-color-50)] first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20",
                                                day: "w-full aspect-square p-0 font-medium aria-selected:opacity-100 last:errorColor rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors",
                                                day_selected: "primaryBg! !text-white hover:!bg-[var(--primary-color)] hover:!text-white focus:!bg-[var(--primary-color)] focus:!text-white rounded-full",
                                                day_today: "primaryColor! font-bold border primaryBorderColor!",
                                                day_outside: "text-gray-300 opacity-50",
                                                day_disabled: "text-gray-300 opacity-50",
                                                day_range_middle: "primaryLightBg! primaryColor! !rounded-none",
                                                day_range_start: "rounded-l-full rounded-r-none",
                                                day_range_end: "rounded-r-full rounded-l-none",
                                                day_hidden: "invisible",
                                            }}
                                            numberOfMonths={2}
                                            weekStartsOn={1}
                                            formatters={{ formatWeekdayName: (date) => format(date, "EEE") }}
                                        />
                                    </div>
                                    <div className="p-4 pb-8 bg-white border-t flex flex-col gap-4 shrink-0 shadow-[0_-8px_20px_0px_rgba(0,0,0,0.05)]">
                                        <div className="flex gap-3">
                                            <div className={`flex items-center gap-3 px-3 py-3 flex-1 rounded-xl border transition-colors ${mobileDateStep === 'checkIn' ? 'primaryLightBg primaryLightBorderColor!' : 'bg-gray-50 border-gray-100'}`}>
                                                <PiCalendarDots className={`text-xl ${mobileDateStep === 'checkIn' ? 'primaryColor!' : 'text-gray-400'}`} />
                                                <span className="text-[13px] font-bold textPrimaryColor! whitespace-nowrap">
                                                    {bookingDetails.checkIn ? formateDatePretty(bookingDetails.checkIn) : t('checkIn')}
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-3 px-3 py-3 flex-1 rounded-xl border transition-colors ${mobileDateStep === 'checkOut' ? 'primaryLightBg primaryLightBorderColor!' : 'bg-gray-50 border-gray-100'}`}>
                                                <PiCalendarDots className={`text-xl ${mobileDateStep === 'checkOut' ? 'primaryColor!' : 'text-gray-400'}`} />
                                                <span className="text-[13px] font-bold textPrimaryColor! whitespace-nowrap">
                                                    {bookingDetails.checkout ? formateDatePretty(bookingDetails.checkout) : t('checkOut')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button variant="primary" size="md" className="w-full" children={t('confirm')} onClick={handleNext} />
                                            <Button variant="outline" size="md" className="w-full primaryBorder primaryColor" children={t('clear')} onClick={() => {
                                                dispatch(setBookingDetails({ ...bookingDetails, checkIn: '', checkout: '' }));
                                                setMobileDateStep('checkIn');
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {mobileStep === 3 && (
                                <div className="flex flex-col h-full bg-white">
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <PiMapPin className="text-xl" />
                                                <span className="font-semibold">
                                                    {
                                                        isCurrentLocatoin ?
                                                            t('currentLocation')
                                                            :
                                                            locationDisplayName || t("selectDestination")
                                                    }
                                                </span>
                                            </div>
                                            <button onClick={() => setMobileStep(1)} className="primaryColor font-medium text-sm">{t('edit')}</button>
                                        </div>
                                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <PiCalendar className="text-xl" />
                                                <span className="font-semibold">
                                                    {bookingDetails.checkIn ? format(parseCustomDate(bookingDetails.checkIn)!, "MMM dd") : t('checkIn')} - {bookingDetails.checkout ? format(parseCustomDate(bookingDetails.checkout)!, "MMM dd") : t('checkOut')}
                                                </span>
                                            </div>
                                            <button onClick={() => setMobileStep(2)} className="primaryColor font-medium text-sm">{t('edit')}</button>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                                        {/* Adults */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold">{t('adults')}</span>
                                            <div className="flex items-center border rounded-full px-2 py-1 gap-4">
                                                <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateGuestCount('adults', 'decrement')} disabled={bookingDetails.adults <= 1}>
                                                    <PiMinus className="h-4 w-4" />
                                                </button>
                                                <span className="w-4 text-center font-medium">{bookingDetails.adults}</span>
                                                <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateGuestCount('adults', 'increment')}>
                                                    <PiPlus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Children */}
                                        <div className="flex items-center justify-between border-t pt-3">
                                            <div className="flex flex-col">
                                                <span className="text-base font-semibold">{t("children")}</span>
                                                <span className="text-xs text-gray-500">{t('below12')}</span>
                                            </div>
                                            <div className="flex items-center border rounded-full px-2 py-1 gap-4">
                                                <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateGuestCount('childrenCount', 'decrement')} disabled={bookingDetails.childrenCount <= 0}>
                                                    <PiMinus className="h-4 w-4" />
                                                </button>
                                                <span className="w-4 text-center font-medium">{bookingDetails.childrenCount}</span>
                                                <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateGuestCount('childrenCount', 'increment')}>
                                                    <PiPlus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Rooms */}
                                        <div className="flex items-center justify-between border-t pt-3">
                                            <span className="text-base font-semibold">{t('rooms')}</span>
                                            <div className="flex items-center border rounded-full px-2 py-1 gap-4">
                                                <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateGuestCount('rooms', 'decrement')} disabled={bookingDetails.rooms <= 1}>
                                                    <PiMinus className="h-4 w-4" />
                                                </button>
                                                <span className="w-4 text-center font-medium">{bookingDetails.rooms}</span>
                                                <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateGuestCount('rooms', 'increment')}>
                                                    <PiPlus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Pets */}
                                        {
                                            !isSingleHotelModule &&
                                            <div className="flex items-center justify-between border-t py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-semibold">{t('pets')}</span>
                                                    <span className="text-xs text-gray-500">{t('includePetFriendlyProps')}</span>
                                                </div>
                                                <Switch checked={bookingDetails.pets} onCheckedChange={(checked) => dispatch(setBookingDetails({ pets: checked }))} />
                                            </div>
                                        }
                                    </div>

                                    <div className="p-4 pb-8 mt-auto bg-white border-t">
                                        <Button variant="primary" size="md" className="w-full" children={t(isSingleHotel ? 'searchRooms' : 'searchProperties')} onClick={handleNext} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>,
                    portalRoot
                )}
            </div>

        </div>
    )
}

export default SearchBar