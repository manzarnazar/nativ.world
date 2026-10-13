import { StaticImageData } from 'next/image'
import { ReactNode } from 'react'

export interface PropertyDataType {
    id: number
    image: any
    rating: number
    reviews: number
    name: string
    location: string
    price: number
    wishlist?: boolean
    featured?: boolean
    taxFees?: number
}

export interface NavLinksType {
    id: number
    label: string
    link: string,
    icon: ReactNode
}


export interface EventDataType {
    id: number;
    title: string;
    description: string;
    features: { text: string }[];
    image: { src: string };
    ctaLabel: string;
}
export interface SidebarFilterTypes {
    payAtProperty?: boolean,
    minPrice: string,
    maxPrice: string,
    amenities: string,
    ratings: string,
    types: string,
    rules: Record<string, string | string[]>,
}

export interface SearchCardType {
    id: number;
    title: string;
    image: StaticImageData;
    pricePerNight: number;
    rating: number;
    reviews: number;
    maxGuests: number;
    bedType: string;
    roomSize: string;
    location?: string
    features: string[];
}


export interface sortByOptsType {
    label: string,
    value: string
}

export interface userDetailsType {
    id: number;
    name: string;
    email: string;
    country_code: null;
    dial_code: null;
    phone: null;
    profile: null;
    role: string;
    status: number;
    locale: string;
    auth_provider: string;
    platform: string;
    referral_code: string;
    email_verified_at: Date;
    phone_verified_at: null;
    social_logins: string[];
    is_demo_account?: boolean;
}

export interface UserDataType {
    user: userDetailsType,
    token: string;
    is_new_user?: boolean;
}

export interface UserSliceType {
    token: string;
    user: userDetailsType,
    isLogin: boolean;
    isNewsUser: boolean;
    firebaseToken: string;
}
export interface ApiResponseType {
    error: boolean;
    message: string;
    data: any;
    code: number;
}
export interface PaginationType {
    total: number;
    limit: number;
    offset: number;
    current_page: number;
    last_page: number;
    has_more: boolean;
}

export interface BookingDetailsData {
    location: string
    checkIn: string
    checkout: string
    rooms: number
    adults: number
    childrenCount: number
    pets: boolean
}