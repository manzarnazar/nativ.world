"use client"

import { useEffect, useState } from "react"
import { Check } from "lucide-react"
import { PiMapPin } from "react-icons/pi"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslation } from "@/hooks/useTranslation"
import { useDispatch, useSelector } from "react-redux"
import { bookingDetailsSelector } from "@/redux/reducers/bookingDetailsSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { latLongSelector, selectedLocationSelector, setSelectedLocation } from "@/redux/reducers/settingsSlice"
import { LocationSuggestion, PropertySuggestion, useSearchSuggestions } from "@/hooks/queries/useSearchSuggestions"
import { useRouter } from "next/navigation"
import { currentLangCodeSelector } from "@/redux/reducers/languageSlice"
import { recentSearchesSelector, setRecentSearches } from "@/redux/reducers/helpersReducer"

interface MultiLocationSearchProps {
    className?: string;
    mobileView?: boolean
    searchMobile?: string;
    handleNext: () => void
}

export const LocationSkeleton = () => (
    <div className="flex items-center gap-4 px-2 py-3">
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
        <div className="flex flex-col gap-1.5 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
        </div>
    </div>
)

const SEARCH_DEBOUNCE_MS = 400

export function MultiLocationSearch({ className, mobileView = false, searchMobile = '', handleNext }: MultiLocationSearchProps) {

    const langCode = useSelector(currentLangCodeSelector)
    const { t } = useTranslation();
    const bookingDetails = useSelector(bookingDetailsSelector);
    const dispatch = useDispatch();
    const router = useRouter();
    const selectedLocation = useSelector(selectedLocationSelector);
    const recentSearches = useSelector(recentSearchesSelector);
    const latLong = useSelector(latLongSelector);
    const { latitude, longitude } = latLong;
    const isCurrentLocatoin = latitude != null && longitude != null;


    const [open, setOpen] = useState(false)
    const [selectedDisplay, setSelectedDisplay] = useState<{ name: string; city: string } | null>(null)

    const [query, setQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')

    // Mobile has no input of its own — the value lives in SearchBar and is passed down.
    const effectiveQuery = mobileView ? searchMobile : query

    const displayName = selectedDisplay
        ? `${selectedDisplay.name}, ${selectedDisplay.city}`
        : selectedLocation
            ? `${selectedLocation.name}, ${selectedLocation.state}`
            : t('selectDestination')

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(effectiveQuery.trim()), SEARCH_DEBOUNCE_MS)
        return () => clearTimeout(timer)
    }, [effectiveQuery])

    const { data: suggestionsData, isLoading, isError } = useSearchSuggestions(debouncedQuery)

    const locations = suggestionsData?.data?.locations ?? []
    const properties = suggestionsData?.data?.properties ?? []
    const hasResults = locations.length > 0 || properties.length > 0

    const handleSelectLocation = (location: LocationSuggestion) => {
        dispatch(setSelectedLocation(location))
        setSelectedDisplay({ name: location.name, city: location.state })
        setOpen(false)
        setQuery("")
        if (!recentSearches?.includes(location)) {
            dispatch(setRecentSearches([...recentSearches, location]))
        }
        if (mobileView) {
            handleNext()
        }
    };

    const handleSelectProperty = (property: PropertySuggestion) => {
        setOpen(false)
        setQuery("")
        router.push(`/${langCode}/properties/${property?.slug}`)

    };

    return (
        mobileView ?
            <div>
                {isLoading && effectiveQuery ? (
                    <div className="space-y-1">
                        <LocationSkeleton />
                        <LocationSkeleton />
                        <LocationSkeleton />
                        <LocationSkeleton />
                    </div>
                ) : recentSearches?.length < 1 && !effectiveQuery.trim() ? (
                    <div className="flex flex-col items-center text-center gap-1 p-4">
                        <span className="font-medium text-sm">{t('searchDestination')}</span>
                        <span className="font-medium text-xs textSecondaryColor">{t('searchDestinationDesc')}</span>
                    </div>
                ) : !isLoading && isError && !hasResults ? (
                    <p className="text-sm text-gray-500 py-4 text-center">{t('noLocationFound')}</p>
                ) : (
                    <div className="space-y-4">
                        {recentSearches?.length > 0 && (
                            <div>
                                <span className="text-sm font-medium my-2 block">{t('recentSearches')}</span>
                                <div className="space-y-2">
                                    {recentSearches.map((location) => (
                                        <button
                                            key={location.ref_city_id ?? location.place_id}
                                            onClick={() => { handleSelectLocation(location) }}
                                            className="flex items-center gap-4 w-full p-2 border-b last:border-0 pb-4"
                                        >
                                            <div className="bg-blue-50 p-3 rounded-full border border-blue-100 shrink-0">
                                                <PiMapPin className="primaryColor text-lg" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-base first-letter:uppercase">{location.name}</div>
                                                <div className="text-sm text-gray-500">{location.state}{location.state ? ',' : ''} {location.country}{location?.property_count! > 0 && ','} {location?.property_count! > 0 && `(${location?.property_count} ${t('properties')})`}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {locations.length > 0 && (
                            <div>
                                <span className="text-sm font-medium my-2 block">{t('suggestDestination')}</span>
                                <div className="space-y-2">
                                    {locations.map((location) => (
                                        <button
                                            key={location.ref_city_id ?? location.place_id}
                                            onClick={() => { handleSelectLocation(location) }}
                                            className="flex items-center gap-4 w-full p-2 border-b last:border-0 pb-4"
                                        >
                                            <div className="bg-blue-50 p-3 rounded-full border border-blue-100 shrink-0">
                                                <PiMapPin className="primaryColor text-lg" />
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-base first-letter:uppercase">{location.name}</div>
                                                <div className="text-sm text-gray-500">{location.state}{location.state ? ',' : ''} {location.country}{location?.property_count! > 0 && ','} {location?.property_count! > 0 && `(${location?.property_count} ${t('properties')})`}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {properties.length > 0 && (
                            <div>
                                <span className="text-sm font-medium my-2 block">{t('suggestedProps')}</span>
                                <div className="space-y-2">
                                    {properties.map((property) => (
                                        <button
                                            key={property?.id}
                                            onClick={() => { handleSelectProperty(property) }}
                                            className="flex items-center gap-4 w-full p-2 border-b last:border-0 pb-4"
                                        >
                                            <img src={property?.image} alt={property?.name} className="h-9 w-9 rounded-full object-cover shrink-0" />
                                            <div className="text-left">
                                                <div className="font-semibold text-base first-letter:uppercase">{property?.name}</div>
                                                <div className="text-sm text-gray-500">{property?.city}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            :
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div role="button" tabIndex={0} className={cn("flex flex-col flex-1 min-w-0 cursor-pointer", className)}>
                        <span className="text-sm textSecondaryColor line-clamp-1">{t('whereToStay')}</span>
                        <div role="combobox" aria-expanded={open} aria-label={t('whereToStay')} className="flex items-center justify-between text-base font-medium w-full text-left">
                            {
                                isCurrentLocatoin ?
                                    t('currentLocation')
                                    :
                                    displayName
                            }
                        </div>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={t('searchByCityHotelOrDestination')}
                            value={query}
                            onValueChange={setQuery}
                        />
                        <CommandList id="location-search-scroll" className="customScrollbar">
                            {isLoading && query ? (
                                <div className="py-2">
                                    <LocationSkeleton />
                                    <LocationSkeleton />
                                    <LocationSkeleton />
                                </div>
                            ) : recentSearches?.length < 1 && !query.trim() ?
                                <CommandEmpty className="flexColCenter text-center p-4">
                                    <span className="font-medium text-sm">
                                        {t('searchDestination')}
                                    </span>
                                    <span className="font-medium text-xs textSecondaryColor">
                                        {t('searchDestinationDesc')}
                                    </span>
                                </CommandEmpty>
                                :
                                !isLoading && isError && !hasResults ? (
                                    <CommandEmpty>{t('noLocationFound')}</CommandEmpty>
                                ) : (
                                    <>
                                        {recentSearches?.length > 0 && (
                                            <CommandGroup>
                                                <span className="text-sm font-medium my-2 block">{t('recentSearches')}</span>
                                                {recentSearches.map((location) => (
                                                    <CommandItem
                                                        key={location.ref_city_id ?? location.place_id}
                                                        value={`location-${location.ref_city_id ?? location.place_id}`}
                                                        onSelect={() => { handleSelectLocation(location) }}
                                                        className="cursor-pointer py-3 aria-selected:bg-blue-50"
                                                    >
                                                        <div className="flex items-center gap-4 w-full">
                                                            <div className="bg-blue-50 p-2 rounded-full border border-blue-100 shrink-0">
                                                                <PiMapPin className="primaryColor text-lg" />
                                                            </div>
                                                            <div className="flex flex-col text-left">
                                                                <span className="font-semibold text-gray-900 text-base first-letter:uppercase">{location.name}</span>
                                                                <span className="text-xs text-gray-500 font-normal">{location.state}{location.state ? ',' : ''} {location.country}{location?.property_count! > 0 && ','} {location?.property_count! > 0 && `(${location?.property_count} ${t('properties')})`}</span>
                                                            </div>
                                                        </div>
                                                        {bookingDetails.location === location.name && (
                                                            <Check className="ml-auto h-4 w-4 primaryColor!" />
                                                        )}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )}
                                        {locations.length > 0 && (
                                            <CommandGroup>
                                                <span className="text-sm font-medium my-2 block">{t('suggestDestination')}</span>
                                                {locations.map((location) => (
                                                    <CommandItem
                                                        key={location.ref_city_id ?? location.place_id}
                                                        value={`location-${location.ref_city_id ?? location.place_id}`}
                                                        onSelect={() => { handleSelectLocation(location) }}
                                                        className="cursor-pointer py-3 aria-selected:bg-blue-50"
                                                    >
                                                        <div className="flex items-center gap-4 w-full">
                                                            <div className="bg-blue-50 p-2 rounded-full border border-blue-100 shrink-0">
                                                                <PiMapPin className="primaryColor text-lg" />
                                                            </div>
                                                            <div className="flex flex-col text-left">
                                                                <span className="font-semibold text-gray-900 text-base first-letter:uppercase">{location.name}</span>
                                                                <span className="text-xs text-gray-500 font-normal">{location.state}{location.state ? ',' : ''} {location.country}{location?.property_count! > 0 && ','} {location?.property_count! > 0 && `(${location?.property_count} ${t('properties')})`}</span>
                                                            </div>
                                                        </div>
                                                        {bookingDetails.location === location.name && (
                                                            <Check className="ml-auto h-4 w-4 primaryColor!" />
                                                        )}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )}
                                        {properties.length > 0 && (
                                            <CommandGroup>
                                                <span className="text-sm font-medium my-2 block">{t('suggestedProps')}</span>
                                                {properties.map((property) => (
                                                    <CommandItem
                                                        key={property?.id}
                                                        value={property?.slug}
                                                        onSelect={() => { handleSelectProperty(property) }}
                                                        className="cursor-pointer py-3 aria-selected:bg-blue-50"
                                                    >
                                                        <div className="flex items-center gap-4 w-full">
                                                            <img src={property?.image} alt={property?.name} className="h-9 w-9 rounded-full object-cover shrink-0" />
                                                            <div className="flex flex-col text-left">
                                                                <span className="font-semibold text-gray-900 text-base first-letter:uppercase">{property?.name}</span>
                                                                <span className="text-xs text-gray-500 font-normal">{property?.city}</span>
                                                            </div>
                                                        </div>
                                                        {bookingDetails.location === property?.slug && (
                                                            <Check className="ml-auto h-4 w-4 primaryColor!" />
                                                        )}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        )}
                                    </>
                                )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
    )
}
