'use client';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Language } from '@/hooks/queries/useSettings';
import { CurrencyDataType } from '@/hooks/queries/general/useCurrencies';

// Simple language state interface
interface CurrencyState {
    currentCurrency: CurrencyDataType | null;
}

// Initial state - simple and clean
const initialState: CurrencyState = {
    currentCurrency: null,
};

// Simple language slice - no async thunks, just basic reducers
export const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        // Set current language
        setCurrentCurrency: (state, action: PayloadAction<CurrencyDataType>) => {
            state.currentCurrency = action.payload;
        },
        resetCurrencyState: () => {
            return initialState;
        },
    },
});

// Export actions
export const {
    setCurrentCurrency,
    resetCurrencyState,
} = currencySlice.actions;

// Export reducer
export default currencySlice.reducer;

// Simple selectors following settingsSlice pattern
export const currencyDataSelector = (state: RootState) => state.currency;

export const currentCurrencySelector = createSelector(currencyDataSelector, state => state.currentCurrency);
export const currentCurreyCodeSelector = createSelector(currencyDataSelector, state => state.currentCurrency?.currency_code);
export const currentCurreySymbolSelector = createSelector(currencyDataSelector, state => state.currentCurrency?.currency_symbol);

