'use client'
import Layout from "@/components/layout/Layout"
import BlogCardSkeleton from "@/components/skeletons/BlogCardSkeleton"
import { Button } from "@/components/storyBook/atoms/Button"
import Pagination from "@/components/storyBook/atoms/Pagination"
import { SelectOpt } from "@/components/storyBook/atoms/SelectOpt"
import { MobileBreadcrum } from "@/components/storyBook/molecules/mobileBreadcrum"
import SectionInfo from "@/components/storyBook/molecules/SectionInfo"
import BlogCard from "@/components/storyBook/organisms/BlogCard"
import NoDataFound from "@/components/systemStates/NoDataFound"
import { useBlogCategories } from "@/hooks/queries/blogs/useBlogCategories"
import { BlogsDataType, useBlogs } from "@/hooks/queries/blogs/useBlogs"
import { useTranslation } from "@/hooks/useTranslation"
import { PaginationType } from "@/types/GlobalTypes"
import { useCallback, useEffect, useState } from "react"  // removed toast import (unused)
import { PiMagnifyingGlass } from "react-icons/pi"
import { motion } from "framer-motion"
import { listVariants, itemVariants } from "@/lib/motionVariants"
import { Skeleton } from "@/components/ui/skeleton"

const Blogs = () => {

    const { t } = useTranslation();

    const [sortBy, setSortBy] = useState<string>();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");         // raw input value
    const [debouncedSearch, setDebouncedSearch] = useState(""); // debounced — fed to API

    // Debounce: wait 1000ms after user stops typing, then update debouncedSearch
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setCurrentPage(1); // reset to page 1 on new search
        }, 1000);

        return () => clearTimeout(timer); // cleanup on every keystroke
    }, [searchQuery]);

    const { data: categories, isLoading: cateLoading, error: catesError, isError: cateIsError } = useBlogCategories();

    const { data: blogsData, isLoading, error: blogsError, isError } = useBlogs({
        category_id: Number(sortBy),
        search: debouncedSearch,
    }, currentPage);

    // Unified variables to use throughout the component
    const resData = blogsData?.data;
    const pagination: PaginationType | undefined = resData?.pagination;
    const totalPages = pagination?.last_page ?? 1;

    const blogs: BlogsDataType[] = resData?.items ?? [];

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (isError) {
            console.log("blogs error =>", blogsError?.message);
        }
        if (cateIsError) {
            console.log("categories error =>", catesError?.message);
        }
    }, [isError, cateIsError])


    return (
        <Layout>
            <MobileBreadcrum title={t('blogs')} />
            <div className="bg-white py-6 md:py-12">
                <div className="container flex flex-col commonGap">
                    <motion.div
                        className="md:block hidden"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <SectionInfo title={t('blogsTitle')} desc={t('blogsDesc')} />
                    </motion.div>
                    <motion.div
                        className="flex items-center justify-between flex-wrap md:p-4 md:bodyBg rounded-2xl md:border gap-y-6"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {
                            cateLoading ?
                                <>
                                    <Skeleton className="h-10 w-42 rounded-md" />
                                </>
                                :
                                !cateIsError && categories?.data && categories?.data?.length > 0 &&
                                <div className="hidden md:block">
                                    <SelectOpt options={categories?.data?.map((category) => ({
                                        value: category?.id.toString(),
                                        label: category?.name,
                                    }))}
                                        value={sortBy ?? ''}
                                        onChange={setSortBy} />
                                </div>
                        }
                        {/* Search Bar — no form submit needed, debounce handles it */}
                        <div className="w-full sm:max-w-66 md:max-w-165">
                            <div className="flex items-center bg-white rounded-lg border border-black overflow-hidden pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-(--primary-color) focus-within:primaryBorder transition-all duration-200">
                                <PiMagnifyingGlass className="text-lg ml-2 md:hidden" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('searchBlog')}
                                    className="flex-1 px-3 md:px-4 py-1.5 text-sm md:text-base bg-transparent outline-none placeholder:textSecondaryColor textPrimaryColor w-full md:w-[90%]"
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="md"
                                    className="rounded-lg! shrink-0 hidden md:flex"
                                    leftIcon={<PiMagnifyingGlass className="text-xl md:text-2xl shrink-0" />}
                                >
                                    {t('search')}
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {
                        isLoading ?
                            <div className="grid grid-cols-1 sm:grid-cols-2 min-1200:grid-cols-3! commonGap">
                                {
                                    Array.from({ length: 6 }).map((_, index) => (
                                        <article key={index}>
                                            <BlogCardSkeleton />
                                        </article>
                                    ))
                                }
                            </div>
                            :
                            !isError && blogs?.length > 0 ?
                                <motion.div
                                    key={currentPage}
                                    className="grid grid-cols-1 sm:grid-cols-2 min-1200:grid-cols-3! commonGap"
                                    variants={listVariants}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}
                                >
                                    {
                                        blogs?.map((blog) => (
                                            <motion.article key={blog.id} variants={itemVariants}>
                                                <BlogCard blog={blog} />
                                            </motion.article>
                                        ))
                                    }
                                </motion.div>
                                :
                                <NoDataFound />
                    }

                    {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            siblingCount={1}
                            className="mt-20 justify-center"
                        />
                    )}
                </div>
            </div >
        </Layout >
    )
}

export default Blogs