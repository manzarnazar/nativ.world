import { useQuery } from "@tanstack/react-query";
import { getRoomsApi } from "@/api/client/apiRoutes";
import { Facility } from '@/api/server/getHomePageContent';
import { ApiResponseType, PaginationType } from "@/types/GlobalTypes";
import { useSelector } from "react-redux";
import { currentCurrencySelector } from "@/redux/reducers/currencySlice";
import { CurrencyDataType } from "./general/useCurrencies";



export interface RoomImage {
  id: number;
  url: string;
  media_type?: string;
}

export interface RoomType {
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
  images: RoomImage[];
  facilities: Facility[];
}

export interface Room {
  id: number;
  slug: string;
  is_available: boolean
  total_rooms: number;
  rating: number;
  reviews_count: number;
  room_size: string;
  base_price_per_night: number;
  currency_code: string;
  currency_symbol: string;
  converted_base_price_per_night: number;
  converted_currency_code: string;
  converted_currency_symbol: string;
  exchange_rate: number;
  room_type: RoomType;
}

export interface RoomsFilters {
  room_slug?: string;
  adults?: number;
  amenities?: string;
  check_in?: string;
  check_out?: string;
  children?: number;
  max_price?: number;
  min_price?: number;
  property_slug?: string;
  rooms?: number;
  sort_by?: string;
}

export interface RoomProperty {
  slug: string;
  name: string;
  rating: number;
  review_count: number;
  address: string;
  street_address?: string;
  latitude: number;
  longitude: number;
  image: string;
  pets_allowed: boolean;
}

export interface RoomsResponseData {
  property: RoomProperty
  min_price: number;
  max_price: number;
  currency_code: string;
  currency_symbol: string;
  converted_min_price: number;
  converted_currency_code: string;
  converted_currency_symbol: string;
  exchange_rate: number;
  converted_max_price: number;
  facilities: Facility[];
  items: Room[];
  pagination: PaginationType;
}

export interface RoomsApiResponse extends Omit<ApiResponseType, 'data'> {
  data: RoomsResponseData;
}
export const ROOMS_LIMIT = 10;

export const getRoomsQueryKey = (
  filters: RoomsFilters = {},
  page: number = 1,
  currentCurrency: CurrencyDataType | null = null,
) => ["rooms", filters, page, currentCurrency] as const;

export const useRooms = (
  filters: RoomsFilters = {},
  page: number = 1,
  enabled: boolean = true
) => {
  const offset = (page - 1) * ROOMS_LIMIT;
  const currentCurrency = useSelector(currentCurrencySelector);

  return useQuery<RoomsApiResponse>({
    queryKey: getRoomsQueryKey(filters, page, currentCurrency),
    enabled,
    queryFn: async () => {
      try {
        if (!filters.property_slug) {
          throw new Error("Property slug is required");
        }

        const response = await getRoomsApi({
          room_slug: filters.room_slug,
          adults: filters.adults,
          amenities: filters.amenities,
          check_in: filters.check_in,
          check_out: filters.check_out,
          children: filters.children,
          limit: ROOMS_LIMIT,
          max_price: filters.max_price,
          min_price: filters.min_price,
          offset,
          property_slug: filters.property_slug,
          rooms: filters.rooms,
          sort_by: filters.sort_by ?? "",
        });

        if (response?.error) {
          throw new Error(
            response?.message || "Failed to fetch rooms"
          );
        }

        return response as RoomsApiResponse;
      } catch (error: any) {
        const apiMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch rooms";

        throw new Error(apiMessage);
      }
    },
  });
};