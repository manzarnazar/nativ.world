import Layout from "@/components/layout/Layout"
import BlogDetails from "@/components/pagesComponent/blogs/BlogDetails"
import NoDataFound from "@/components/systemStates/NoDataFound"
import axios from "axios"

export interface BlogCategory {
    id: number
    name: string
    slug: string
}

export interface RelatedBlog {
    id: number
    slug: string
    title: string
    excerpt: string
    featured_image: string
    category: BlogCategory
    published_at: string
    read_time_minutes: number | null
}

export interface BlogData {
    id: number
    slug: string
    title: string
    excerpt: string
    content: string
    featured_image: string
    category: BlogCategory
    published_at: string
    read_time_minutes: number | null
    meta_title: string
    meta_description: string
    related_blogs: RelatedBlog[]
}

async function getBlogBySlug(slug: string): Promise<BlogData | null> {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/blogs/${slug}`,
        )

        if (res.data.error || res.data.code !== 200) return null
        return res.data.data


    } catch (error) {
        console.error("Failed to fetch blog:", error)
        return null
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, langCode: string }> }) {
    const { slug, langCode } = await params
    const blog = await getBlogBySlug(slug)
    if (!blog) return { title: "Blog Not Found" }

    return {
        title: blog?.meta_title || process.env.NEXT_PUBLIC_TITLE,
        description: blog?.meta_description || process.env.NEXT_PUBLIC_DESCRIPTION,
        keywords: process.env.NEXT_PUBLIC_KEYWORDS,
        openGraph: {
            title: blog?.meta_title || process.env.NEXT_PUBLIC_TITLE,
            description: blog?.meta_description || process.env.NEXT_PUBLIC_DESCRIPTION,
            images: blog?.featured_image || process.env.NEXT_PUBLIC_IMAGE,
            type: "website",
            siteName: process.env.NEXT_PUBLIC_WEB_NAME,
            locale: "en_US",
        },
        twitter: {
            card: "summary_large_image",
            title: blog?.meta_title || process.env.NEXT_PUBLIC_TITLE,
            description: blog?.meta_description || process.env.NEXT_PUBLIC_DESCRIPTION,
            images: blog?.featured_image || process.env.NEXT_PUBLIC_IMAGE,
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_WEB_URL!}/${langCode}/blogs/${slug}`,
        },
    }
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const blog = await getBlogBySlug(slug)

    if (!blog) {
        return (
            <Layout>
                <div className='h-screen flexCenter'>
                    <NoDataFound />
                </div>
            </Layout>
        )
    }

    return <BlogDetails blog={blog} />
}

export default Page