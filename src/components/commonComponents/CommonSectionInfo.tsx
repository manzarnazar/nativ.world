'use client'

import Badge from "../storyBook/atoms/Badge";
import { Typography } from "../storyBook/atoms/Typography";

interface CommonSectionInfoProps {
    title: string;
    desc: string;
    badge: string;
    isCenter?: boolean
}


const CommonSectionInfo = ({ title, desc, badge, isCenter = false }: CommonSectionInfoProps) => {
    return (
        <div className={`flex flex-col gap-6 ${isCenter ? 'items-center justify-center sm:w-[80%] md:w-[60%] lg:w-[45%] min-1800:w-[38%] mx-auto text-center' : ''}`}>
            <span className="block w-fit primaryLightBg text-[var(--primary-color-700)] py-1 px-4 rounded-full">{badge}</span>
            <div className="space-y-2">

                <Typography variant="h2" weight="medium">
                    {title}
                </Typography>
                <Typography className="m-0 textSecondaryColor font-medium">
                    {desc}
                </Typography>
            </div>
        </div>
    )
}

export default CommonSectionInfo
