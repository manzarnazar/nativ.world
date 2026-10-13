import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import * as apiEndPoints from "@/api/apiEndPoints";
import { ApiResponseType } from "@/types";

export interface Banner {
  id: number;
  title: string;
  image: string;
  target_url: string;
  start_date: string | null;
  end_date: string | null;
}

export interface BannersApiResponse extends Omit<ApiResponseType, 'data'> {
  data: Banner[];
}

export const getBanners = cache(async (): Promise<BannersApiResponse | null> => {
  try {
    const response = await api.get(apiEndPoints.banners);
    const data = response.data;
    if (!data || data.error) {
      console.log("Error fetching banners:", response.status, data);
      return data as BannersApiResponse;
    }
    return data as BannersApiResponse;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return null;
  }
});
