import React, { useEffect, useRef, useState } from 'react';
import { AboutPropertyProps } from './AboutProperty.type';
import Typography from '../Typography/Typography';
import Divider from '../Divider/Divider';
import { useTranslation } from '@/hooks/useTranslation';
import AboutPropertyModal from '@/components/modalsAndSheets/AboutPropertyModal';
import { useIsMobile } from '@/hooks/useMobile';
import RichTextContent from '@/components/commonComponents/RichText';
import { PiPawPrint } from 'react-icons/pi';

const AboutProperty: React.FC<AboutPropertyProps> = ({
  roomsPage,
  description,
  petsAllowed,
  className = '',
  petPolicy = ''
}) => {

  const { t } = useTranslation();

  const isMobile = useIsMobile();

  const contentRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setShowModal(contentRef.current.scrollHeight > 300);
    }
  }, [description]);

  return (
    <div
      className={`bg-white rounded-2xl md:border ${isMobile ? 'container' : ''} overflow-hidden p-4 flex flex-col gap-y-4 items-start ${className}`}
    >
      {/* Title */}
      <Typography variant="h5" weight="semibold">
        {t(roomsPage ? 'aboutRoom' : 'aboutProperty')}
      </Typography>

      {
        !isMobile &&
        <Divider width='bleed' />
      }

      <div ref={contentRef} className={`overflow-hidden ${showModal ? 'h-75' : ''}`}>
        <RichTextContent content={description || ''} />
      </div>
      {showModal && <AboutPropertyModal content={description || ''} />}

      {
        petsAllowed &&
        <div className='primaryLightBg primaryLightBorderColor border rounded-2xl p-4 grid grid-cols-12 sm:flex items-center sm:gap-4 w-full'>
          <span className='primaryBg w-12 h-12 rounded-lg flexCenter text-white text-2xl max-sm:col-span-2'>
            <PiPawPrint />
          </span>
          <div className='max-sm:col-span-10 max-sm:ml-4'>
            <Typography variant="h5" weight="semibold">
              {t('petsAllowed')}
            </Typography>
            <Typography variant="caption" weight="regular" className='text-balance'>
              {t('petsAllowedDescription')}
            </Typography>
            {
              petPolicy &&
              <RichTextContent content={petPolicy} />
            }
          </div>

        </div>
      }
    </div>
  );
};

export default AboutProperty;
