import React from 'react';
import Typography from '../Typography/Typography';
import Divider from '../Divider/Divider';
import { useTranslation } from '@/hooks/useTranslation';
import { useIsMobile } from '@/hooks/useMobile';
import { HotelPoliciesProps } from './HotelPolicies.type';
import { RuleItem } from '@/hooks/queries/usePropertyDetails';
import { PiArrowRight, PiCalendarBlank, PiCalendarDots } from 'react-icons/pi';
import HotelPoliciesModal from '@/components/modalsAndSheets/HotelPoliciesModal';
import { Button } from '../Button';
import { formatTime } from '@/utils/helpers';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice';

export const renderAnswer = (item: RuleItem) => {
  const { answer, type } = item;

  if (type === 'yes_no' || typeof answer === 'boolean') {
    const isYes = answer === true || String(answer).toLowerCase() === 'true';
    return (
      <Typography variant="h6" className="capitalize" weight='medium'>
        {isYes ? 'Yes' : 'No'}
      </Typography>
    );
  }

  if (type === 'multiple_select' && Array.isArray(answer)) {
    return (
      <ul className="list-disc pl-5 space-y-2">
        {answer.map((ans, idx) => (
          <li key={idx} className="marker:text-black">
            <Typography variant="h6" as="span" weight='medium' className="capitalize">
              {String(ans)}
            </Typography>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Typography variant="h6" weight='medium' className="capitalize">
      {String(answer)}
    </Typography>
  );
};

const HotelPolicies: React.FC<HotelPoliciesProps> = ({
  policies,
  className = '',
  checkIn,
  checkOut
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const langCode = useSelector(currentLangCodeSelector);

  const hasCheckInOut = checkIn || checkOut;

  return (
    <div
      className={`bg-white rounded-2xl md:border ${isMobile ? 'container' : ''} overflow-hidden p-4 flex flex-col gap-y-4 items-start ${className}`}
    >
      {/* Title */}
      <Typography variant="h5" weight="semibold">
        {t('hotelPolicies')}
      </Typography>

      {!isMobile && <Divider width="bleed" />}

      <div className="w-full flex flex-col gap-y-6">
        {hasCheckInOut && (
          <div className="w-full flex flex-col gap-y-3">
            <Typography variant="h6" weight="bold" className="capitalize">
              1.{t('checkInOutPolicy')}
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              {checkIn && (
                <div className="bg-[#f8f9fa] rounded-xl p-4 flex gap-3">
                  <PiCalendarDots className="text-xl textSecondaryColor" />
                  <div className="flex gap-1 sm:gap-2 textSecondaryColor flex-col -mt-1">
                    <Typography variant="desc2" weight='medium'>{t('checkIn')}</Typography>
                    <Typography variant="h6" weight="medium" className='textPrimaryColor!'>
                      {formatTime(checkIn)}
                    </Typography>
                  </div>
                </div>
              )}
              {checkOut && (
                <div className="bg-[#f8f9fa] rounded-xl p-4 flex gap-3">
                  <PiCalendarDots className="text-xl textSecondaryColor" />
                  <div className="flex gap-1 sm:gap-2 textSecondaryColor flex-col -mt-1">
                    <Typography variant="desc2" weight='medium'>{t('checkOut')}</Typography>
                    <Typography variant="h6" weight="medium" className='textPrimaryColor!'>
                      {formatTime(checkOut)}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {policies?.slice(0, 2)?.map((policy, index) => {
          const displayIndex = hasCheckInOut ? index + 2 : index + 1;
          return (
            <div key={policy.id || index} className="w-full flex flex-col gap-y-3">
              <Typography variant="h6" weight="semibold" className="capitalize">
                {displayIndex}. {policy.name}
              </Typography>

              <div className="flex flex-col gap-y-4">
                {policy.items?.map((item, idx) => (
                  <div key={idx} className="pl-0 sm:pl-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <span className="textSecondaryColor mt-0.5">•</span>
                        <Typography variant="desc2" className="mt-[2px] first-letter:capitalize" weight='medium'>
                          {item.question}
                        </Typography>
                      </div>
                      <div className="pl-[22px]">
                        {renderAnswer(item)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className='flex items-center gap-4 flex-wrap'>
          {
            policies?.length > 2 && <HotelPoliciesModal policies={policies} />
          }
          <Link href={`/${langCode}/platform-policy`} className='textDecorationNone' rel="noopener noreferrer">
            <Button variant='outline' rightIcon={<PiArrowRight className="rtl:rotate-180" />} size={isMobile ? 'md' : 'lg'} className='max-399:text-sm! max-399:line-clamp-1 max-399:px-2! max-399:py-1! max-399:flexCenter!'>
              {t('platformPolicy')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelPolicies;
