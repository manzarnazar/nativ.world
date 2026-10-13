import ContactUsPage from "@/components/pagesComponent/ContactUsPage"
import JsonLd from "@/components/Schema/JsonLd"
import { generateMetaInfo, getSchemaMarkup } from "@/hooks/useGenerateMetaInfo"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ langCode: string }> }): Promise<Metadata> {
    const { langCode } = await params;
    
    return generateMetaInfo({
        page: 'contact-us',
        language_code: langCode,
    })
}

const Page = async ({ params }: { params: Promise<{ langCode: string }> }) => {
    const { langCode } = await params;

    const schemaMarkup = await getSchemaMarkup({
        page: "contact-us",
        language_code: langCode
    });

    return (
        <>
            <ContactUsPage />
            {schemaMarkup && <JsonLd data={schemaMarkup} />}
        </>
    )
}

export default Page
