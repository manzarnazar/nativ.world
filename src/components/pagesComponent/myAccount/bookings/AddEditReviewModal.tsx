'use client'
import { useState, useCallback, useRef, useEffect } from "react"
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
import { Button } from "@/components/storyBook/atoms/Button"
import Divider from "@/components/storyBook/atoms/Divider"
import { useIsMobile } from "@/hooks/useMobile"
import { PiStarFill, PiXCircleFill, PiBed, PiCalendarBlank, PiCameraFill } from "react-icons/pi"
import { BookingListItem, BookingReview, Image as ReviewImage } from "@/hooks/queries/bookings/useBookingsList"
import { Typography } from "@/components/storyBook/atoms/Typography"
import Image from "next/image"
import { useAddReview } from "@/hooks/queries/bookings/useAddReview"
import { toast } from '@/lib/toast';
import ImagePreview from "@/components/storyBook/atoms/ImagePreview"

const REVIEW_MAX = 500
const MAX_IMAGES = 5

interface ReviewFormData {
    rating: number
    review: string
    images: File[]
}

type ReviewErrors = Partial<Record<"rating" | "review", string>>

interface AddEditReviewModalProps {
    booking: BookingListItem
    nights: number
    existingReview?: BookingReview | null
    onSuccess?: () => void
    triggerLabel?: string,
    setRefetchTrigger: (value: boolean) => void
}

