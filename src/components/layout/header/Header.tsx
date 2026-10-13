'use client'
import Link from 'next/link'
import LanguageModal from '@/components/modalsAndSheets/LanguageModal';
import { PiBell, PiBuildings, PiHeart, PiHouse, PiImages, PiInfo, PiLockers, PiPhone, PiQuestion, PiTicket, PiUserCircle } from 'react-icons/pi';
import { useTranslation } from '@/hooks/useTranslation';
import MenusDropdown from '@/components/dropdowns/MenusDropdown';
import ProfileDropdown from '@/components/dropdowns/ProfileDropdown';
import { usePathname, useParams } from 'next/navigation';
import MobileNav from './MobileNav';
import { NavLinksType } from '@/types/GlobalTypes';
import ImagePreview from '@/components/storyBook/atoms/ImagePreview';
import { useEffect, useState } from 'react';
import AuthModals from '@/components/auth/AuthModals';
import { useDispatch, useSelector } from 'react-redux';
import { isLoginSelector, isNewUserSelector, userDataSelector } from '@/redux/reducers/userSlice';
import { businessModeSelector, settingsSelector } from '@/redux/reducers/settingsSlice';
import { BasicDetails } from '@/hooks/queries/useSettings';
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice';
import { setIsFromSearch, setLoginModalState } from '@/redux/reducers/helpersReducer';

