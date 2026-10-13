"use client";
import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./header/Header";
import { useDispatch, useSelector } from "react-redux";
import { isLoginSelector, setUserData, userDataSelector } from "@/redux/reducers/userSlice";
import { userDetailsType } from "@/types/GlobalTypes";
import { toast } from '@/lib/toast';
import { useTranslation } from "@/hooks/useTranslation";
import { useLogoutUser } from "@/hooks/logoutUser";
import { useSettings } from "@/hooks/queries/useSettings";
import { setSettings, settingsSelector } from "@/redux/reducers/settingsSlice";
import { bookingDetailsSelector, resetBookingDetailsData, setBookingDetails } from "@/redux/reducers/bookingDetailsSlice";
import { addDays } from "date-fns";
import { formateDate, formateDateForApi } from "@/utils/helpers";
import { generateColorPalette, TailwindPalette } from "@/utils/colorShades";
import { setLangCookie } from "@/utils/langCookie";
import { setBasicDetailsCookie } from "@/utils/basicDetailsCookie";
import MainLoader from "../commonComponents/MainLoader";
import { currentLanguageSelector, setCurrentLanguage, setIsRTL } from "@/redux/reducers/languageSlice";
import { languagesSelector } from "@/redux/reducers/settingsSlice";
import EmptyStatus from "../commonComponents/EmptyStatus";
import { useGetUserDetails } from "@/hooks/queries/profile/useGetUserDetails";
import { useParams, usePathname, useRouter } from "next/navigation";
import CookiesComponent from "../CookiesComp";
import { useBookingDetails } from "@/contexts/BookingDetails";

const SHADE_LEVELS: (keyof TailwindPalette)[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000];

const applyPalette = (prefix: string, hex: string) => {
  const palette = generateColorPalette(hex);
  document.documentElement.style.setProperty(`--${prefix}-color`, palette[500]);
  SHADE_LEVELS.forEach((n) => {
    document.documentElement.style.setProperty(`--${prefix}-${n}`, palette[n]);
  });
};

