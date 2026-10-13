// Import necessary modules
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Room, RoomProperty } from '@/hooks/queries/useRooms'
import { PropertyDropdown } from '@/hooks/queries/usePropertiesDropdown'
import { BookingQuoteData, BookingQuotePricing } from '@/hooks/queries/useBookingQuote'
import { LocationSuggestion } from '@/hooks/queries/useSearchSuggestions'

export interface selectedRoomType {
    property: RoomProperty,
    room: Room,
}
export interface payAtPropertyType {
    enabled: boolean,
    advancePercentage: number,
    totalAmount: number,
}

// Initial state with some default data
const initialState = {
    isNewsUser: false as boolean,
    properties: [] as PropertyDropdown[],
    selectedPropertyCountryId: null as number | null,
    loginModalState: false,
    isFromSearch: false as boolean,
    //booking related helper states start 
    selectedRoom: {} as selectedRoomType,
    bookingLockId: null as number | null,
    payAtProperty: {} as payAtPropertyType,
    bookingSummary: {} as BookingQuoteData,
    bookingId: null as string | null,
    isRedirectToPaymentGateway: false as boolean,
    couponCode: '' as string,
    reserveNowClicked: false as boolean,
    //booking related helper states ends 
    recentSearches: [] as LocationSuggestion[],
}

// Create a Redux slice
export const helpersSlice = createSlice({
    name: 'helpers',
    initialState,
    reducers: {
        resetHelpersData: () => {
            return initialState
        },
        setSelectedRoom: (state, action: PayloadAction<selectedRoomType>) => {
            state.selectedRoom = action.payload
        },
        setBookingLockId: (state, action: PayloadAction<number | null>) => {
            state.bookingLockId = action.payload
        },
        setProperties: (state, action: PayloadAction<PropertyDropdown[]>) => {
            state.properties = action.payload
        },
        setPayAtProperty: (state, action: PayloadAction<payAtPropertyType>) => {
            state.payAtProperty = action.payload
        },
        setBookingSummary: (state, action: PayloadAction<BookingQuoteData>) => {
            state.bookingSummary = action.payload
        },
        setBookingId: (state, action: PayloadAction<string | null>) => {
            state.bookingId = action.payload
        },
        setIsRedirectToPaymentGateway: (state, action: PayloadAction<boolean>) => {
            state.isRedirectToPaymentGateway = action.payload
        },
        setCouponCode: (state, action: PayloadAction<string>) => {
            state.couponCode = action.payload
        },
        setReserveNowClicked: (state, action: PayloadAction<boolean>) => {
            state.reserveNowClicked = action.payload
        },
        resetBookingDetailsHelper: (state) => {
            state.selectedRoom = {} as selectedRoomType
            state.bookingLockId = null
            state.payAtProperty = {} as payAtPropertyType
            state.bookingSummary = {} as BookingQuoteData
            state.bookingId = null
            state.isRedirectToPaymentGateway = false
            state.couponCode = ''
            state.reserveNowClicked = false
        },
        setSelectedPropertyCountryId: (state, action: PayloadAction<number | null>) => {
            state.selectedPropertyCountryId = action.payload
        },
        setLoginModalState: (state, action: PayloadAction<boolean>) => {
            state.loginModalState = action.payload
        },
        setIsFromSearch: (state, action: PayloadAction<boolean>) => {
            state.isFromSearch = action.payload
        },
        setRecentSearches: (state, action: PayloadAction<LocationSuggestion[]>) => {
            state.recentSearches = action.payload
        },

    }
})

export const { resetHelpersData, setSelectedRoom, setBookingLockId, resetBookingDetailsHelper, setProperties, setPayAtProperty, setBookingSummary, setBookingId, setIsRedirectToPaymentGateway, setCouponCode, setReserveNowClicked, setSelectedPropertyCountryId, setLoginModalState, setIsFromSearch, setRecentSearches } = helpersSlice.actions

export default helpersSlice.reducer

export const dataSelector = (state: RootState) => state.helpers

export const selectedRoomSelector = createSelector(dataSelector, (state) => state.selectedRoom)
export const bookingLockIdSelector = createSelector(dataSelector, (state) => state.bookingLockId)
export const propertiesSelector = createSelector(dataSelector, (state) => state.properties)
export const payAtPropertySelector = createSelector(dataSelector, (state) => state.payAtProperty)
export const bookingSummarySelector = createSelector(dataSelector, (state) => state.bookingSummary)
export const bookingIdSelector = createSelector(dataSelector, (state) => state.bookingId)
export const isRedirectToPaymentGatewaySelector = createSelector(dataSelector, (state) => state.isRedirectToPaymentGateway)
export const couponCodeSelector = createSelector(dataSelector, (state) => state.couponCode)
export const reserveNowClickedSelector = createSelector(dataSelector, (state) => state.reserveNowClicked)
export const selectedPropertyCountryIdSelector = createSelector(dataSelector, (state) => state.selectedPropertyCountryId)
export const isLoginModalOpenSelector = createSelector(dataSelector, (state) => state.loginModalState)
export const isFromSearchSelector = createSelector(dataSelector, (state) => state.isFromSearch)
export const recentSearchesSelector = createSelector(dataSelector, (state) => state.recentSearches)





