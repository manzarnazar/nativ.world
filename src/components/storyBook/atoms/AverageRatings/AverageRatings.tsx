import { RatingBreakdown } from '@/hooks/queries/useReviews';
import { useTranslation } from '@/hooks/useTranslation';
import React from 'react';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

export interface AverageRatingsProps {
  rating?: number;
  reviews?: number;
  breakdown?: RatingBreakdown[];
}

const AverageRatings: React.FC<AverageRatingsProps> = ({
  rating = 4.5,
  reviews = 720,
  breakdown
}) => {

  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
      {/* Left side: Overall Rating Box */}
      <div className="flex items-center gap-3 md:flexCeneter md:flex-col primaryLightBg border primaryLightBorderColor rounded-2xl p-3 md:p-4 min-w-50 w-full md:w-auto shrink-0">
        <div className="w-16 h-16 rounded-full primaryBg flexCenter">
          <span className="text-white text-2xl font-bold">{rating}</span>
        </div>
        <div className='flex flex-col md:flexCenter'>

          <div className="flex  md:flexCenter gap-0.5 mb-2 warningColor">
            {Array.from({ length: 5 }).map((_, i) => {
              const fill = rating - i;
              if (fill >= 1) return <FaStar key={i} className="text-[18px]" />;
              if (fill >= 0.5) return <FaStarHalfAlt key={i} className="text-[18px]" />;
              return <FaStar key={i} className="text-gray-300 text-[18px]" />;
            })}
          </div>
          <h4 className="text-[#1A1A1A] font-bold text-base mt-2 mb-1 hidden md:block">{t('guestRating')}</h4>
          <p className="textSecondaryColor">{t('basedOn')} {reviews} {t('verifiedStays')}</p>
        </div>
      </div>

      {/* Right side: Breakdown Bars */}
      <div className="w-full h-full flex flex-col gap-4">
        {breakdown?.map((item, index) => (
          <div key={index} className="flex items-center h-full">
            {/* Stars */}
            <div className="flex items-center gap-0.5 w-22.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={`shrink-0 text-[14px] ${i < item.rating ? 'warningColor' : 'text-gray-300'}`}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-4 relative shrink-0">
              <div
                className="absolute top-0 left-0 h-full warningBg rounded-full"
                style={{ width: `${item.count}%` }}
              ></div>
            </div>

            {/* Percentage Text */}
            <div className="w-8.75 text-right text-[#1a1a1a] text-[13px] font-medium shrink-0">
              {item.count}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AverageRatings;
