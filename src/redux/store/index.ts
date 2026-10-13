"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import settingsReducer from "../reducers/settingsSlice";
import userReducer from "../reducers/userSlice";
import helpersReducer from "../reducers/helpersReducer";
import bookingDetailsReducer from "../reducers/bookingDetailsSlice";
import languageReducer from "../reducers/languageSlice";
import currencyReducer from "../reducers/currencySlice";

const persistConfig = {
  key: "e-stay",
  storage,
  blacklist: ["settings"],
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  user: userReducer,
  helpers: helpersReducer,
  bookingDetails: bookingDetailsReducer,
  language: languageReducer,
  currency: currencyReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: persistedReducer,
    // redux-persist's wrapped reducer loses the CombinedState branding that lets
    // RTK infer a deep-partial PreloadedState — cast is safe, unset slices (and
    // the persist-only `_persist` field) still fall back to their own initial
    // state at runtime.
    preloadedState: preloadedState as ReturnType<typeof persistedReducer> | undefined,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];

// Registry so non-React modules (axios interceptors, plain helpers) read/dispatch
// against the SAME store instance StoreProvider mounted for this browser session,
// instead of spinning up a disconnected one.
let browserStore: AppStore | undefined;

export const setBrowserStore = (instance: AppStore) => {
  browserStore = instance;
};

export const getStore = (): AppStore => {
  if (!browserStore) {
    browserStore = makeStore();
  }
  return browserStore;
};
