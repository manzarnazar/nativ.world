'use client'
import ReserveCard from "../storyBook/organisms/ReserveNowCard/ReserveCard"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { useTranslation } from '@/hooks/useTranslation'
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi';
import Divider from '../storyBook/atoms/Divider';
import { useIsMobile } from "@/hooks/useMobile";
import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";


interface ReserveRoomModalProps {
    roomsPage?: boolean,
    open?: boolean
    close?: (value: boolean) => void;
}

const ReserveRoomModal = ({ roomsPage = false, open = false, close }: ReserveRoomModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        if (roomsPage) {
            setOpenModal(open)
        }
    }, [open, roomsPage])


    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            {
                !roomsPage &&
                <DialogTrigger className="primaryBtn btn_md flexCenter gap-2 max-375:text-sm! max-375:line-clamp-1 max-375:px-2! max-375:py-1! max-375:flexCenter!">
                    <span>{t('reserveNow')}</span>
                    <PiArrowRight className="text-base w-max rtl:rotate-180" />
                </DialogTrigger>
            }
            <DialogContent className={`overflow-y-auto overflow-x-hidden ${isMobile ? 'max-w-full! max-h-full! h-full! [&>.closeBtn]:hidden rounded-none' : 'max-w-max!'} flex flex-col`}>
                <DialogHeader className='block'>
                    <div className="flex flex-col gap-y-4">
                        <div className="flex items-center gap-6">
                            {
                                <DialogClose asChild>
                                    <span className="md:hidden">
                                        <PiArrowLeft className="text-2xl" />
                                    </span>
                                </DialogClose>
                            }
                            <DialogTitle>{t('reserveBooking')}</DialogTitle>
                        </div>
                        <Divider width='bleed' />
                    </div>
                </DialogHeader>
                <ReserveCard isActive={isMobile} />
            </DialogContent>
        </Dialog>
    )
}

export default ReserveRoomModal
