'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState, MouseEvent } from "react";
import { RoomImgsSliderProps } from "./RoomImgsSlider.type";
import ImagePreview from "@/components/storyBook/atoms/ImagePreview";
import LightBox from "@/components/lightBox/LightBox";
import { PiPlay } from "react-icons/pi";
import Fade from "embla-carousel-fade";

const RoomImgsSlider = ({
    images,
    className,
    imageClassName,
    roomsDetailsPage = false,
    autoPlay = true,
    autoPlayInterval = 2500,
    alwaysShowDots = false,
    enableLightbox = true,
    blurredEdge = false
}: RoomImgsSliderProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    useEffect(() => {
        if (!api || !autoPlay || images.length < 2) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [api, autoPlay, autoPlayInterval, images.length]);

    if (!images || images.length === 0) return null;

    const onDotClick = (e: MouseEvent<HTMLButtonElement>, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        api?.scrollTo(index);
    };

    return (
        <>
            <Carousel
                className={`relative w-full h-full group ${className || ''}`}
                setApi={setApi}
                opts={(autoPlay) ? { loop: true } : undefined}
                plugins={[
                    Fade(),
                ]}
            >
                <CarouselContent className="h-full">
                    {images.map((img, index) => (
                        <CarouselItem
                            key={index}
                            className="relative cursor-pointer h-full"
                            onClick={() => { if (enableLightbox) { setLightboxIndex(index); setLightboxOpen(true); } }}
                        >
                            {img.media_type === 'video' ? (
                                <div className={`relative w-full h-full ${imageClassName || ''}`}>
                                    <video
                                        src={`${img.src}#t=0.1`}
                                        className="w-full h-full object-cover"
                                        preload="metadata"
                                        playsInline
                                    />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                            <PiPlay className="text-xl text-black" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <ImagePreview
                                    src={img.src}
                                    alt={`Room image ${index + 1}`}
                                    className={`w-full h-full object-cover ${imageClassName || ''} ${blurredEdge ? 'brightness-60!' : ''}`}
                                />
                            )}
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Pagination Dots - Positioned over the image at the bottom, exact styles from Slider.tsx */}
                {
                    !roomsDetailsPage &&
                    <div className={`py-4 flexCenter gap-1 ${alwaysShowDots ? '' : 'lg:hidden'} ${roomsDetailsPage ? '' : 'bg-white w-max mx-auto p-2! rounded-2xl bottom-2!'} absolute bottom-0 left-0 right-0 z-10 pointer-events-none`}>
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => onDotClick(e, index)}
                                className={`h-2 rounded-full transition-all duration-300 pointer-events-auto shadow-sm ${current === index
                                    ? `w-6 ${roomsDetailsPage ? 'bg-white' : 'primaryBg'}`
                                    : 'w-2 bg-[var(--neutral-300)]'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                }
            </Carousel>

            <LightBox
                images={images.map((img, i) => ({ src: img.src, alt: `Room image ${i + 1}`, media_type: img.media_type }))}
                isOpen={lightboxOpen}
                currentIndex={lightboxIndex}
                onClose={() => setLightboxOpen(false)}
                onIndexChange={setLightboxIndex}
            />
        </>
    );
};

export default RoomImgsSlider;
