import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import * as apiEndPoints from "@/api/apiEndPoints";
import type { SettingsApiResponse } from "@/hooks/queries/useSettings";

export const getSettingsServer = cache(async (): Promise<SettingsApiResponse | null> => {
  try {
    const response = await api.get(apiEndPoints.getSettings);
    const data = response.data;
    if (!data || data.error) {
      console.log("Error fetching settings:", response.status, data);
      return data as SettingsApiResponse;
    }
    return data as SettingsApiResponse;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
});
