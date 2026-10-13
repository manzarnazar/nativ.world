import Layout from "@/components/layout/Layout";
import PolicyPages from "@/components/pagesComponent/PolicyPages";
import { getLegalPolicy } from "@/api/server/getPages";
import { Metadata } from "next";
import NoDataFound from "@/components/systemStates/NoDataFound";

const POLICY_TYPE = "cancellation_policy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ langCode: string }>;
}): Promise<Metadata> {
  const { langCode } = await params;
  const policy = await getLegalPolicy({ lang: langCode, type: POLICY_TYPE });

  if (!policy) {
    return {
      title: process.env.NEXT_PUBLIC_TITLE,
      description: process.env.NEXT_PUBLIC_DESCRIPTION,
      keywords: process.env.NEXT_PUBLIC_KEYWORDS,
    };
  }

  return {
    title: policy.meta_title || policy.title || process.env.NEXT_PUBLIC_TITLE,
    description: policy.meta_description || process.env.NEXT_PUBLIC_DESCRIPTION,
    keywords: policy.meta_keyword || process.env.NEXT_PUBLIC_KEYWORDS,
    openGraph: {
      title: policy.meta_title || policy.title || process.env.NEXT_PUBLIC_TITLE,
      description: policy.meta_description || process.env.NEXT_PUBLIC_DESCRIPTION,
      images: policy.og_image ? [policy.og_image] : undefined,
    },
  };
}

const Page = async ({
  params,
}: {
  params: Promise<{ langCode: string }>;
}) => {
  const { langCode } = await params;
  const policy = await getLegalPolicy({ lang: langCode, type: POLICY_TYPE });

  if (!policy) {
    return (
      <Layout>
        <NoDataFound />
      </Layout>
    );
  }

  return (
    <Layout>
      <PolicyPages policy={policy} />
    </Layout>
  );
};

export default Page;
