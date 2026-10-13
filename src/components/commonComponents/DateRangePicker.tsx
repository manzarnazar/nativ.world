"use client"
import * as React from "react"
import { addMonths, subMonths } from "date-fns"
import { PiCaretLeft, PiCaretRight } from "react-icons/pi"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslation } from "@/hooks/useTranslation"
import { useDispatch, useSelector } from "react-redux"
import { bookingDetailsSelector, setBookingDetails } from "@/redux/reducers/bookingDetailsSlice"
import { formateDate, formateDatePretty, parseCustomDate } from "@/utils/helpers" // ✅ import parseCustomDate

interface DateRangePickerProps {
    className?: string;
}

export function DateRangePicker({ className }: DateRangePickerProps) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false)
    const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
    const [step, setStep] = React.useState<'checkIn' | 'checkOut'>('checkIn');

    const bookingDetails = useSelector(bookingDetailsSelector);

    // ✅ Use parseCustomDate — it handles "d-M-yyyy" format correctly
    const checkInDate = parseCustomDate(bookingDetails.checkIn) ?? undefined;
    const checkOutDate = parseCustomDate(bookingDetails.checkout) ?? undefined;

    // On open: reset step to checkIn and jump calendar to checkIn month
    React.useEffect(() => {
        if (!open) return;
        setStep('checkIn');
        const parsed = parseCustomDate(bookingDetails.checkIn);
        if (parsed) setCurrentMonth(parsed);
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentMonth(prev => subMonths(prev, 1))
    }

    const handleNextMonth = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentMonth(prev => addMonths(prev, 1))
    }

    // react-day-picker always sorts: { from: min, to: max }.
    // To get the actual clicked date: if date.from === existingCheckIn → normal (clicked after, use date.to),
    // else swap happened (clicked before, use date.from).
    const resolveClickedDate = (
        date: { from?: Date; to?: Date },
        existingCheckIn: Date | null
    ): Date | undefined => {
        if (!date.from) return undefined;
        if (!existingCheckIn) return date.from;
        const sameAsCheckIn = date.from.getTime() === existingCheckIn.getTime();
        return sameAsCheckIn ? (date.to ?? date.from) : date.from;
    };

    const handleSelect = (date: { from?: Date; to?: Date } | undefined) => {
        if (!date?.from) return;
        const existingCheckIn = parseCustomDate(bookingDetails.checkIn);

        if (step === 'checkIn') {
            const clicked = resolveClickedDate(date, existingCheckIn);
            if (!clicked) return;
            dispatch(setBookingDetails({ ...bookingDetails, checkIn: formateDate(clicked), checkout: '' }));
            setStep('checkOut');
        } else {
            const clicked = resolveClickedDate(date, existingCheckIn);
            if (!clicked) return;
            if (existingCheckIn && clicked > existingCheckIn) {
                // Valid checkout → set it, reset cycle so next click = new checkIn
                dispatch(setBookingDetails({ ...bookingDetails, checkout: formateDate(clicked) }));
                setStep('checkIn');
            } else {
                // Clicked before/on checkIn → treat as new checkIn, stay in checkOut step
                dispatch(setBookingDetails({ ...bookingDetails, checkIn: formateDate(clicked), checkout: '' }));
            }
        }
    };

    const displayText = checkInDate && checkOutDate
        ? `${formateDatePretty(checkInDate)} - ${formateDatePretty(checkOutDate)}`
        : checkInDate
            ? formateDatePretty(checkInDate)
            : t('checkInCheckOut'); // ✅ Graceful fallback

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div role="button" tabIndex={0} className="flex flex-col flex-1 min-w-0 cursor-pointer">
                        <span className="text-sm textSecondaryColor line-clamp-1">
                            {t('checkInCheckOut')}
                        </span>
                        <div className='flex items-center gap-2 text-base'>
                            <span className='font-medium line-clamp-1'>
                                {displayText}
                            </span>
                        </div>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none shadow-none rounded-2xl" align="start">
                    <div className="bg-white rounded-2xl p-4 shadow-xl border relative">
                        <div className="absolute top-6 left-4 z-20">
                            <button
                                onClick={handlePrevMonth}
                                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <PiCaretLeft className="text-lg" />
                            </button>
                        </div>
                        <div className="absolute top-6 right-4 z-20">
                            <button
                                onClick={handleNextMonth}
                                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <PiCaretRight className="text-lg" />
                            </button>
                        </div>

                        <Calendar
                            initialFocus
                            mode="range"
                            showOutsideDays={false}
                            // ✅ Both defaultMonth and month use properly parsed Date objects
                            defaultMonth={checkInDate}
                            month={currentMonth}
                            onMonthChange={setCurrentMonth}
                            // ✅ selected uses correctly parsed Date objects
                            selected={{ from: checkInDate, to: checkOutDate }}
                            onSelect={handleSelect}
                            numberOfMonths={2}
                            weekStartsOn={1}
                            modifiers={{ sunday: { dayOfWeek: [0] } }}
                            modifiersClassNames={{ sunday: "errorColor" }}
                            className="p-0"
                            classNames={{
                                month: "space-y-4",
                                caption: "flex justify-center pt-1 relative items-center mb-4",
                                caption_label: "text-base font-semibold",
                                nav: "hidden",
                                head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] last:errorColor",
                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 placeholder:opacity-50 [&:nth-child(7)]:errorColor",
                                day_range_end: "day-range-end",
                                day_selected: "primaryBg! !text-white hover:!bg-[var(--primary-color)] hover:!text-white focus:!bg-[var(--primary-color)] focus:!text-white",
                                day_today: "bg-accent text-accent-foreground",
                                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                                day_disabled: "text-muted-foreground opacity-50",
                                day_range_middle: "!aria-selected:bg-[var(--primary-color-50)] !aria-selected:text-black",
                                day_hidden: "invisible",
                            }}
                        />
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}