'use client'
import { bookingDetailsSelector } from "@/redux/reducers/bookingDetailsSlice"
import { BookingDetailsData } from "@/types/GlobalTypes"
import { formateDate } from "@/utils/helpers"
import { addDays } from "date-fns"
import { createContext, useContext, useState, ReactNode } from "react"
import { useSelector } from "react-redux"

const getDefaultBookingData = (): BookingDetailsData => ({
    location: '',
    checkIn: formateDate(new Date()),
    checkout: formateDate(addDays(new Date(), 1)),
    rooms: 1,
    adults: 2,
    childrenCount: 0,
    pets: false,
})

type BookingDetailsContextType = {
    bookingData: BookingDetailsData
    setBookingData: React.Dispatch<React.SetStateAction<BookingDetailsData>>
    resetBookingData: () => void
}

const BookingDetailsContext = createContext<BookingDetailsContextType | undefined>(undefined)

export const BookingDetailsProvider = ({ children }: { children: ReactNode }) => {

    const defaultDetails = useSelector(bookingDetailsSelector);

    const [bookingData, setBookingData] = useState<BookingDetailsData>(defaultDetails);

    const resetBookingData = () => {
        setBookingData(getDefaultBookingData());
    }

    return (
        <BookingDetailsContext.Provider value={{ bookingData, setBookingData, resetBookingData }}>
            {children}
        </BookingDetailsContext.Provider>
    )
}

export const useBookingDetails = () => {
    const context = useContext(BookingDetailsContext)
    if (!context) {
        throw new Error("useBookingDetails must be used within a BookingDetailsProvider")
    }
    return context
}