const AddEditReviewModal = ({ booking, nights, existingReview, onSuccess, triggerLabel, setRefetchTrigger }: AddEditReviewModalProps) => {
    const { t } = useTranslation()
    const isMobile = useIsMobile()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(existingReview?.rating ?? 0)
    const [hoverRating, setHoverRating] = useState(0)
    const [review, setReview] = useState(existingReview?.review ?? "")
    const [existingImages, setExistingImages] = useState<ReviewImage[]>(existingReview?.images ?? [])
    const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([])
    const [errors, setErrors] = useState<ReviewErrors>({})

    const isAlreadyEdited = existingReview?.is_edited === true
    const totalImageCount = existingImages.length + newImages.length

    const { mutate: addReview, isPending } = useAddReview()

    const reviewSchema = z.object({
        rating: z.number().min(1, t("ratingRequired")),
        review: z.string().min(10, t("reviewMinLength")).max(REVIEW_MAX, t("messageMaxLength")),
    })

    const validate = useCallback((): boolean => {
        const result = reviewSchema.safeParse({ rating, review })
        if (!result.success) {
            const fieldErrors: ReviewErrors = {}
            result.error.issues.forEach((err) => {
                const field = err.path[0] as "rating" | "review"
                if (!fieldErrors[field]) fieldErrors[field] = err.message
            })
            setErrors(fieldErrors)
            return false
        }
        setErrors({})
        return true
    }, [rating, review])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validate()) return

        addReview(
            {
                booking_number: booking.booking_number,
                rating,
                review,
                images: newImages.map(i => i.file),
                existing_image_ids: existingImages.map(i => i.id),
                isEdit: !!existingReview,
            },
            {
                onSuccess: () => {
                    toast.success(t(existingReview ? "updatedReviewSuccess" : "submitReviewSuccess"))
                    setRefetchTrigger(true)
                    setOpen(false)
                    onSuccess?.()
                    setRating(0)
                    setReview("")
                    setExistingImages([])
                    setNewImages([])
                },
                onError: (error) => {
                    toast.error(error.message)
                },
            }
        )
    }

    const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const remaining = MAX_IMAGES - totalImageCount
        files.slice(0, remaining).forEach(file => {
            const preview = URL.createObjectURL(file)
            setNewImages(prev => [...prev, { file, preview }])
        })
        e.target.value = ""
    }

    const handleRemoveExistingImage = (id: number) => {
        setExistingImages(prev => prev.filter(img => img.id !== id))
    }

    const handleRemoveNewImage = (index: number) => {
        setNewImages(prev => {
            URL.revokeObjectURL(prev[index].preview)
            return prev.filter((_, i) => i !== index)
        })
    }

    useEffect(() => {
        setRating(existingReview?.rating ?? 0)
        setReview(existingReview?.review ?? "")
        setExistingImages(existingReview?.images ?? [])
    }, [existingReview])


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="text" className="primaryColor!" rightIcon={<PiStarFill className="primaryColor! text-lg" />}>
                    {existingReview ? isAlreadyEdited ? t("viewReview") : t("editReview") : t("writeReview")}
                </Button>
            </DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()} className={`overflow-x-hidden overscroll-y-auto ${isMobile ? 'max-w-full! max-h-full! h-full! rounded-none justify-between' : 'max-w-200!'} flex flex-col gap-6 `}>
                <DialogHeader>
                    <DialogTitle>{t("rateYourStay")}</DialogTitle>
                    <DialogDescription>{t("rateYourStayDesc")}</DialogDescription>
                </DialogHeader>

                {/* Property info card */}
                <div className="rounded-xl border bodyBg p-4 flex flex-col gap-3">
                    <Typography variant="desc2" weight="semibold" className="textPrimaryColor!">
                        {booking.property.name}
                    </Typography>
                    <Divider />
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 textSecondaryColor">
                                <PiBed className="text-base shrink-0" />
                                <Typography variant="caption" className="textSecondaryColor!">{t("roomType")}</Typography>
                            </div>
                            <Typography variant="caption" weight="semibold" className="textPrimaryColor!">
                                {booking.room_type_name}
                            </Typography>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 textSecondaryColor">
                                <PiCalendarBlank className="text-base shrink-0" />
                                <Typography variant="caption" className="textSecondaryColor!">{t("yourReservation")}</Typography>
                            </div>
                            <Typography variant="caption" weight="semibold" className="textPrimaryColor!">
                                {nights} {t("nights")}
                            </Typography>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Star rating */}
                    <div className="flex flex-col gap-2">
                        <Typography variant="desc2" weight="semibold" className="textPrimaryColor!">
                            {t("howWasYourStay")}
                        </Typography>
                        <div className="flex items-center gap-6">
                            {[1, 2, 3, 4, 5].map(star => {
                                const filled = star <= (hoverRating || rating)
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => { setRating(star); setErrors(prev => ({ ...prev, rating: undefined })) }}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className={`text-2xl border p-2 rounded-lg ${isAlreadyEdited ? "cursor-not-allowed!" : " transition-transform hover:scale-110 "}`}
                                        disabled={isAlreadyEdited}
                                    >
                                        {filled
                                            ? <PiStarFill className="warningColor" />
                                            : <PiStarFill className="text-gray-400" />
                                        }
                                    </button>
                                )
                            })}
                            {
                                existingReview &&
                                <div className="textPrimaryColor! p-2 rounded-lg warningLightBg flexCenter gap-1 font-medium">

                                    <span className="textSecondaryColor!">{t('youRated')}</span>
                                    <span>|</span>
                                    <span className="textPrimaryColor! font-semibold">{rating}</span>
                                </div>
                            }
                        </div>
                        {errors.rating && <p className="text-xs errorColor">{errors.rating}</p>}
                    </div>

                    {/* Review textarea */}
                    <div className="flex flex-col gap-1">
                        <label className="block text-sm md:text-base requireInput">{t("reviewLabel")}</label>
                        <textarea
                            rows={4}
                            maxLength={REVIEW_MAX}
                            placeholder={t("reviewPlaceholder")}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm bodyBg textPrimaryColor outline-none transition-colors focus:ring-1 focus:primaryBorderColor ${errors.review ? "border-red-500" : "border-gray-200"}`}
                            readOnly={isAlreadyEdited}
                        />
                        <div className="flex items-center justify-between">
                            {errors.review
                                ? <p className="text-xs errorColor">{errors.review}</p>
                                : <span className="text-xs textSecondaryColor">{t("characterLimit")}: {review.length} / {REVIEW_MAX}</span>
                            }
                        </div>
                    </div>

                    {/* Image upload */}
                    <div className="flex flex-wrap gap-2">
                        {existingImages.map((img) => (
                            <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                <ImagePreview src={img.url} alt="" className="object-cover" />
                                {
                                    !isAlreadyEdited &&
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(img.id)}
                                        className="absolute top-0.5 right-0.5 text-red-500 bg-white rounded-full"
                                    >
                                        <PiXCircleFill className="text-lg" />
                                    </button>
                                }
                            </div>
                        ))}
                        {newImages.map((img, i) => (
                            <div key={`new-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                <ImagePreview src={img.preview} alt="" className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveNewImage(i)}
                                    className="absolute top-0.5 right-0.5 text-red-500 bg-white rounded-full"
                                >
                                    <PiXCircleFill className="text-lg" />
                                </button>
                            </div>
                        ))}
                        {totalImageCount < MAX_IMAGES && !isAlreadyEdited && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center textSecondaryColor hover:border-gray-400 transition-colors"
                            >
                                <PiCameraFill className="text-2xl" />
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleAddImages}
                        />
                    </div>
                    {
                        !isAlreadyEdited &&
                        <Divider width="bleed" />
                    }

                    {!existingReview && !isAlreadyEdited ?
                        <div className="flex items-center justify-end gap-3">
                            <Button type="button" variant="text" size="md" onClick={() => setOpen(false)}>
                                {t("cancel")}
                            </Button>
                            <Button type="submit" variant="secondary" size="md" loading={isPending}>
                                {t("submitReview")}
                            </Button>
                        </div>
                        :
                        existingReview && !isAlreadyEdited &&
                        <div className="flex items-center justify-end gap-3">
                            <Button type="button" variant="text" size="md" onClick={() => setOpen(false)}>
                                {t("cancel")}
                            </Button>
                            <Button type="submit" variant="secondary" size="md" loading={isPending}>
                                {t("editReview")}
                            </Button>
                        </div>
                    }

                </form>
            </DialogContent>
        </Dialog >
    )
}

export default AddEditReviewModal
