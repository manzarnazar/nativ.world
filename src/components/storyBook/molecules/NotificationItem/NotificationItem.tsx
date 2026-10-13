'use client'

import React from 'react';
import { PiArrowRight, PiBell } from 'react-icons/pi';
import { formatDistanceToNow } from 'date-fns';
import { NotificationItemProps } from './NotificationItem.type';
import { Typography } from '../../../storyBook/atoms/Typography';
import { useTranslation } from '@/hooks/useTranslation';
import { formateDatePretty } from '@/utils/helpers';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice';


const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  body,
  createdAt,
  isRead,
  type,
  image,
  link,
  className = '',
}) => {

  const { t } = useTranslation();
  const langCode = useSelector(currentLangCodeSelector);
  const isBooking = type?.includes('booking');

  const relativeTime = (() => {
    try {
      const date = new Date(createdAt);
      const diffHours = (Date.now() - date.getTime()) / 3600000;
      return diffHours < 24
        ? formatDistanceToNow(date, { addSuffix: true })
        : formateDatePretty(createdAt);
    } catch {
      return '';
    }
  })();

  return (
    <div className={`flex items-start gap-4 py-4 ${className}`}>
      {/* Square icon / image */}
      <div className="shrink-0 primaryLightBg primaryColor flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl mt-0.5 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <PiBell size={22} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Typography variant="desc1" weight="semibold" className="textPrimaryColor! text-sm! md:text-base!">
          {title}
        </Typography>
        <Typography variant="desc2" as="p" className="textSecondaryColor! mt-0.5 text-xs! md:text-sm!">
          {body}
        </Typography>
        {link && (
          isBooking ? (
            <Link
              href={`/${langCode}/my-bookings/${link}`}
              className="primaryColor flex items-center justify-center gap-1 text-xs md:text-sm font-normal mt-2 hover:underline w-fit"
            >
              {t('viewBookingLink')} <PiArrowRight size={20} className='rtl:rotate-180' />
            </Link>
          ) : (
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="primaryColor flex items-center justify-center gap-1 text-xs md:text-sm font-normal mt-2 hover:underline w-fit"
            >
              {t('view')} <PiArrowRight size={20} className='rtl:rotate-180' />
            </Link>
          )
        )}
      </div>

      {/* Time */}
      <Typography variant="caption" weight='medium' className="textPrimaryColor! shrink-0 whitespace-nowrap pt-0.5 text-xs! md:text-sm!">
        {relativeTime}
      </Typography>
    </div>
  );
};

export default NotificationItem;
