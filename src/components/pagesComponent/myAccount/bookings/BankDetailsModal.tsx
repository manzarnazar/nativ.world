'use client'
import { useState, useCallback } from "react"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslation } from "@/hooks/useTranslation"
import Input from "@/components/storyBook/atoms/Input/Input"
import { Button } from "@/components/storyBook/atoms/Button"
import { PiPlusCircle } from "react-icons/pi"
import Divider from "@/components/storyBook/atoms/Divider"
import { useIsMobile } from "@/hooks/useMobile"
import { useManualRefundRequest } from "@/hooks/queries/bookings/useManualRefundRequest"
import { toast } from '@/lib/toast';
import { Typography } from "@/components/storyBook/atoms/Typography"

const MESSAGE_MAX = 500

interface BankDetailsForm {
    accountHolderName: string
    bankName: string
    accountNumber: string
    ifscSwiftCode: string
    message: string
}

type BankDetailsErrors = Partial<Record<keyof BankDetailsForm, string>>

interface BankDetailsModalProps {
    bookingNumber: string
}

const BankDetailsModal = ({ bookingNumber }: BankDetailsModalProps) => {

    const { t } = useTranslation();
    const isMobile = useIsMobile();

    const [isOpen, setIsOpen] = useState(false)
    const [submittedData, setSubmittedData] = useState<BankDetailsForm | null>(null)
    const [formData, setFormData] = useState<BankDetailsForm>({
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        ifscSwiftCode: "",
        message: "",
    })
    const [errors, setErrors] = useState<BankDetailsErrors>({})
    const [loading, setLoading] = useState(false)

    const bankDetailsSchema = z.object({
        accountHolderName: z.string().min(2, t("nameMinLength")),
        bankName: z.string().min(2, t("nameMinLength")),
        accountNumber: z.string().min(5, t("invalidAccountNumber")),
        ifscSwiftCode: z.string().min(4, t("invalidIfscSwiftCode")),
        message: z.string().min(1, t("messageRequired")).max(MESSAGE_MAX, t("messageMaxLength")),
    })

    const validate = useCallback((): boolean => {
        const result = bankDetailsSchema.safeParse(formData)
        if (!result.success) {
            const fieldErrors: BankDetailsErrors = {}
            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof BankDetailsForm
                if (!fieldErrors[field]) fieldErrors[field] = err.message
            })
            setErrors(fieldErrors)
            return false
        }
        setErrors({})
        return true
    }, [formData])

    const { mutate: sendRefundRequest, isPending: isLoading } = useManualRefundRequest();

    const handleChange = (field: keyof BankDetailsForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)

        sendRefundRequest(
            {
                bookingNumber: bookingNumber,
                account_holder_name: formData.accountHolderName,
                bank_name: formData.bankName,
                account_number: formData.accountNumber,
                ifsc_swift_code: formData.ifscSwiftCode,
                message: formData.message,
            },
            {
                onSuccess: () => {
                    setLoading(false)
                    setSubmittedData({ ...formData })
                },
                onError: (error) => {
                    toast.error(error.message)
                    setLoading(false)
                },
            }
        )
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) setSubmittedData(null)
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger className="bg-black text-white btn_md 2xl:btn_lg flexCenter gap-2 max-lg:w-full!">
                <PiPlusCircle className="text-2xl" />
                {t("submitBankDetails")}
            </DialogTrigger>
            <DialogContent className={`overflow-x-hidden overscroll-y-auto ${isMobile ? 'max-w-full! max-h-full! h-full! rounded-none' : 'max-w-150!'} flex flex-col gap-6 `}>
                <DialogHeader>
                    <DialogTitle>{t("viewBankDetails")}</DialogTitle>
                    {!submittedData && (
                        <DialogDescription>
                            {t("bankDetailsDesc")}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <Divider width="bleed" />

                {submittedData ? (
                    <div className="flex flex-col gap-6">
                        <div className="successLightBg rounded-xl p-4 flex flex-col gap-1">
                            <Typography variant="h5" weight="semibold" className="textPrimaryColor!">
                                {t("bankDetailsSubmittedTitle")}
                            </Typography>
                            <Typography variant="h6" weight="regular" className="textSecondaryColor!">
                                {t("bankDetailsSubmittedDesc")}
                            </Typography>
                        </div>

                        <div className="flex flex-col gap-3">
                            <p className="text-base font-semibold textPrimaryColor!">{t("bookingInformation")}</p>
                            <div className="border borderColor rounded-xl p-4 flex flex-col sm:grid sm:grid-cols-2 gap-x-6 gap-y-4 bodyBg">
                                <div className="flex justify-between sm:flex-col gap-0.5">
                                    <span className="text-sm font-medium textSecondaryColor!">{t("accountHolderName")}</span>
                                    <span className="font-semibold textPrimaryColor!">{submittedData.accountHolderName}</span>
                                </div>
                                <div className="flex justify-between sm:flex-col gap-0.5">
                                    <span className="text-sm font-medium textSecondaryColor!">{t("bankName")}</span>
                                    <span className="font-semibold textPrimaryColor!">{submittedData.bankName}</span>
                                </div>
                                <div className="flex justify-between sm:flex-col gap-0.5">
                                    <span className="text-sm font-medium textSecondaryColor!">{t("accountNumber")}</span>
                                    <span className="font-semibold textPrimaryColor!">{submittedData.accountNumber}</span>
                                </div>
                                <div className="flex justify-between sm:flex-col gap-0.5">
                                    <span className="text-sm font-medium textSecondaryColor!">{t("ifscSwiftCode")}</span>
                                    <span className="font-semibold textPrimaryColor!">{submittedData.ifscSwiftCode}</span>
                                </div>
                                {submittedData.message && (
                                    <div className="col-span-2 flex flex-col gap-0.5">
                                        <span className="text-sm font-medium textSecondaryColor!">{t("message")}</span>
                                        <span className="font-semibold textPrimaryColor!">{submittedData.message}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* <Divider width="bleed" />

                        <div className="flex items-center justify-end">
                            <Button type="button" variant="text" size="md" onClick={() => handleOpenChange(false)}>
                                {t("close")}
                            </Button>
                        </div> */}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            label={t("accountHolderName")}
                            required
                            fullWidth
                            type="text"
                            variant="default"
                            placeholder={t("accountHolderNamePlaceholder")}
                            value={formData.accountHolderName}
                            onChange={handleChange("accountHolderName")}
                            className="bodyBg rounded-lg textPrimaryColor"
                            error={errors.accountHolderName}
                        />

                        <Input
                            label={t("bankName")}
                            required
                            fullWidth
                            type="text"
                            variant="default"
                            placeholder={t("bankNamePlaceholder")}
                            value={formData.bankName}
                            onChange={handleChange("bankName")}
                            className="bodyBg rounded-lg textPrimaryColor"
                            error={errors.bankName}
                        />

                        <Input
                            label={t("accountNumber")}
                            required
                            fullWidth
                            type="text"
                            variant="default"
                            placeholder={t("accountNumberPlaceholder")}
                            value={formData.accountNumber}
                            onChange={handleChange("accountNumber")}
                            className="bodyBg rounded-lg textPrimaryColor"
                            error={errors.accountNumber}
                        />

                        <Input
                            label={t("ifscSwiftCode")}
                            required
                            fullWidth
                            type="text"
                            variant="default"
                            placeholder={t("ifscSwiftCodePlaceholder")}
                            value={formData.ifscSwiftCode}
                            onChange={handleChange("ifscSwiftCode")}
                            className="bodyBg rounded-lg textPrimaryColor"
                            error={errors.ifscSwiftCode}
                        />

                        <div className="flex flex-col gap-1">
                            <label className="block text-sm md:text-base requireInput">{t("message")}</label>
                            <textarea
                                rows={4}
                                maxLength={MESSAGE_MAX}
                                placeholder={t("typeMsgHere")}
                                value={formData.message}
                                onChange={handleChange("message")}
                                className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm bodyBg textPrimaryColor outline-none transition-colors focus:ring-1 focus:primaryBorderColor ${errors.message ? "border-red-500" : "border-gray-200"}`}
                            />
                            <div className="flex items-center justify-between">
                                {errors.message
                                    ? <p className="text-xs errorColor">{errors.message}</p>
                                    : <span className="text-xs textSecondaryColor">{t("characterLimit")}: {formData.message.length} / {MESSAGE_MAX}</span>
                                }
                            </div>
                        </div>

                        <Divider width="bleed" />

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="text"
                                size="md"
                                onClick={() => handleOpenChange(false)}
                            >
                                {t("cancel")}
                            </Button>
                            <Button
                                type="submit"
                                variant="secondary"
                                size="md"
                                loading={loading || isLoading}
                            >
                                {t("submitBankDetails")}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default BankDetailsModal
