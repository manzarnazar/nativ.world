'use client'
import NoDataFoundImg from '@/assets/images/emptyStates/NoDataFound.svg'
import maintenanceModeImg from '@/assets/images/emptyStates/Maintenance_Mode.svg'
import no_NotificationImg from '@/assets/images/emptyStates/No_Notification.svg'
import somethingWentWrongImg from '@/assets/images/emptyStates/Something_Went_Wrong.svg'
import pageNotFoundImg from '@/assets/images/emptyStates/Page_Not_Found.svg'
import ImagePreview from '../storyBook/atoms/ImagePreview'
import { Typography } from '../storyBook/atoms/Typography'
import ThemeSvg from './ThemeSvg'

interface EmptyStatusProps {
    title?: string
    description?: string
    image?: string
    className?: string
    type?: "noDataFound" | "maintenanceMode" | "noNotification" | "somethingWentWrong" | "pageNotFound"
}

const EmptyStatus = ({
    title = 'No Data Found',
    description = "We couldn't find any data to display at the moment. Try adjusting your filters or check back later for updates.",
    image = NoDataFoundImg,
    className = '',
    type = "noDataFound",
}: EmptyStatusProps) => {

    const getImage = () => {
        switch (type) {
            case "noDataFound":
                return NoDataFoundImg;
            case "maintenanceMode":
                return maintenanceModeImg;
            case "noNotification":
                return no_NotificationImg;
            case "somethingWentWrong":
                return somethingWentWrongImg;
            case "pageNotFound":
                return pageNotFoundImg;
            default:
                return NoDataFoundImg;
        }
    }

    return (
        <div className={`flexColCenter ${type === 'noNotification' ? 'h-full' : type === 'noDataFound' ? 'h-150' : 'h-screen'} py-12 px-4 text-center ${className} ${type === 'noDataFound' ? '' : 'bg-white'}`}>
            <div className={`w-44 h-44 sm:w-64 sm:h-64 rounded-full flexCenter mb-6 sm:mb-8 ${type === 'noDataFound' ? 'bg-white' : 'bodyBg'}`}>
                <ThemeSvg
                    src={getImage()}
                    alt={title}
                    className="w-32! h-32! sm:w-39! sm:h-39! object-contain"
                />
            </div>

            <Typography variant='h3' weight='semibold' className='mb-2'>
                {title}
            </Typography>

            <Typography variant='caption' color='textSecondaryColor!' weight='medium' className="max-w-xs sm:max-w-sm lg:max-w-lg leading-relaxed">
                {description}
            </Typography>
        </div>
    )
}

export default EmptyStatus
