import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryConfig } from "@/lib/queryConfig";
import { getSettingsServer } from "@/api/server/getSettingsServer";

export default async function LangLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: queryConfig } });

  await queryClient.prefetchQuery({
    queryKey: ["settings"],
    queryFn: getSettingsServer,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
