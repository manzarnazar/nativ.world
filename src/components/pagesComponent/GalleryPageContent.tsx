'use client'
import { useMemo, useState } from "react"
import { GalleryGroup } from "@/hooks/queries/usePropertyDetails"
import Divider from "../storyBook/atoms/Divider"
import GalleryContent from "../storyBook/atoms/GalleryContent"
import LightBox, { LightBoxImage } from "../lightBox/LightBox"

const ALL_ID = '__all__'

const GalleryPageContent = ({ galleryImgs = [] }: { galleryImgs?: GalleryGroup[] }) => {

  const [lbOpen, setLbOpen] = useState(false)
  const [lbGroupId, setLbGroupId] = useState<string>(ALL_ID)
  const [lbIndex, setLbIndex] = useState(0)

  const lbImages: LightBoxImage[] = useMemo(() => {
    const group = galleryImgs.find(g => g.group === lbGroupId)
    return group?.images.map(img => ({ src: img.url, alt: img.url, media_type: img.media_type })) ?? []
  }, [lbGroupId, galleryImgs])

  const openLightbox = (groupId: string, localIndex: number) => {
    setLbGroupId(groupId)
    setLbIndex(localIndex)
    setLbOpen(true)
  }

  const handleGroupChange = (groupId: string, imageIndex: number) => {
    setLbGroupId(groupId)
    setLbIndex(imageIndex)
  }

  return (
    <>
      <div className="container space-y-6 md:space-y-12">
        {galleryImgs.map((group, index) => (
          <div key={group.group}>
            <GalleryContent
              label={group.group}
              galleryImg={group.images}
              id={group.group}
              onImageClick={(localIndex) => openLightbox(group.group, localIndex)}
            />
            {index < galleryImgs.length - 1 && <Divider />}
          </div>
        ))}
      </div>

      <LightBox
        images={lbImages}
        isOpen={lbOpen}
        currentIndex={lbIndex}
        onClose={() => setLbOpen(false)}
        onIndexChange={setLbIndex}
        groups={galleryImgs}
        activeGroupId={lbGroupId}
        onGroupChange={handleGroupChange}
      />
    </>
  )
}

export default GalleryPageContent
