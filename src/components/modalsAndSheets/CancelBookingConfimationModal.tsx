'use client';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/storyBook/atoms/Button';
import { Typography } from '@/components/storyBook/atoms/Typography';
import { useTranslation } from '@/hooks/useTranslation';
import { PiWarning } from 'react-icons/pi';
import Divider from '@/components/storyBook/atoms/Divider';
import { useCancelBooking } from '@/hooks/queries/bookings/useCancelBooking';
import { toast } from '@/lib/toast';
import { useIsMobile } from '@/hooks/useMobile';

interface CancelBookingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bookingNumber: string;
    setRefetchTrigger: (value: boolean) => void
}

const CancelBookingConfimationModal: React.FC<CancelBookingModalProps> = ({
    open,
    onOpenChange,
    bookingNumber,
    setRefetchTrigger
}) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const { mutate: cancelBooking, isPending: isLoading } = useCancelBooking();

    const handleCancelBooking = () => {

        cancelBooking(
            {
                bookingNumber: bookingNumber,
            },
            {
                onSuccess: () => {
                    toast.success(t("bookingCancelSuccess"))
                    onOpenChange(false)
                    setRefetchTrigger(true)
                },
                onError: (error) => {
                    toast.error(error.message)
                },
            }
        )
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="md:max-w-200! w-full bg-white rounded-2xl p-3 sm:p-6 gap-0 overflow-x-hidden max-479:max-w-[90%]!">
                <DialogHeader className="mb-5">
                    <DialogTitle className="text-xl font-semibold textPrimaryColor!">
                        {t('cancelBookingTitle')}
                    </DialogTitle>
                </DialogHeader>

                {/* Warning box */}
                <div className="errorLightBg rounded-2xl p-4 flex flex-col items-center gap-4 text-center">
                    <div className="errorBg w-14 h-14 flexCenter rounded-2xl">
                        <PiWarning className="text-white text-3xl" />
                    </div>
                    <div className="space-y-1.5">
                        <Typography variant="h6" weight="semibold" className="textPrimaryColor!">
                            {t('cancelBookingConfirmQuestion')}
                        </Typography>
                        <Typography variant="caption" className="textSecondaryColor!">
                            {t('cancelBookingConfirmDesc')}
                        </Typography>
                    </div>
                </div>

                <Divider width="bleed" className="mt-5" />

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                        variant="text"
                        className="textPrimaryColor! font-medium"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        size='md'
                    >
                        {t(isMobile ? 'keepBooking' : 'noKeepBooking')}
                    </Button>
                    <Button
                        variant="secondary"
                        className="rounded-full!"
                        onClick={handleCancelBooking}
                        loading={isLoading}
                        size='md'
                    >
                        {t(isMobile ? 'yesCancel' : 'yesCancelBooking')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CancelBookingConfimationModal;
