import { useQuery } from "@tanstack/react-query";
import { getPropertiesApi } from "@/api/client/apiRoutes";
import { Facility } from '@/api/server/getHomePageContent';
import { ApiResponseType, PaginationType } from "@/types/GlobalTypes";
import { useSelector } from "react-redux";
import { currentCurrencySelector } from "@/redux/reducers/currencySlice";
import { CurrencyDataType } from "@/hooks/queries/general/useCurrencies";


export interface PropertyFacility {
  id: number;
  name: string;
  icon: string | null;
  category: string | null;
}

export interface Property {
  id: number;
  slug: string;
  name: string;
  country_id: number;
  country_name: string;
  state: string;
  city: string | null;
  street_address: string;
  latitude: string | null;
  longitude: string | null;
  distance_km: number | null;
  image: string;
  starting_price: number;
  currency_code: string;
  currency_symbol: string;
  pay_at_property: boolean;
  advance_percentage: string;
  pets_allowed: boolean;
  facilities: PropertyFacility[];
  more_facilities_count: number;
  rating: number | null;
  reviews_count: number;
  converted_starting_price: number;
  converted_currency_code: string;
  converted_currency_symbol: string;
  exchange_rate: number;
  is_favorited?: boolean;
  images: string[];
}

export interface PropertiesFilters {
  slug?: string;
  adults?: number;
  amenities?: string;
  check_in?: string;
  check_out?: string;
  children?: number;
  country_id?: number;
  lat?: number;
  lng?: number;
  radius_km?: number;
  max_price?: number;
  min_price?: number;
  pay_at_property?: number;
  property_type_id?: string[];
  search?: string;
  sort_by?: string;
  city_slug?: string;
  pets?: boolean;
  rooms?: number;
  ratings?: string[]
  rules?: string
}
export interface PropertyType {
    id: number;
    name: string;
    icon: string | null;
}
export interface PropertiesResponseData {
  min_price: number;
  max_price: number;
  currency_code: string;
  currency_symbol: string;
  converted_min_price: number;
  converted_max_price: number;
  converted_currency_code: string;
  converted_currency_symbol: string;
  exchange_rate: number;
  facilities: Facility[];
  property_types: PropertyType[]
  items: Property[];
  pagination: PaginationType;
}

export interface PropertiesApiResponse extends Omit<ApiResponseType, 'data'> {
  data: PropertiesResponseData;
}

export const PROPERTIES_LIMIT = 10;

export const getPropertiesQueryKey = (
  filters: PropertiesFilters = {},
  page: number = 1,
  currentCurrency: CurrencyDataType | null = null,
) => ["properties", filters, page, currentCurrency] as const;

export const useProperties = (filters: PropertiesFilters = {}, page: number = 1, enabled: boolean = true) => {
  const offset = (page - 1) * PROPERTIES_LIMIT;
  const currentCurrency = useSelector(currentCurrencySelector);

  return useQuery<PropertiesApiResponse>({
    queryKey: getPropertiesQueryKey(filters, page, currentCurrency),
    enabled,
    queryFn: async () => {
      try {
        const response = await getPropertiesApi({
          slug: filters.slug ?? "",
          adults: filters.adults,
          amenities: filters.amenities ?? "",
          check_in: filters.check_in ?? "",
          check_out: filters.check_out ?? "",
          children: filters.children,
          country_id: filters.country_id ?? "",
          lat: filters.lat ?? '',
          lng: filters.lng ?? '',
          radius_km: filters.radius_km,
          ...(filters.slug === '' || !filters.slug) && { limit: String(PROPERTIES_LIMIT) },
          max_price: filters.max_price,
          min_price: filters.min_price,
          ...(filters.slug === '' || !filters.slug) && { offset: String(offset) },
          pay_at_property: filters.pay_at_property,
          property_type_id: filters.property_type_id?.join(',') ?? "",
          search: filters.search ?? "",
          sort_by: filters.sort_by ?? "",
          city_slug: filters.city_slug ?? "",
          pets: filters.pets ?? false,
          rooms: filters?.rooms ?? "",
          ratings: filters.ratings?.join(',') ?? "",
          rules: filters?.rules
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