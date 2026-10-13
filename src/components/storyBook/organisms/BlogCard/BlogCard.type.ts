import { BlogsDataType } from "@/hooks/queries/blogs/useBlogs";

export interface BlogCardProps {
    blog: BlogsDataType;
    className?: string;
}
