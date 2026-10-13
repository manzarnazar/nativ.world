import { useQuery } from "@tanstack/react-query";
import { getSettingsApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface BasicDetails {
  property_type: string;
  business_mode: string;
  no_of_properties: number;
  slug?: string;
}
export interface Language {
  name: string;
  code: string;
  image: string;
  is_rtl: boolean;
  is_default: boolean;
  updated_at: Date;
}
export interface ReferralSettings {
  enabled: boolean;
  referrer_percentage: number;
  referrer_expiry_days: number;
  referee_percentage: number;
  referee_expiry_days: number;
}
export interface SocialMediaLink {
  id: number;
  link: string;
  image: string;
}
export interface GeneralConfig {
  demo_mode: boolean;
  maintenance_mode: boolean;
  allow_auth_methods: string[];
  country_code: string;
  country_dial_code: string;
}
export interface Branding {
  logo: string;
  default_img: string;
  primary_color: string;
  primary_light_color: string;
  contact_address: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}
export interface AppConfig {
  force_update: boolean;
  android_version: string;
  ios_version: string;
  app_scheme: string;
  playstore_url: string | null;
  appstore_url: string | null;
}
export interface WebConfig {
  footer_description: string | null;
  cache_enabled: boolean;
  cookies_enabled: boolean;
  favicon: string;
}
export interface SettingsData {
  basic_details: BasicDetails;
  general_config: GeneralConfig;
  languages: Language[];
  referral_settings: ReferralSettings;
  social_media_links: SocialMediaLink[];
  branding: Branding;
  app_config: AppConfig;
  web_config: WebConfig;
}

export interface SettingsApiResponse extends Omit<ApiResponseType, 'data'> {
  data: SettingsData;
}

export const useSettings = () => {
  return useQuery<SettingsApiResponse>({
    queryKey: ["settings"],
    queryFn: async () => {
      try {
        const response = await getSettingsApi();
        if (!response) {
          throw new Error("Failed to fetch settings");
        }
        if (response?.error) {
          throw new Error(response?.message || "Failed to fetch settings");
        }
        return response as SettingsApiResponse;
      } catch (error: any) {
        const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch settings";
        throw new Error(apiMessage);
      }
    },
  });
};