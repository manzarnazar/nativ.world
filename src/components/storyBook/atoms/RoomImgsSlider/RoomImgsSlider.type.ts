export interface SliderMedia {
    src: string;
    media_type?: string;
}

export interface RoomImgsSliderProps {
    images: SliderMedia[];
    className?: string;
    imageClassName?: string;
    roomsDetailsPage?: boolean;
    /** Show prev/next arrow buttons, faded in on hover. Default false. */
    /** Auto-advance slides continuously. Default true. */
    autoPlay?: boolean;
    /** Interval in ms between auto-advances when autoPlay is true. Default 1200. */
    autoPlayInterval?: number;
    /** Show pagination dots on all breakpoints instead of mobile-only. Default false. */
    alwaysShowDots?: boolean;
    /** Open the lightbox on slide click. Default true. */
    enableLightbox?: boolean;
    /** Show a blurred, scaled-up copy of the image as backdrop behind an inset rounded image. Default false. */
    blurredEdge?: boolean;
}
