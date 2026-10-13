import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import * as apiEndPoints from "@/api/apiEndPoints";
import { BLOGS_LIMIT, BlogsApiResponse, BlogsFilter } from "@/hooks/queries/blogs/useBlogs";

export const getBlogs = cache(async (filters: BlogsFilter = {}, page: number = 1): Promise<BlogsApiResponse | null> => {
  const offset = (page - 1) * BLOGS_LIMIT;

  try {
    const response = await api.get(apiEndPoints.blogs, {
      params: {
        category_id: filters.category_id,
        limit: BLOGS_LIMIT,
        offset,
        search: filters.search,
      },
    });
    const data = response.data;
    if (!data || data.error) {
      console.log("Error fetching blogs:", response.status, data);
      return data as BlogsApiResponse;
    }
    return data as BlogsApiResponse;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return null;
  }
});
