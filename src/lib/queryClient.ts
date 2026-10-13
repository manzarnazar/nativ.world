// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import { queryConfig } from "./queryConfig";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...queryConfig,
      throwOnError: false,
    },
    mutations: {
      retry: 0,
    },
  },
});