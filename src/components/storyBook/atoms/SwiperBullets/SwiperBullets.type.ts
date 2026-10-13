import { EmblaCarouselType } from 'embla-carousel';

export interface SwiperBulletsProps {
    /** Total snap points (pass scrollSnaps.length or the array itself) */
    count: number;
    /** Currently active index */
    current: number;
    /** Embla API instance used to scroll to a slide */
    api?: EmblaCarouselType;
    /** Additional CSS classes for the wrapper */
    className?: string;
}
