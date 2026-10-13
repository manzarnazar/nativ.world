// Import necessary modules
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { addDays } from 'date-fns'
import { BookingDetailsData } from '@/types/GlobalTypes'
import { formateDate } from '@/utils/helpers'

// Initial state with some default data
const initialState: BookingDetailsData = {
    location: "",
    checkIn: formateDate(new Date()),
    checkout: formateDate(addDays(new Date(), 1)),
    rooms: 1,
    adults: 2,
    childrenCount: 0,
    pets: false,
}

// Create a Redux slice
export const bookingDetailsSlice = createSlice({
    name: 'bookingDetails',
    initialState,
    reducers: {
        resetBookingDetailsData: () => {
            return initialState
        },
        setBookingDetails: (state, action: PayloadAction<Partial<BookingDetailsData>>) => {
            return { ...state, ...action.payload }
        },
    }
})

export const { resetBookingDetailsData, setBookingDetails } = bookingDetailsSlice.actions
export default bookingDetailsSlice.reducer

export const dataSelector = (state: RootState) => state
export const bookingDetailsSelector = createSelector(dataSelector, (state) => state.bookingDetails)