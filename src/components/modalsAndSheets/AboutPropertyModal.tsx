import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslation } from '@/hooks/useTranslation'
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi';
import Divider from '../storyBook/atoms/Divider';
import { useIsMobile } from "@/hooks/useMobile";
import RichTextContent from "../commonComponents/RichText";
import { CancellationRule } from "@/hooks/queries/useBookingQuote";
import { formatTime } from "@/utils/helpers";

interface AboutPropertyModalProps {
    content: string;
    cancelationPolicy?: boolean;
    cancellationRules?: CancellationRule[];
    cancellationCutoffTime?: string;
}

const AboutPropertyModal = ({ content, cancelationPolicy, cancellationRules, cancellationCutoffTime }: AboutPropertyModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const cancellationData = cancellationRules;

    return (
        <Dialog>
            <DialogTrigger className={`${cancelationPolicy ? 'underline text-base! font-medium' : ''} primaryColor btn_md flexCenter gap-2 p-0 text-lg md:text-xl justify-start!`}>

                {cancelationPolicy ? t('readPolicy') : t('readMore')}
                {
                    !cancelationPolicy &&
                    <PiArrowRight className="text-2xl rtl:rotate-180" />
                }
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
                            <div className="flex flex-col gap-1">

                                <DialogTitle>{cancelationPolicy ? t('cancelationPolicy') : t('aboutProperty')}</DialogTitle>
                                {
                                    cancelationPolicy &&
                                    <>
                                        <DialogDescription>{t('cancelationPolicyDesc')}</DialogDescription>
                                        {cancellationCutoffTime && (
                                            <p className="text-sm font-semibold mt-1">
                                                {t('cancellationCutoffTime')} : {formatTime(cancellationCutoffTime)}
                                            </p>
                                        )}
                                    </>
                                }
                            </div>
                        </div>
                        <Divider width='bleed' />
                    </div>
                </DialogHeader>
                {
                    cancelationPolicy ?
                        cancellationData &&
                        <ul className="flex flex-col gap-6">
                            {
                                [...cancellationData]?.sort((a, b) => (Number(b?.refund_percentage) - Number(a?.refund_percentage)))?.map((item, index) => (
                                    <li key={index} className="list-disc! ml-4 textSecondaryColor!">
                                        <div className="flex items-center justify-between">
                                            <span className="">{item?.label}</span>
                                            <span className="font-semibold textPrimaryColor">{item?.description}</span>
                                        </div>
                                    </li>

                                ))
                            }
                        </ul>

                        :
                        <RichTextContent content={content || ''} />
                }
            </DialogContent>
        </Dialog>
    )
}

export default AboutPropertyModal
