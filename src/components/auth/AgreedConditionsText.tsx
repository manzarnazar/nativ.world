import { Typography } from '../storyBook/atoms/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import Divider from '../storyBook/atoms/Divider';
import { useSelector } from 'react-redux';
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice';

interface AgreedConditionsTextProps {
    listPropPage?: boolean
}

const AgreedConditionsText = ({ listPropPage }: AgreedConditionsTextProps) => {
    const { t } = useTranslation();
    const langCode = useSelector(currentLangCodeSelector);
    return (
        <div className='flex flex-col justify-end '>
            <Divider width="bleed" className="" />
            <div className="flex flex-col items-center gap-1 mt-4">
                <Typography variant="caption" className="textPrimaryColor!">
                    {t('byClickingContinue')}

                    {
                        listPropPage &&
                        <Link href={`/${langCode}/partner-policy`} target='_blank' className="primaryColor! font-medium cursor-pointer pl-1">
                            {t('partnerPolicy')}
                        </Link>
                    }
                </Typography>
                {
                    !listPropPage &&
                    <div className="flex items-center gap-1">
                        <Link href={`/${langCode}/terms-conditions`} className="primaryColor! font-medium cursor-pointer">
                            {t('termsAndConditions')}
                        </Link>
                        <Typography variant="caption" className="textPrimaryColor!">
                            {t('and')}
                        </Typography>
                        <Link href={`/${langCode}/privacy-policy`} className="primaryColor! font-medium cursor-pointer">
                            {t('privacyPolicy')}
                        </Link>
                    </div>
                }

            </div>
        </div >
    )
}

export default AgreedConditionsText
