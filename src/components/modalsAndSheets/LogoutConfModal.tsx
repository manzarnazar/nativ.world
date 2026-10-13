'use client'
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { useTranslation } from '@/hooks/useTranslation'
import { PiSignOut } from 'react-icons/pi';
import Divider from '../storyBook/atoms/Divider';
import { Button } from "../storyBook/atoms/Button";
import { useLogoutUser } from "@/hooks/logoutUser";

interface LogoutConfModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const LogoutConfModal: React.FC<LogoutConfModalProps> = ({ open, setOpen }) => {

    const { t } = useTranslation();
    const { handleUserLogout } = useLogoutUser();
    const [loggingOut, setLoggingOut] = useState(false);

    const onLogout = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoggingOut(true)
        await handleUserLogout()
        setLoggingOut(false)
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="overflow-x-hidden overflow-y-auto w-[90vw] max-w-md! [&>.closeBtn]:hidden flex flex-col">
                <DialogHeader className='block'>
                    <div className="flex flex-col gap-y-4">
                        <div className="flexColCenter gap-6">

                            <span className="errorColor errorLightBg p-2 rounded-full w-18 h-18 flexCenter text-[40px]"><PiSignOut /></span>
                            <div className="flexColCenter gap-1">
                                <DialogTitle>
                                    {t('logout')}
                                </DialogTitle>
                                <DialogDescription className="text-center">
                                    {t('logoutDescription')}
                                </DialogDescription>
                            </div>
                        </div>
                        <Divider width='bleed' />
                        <div className="flexCenter gap-4">
                            <Button variant="text" onClick={() => setOpen(false)} className="rounded-lg! w-full!" disabled={loggingOut}>
                                {t('cancel')}
                            </Button>
                            <Button variant="danger" className="rounded-lg! w-full!" onClick={onLogout} loading={loggingOut}>
                                {t('yesLogout')}
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

            </DialogContent>
        </Dialog>
    )
}

export default LogoutConfModal
