import React from 'react';
import { SwiperBulletsProps } from './SwiperBullets.type';

const SwiperBullets: React.FC<SwiperBulletsProps> = ({
    count,
    current,
    api,
    className = '',
}) => {
    return (
        <div className={`py-6 md:py-12 flexCenter gap-4 ${className} h-5`}>
            {Array.from({ length: count }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`rounded-full transition-all duration-300 ${current === index
                            ? 'w-4 h-4 bg-white border-4 primaryBorder'
                            : 'w-2 h-2 bg-(--neutral-300)'
                        }`}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    );
};

export default SwiperBullets;