const Layout = ({ children }: { children: React.ReactNode }) => {

  const { t } = useTranslation();
  const { handleUserLogout } = useLogoutUser();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const routerLangCode = params?.langCode;

  const userDetails = useSelector(userDataSelector) as userDetailsType;
  const isLogin = useSelector(isLoginSelector);
  const userStatus = userDetails?.status;
  const currentLanguage = useSelector(currentLanguageSelector);
  const isHomePage = pathname === `/${currentLanguage?.code || routerLangCode}`

  const bookingDetails = useSelector(bookingDetailsSelector);
  const { bookingData, setBookingData, resetBookingData } = useBookingDetails();

  const settings = useSelector(settingsSelector);
  const languages = useSelector(languagesSelector);

  const { data: settingsData, isLoading: settingsLoading } = useSettings();

  const isSettingsError = settingsData?.error

  useEffect(() => {
    if (isSettingsError) {
      console.log('settings error => ', settingsData?.message)
    }
    console.log()

  }, [isSettingsError])

  useEffect(() => {
    if (!settingsData?.data) return

    dispatch(setSettings(settingsData.data));
    setBasicDetailsCookie(settingsData.data.basic_details);

    const availableLanguages = settingsData.data.languages ?? [];
    const defaultLanguage = availableLanguages.find(lang => lang.is_default);

    if (!currentLanguage) {
      if (defaultLanguage) {
        dispatch(setCurrentLanguage(defaultLanguage));
        dispatch(setIsRTL(defaultLanguage.is_rtl));
      }
    } else {
      const stillExists = availableLanguages.some(lang => lang.code === currentLanguage.code);
      if (!stillExists && defaultLanguage) {
        dispatch(setCurrentLanguage(defaultLanguage));
        dispatch(setIsRTL(defaultLanguage.is_rtl));
        // router.replace(`/${defaultLanguage.code}`);
      }
    }
  }, [settingsData]);

  const { data: userDetailsData, error: userDetailsError, isError } = useGetUserDetails(isLogin);

  useEffect(() => {
    if (isError) {
      toast.error(userDetailsError?.message)
      console.log('user api error =>', userDetailsError?.message)
    }
    if (!isLogin) return;
    if (userDetailsData?.data?.user) {
      dispatch(setUserData(userDetailsData.data.user));
    }
  }, [isLogin, userDetailsData, userDetailsError, isError]);

  useEffect(() => {
    // 0 = inactive | 1 = active | 2 = suspend
    if (userStatus === 0) {
      toast.error(t("accountInactive"));
      handleUserLogout();
    }
    if (userStatus === 2) {
      toast.error(t("accountSuspended"));
      handleUserLogout();
    }
  }, [userDetails]);


  useEffect(() => {

    const checkIn = new Date(formateDateForApi(bookingDetails?.checkIn));
    const checkOut = new Date(formateDateForApi(bookingDetails?.checkout));
    const contextCheckIn = new Date(formateDateForApi(bookingData?.checkIn));
    const contextCheckOut = new Date(formateDateForApi(bookingData?.checkout));
    const today = new Date();

    let newCheckIn = checkIn;
    let newCheckOut = checkOut;

    if (checkIn < today) {
      newCheckIn = new Date();
    }
    if (checkOut <= newCheckIn) {
      newCheckOut = addDays(newCheckIn, 1);
    }

    if (newCheckIn !== checkIn || newCheckOut !== checkOut) {
      dispatch(setBookingDetails({ ...bookingDetails, checkIn: formateDate(newCheckIn), checkout: formateDate(newCheckOut) }));
    }

    let newContextCheckIn = contextCheckIn;
    let newContextCheckOut = contextCheckOut;

    if (contextCheckIn < today) {
      newContextCheckIn = new Date();
    }
    if (contextCheckOut <= newContextCheckIn) {
      newContextCheckOut = addDays(newContextCheckIn, 1);
    }

    if (newContextCheckIn !== contextCheckIn || newContextCheckOut !== contextCheckOut) {
      setBookingData({ ...bookingData, checkIn: formateDate(newContextCheckIn), checkout: formateDate(newContextCheckOut) });
    }
  }, []);

  // Sync booking details to booking context
  useEffect(() => {
    if (pathname !== '/confirm-booking') {
      setBookingData(bookingDetails);
    }

  }, [bookingDetails, pathname]);


  useEffect(() => {
    document.documentElement.style.setProperty('--loader-color', process.env.NEXT_PUBLIC_LOADER_COLOR || '#1A73E8')
    
    applyPalette('primary', `${settings?.branding?.primary_color || '#1A73E8'}`);
    applyPalette('neutral', '#9E9E9E');
    applyPalette('success', '#20B364');
    applyPalette('error', '#D63031');
    applyPalette('warning', '#F79E1B');
    applyPalette('info', '#2196F3');
    // secondary: single var, no shades
    document.documentElement.style.setProperty('--secondary-color', '#010211');

    // Set favicon from settings API
    if (settings?.web_config?.favicon) {
      const favicon: HTMLLinkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement || document.createElement("link") as HTMLLinkElement;
      favicon.rel = "icon";
      favicon.href = settings.web_config.favicon;
      if (!document.querySelector('link[rel="icon"]')) {
        document.head.appendChild(favicon);
      }
    }

    if (settings?.basic_details?.business_mode === 'single' && settings?.basic_details?.no_of_properties === 1) {
      dispatch(setBookingDetails({ ...bookingDetails, location: settings?.basic_details?.slug }))
    }
  }, [settings]);

  useEffect(() => {
    if (currentLanguage && currentLanguage?.is_rtl) {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = `${currentLanguage && currentLanguage?.code}`
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = `${currentLanguage && currentLanguage?.code}`
    }
    if (currentLanguage?.code) setLangCookie(currentLanguage.code);
  }, [currentLanguage]);

  const maintenanceMode = settings?.general_config?.maintenance_mode;
  const cookiesMode = settings?.web_config?.cookies_enabled;
  const isSingleProperty = settings?.basic_details?.business_mode === 'single' && settings?.basic_details?.no_of_properties === 1;
  const isRoomsPage = pathname === `/${currentLanguage?.code || routerLangCode}/rooms`;

  useEffect(() => {
    if (routerLangCode && routerLangCode !== currentLanguage?.code) {
      const matchedLang = languages?.find(lang => lang.code === routerLangCode);
      if (matchedLang) {
        dispatch(setCurrentLanguage(matchedLang));
        dispatch(setIsRTL(matchedLang.is_rtl));
      } else if (languages?.length > 0 && currentLanguage?.code) {
        const segments = pathname.split('/');
        segments[1] = currentLanguage.code;
        router.replace(segments.join('/'));
      }
    }
  }, [routerLangCode, languages]);

  useEffect(() => {
    if (isHomePage) {
      dispatch(resetBookingDetailsData());
      resetBookingData();
    }
  }, [isHomePage])


  return (
    settingsLoading ?
      <MainLoader />
      :
      isSettingsError ?
        <EmptyStatus title={t('somethingWentWrongTitle')} description={t('somethingWentWrongDescription')} type="somethingWentWrong" />
        :
        maintenanceMode ?
          <EmptyStatus title={t('maintenanceModeTitle')} description={t('maintenanceModeDescription')} type="maintenanceMode" />
          :
          <>
            <Header />
            <main className={`headerPT version-${process.env.NEXT_PUBLIC_WEB_VERSION}`}>
              {children}
            </main>
            {
              cookiesMode &&
              <CookiesComponent />
            }
            <Footer />
          </>
  );
};

export default Layout;
