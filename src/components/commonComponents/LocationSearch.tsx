"use client"

import { useState } from "react"
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
import { PropertyDropdown } from "@/hooks/queries/usePropertiesDropdown"
import { useDispatch, useSelector } from "react-redux"
import { bookingDetailsSelector, setBookingDetails } from "@/redux/reducers/bookingDetailsSlice"
import InfiniteScroll from "react-infinite-scroll-component"
import { Skeleton } from "@/components/ui/skeleton"
import { setSelectedPropertyCountryId } from "@/redux/reducers/helpersReducer"

interface LocationSearchProps {
    placeholder?: string;
    className?: string;
    items: PropertyDropdown[];
    isLoading: boolean;
    offset: number;
    hasMore: boolean;
    fetchMore: () => void;
    search: string;
    onSearchChange: (val: string) => void;
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

export function LocationSearch({
    placeholder = "Select location...",
    className,
    items,
    isLoading,
    offset,
    hasMore,
    fetchMore,
    search,
    onSearchChange,
}: LocationSearchProps) {

    const { t } = useTranslation();
    const bookingDetails = useSelector(bookingDetailsSelector);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false)
    const [selectedDisplay, setSelectedDisplay] = useState<{ name: string; city: string } | null>(null)

    const selectedInList = items.find(p => p.slug === bookingDetails.location)
    const displayName = selectedDisplay
        ? `${selectedDisplay.name}, ${selectedDisplay.city}`
        : selectedInList
            ? `${selectedInList.name}, ${selectedInList.city}`
            : placeholder


    const handleSelectLocation = (property: PropertyDropdown) => {
        dispatch(setSelectedPropertyCountryId(property.country_id))
        dispatch(setBookingDetails({ ...bookingDetails, location: property.slug === bookingDetails.location ? bookingDetails.location : property.slug }))
        setSelectedDisplay({ name: property.name, city: property.city })
        setOpen(false)
        onSearchChange("")
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div role="button" tabIndex={0} className={cn("flex flex-col flex-1 min-w-0 cursor-pointer", className)}>
                    <span className="text-sm textSecondaryColor line-clamp-1">{t('whereToStay')}</span>
                    <div role="combobox" aria-expanded={open} aria-label={t('whereToStay')} className="flex items-center justify-between text-base font-medium w-full text-left">
                        {displayName}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={t('searchByCityHotelOrDestination')}
                        value={search}
                        onValueChange={onSearchChange}
                    />
                    <CommandList id="location-search-scroll" className="customScrollbar">
                        {isLoading && offset === 0 ? (
                            <div className="py-2">
                                <LocationSkeleton />
                                <LocationSkeleton />
                                <LocationSkeleton />
                            </div>
                        ) : items.length === 0 ? (
                            <CommandEmpty>{t('noLocationFound')}</CommandEmpty>
                        ) : (
                            <InfiniteScroll
                                dataLength={items.length}
                                next={fetchMore}
                                hasMore={hasMore}
                                loader={
                                    <div className="py-2">
                                        <LocationSkeleton />
                                    </div>
                                }
                                scrollableTarget="location-search-scroll"
                            >
                                <CommandGroup>
                                    {items.map((property) => (
                                        <CommandItem
                                            key={property.id}
                                            value={property.slug}
                                            onSelect={() => { handleSelectLocation(property) }}
                                            className="cursor-pointer py-3 aria-selected:bg-blue-50"
                                        >
                                            <div className="flex items-center gap-4 w-full">
                                                <div className="bg-blue-50 p-2 rounded-full border border-blue-100 shrink-0">
                                                    <PiMapPin className="primaryColor text-lg" />
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-semibold text-gray-900 text-base first-letter:uppercase">{property.name}</span>
                                                    <span className="text-xs text-gray-500 font-normal">{property.city}{property.city ? ',' : ''} {property.country}</span>
                                                </div>
                                            </div>
                                            {bookingDetails.location === property.slug && (
                                                <Check className="ml-auto h-4 w-4 primaryColor!" />
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </InfiniteScroll>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
