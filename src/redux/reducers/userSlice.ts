// Import necessary modules
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { UserDataType, userDetailsType, UserSliceType } from '@/types/GlobalTypes'
// import { UserDetails } from '@/utils/api/user/getUserDetails'
// import { removeAuthToken } from '@/utils/cookies'

// Initial state with some default data
const initialState: UserSliceType = {
    token: '',
    user: {} as userDetailsType,
    isLogin: false,
    isNewsUser: false,
    firebaseToken: '',
}

// Create a Redux slice
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setUserData: (state, action: PayloadAction<userDetailsType>) => {
            state.user = action.payload
            if (action.payload) {
                state.isLogin = true
            }
        },
        setIsNewUser: (state, action: PayloadAction<boolean>) => {
            state.isNewsUser = action.payload
        },
        logoutSuccess: () => {
            // removeAuthToken();
            return initialState;
        },
        setFirebaseToken: (state, action: PayloadAction<string>) => {
            state.firebaseToken = action.payload;
        },
    }
})

export const { setToken, setUserData, setIsNewUser, setFirebaseToken, logoutSuccess } = userSlice.actions

export default userSlice.reducer

export const dataSelector = (state: RootState) => state?.user

export const userDataSelector = createSelector(dataSelector, state => state.user)
export const isLoginSelector = createSelector(dataSelector, state => state.isLogin)
export const firebaseTokenSelector = createSelector(dataSelector, state => state.firebaseToken)

export const isNewUserSelector = createSelector(dataSelector, state => state.isNewsUser)