"use client"

import * as React from "react"
import { PiCaretDown, PiMinus, PiPlus } from "react-icons/pi"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslation } from "@/hooks/useTranslation"
import { Switch } from "@/components/ui/switch"
import { Button } from "../storyBook/atoms/Button"
import { useDispatch, useSelector } from "react-redux"
import { bookingDetailsSelector, setBookingDetails } from "@/redux/reducers/bookingDetailsSlice"
import { BookingDetailsData } from "@/types/GlobalTypes"
import { businessModeSelector } from "@/redux/reducers/settingsSlice"
import { useBookingDetails } from "@/contexts/BookingDetails"
import { getDirection } from "@/utils/helpers"

interface GuestSelectorProps {
    className?: string;
    trigger?: React.ReactNode;
    reserveCard?: boolean;
    setBookingDetailsReserveCard?: (bookingDetails: BookingDetailsData) => void;
    petsAllowed?: boolean;
}

export function GuestSelector({ className, trigger, reserveCard, setBookingDetailsReserveCard, petsAllowed }: GuestSelectorProps) {

    const { t } = useTranslation()
    const dispatch = useDispatch();

    const { bookingData } = useBookingDetails();

    const bookingDetails = useSelector(bookingDetailsSelector);
    const businessMode = useSelector(businessModeSelector);

    const isSingleHotel = businessMode?.business_mode === 'single';

    const [open, setOpen] = React.useState(false)

    type GuestFields = Pick<BookingDetailsData, 'rooms' | 'adults' | 'childrenCount' | 'pets'>;
    const extractGuestFields = (d: BookingDetailsData): GuestFields => ({
        rooms: d.rooms,
        adults: d.adults,
        childrenCount: d.childrenCount,
        pets: d.pets,
    });

    // ✅ Local state to hold changes until Apply is clicked — dates excluded
    const [localDetails, setLocalDetails] = React.useState<GuestFields>(() => extractGuestFields(bookingDetails));

    // ✅ Sync local state when popover opens
    React.useEffect(() => {
        if (open) {
            setLocalDetails(extractGuestFields(reserveCard ? bookingData : bookingDetails));
        }
    }, [open]);

    const updateCount = (type: 'rooms' | 'adults' | 'childrenCount', operation: 'increment' | 'decrement') => {
        setLocalDetails(prev => {
            let newValue = prev[type] as number;

            if (operation === 'increment') {
                newValue += 1;
            } else {
                if (newValue > 0) newValue -= 1;
            }

            if (type === 'rooms' && newValue < 1) newValue = 1;
            if (type === 'adults' && newValue < 1) newValue = 1;

            return { ...prev, [type]: newValue };
        });
    }

    const togglePets = (checked: boolean) => {
        setLocalDetails(prev => ({ ...prev, pets: checked }));
    }

    // ✅ Only commit on Apply
    const handleApply = () => {
        const base = reserveCard ? bookingData : bookingDetails;
        const guestUpdate: BookingDetailsData = { ...base, ...localDetails };
        if (reserveCard) {
            setBookingDetailsReserveCard?.(guestUpdate);
        } else {
            dispatch(setBookingDetails(guestUpdate));
        }
        setOpen(false);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <div role="button" tabIndex={0} className="flex flex-col flex-1 min-w-0 cursor-pointer">
                        <span className="text-sm textSecondaryColor line-clamp-1">{t('guestsAndRooms')}</span>
                        <div className='flex items-center gap-2 text-base'>
                            <span className='font-medium line-clamp-1'>
                                {bookingDetails.rooms} {t('rooms')}, {bookingDetails.adults} {t('adults')}, {bookingDetails.childrenCount} {t('children')}{bookingDetails.pets ? `, ${t('pets')}` : ''}
                            </span>
                        </div>
                    </div>
                )}
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-xl" align="end" onMouseLeave={() => setOpen(false)}>
                <div className="flex flex-col p-6 gap-6">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                        <span className="text-base font-semibold">{t('adults')}</span>
                        <div className="flex items-center border rounded-full px-2 py-1 gap-4">
                            <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateCount('adults', 'decrement')} disabled={localDetails.adults <= 1}>
                                <PiMinus className="h-4 w-4" />
                            </button>
                            <span className="w-4 text-center font-medium">{localDetails.adults}</span>
                            <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateCount('adults', 'increment')}>
                                <PiPlus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between border-t pt-6">
                        <div className="flex flex-col">
                            <span className="text-base font-semibold">{t('children')}</span>
                            <span className="text-xs text-gray-500">{t('below12')}</span>
                        </div>
                        <div className="flex items-center border rounded-full px-2 py-1 gap-4">
                            <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateCount('childrenCount', 'decrement')} disabled={localDetails.childrenCount <= 0}>
                                <PiMinus className="h-4 w-4" />
                            </button>
                            <span className="w-4 text-center font-medium">{localDetails.childrenCount}</span>
                            <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateCount('childrenCount', 'increment')}>
                                <PiPlus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Rooms */}
                    <div className="flex items-center justify-between border-t pt-6">
                        <span className="text-base font-semibold">{t('rooms')}</span>
                        <div className="flex items-center border rounded-full px-2 py-1 gap-4">
                            <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateCount('rooms', 'decrement')} disabled={localDetails.rooms <= 1}>
                                <PiMinus className="h-4 w-4" />
                            </button>
                            <span className="w-4 text-center font-medium">{localDetails.rooms}</span>
                            <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-900" onClick={() => updateCount('rooms', 'increment')}>
                                <PiPlus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Pets */}
                    {
                        (!isSingleHotel || reserveCard) &&
                        <div className="flex items-center justify-between border-t py-6">
                            <div className="flex flex-col">
                                <span className="text-base font-semibold">{t('pets')}</span>
                                <span className="text-xs text-gray-500">{reserveCard && isSingleHotel ? petsAllowed ? t('arePetsWithYouDesc') : t('petsAreNotAllowed') : t('includePetFriendlyProps')}</span>
                            </div>
                            <Switch checked={localDetails.pets} onCheckedChange={togglePets} disabled={!petsAllowed} className={`${!petsAllowed ? 'cursor-not-allowed!' : ''}`} dir={getDirection()} />
                        </div>
                    }

                    <Button children={t('apply')} onClick={handleApply} />
                </div>
            </PopoverContent>
        </Popover >
    )
}
