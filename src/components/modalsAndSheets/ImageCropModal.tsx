'use client'

import { useState, useCallback } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { PiArrowCounterClockwise } from 'react-icons/pi'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/storyBook/atoms/Button'
import Divider from '@/components/storyBook/atoms/Divider'
import { useIsMobile } from '@/hooks/useMobile'
import { useTranslation } from '@/hooks/useTranslation'

interface ImageCropModalProps {
    open: boolean
    imageSrc: string
    onClose: () => void
    onCropDone: (croppedFile: File) => void
}

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image()
        img.addEventListener('load', () => resolve(img))
        img.addEventListener('error', reject)
        img.setAttribute('crossOrigin', 'anonymous')
        img.src = url
    })

async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext('2d')!

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        400,
        400,
    )

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('Empty canvas'))),
            'image/jpeg',
            0.92,
        )
    })
}

const sliderCls = `appearance-none bg-transparent cursor-pointer h-5
    [&::-webkit-slider-runnable-track]:h-5
    [&::-webkit-slider-runnable-track]:bg-transparent
    [&::-webkit-slider-runnable-track]:border-0
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-white
    [&::-webkit-slider-thumb]:shadow-md
    [&::-webkit-slider-thumb]:mt-[2px]
    [&::-moz-range-track]:h-5
    [&::-moz-range-track]:bg-transparent
    [&::-moz-range-track]:border-0
    [&::-moz-range-thumb]:w-4
    [&::-moz-range-thumb]:h-4
    [&::-moz-range-thumb]:rounded-full
    [&::-moz-range-thumb]:bg-white
    [&::-moz-range-thumb]:border-0
    [&::-moz-range-thumb]:shadow-md`

const ImageCropModal = ({ open, imageSrc, onClose, onCropDone }: ImageCropModalProps) => {
    const { t } = useTranslation()
    const isMobile = useIsMobile()

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
    const [loading, setLoading] = useState(false)

    const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
        setCroppedAreaPixels(areaPixels)
    }, [])

    const handleReset = () => {
        setCrop({ x: 0, y: 0 })
        setZoom(1)
    }

    const handleDone = async () => {
        if (!croppedAreaPixels) return
        try {
            setLoading(true)
            const blob = await getCroppedBlob(imageSrc, croppedAreaPixels)
            const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
            onCropDone(file)
        } catch {
            // silent
        } finally {
            setLoading(false)
        }
    }

    const cropAreaHeight = isMobile ? undefined : 340

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
            <DialogContent
                className={`flex flex-col gap-0 p-0 overflow-hidden ${
                    isMobile
                        ? 'max-w-full! max-h-full! h-full! rounded-none'
                        : 'max-w-md!'
                }`}
            >
                <DialogHeader className="px-6 pt-5 pb-4 shrink-0">
                    <DialogTitle>{t('cropImage')}</DialogTitle>
                </DialogHeader>

                <Divider width="bleed" />

                {/* Crop canvas */}
                <div
                    className={`relative w-full bg-black overflow-hidden ${isMobile ? 'flex-1' : ''}`}
                    style={cropAreaHeight ? { height: cropAreaHeight } : undefined}
                >
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={true}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />

                    {/* Bottom controls overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-8 pb-3 pointer-events-none">
                        <p className="text-white/50 text-[10px] text-center mb-3 tracking-wide pointer-events-none">
                            {t('dragToReposition')}
                        </p>

                        <div className="pointer-events-auto">
                            <div className="flex items-center gap-2">
                                <span className="text-white/60 text-[11px] w-10 shrink-0">{t('zoom')}</span>

                                <div className="relative flex-1 h-5">
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/40 rounded-full pointer-events-none" />
                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={0.01}
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className={`absolute inset-0 w-full  ${sliderCls}`}
                                    />
                                </div>

                                <span className="text-white/70 text-[11px] w-8 text-right tabular-nums shrink-0">
                                    {zoom.toFixed(1)}×
                                </span>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex items-center gap-1 text-white/70 hover:text-white text-[11px] transition-colors shrink-0"
                                >
                                    <PiArrowCounterClockwise size={13} />
                                    {t('reset')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 flex items-center justify-end gap-3 shrink-0">
                    <Button variant="text" onClick={onClose} className="rounded-full!">
                        {t('cancel')}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleDone}
                        loading={loading}
                        className="rounded-full!"
                    >
                        {t('cropAndSave')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ImageCropModal
