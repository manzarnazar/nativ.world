'use client'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { userDataSelector, isLoginSelector } from '@/redux/reducers/userSlice'
import { useTranslation } from '@/hooks/useTranslation'

const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
};

const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const CookiesComponent = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [isCookiesAccept, setIsCookiesAccept] = useState(false);

    const userData = useSelector(userDataSelector);
    const isUserLogin = useSelector(isLoginSelector);
    const { t } = useTranslation();

    const expirationDays = 7;

    const handleSaveData = () => {
        if (userData?.name) setCookie('user-name', userData.name, expirationDays);
        if (userData?.email) setCookie('user-email', userData.email, expirationDays);
        if (userData?.phone) setCookie('user-number', String(userData.phone), expirationDays);
    };

    const handleAccept = () => {
        setCookie('cookie-consent', 'accepted', expirationDays);
        setShowPopup(false);
        setIsCookiesAccept(true);
        handleSaveData();
    };

    const handleDecline = () => {
        setCookie('cookie-consent', 'declined', expirationDays);
        setShowPopup(false);
    };

    useEffect(() => {
        const consent = getCookie('cookie-consent');
        if (!consent) {
            setShowPopup(true);
        }
    }, []);

    useEffect(() => {
        if (isUserLogin && isCookiesAccept) {
            handleSaveData();
        }
    }, [isUserLogin, showPopup, userData]);

    if (!showPopup) return null;

    return (
        <section className='fixed z-1004 bg-white flexCenter flex-col gap-6 items-center text-center bottom-2.5 right-2.5 md:bottom-5 md:right-5 p-5 md:p-12.5 lg:py-46.25 lg:px-15 w-75 h-95 sm:w-100 sm:h-100 md:w-112.5 md:h-112.5 lg:w-160 lg:h-91.5 shadow-[0px_0px_50px_#1B2D511A] rounded-2xl border primaryLightBorderColor'>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className='h-17.5 w-17.5' aria-hidden="true">
                    <circle cx="32" cy="32" r="30" fill="#F5A623" />
                    <circle cx="22" cy="24" r="4" fill="#8B5E3C" />
                    <circle cx="40" cy="20" r="3" fill="#8B5E3C" />
                    <circle cx="44" cy="36" r="4" fill="#8B5E3C" />
                    <circle cx="28" cy="40" r="3" fill="#8B5E3C" />
                    <circle cx="36" cy="30" r="2" fill="#8B5E3C" />
                    <circle cx="20" cy="38" r="2" fill="#8B5E3C" />
                </svg>
            </div>
            <div className='flex flex-col gap-3'>
                <span className='text-lg md:text-xl lg:text-2xl font-bold'>{t('allCokkies')}</span>
                <span className='textSecondaryColor text-[14px] sm:text-[16px] font-semibold'>{t('weUseCokkies')}</span>
            </div>
            <div className="flex items-center flex-wrap sm:flex-nowrap justify-center gap-4  mt-3 sm:mt-8">
                <button onClick={handleDecline} className='bg-black text-white border py-2 px-3 rounded-lg font-semibold
                    '>{t('declineCokkies')}</button>
                <button onClick={handleAccept} className='primaryBg border py-2 px-3 rounded-lg text-white font-semibold'>{t('acceptCokkies')}</button>
            </div>
        </section>
    );
};

export default CookiesComponent;
