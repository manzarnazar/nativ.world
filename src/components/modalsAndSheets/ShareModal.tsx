import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslation } from '@/hooks/useTranslation'
import { Typography } from '../storyBook/atoms/Typography';
import { Button } from '../storyBook/atoms/Button';
import { PiCopy, PiShareNetwork } from 'react-icons/pi';
import Divider from '../storyBook/atoms/Divider';
import { usePathname } from 'next/navigation';
import { useIsMobile } from "@/hooks/useMobile";
import { toast } from '@/lib/toast';

const ShareModal = ({ bgTransparent = false }: { bgTransparent?: boolean }) => {

    const { t } = useTranslation();

    const isMobile = useIsMobile();

    const pathname = usePathname();

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url).then(() => {
            toast.success(t('linkCopied'))
        }).catch(() => {
            toast.error(t('somethingWentWrong'))
        })
    }

    const url = `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}?share=true`

    return (
        <Dialog>
            <DialogTrigger className={`${isMobile ? `h-10 w-10 shrink-0 border-0 hover:bg-transparent focus:ring-0 textPrimaryColor! shareBtn flexCenter rounded-full ${bgTransparent ? 'bg-transparent' : 'bg-white'}` : 'flexCenter gap-3! text-xl'}`}>
                {
                    isMobile ?
                        <PiShareNetwork className='text-2xl' />
                        :
                        <>
                            <PiShareNetwork className="border rounded-xl w-10 h-10 flexCenter p-2" />
                            {t('share')}

                        </>
                }
            </DialogTrigger>
            <DialogContent className='overflow-hidden max-w-max! lg:max-w-200!'>
                <DialogHeader className='flex flex-col gap-y-4'>
                    <DialogTitle>{t('share')}</DialogTitle>
                    <Divider width='bleed' />
                    <div className='space-y-2'>
                        <Typography variant="label" weight="regular" required={true}>{t('pageLink')}</Typography>
                        <div className='grid grid-cols-12 gap-2 border rounded-lg py-3 px-4'>
                            <Typography variant="desc2" weight="regular" className='col-span-12 md:col-span-9'>
                                {url}
                            </Typography>
                            <Button variant='text' children={t('copyLink')} leftIcon={<PiCopy />} className='primaryColor p-0! col-span-12 md:col-span-3' onClick={handleCopyLink} />
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default ShareModal
