import { GalleryGroup, PropertyImage } from "@/hooks/queries/usePropertyDetails";

export type { GalleryGroup };

export interface GalleryContentProps {
    label: string;
    galleryImg: PropertyImage[];
    id?: string;
    onImageClick?: (index: number) => void;
}
