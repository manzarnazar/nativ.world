import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import * as apiEndPoints from "@/api/apiEndPoints";
import { ApiResponseType } from "@/types";

export interface KeyHighlight {
  id: number;
  title: string;
  description: string;
  sort_order: number;
}

export interface OurPromise {
  badge_text: string;
  title: string;
  content: string;
  image: string;
  features: string[];
}

export interface WhoWeAre {
  badge_text: string;
  title: string;
  short_description: string;
  content: string;
  image: string;
}

export interface AboutUsPageContentData {
  content?: string;
  who_we_are?: WhoWeAre;
  key_highlights?: KeyHighlight[];
  our_promise?: OurPromise;
}

export interface AboutUsPageContentApiResponse extends Omit<ApiResponseType, 'data'> {
  data: AboutUsPageContentData;
}

export const getAboutUsPageContent = cache(async (): Promise<AboutUsPageContentApiResponse | null> => {
  try {
    const response = await api.get(apiEndPoints.about);
    const data = response.data;
    if (!data || data.error) {
      console.log("Error fetching about us page content:", response.status, data);
      return data as AboutUsPageContentApiResponse;
    }
    return data as AboutUsPageContentApiResponse;
  } catch (error) {
    console.error("Error fetching about us page content:", error);
    return null;
  }
});
