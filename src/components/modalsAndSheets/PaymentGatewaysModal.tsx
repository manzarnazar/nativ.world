import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useTranslation } from '@/hooks/useTranslation'
import Divider from '../storyBook/atoms/Divider';
import { useIsMobile } from "@/hooks/useMobile";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PaymentGateway } from "../pagesComponent/confirmBooking/GuetDetailsPaymentOpts";


interface PaymentGatewaysModalProps {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
    selectedGateway: PaymentGateway;
    setSelectedGateway: (value: PaymentGateway) => void;
}

const PaymentGatewaysModal = ({ isOpen, setIsOpen, selectedGateway, setSelectedGateway }: PaymentGatewaysModalProps) => {

    const { t } = useTranslation();

    const isMobile = useIsMobile();

    const availableGateways = [
        { id: "razorpay", name: "Razorpay", logo: "https://cdn.razorpay.com/logo.png" },
        { id: "stripe", name: "Stripe", logo: "https://stripe.com/img/logo.png" },
        { id: "flutterwave", name: "Flutterwave", logo: "https://www.flutterwave.com/img/logo.png" }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='overflow-hidden max-w-max! lg:max-w-200!'>
                <DialogHeader className='flex flex-col gap-y-4'>
                    <DialogTitle>{t('selectPaymentMethod')}</DialogTitle>
                    <Divider width='bleed' />
                    <div className='space-y-2'>
                        <RadioGroup defaultValue="option-one" className="flex flex-col gap-4 py-4" value={selectedGateway} onValueChange={setSelectedGateway}>
                            {
                                availableGateways.map((opt) => {
                                    return (
                                        <DialogClose key={opt.id}>
                                            <div className="flex items-center justify-between border rounded-lg p-4">
                                                <Label htmlFor={opt.name}>{opt.name}</Label>
                                                <RadioGroupItem value={opt.id} id={opt.name} />
                                            </div>
                                        </DialogClose>
                                    )
                                })
                            }
                        </RadioGroup>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default PaymentGatewaysModal
