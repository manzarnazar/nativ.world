"use client";

import { Button } from "@/components/storyBook/atoms/Button";
import ImagePreview from "@/components/storyBook/atoms/ImagePreview";
import { Typography } from "@/components/storyBook/atoms/Typography";
import { useTranslation } from "@/hooks/useTranslation";
import React from "react";
import { PiArrowRight } from "react-icons/pi";
import Badge from "../../atoms/Badge";
import Link from "next/link";
import { BlogsDataType } from "@/hooks/queries/blogs/useBlogs";
import { useSelector } from "react-redux";
import { currentLangCodeSelector } from "@/redux/reducers/languageSlice";

interface BlogCardProps {
    blog: BlogsDataType;
    className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {

    const { t } = useTranslation();

    const langCode = useSelector(currentLangCodeSelector);

    const dateObj = new Date(blog?.published_at);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "short" });

    return (
        <Link href={`/${langCode}/blogs/${blog?.slug}`} className="bodyBg border rounded-2xl p-4 md:p-5 flex flex-col gap-5">

            {/* Image Section */}
            <div className="relative w-auto h-43 sm:h-62">
                <ImagePreview
                    src={blog?.featured_image}
                    alt={blog?.title}
                    rounded="xl"
                    className="aspect-488/248!"
                />

                {/* Date Badge */}
                <div className="absolute bottom-4 right-4 bg-white rounded-xl w-12 h-20 shadow-md gap-2 flexColCenter">
                    <Typography variant="h5" weight="semibold" className="textPrimaryColor! leading-none">
                        {day}
                    </Typography>
                    <Typography variant="caption" className="textSecondaryColor leading-none">
                        {month}
                    </Typography>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3">

                {/* Category */}
                <Badge
                    label={blog?.category?.name}
                    variant={'primary'}
                    className='primaryColor! font-semibold! text-sm! capitalize'
                />

                {/* Title */}
                <Typography
                    variant="h3"
                    weight="semibold"
                    className="textPrimaryColor! line-clamp-1 first-letter:capitalize"
                >
                    {blog?.title}
                </Typography>

                {/* Description */}
                <Typography
                    variant="desc2"
                    className="line-clamp-2 first-letter:capitalize lg:h-12"
                >
                    {blog?.excerpt}
                </Typography>
            </div>

            {/* CTA */}
            <div className="mt-6 md:block hidden">
                <Button
                    variant="secondary"
                    className="rounded-full!"
                    rightIcon={<PiArrowRight className="text-xl md:text-2xl rtl:rotate-180"/>}
                    size="md"
                >
                    {t('readMore')}
                </Button>
            </div>
        </Link>
    );
};

export default BlogCard;