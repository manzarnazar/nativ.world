
'use client'
import { Typography } from '../Typography'
import ImagePreview from '../ImagePreview'
import { GalleryContentProps } from './GalleryContent.type'
import { useState } from 'react'

const GalleryContent: React.FC<GalleryContentProps> = ({ label, galleryImg = [], id, onImageClick }) => {
    const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});

    return (
        <div className="space-y-6" id={id}>
            <div className="bodyBg p-4 rounded-2xl">
                <Typography variant="h4" weight="semibold" children={label} className='first-letter:capitalize'/>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:commonGap">
                {galleryImg.map((item, index) => (
                    <div
                        key={item.id}
                        className="cursor-pointer relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
                        onClick={() => onImageClick?.(index)}
                    >
                        {!loadedMap[index] && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl" />
                        )}
                        <ImagePreview
                            src={item.url}
                            alt={`gallery-${item.id}`}
                            rounded="2xl"
                            objectFit="cover"
                            onLoad={() => setLoadedMap(prev => ({ ...prev, [index]: true }))}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GalleryContent
