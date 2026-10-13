'use client'
import { useIsMobile } from '@/hooks/useMobile';
import RichTextContent from '../commonComponents/RichText'
import { PolicyData } from '@/api/server/getPages';
import { MobileBreadcrum } from '../storyBook/molecules/mobileBreadcrum';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSelector } from 'react-redux';
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice';

const PolicyPages = ({ policy }: { policy: PolicyData | null }) => {

  if (!policy) return null;

  const { t } = useTranslation();

  const isMobile = useIsMobile();

  const pathname = usePathname();
  const langCode = useSelector(currentLangCodeSelector);

  const [pageTitle, setPageTitle] = useState('')

  useEffect(() => {
    switch (pathname) {
      case `/${langCode}/cancellation-refunds`:
        setPageTitle(t('cancellationRefunds'))
        break;
      case `/${langCode}/terms-conditions`:
        setPageTitle(t('termsConditions'))
        break;
      case `/${langCode}/privacy-policy`:
        setPageTitle(t('privacyPolicy'))
        break;
      case `/${langCode}/platform-policy`:
        setPageTitle(t('platformPolicy'))
        break;
      default:
        setPageTitle('')
    }
  }, [pathname])


  return (
    <>
      <MobileBreadcrum title={pageTitle} />
      <section className='bg-white commonPY'>
        <div className='container'>
          <div className='flex flex-col gap-4 md:commonGap'>
            {policy.sections.map((section, index) => (
              <div key={index} className='border-b pb-2 md:pb-4 last:border-b-0'>
                {section.title && <h2 className='text-sm sm:text-xl md:text-2xl font-semibold m-0'>{section.title}</h2>}
                <div className={`${isMobile ? 'text-sm' : ''}`}>
                  <RichTextContent content={section.content} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PolicyPages;
