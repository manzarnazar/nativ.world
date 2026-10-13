import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslation } from '@/hooks/useTranslation'
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi';
import Divider from '../storyBook/atoms/Divider';
import { useIsMobile } from "@/hooks/useMobile";
import { Rule } from "@/hooks/queries/usePropertyDetails";
import { Typography } from "../storyBook/atoms/Typography";
import { renderAnswer } from "../storyBook/atoms/HotelPolicies/HotelPolicies";

const HotelPoliciesModal = ({ policies }: { policies: Rule[] }) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    return (
        <Dialog>
            <DialogTrigger className="btn_md md:btn_lg primaryBtn w-max flexCenter gap-2 max-399:text-sm! max-399:line-clamp-1 max-399:px-2! max-399:py-1! max-399:flexCenter!">
                {t('readHotelPolicy')}
                <PiArrowRight className="rtl:rotate-180" />
            </DialogTrigger>
            <DialogContent className={`overflow-x-hidden overscroll-y-auto ${isMobile ? 'max-w-full! max-h-full! h-full! [&>.closeBtn]:hidden rounded-none' : 'max-w-200!'} flex flex-col`}>
                <DialogHeader className='block!'>
                    <div className="flex flex-col gap-y-4">
                        <div className="flex items-center gap-6">
                            {
                                <DialogClose asChild>
                                    <span className="md:hidden">
                                        <PiArrowLeft className="text-2xl" />
                                    </span>
                                </DialogClose>
                            }
                            <DialogTitle>{t('hotelPolicies')}</DialogTitle>
                        </div>
                        <Divider width='bleed' />
                    </div>
                </DialogHeader>
                {policies?.map((policy, index) => {
                    return (
                        <div key={policy.id || index} className="w-full flex flex-col gap-y-3">
                            <Typography variant="h6" weight="semibold" className="capitalize">
                                {index + 1}. {policy.name}
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
            </DialogContent>
        </Dialog>
    )
}

export default HotelPoliciesModal
