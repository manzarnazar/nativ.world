'use client';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SettingsData } from '@/hooks/queries/useSettings';
import { LocationSuggestion } from '@/hooks/queries/useSearchSuggestions';
// import { WebSettings } from '@/utils/api/general/getSettings';

export const initialState = {
    data: {} as SettingsData,
    fcmtoken: "",
    lastFetch: null,
    latitude: null as number | null,
    longitude: null as number | null,
    propertyLatitude: null as number | null,
    propertyLongitude: null as number | null,
    selectedLocation: null as LocationSuggestion | null,
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings: (state, action: PayloadAction<any>) => {
            state.data = action.payload
        },
        setFcmTokenData: (state, action: PayloadAction<string>) => {
            state.fcmtoken = action.payload
        },
        setSettingsLastFetch: (state, action) => {
            state.lastFetch = action.payload
        },
        setLatLong: (state, action: PayloadAction<{ latitude: number | null; longitude: number | null }>) => {
            state.latitude = action.payload.latitude
            state.longitude = action.payload.longitude
        },
        setPropertyLatLong: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
            state.propertyLatitude = action.payload.latitude
            state.propertyLongitude = action.payload.longitude
        },
        setSelectedLocation: (state, action: PayloadAction<LocationSuggestion | null>) => {
            state.selectedLocation = action.payload
        },

    },
});

export const { setFcmTokenData, setSettings, setSettingsLastFetch, setLatLong, setPropertyLatLong, setSelectedLocation } = settingsSlice.actions;
export default settingsSlice.reducer;

export const dataSelector = (state: RootState) => state.settings

export const settingsSelector = createSelector(dataSelector, state => state.data)
export const businessModeSelector = createSelector(dataSelector, state => state.data?.basic_details)
export const fcmTokenSelector = createSelector(dataSelector, state => state.fcmtoken)
export const settingsLastFetchSelector = createSelector(dataSelector, state => state.lastFetch)
export const latLongSelector = createSelector(dataSelector, state => ({ latitude: state.latitude, longitude: state.longitude }))
export const languagesSelector = createSelector(dataSelector, state => state.data?.languages)
export const referralSettingsSelector = createSelector(dataSelector, state => state.data?.referral_settings)
export const demoModeSelector = createSelector(dataSelector, state => state.data?.general_config?.demo_mode)
export const selectedLocationSelector = createSelector(dataSelector, state => state.selectedLocation)
