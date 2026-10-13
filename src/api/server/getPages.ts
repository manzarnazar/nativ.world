import { cache } from "react";
import api from "@/api/server/apiMiddleware";

export interface PolicySection {
  title: string;
  content: string;
}

export interface PolicyData {
  type: string;
  title: string;
  sections: PolicySection[];
  last_updated: string;
  og_image: string;
  meta_title: string;
  meta_description: string;
  meta_keyword: string;
  schema_markup: string;
}

export const getLegalPolicy = cache(async ({
  lang,
  type,
}: {
  lang: string;
  type: string;
}): Promise<PolicyData | null> => {
  try {
    const response = await api.get("legal-policies", {
      params: { lang, type },
      headers: { "Accept-Language": lang },
    });
    const data = response.data;
    if (!data || data.error) {
      console.log("Error fetching legal policy:", response.status, data);
      return null;
    }
    return (data.data?.policies?.[type] as PolicyData) ?? null;
  } catch (error) {
    console.error("Error fetching legal policy:", error);
    return null;
  }
})