const Header = () => {

    const { t } = useTranslation();
    const pathname = usePathname();
    const params = useParams();
    const dispatch = useDispatch();

    const isLogin = useSelector(isLoginSelector);
    const isNewsUser = useSelector(isNewUserSelector);
    const businessMode = useSelector(businessModeSelector) as BasicDetails;
    const reduxLangCode = useSelector(currentLangCodeSelector)
    const langCode = (params?.langCode as string) ?? reduxLangCode ?? 'en';
    const settingsData = useSelector(settingsSelector);
    const logo = settingsData?.branding?.logo
    const userData = useSelector(userDataSelector);

    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    const isSingleHotel = businessMode?.business_mode === 'single';
    const isLoggedIn = mounted && isLogin && !isNewsUser;
    const isHomePage = pathname === '/' || pathname === `/${langCode}`;

    const singleHotelLinks: NavLinksType[] = [
        {
            id: 1,
            label: t('home'),
            link: `/${langCode}`,
            icon: <PiHouse />

        },
        businessMode?.no_of_properties > 1 ? {
            id: 2,
            label: t('properties'),
            link: `/${langCode}/properties`,
            icon: <PiLockers />
        } : {
            id: 2,
            label: t('rooms'),
            link: `/${langCode}/rooms`,
            icon: <PiLockers />
        },
        ...(isSingleHotel && businessMode?.no_of_properties === 1 ? [{
            id: 3,
            label: t('gallery'),
            link: `/${langCode}/gallery`,
            icon: <PiImages />
        }] : []),
        {
            id: 4,
            label: t('aboutUs'),
            link: `/${langCode}/about-us`,
            icon: <PiInfo />
        },
        {
            id: 5,
            label: t('contactUs'),
            link: `/${langCode}/contact-us`,
            icon: <PiPhone />
        },
        {
            id: 6,
            label: t('helpSupport'),
            link: `/${langCode}/help-support`,
            icon: <PiQuestion />
        },
    ];


    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, []);

    const handlePropertyRoomLink = (link: string, e: React.MouseEvent) => {
        if (link === `/${langCode}/rooms` || link === `/${langCode}/properties`) {
            dispatch(setIsFromSearch(false));
        }
        else {
            if (!isLogin) {
                e.preventDefault();
                dispatch(setLoginModalState(true));
            }
        }
    }

    return (
        <header suppressHydrationWarning className={`transition-all duration-500 ease-in-out ${isSingleHotel ? 'bg-white' : `${scrolled ? '' : isHomePage ? `max-1680:!container 2xl:max-w-[98%] mx-auto block inset-x-0 max-md:mt-0 mt-6 rounded-2xl border-none` : ''}`} ${pathname !== '/' ? 'bg-white' : `${scrolled ? 'bg-white' : isSingleHotel ? '' : 'md:mt-6'}`} border-b ${pathname !== '/' || scrolled ? 'primaryLightBorderColor' : 'border-transparent'} fixed top-0 z-1002 w-full`}>
            <div className={`hidden md:block ${isHomePage ? `${scrolled ? 'container' : 'max-1680:!container 2xl:max-w-[98%] mx-auto'}` : 'container'} transition-[max-width,padding] duration-500 ease-in-out`}>
                <div className={`bg-white ${isHomePage && !scrolled ? `p-6 ${!isSingleHotel ? 'between-768-991:px-0!' : ''}` : 'py-6'} rounded-2xl relative transition-[padding] duration-500 ease-in-out`}>
                    <div className='flex items-center justify-between'>
                        <div>
                            <Link href={`/${langCode}`} title='WRTeam Logo'>
                                <div className='w-auto h-[56px]!'>
                                    <ImagePreview src={logo} alt='WRTeam Logo' className='w-auto!' />
                                </div>
                            </Link>
                        </div>
                        {
                            isSingleHotel &&
                            <nav className='max-1199:hidden flexCenter gap-6'>
                                {singleHotelLinks.map((item) => (
                                    <Link href={item.link} key={item.id} className={`font-medium pb-2 hover:primaryColor transition-all duration-300 ${pathname === item.link ? 'border-b-2 primaryBorder primaryColor' : ''} `}>
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        }
                        {
                            isSingleHotel &&
                            <div className='flexCenter gap-4'>
                                <LanguageModal />
                                <div className='md:block hidden'>
                                    {
                                        isLoggedIn ? (
                                            <ProfileDropdown />
                                        ) : (
                                            <AuthModals />
                                        )
                                    }
                                </div>
                                <div className='lg:hidden max-1199:block '>
                                    <MobileNav navLinks={singleHotelLinks} />
                                </div>
                            </div>
                        }
                        {

                            !isSingleHotel &&
                            <nav className='flexCenter gap-4'>
                                <LanguageModal />
                                <Link href={`/${langCode}/list-your-property`} className='flexCenter gap-2 border py-2 px-4 rounded-full'>
                                    <PiBuildings size={24} />
                                    <span>{t('listYourProperty')}</span>
                                </Link>
                                {
                                    isLoggedIn ? (
                                        <ProfileDropdown />
                                    ) : (
                                        <AuthModals />
                                    )
                                }
                                <MenusDropdown />
                            </nav>
                        }

                    </div>
                </div>
            </div>
            {
                (isHomePage) &&
                <div className='bg-white py-3 md:hidden'>
                    <div className='container'>
                        {
                            isLoggedIn ? <div className='flex items-center gap-3'>
                                <span className='w-12 h-12 rounded-full flexCenter text-white'>
                                    <ImagePreview src={userData?.profile} alt='user-profile' rounded='full' />
                                </span>
                                <div className='flex items-center justify-between w-full'>
                                    <div className='flex flex-col text-sm'>
                                        <span className='textSecondaryColor'>{t('welcomeBack')} 👋</span>
                                        <span>{userData?.name}</span>
                                    </div>
                                    <Link href={`/${langCode}/notifications`}>
                                        <span className='bg-(--neutral-200) w-12 h-12 rounded-full flexCenter'>
                                            <PiBell size={24} />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                                :
                                <div className='flex items-center gap-3'>
                                    <span className='bg-(--neutral-200) w-12 h-12 rounded-full flexCenter'>
                                        <PiUserCircle size={24} />
                                    </span>
                                    <div className='flex flex-col text-sm'>
                                        <span className='textSecondaryColor'>{t('helloThere')} 👋</span>
                                        <span className='textPrimaryColor!'>{t('guest')}</span>
                                    </div>
                                </div>
                        }
                    </div>

                </div>
            }

            {/* mobile bottom navigation — home + account pages */}
            {
                (isHomePage || pathname === `/${langCode}/account` || pathname === `/${langCode}/my-bookings` || pathname === `/${langCode}/properties` || pathname === `/${langCode}/rooms`) &&
                (() => {
                    const isHome = isHomePage
                    const isProfile = pathname.includes('/account')
                    const isBookings = pathname.includes('/my-bookings')

                    const midLink = isSingleHotel
                        ? businessMode?.no_of_properties > 1
                            ? { href: `/${langCode}/properties`, labelKey: t('properties'), icon: <PiLockers size={24} /> }
                            : { href: `/${langCode}/rooms`, labelKey: t('rooms'), icon: <PiLockers size={24} /> }
                        : { href: `/${langCode}/wishlist`, labelKey: t('wishlist'), icon: <PiHeart size={24} /> }

                    const NavItem = ({ href, active, icon, label, onClick }: { href: string; active: boolean; icon: React.ReactNode; label: string; onClick?: (e: React.MouseEvent) => void }) => (
                        <Link href={href} onClick={onClick} className={`flex-1 relative inline-flex flex-col justify-start items-center ${active ? 'h-14' : ''}`}>
                            {active && (
                                <div className='absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center'>
                                    <span className='w-6 h-1 primaryBg rounded-3xl block' />
                                    <svg width="24" height="18" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="navFunnelGrad" x1="10.1719" y1="0" x2="10.1719" y2="14.5116" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="var(--primary-color)" stopOpacity="0.3" />
                                                <stop offset="1" stopColor="white" stopOpacity="0.5" />
                                            </linearGradient>
                                        </defs>
                                        <path opacity="0.4" d="M5.82881 13.2617L0.337048 3.75004C-0.625241 2.08337 0.577569 0 2.50209 0H17.8418C19.7663 0 20.9691 2.08333 20.0068 3.75L14.5153 13.2616C14.0687 14.0351 13.2434 14.5116 12.3502 14.5116H7.99386C7.10071 14.5116 6.2754 14.0351 5.82881 13.2617Z" fill="url(#navFunnelGrad)" fillOpacity="0.7" />
                                    </svg>
                                </div>
                            )}
                            <div className={`inline-flex flex-col items-center gap-1 ${active ? 'absolute top-3 w-full' : 'pt-2'}`}>
                                <span className={active ? 'primaryColor' : 'textSecondaryColor'}>{icon}</span>
                                <span className={`max-375:text-xs text-sm ${active ? 'primaryColor font-medium' : 'textSecondaryColor font-normal'}`}>{label}</span>
                            </div>
                        </Link>
                    )

                    return (
                        <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50'>
                            <nav className='flex items-end justify-around px-4 pt-2 pb-4'>
                                <NavItem href={`/${langCode}`} active={isHome} icon={<PiHouse size={24} />} label={t('home')} />
                                <NavItem href={`/${langCode}/my-bookings`} active={isBookings} icon={<PiTicket size={24} />} label={t('myBooking')} />
                                <NavItem href={midLink.href} active={pathname.includes(midLink.href)} icon={midLink.icon} label={midLink.labelKey} onClick={(e) => handlePropertyRoomLink(midLink.href, e)} />
                                <NavItem href={`/${langCode}/account`} active={isProfile} icon={<PiUserCircle size={24} />} label={t('profile')} />
                            </nav>
                        </div>
                    )
                })()
            }
        </header >
    )
}

export default Header
