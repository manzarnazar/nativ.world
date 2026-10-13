import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import { Language } from "@/hooks/queries/useSettings";

export const getDefaultLanguage = cache(async ({
  lang_code,
}: {
  lang_code?: string;
} = {}): Promise<Language | null> => {
  try {
    const response = await api.get("language", {
      params: lang_code ? { lang_code } : undefined,
      headers: lang_code ? { "Accept-Language": lang_code } : undefined,
    });
    const data = response.data;
    if (!data || data.error) {
      console.log("Error fetching default language:", response.status, data);
      return null;
    }
    return (data.data as Language) ?? null;
  } catch (error) {
    console.error("Error fetching default language:", error);
    return null;
  }
});
