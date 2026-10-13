import React, { useState } from 'react';
import Ratings from '../../atoms/Ratings/Ratings';
import Typography from '../../atoms/Typography/Typography';
import ImagePreview from '../../atoms/ImagePreview/ImagePreview';
import LightBox from '../../../lightBox/LightBox';
import { ReviewProps } from './Review.type';
import { useTranslation } from '@/hooks/useTranslation';

const Review: React.FC<ReviewProps> = ({
    review,
    className = ''
}) => {

    const { t } = useTranslation();

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const maxVisibleImages = 4;
    const remainingCount = review?.images?.length - (maxVisibleImages - 1);


    return (
        <div className={`flex flex-col md:flex-row gap-4 w-full relative ${className}`}>

            <div className='flex items-center gap-1 absolute top-0 ltr:right-0 rtl:left-0'>
                <span className='font-medium text-sm'>{t('room')} :</span>
                <span className=' textSecondaryColor'>
                    {review?.room_type?.name}
                </span>
            </div>

            {/* Left side: Rating */}
            <div className="shrink-0">
                <Ratings value={review?.rating} col={true} />
            </div>

            {/* Right side: Content */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col">
                    <Typography variant="h6" weight="semibold" className="text-black!">
                        {review?.user?.name}
                    </Typography>
                    <div className='flex items-center gap-1'>
                        <Typography variant="caption">
                            {review?.date}
                        </Typography>
                        <Typography variant="caption">
                            - {t('stayed')} {review?.stayed_nights} <span className='lowercase'>{review?.stayed_nights > 1 ? t('nights') : t('night')}</span>
                        </Typography>
                    </div>
                </div>

                <Typography variant="desc2" className="text-gray-800! leading-relaxed">
                    {review?.review}
                </Typography>

                {review?.images?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        {review?.images.slice(0, maxVisibleImages).map((img, idx) => {
                            const isLast = idx === maxVisibleImages - 1;
                            const showOverlay = isLast && remainingCount > 0;

                            return (
                                <div
                                    key={idx}
                                    className="relative w-18 h-15 cursor-pointer"
                                    onClick={() => {
                                        setCurrentIndex(idx);
                                        setLightboxOpen(true);
                                    }}
                                >
                                    <ImagePreview
                                        src={img?.url}
                                        alt={`Review image ${idx + 1}`}
                                        rounded="lg"
                                        className="w-full h-full object-cover"
                                        containerClassName="w-full h-full"
                                    />
                                    {showOverlay && (
                                        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                                            <Typography variant="subtitle2" weight="bold" className="text-white!">
                                                +{remainingCount}
                                            </Typography>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* LightBox Instance */}
            <LightBox
                images={review?.images?.map((img, i) => ({
                    src: typeof img === 'object' ? img.url : img,
                    alt: `Review image ${i + 1}`
                }))}
                isOpen={lightboxOpen}
                currentIndex={currentIndex}
                onClose={() => setLightboxOpen(false)}
                onIndexChange={setCurrentIndex}
            />
        </div>
    );
};

export default Review;
