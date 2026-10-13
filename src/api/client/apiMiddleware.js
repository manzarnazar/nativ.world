// src/middleware/axiosInterceptor.js

import axios from 'axios';
import { logoutSuccess } from '@/redux/reducers/userSlice';
import { getStore } from '@/redux/store';
// import { clearUserData } from '@/redux/reducers/userDataSlice';
// import { clearCart } from '@/redux/reducers/cartSlice';

// Create Axios instance
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/`,
});

// Function to get stored token
const getStoredToken = async () => {
  try {
    const state = getStore().getState();
    if (!state) return null;
    return state.user.token || null;
  } catch (error) {
    console.warn('Store not initialized yet:', error);
    return null;
  }
};

// Function to get current language code
const getCurrentLanguageCode = () => {
  try {
    const state = getStore().getState();
    if (!state) return 'en';
    // const currentLanguage = state.translation?.currentLanguage;
    const currentLangCode = state.language?.currentLanguage;
    const currentCurrencyCode = state.currency?.currentCurrency?.currency_code;
    return {
      langCode: currentLangCode?.code,
      currencyCode: currentCurrencyCode
    }
  } catch (error) {
    console.warn('Store not initialized yet:', error);
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // config.headers.Authorization = `Bearer ${'135|eMRQdYRUyOyuxod1gQ6Q7usYnFVmzTkgTgHDNkB646068306'}`;
      }

      // Add Content-Language header with current language code
      const currentLanguage = getCurrentLanguageCode();
      config.headers['Accept-Currency'] = currentLanguage.currencyCode;
      config.headers['Accept-Language'] = currentLanguage.langCode;

      // Set Content-Type header
      // config.headers['Content-Type'] = 'multipart/form-data';
      // ✅ Only set JSON if NOT FormData
      if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
      } else {
        // ❌ DO NOT set Content-Type manually for FormData
        delete config.headers['Content-Type'];
      }
      return config;
    } catch (error) {
      console.error('Error in token retrieval:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("401 Unauthorized - Logging out user...");
      getStore().dispatch(logoutSuccess());
      return Promise.reject(error);
    }

    // For 4xx validation/business errors the API returns a structured body
    // { error: true, message: "...", data: ..., code: ... }
    // Resolve so callers receive the body normally and check response.error.
    // This prevents console.error in every catch block from triggering the
    // Next.js dev overlay on expected errors.
    if (status >= 400 && status < 500 && error.response?.data) {
      return Promise.resolve(error.response);
    }

    // 5xx / network errors — still reject
    return Promise.reject(error);
  }
);

export default api;