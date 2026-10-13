'use client';
import React from 'react';

import Badge from '../../atoms/Badge';
import { Typography } from '../../atoms/Typography';
import { SectionInfoProps } from './SectionInfo.type';
import RichTextContent from '@/components/commonComponents/RichText';

const SectionInfo: React.FC<SectionInfoProps> = ({
    badge,
    badgeVariant = 'primary',
    badgeSize = 'lg',
    badgeRounded = 'full',
    badgeIconLeft,
    badgeIconRight,
    title,
    titleVariant = 'h2',
    titleWeight = 'medium',
    desc,
    descVariant = 'desc1',
    isCenter = false,
    className = '',
    isTextWhite = false,
    showInRichText = false,
    blogsDetailsPage = false
}) => {
    const wrapperClasses = [
        'flex flex-col gap-6',
        isCenter
            ? 'md:items-center md:justify-center sm:w-[80%] md:w-[60%] lg:w-[45%] min-1800:w-[38%] mx-auto md:text-center'
            : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={wrapperClasses}>
            {
                badge &&
                <Badge
                    label={badge}
                    variant={badgeVariant}
                    size={badgeSize}
                    rounded={badgeRounded}
                    iconLeft={badgeIconLeft}
                    iconRight={badgeIconRight}
                    className='hidden! md:block! first-letter:uppercase!'
                />
            }

            <div className="space-y-2">
                <Typography variant={titleVariant} weight={titleWeight} className={`${isTextWhite && 'text-white!'}`}>
                    {title}
                </Typography>
                {
                    showInRichText ?
                        <RichTextContent content={desc || ''} className="font-medium! textSecondaryColor!" />
                        :
                        <Typography variant={descVariant} className={`${blogsDetailsPage ? '' : 'hidden'} md:block m-0 textSecondaryColor font-medium ${isTextWhite && 'text-[#BFBFBF]!'}`}>
                            {desc}
                        </Typography>
                }
            </div>
        </div>
    );
};

export default SectionInfo;
