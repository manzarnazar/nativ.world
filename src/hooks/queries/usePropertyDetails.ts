import { useQuery } from "@tanstack/react-query";
import { getPropertyDetailsApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface PropertiesFilters {
    slug?: string;
}

export interface Country {
    id: number;
    name: string;
    currency_code: string;
    currency_symbol: string;
}

export interface PropertyType {
    id: number;
    name: string;
    icon: string | null;
}

export interface Facility {
    id: number;
    name: string;
    icon: string | null;
    category?: string;
}

export interface RuleItem {
    question: string;
    answer: string[] | string | boolean;
    type: string;
}

export interface Rule {
    id: number;
    name: string;
    icon: string | null;
    items: RuleItem[];
}

export interface PropertyImage {
    id: number;
    url: string;
    media_type?: string;
}

export interface GalleryGroup {
    group: string;
    images: PropertyImage[];
}

export interface Images {
    primary: PropertyImage[];
    gallery: GalleryGroup[];
}

export interface PropertyRoomType {
    id: number;
    slug: string;
    name: string;
    bed_type: string;
    max_guests: number;
    description: string;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    schema_markup: string | null;
    images: PropertyImage[];
    facilities: Facility[];
}

export interface PropertyRoom {
    id: number;
    total_rooms: number;
    room_size: string;
    base_price_per_night: number;
    rating: number | null;
    reviews_count: number;
    room_type: PropertyRoomType;
}

export interface PropertiesResponseData {
    id: number;
    slug: string;
    name: string;
    description: string;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    schema_markup: string | null;
    country: Country;
    property_type: PropertyType;
    state: string;
    city: string;
    street_address: string;
    zip_code: string;
    latitude: string;
    longitude: string;
    phone: string;
    email: string;
    landline: string | null;
    check_in_time: string;
    check_out_time: string;
    rating: number | null;
    reviews_count: number;
    custom_rules: string;
    pets_allowed: boolean;
    pet_policy_details: string | null,
    pay_at_property: boolean;
    advance_percentage: number | null;
    facilities: Facility[];
    rules: Rule[];
    images: Images;
    rooms: PropertyRoom[];
    is_favorited?: boolean;
}

export interface PropertiesApiResponse extends Omit<ApiResponseType, 'data'> {
    data: PropertiesResponseData;
}

export const usePropertyDetails = (filters: PropertiesFilters = {}, enabled: boolean = true) => {

    return useQuery<PropertiesApiResponse>({
        queryKey: ["propertyDetails", filters],
        enabled,
        queryFn: async () => {
            try {
                const response = await getPropertyDetailsApi({
                    slug: filters.slug ?? "",
                });
                if (response?.error) {
                    throw new Error(response?.message || "Failed to fetch properties");
                }
                return response as PropertiesApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch properties";
                throw new Error(apiMessage);
            }
        },
    });
};
