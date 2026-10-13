'use client'

import React, { useEffect, useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IoClose } from 'react-icons/io5'
import { PiArrowLeft, PiArrowRight } from 'react-icons/pi'
import { useIsMobile } from '@/hooks/useMobile'
import { GalleryGroup } from '@/hooks/queries/usePropertyDetails'

export interface LightBoxImage {
    src: string
    alt: string
    media_type?: string
}

interface LightBoxProps {
    images: LightBoxImage[]
    isOpen: boolean
    currentIndex: number
    onClose: () => void
    onIndexChange: (index: number) => void
    // category-aware props (optional — used from GalleryModal)
    groups?: GalleryGroup[]
    activeGroupId?: string
    onGroupChange?: (groupId: string, imageIndex: number) => void
}

const ALL_ID = '__all__'

const LightBox: React.FC<LightBoxProps> = ({
    images,
    isOpen,
    currentIndex,
    onClose,
    onIndexChange,
    groups,
    activeGroupId,
    onGroupChange,
}) => {
    const isMobile = useIsMobile()
    const canPrev = currentIndex > 0
    const canNext = currentIndex + 1 < images.length
    const thumbRef = useRef<HTMLDivElement>(null)
    const catRef = useRef<HTMLDivElement>(null)
    const touchStartX = useRef<number | null>(null)
    const [fading, setFading] = useState(false)

    const changeIndex = useCallback((next: number) => {
        if (next === currentIndex) return
        setFading(true)
        setTimeout(() => { onIndexChange(next); setFading(false) }, 180)
    }, [currentIndex, onIndexChange])

    const gotoPrevious = useCallback(() => { if (canPrev) changeIndex(currentIndex - 1) }, [canPrev, currentIndex, changeIndex])
    const gotoNext = useCallback(() => { if (canNext) changeIndex(currentIndex + 1) }, [canNext, currentIndex, changeIndex])

    // Keyboard nav
    useEffect(() => {
        if (!isOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') gotoPrevious()
            else if (e.key === 'ArrowRight') gotoNext()
            else if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [isOpen, gotoPrevious, gotoNext, onClose])

    // Scroll active thumb into view
    useEffect(() => {
        if (!thumbRef.current) return
        const el = thumbRef.current.children[currentIndex] as HTMLElement
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }, [currentIndex])

    // Scroll active category tab into view
    useEffect(() => {
        if (!catRef.current || !activeGroupId) return
        const tabs = catRef.current.querySelectorAll('[data-cat]')
        tabs.forEach(tab => {
            if ((tab as HTMLElement).dataset.cat === activeGroupId) {
                tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            }
        })
    }, [activeGroupId])

    // Body scroll lock
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen || !images || images.length === 0) return null
    if (typeof document === 'undefined') return null

    const current = images[currentIndex]
    const isVideo = current?.media_type === 'video'

    // Touch swipe
    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (dx > 50) gotoPrevious()
        else if (dx < -50) gotoNext()
        touchStartX.current = null
    }

    // Build category tabs
    const hasCats = groups && groups.length > 0 && onGroupChange
    const allCount = groups?.reduce((s, g) => s + g.images.length, 0) ?? 0
    const cats = hasCats ? [
        { id: ALL_ID, label: 'All Photos', count: allCount },
        ...groups!.map(g => ({ id: g.group, label: g.group, count: g.images.length })),
    ] : []
    const activeCat = activeGroupId ?? ALL_ID

    const glassBtn: React.CSSProperties = {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
        color: '#fff', transition: 'background 0.2s, transform 0.15s', flexShrink: 0,
    }

    return createPortal(
        <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.96)', display: 'flex', flexDirection: 'column' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* ── Header ── */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 20px', height: 60, flexShrink: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)',
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999,
                    padding: '4px 14px', color: '#fff', fontSize: 13, fontWeight: 600,
                }}>
                    {currentIndex + 1} / {images.length}
                </div>
                <button onClick={onClose} aria-label="Close" style={{ ...glassBtn, width: 40, height: 40, fontSize: 20 }}>
                    <IoClose />
                </button>
            </div>

            {/* ── Media area ── */}
            <div
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
                onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
            >
                {canPrev && !isMobile && (
                    <button onClick={gotoPrevious} aria-label="Previous"
                        style={{ ...glassBtn, position: 'absolute', left: 20, zIndex: 10, width: 48, height: 48, fontSize: 22 }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'scale(1.08)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'scale(1)' }}
                    ><PiArrowLeft /></button>
                )}

                <div style={{
                    transition: 'opacity 0.18s ease, transform 0.18s ease',
                    opacity: fading ? 0 : 1, transform: fading ? 'scale(0.97)' : 'scale(1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '100%', padding: isMobile ? '0 12px' : '0 88px',
                }}>
                    {isVideo ? (
                        <video key={current.src} src={current.src} controls autoPlay
                            style={{ maxHeight: isMobile ? '60vh' : '68vh', maxWidth: '100%', objectFit: 'contain', borderRadius: 12 }} />
                    ) : (
                        <img key={current.src} src={current.src} alt={current.alt} draggable={false}
                            style={{ maxHeight: isMobile ? '60vh' : '68vh', maxWidth: '100%', objectFit: 'contain', borderRadius: isMobile ? 8 : 12 }} />
                    )}
                </div>

                {canNext && !isMobile && (
                    <button onClick={gotoNext} aria-label="Next"
                        style={{ ...glassBtn, position: 'absolute', right: 20, zIndex: 10, width: 48, height: 48, fontSize: 22 }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'scale(1.08)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'scale(1)' }}
                    ><PiArrowRight /></button>
                )}
            </div>

            {/* ── Bottom: category tabs + thumbnails ── */}
            <div style={{
                flexShrink: 0, paddingBottom: 16,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            }}>
                {/* Category tabs */}
                {hasCats && (
                    <div style={{ overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 10 }}>
                        <div ref={catRef} style={{ display: 'flex', gap: 6, width: 'max-content', margin: '0 auto', padding: '0 16px' }}>
                            {cats.map(cat => {
                                const isActive = cat.id === activeCat
                                return (
                                    <button
                                        key={cat.id}
                                        data-cat={cat.id}
                                        onClick={() => onGroupChange!(cat.id, 0)}
                                        style={{
                                            flexShrink: 0, padding: '5px 12px', borderRadius: 999,
                                            border: isActive ? '1.5px solid #fff' : '1.5px solid rgba(255,255,255,0.25)',
                                            background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
                                            backdropFilter: 'blur(10px)', color: '#fff', cursor: 'pointer',
                                            fontSize: isMobile ? 11 : 12, fontWeight: isActive ? 700 : 400,
                                            transition: 'all 0.2s', whiteSpace: 'nowrap',
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {cat.label} <span style={{ opacity: 0.7, fontWeight: 400 }}>({cat.count})</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Thumbnail strip */}
                {images.length > 1 && (
                    <div style={{ overflowX: 'auto', scrollbarWidth: 'none', padding: '6px 16px' }}>
                        <div ref={thumbRef} style={{ display: 'flex', gap: 6, width: 'max-content', margin: '0 auto', padding: '4px 2px' }}>
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => changeIndex(i)}
                                    aria-label={`Go to image ${i + 1}`}
                                    style={{
                                        flexShrink: 0,
                                        width: isMobile ? 52 : 64, height: isMobile ? 38 : 48,
                                        borderRadius: 7, overflow: 'hidden', padding: 0, border: 'none',
                                        boxShadow: i === currentIndex ? '0 0 0 2.5px #fff' : '0 0 0 2.5px transparent',
                                        opacity: i === currentIndex ? 1 : 0.45,
                                        transform: i === currentIndex ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'opacity 0.2s, box-shadow 0.2s, transform 0.15s',
                                        cursor: 'pointer', background: '#333',
                                    }}
                                >
                                    {img.media_type === 'video' ? (
                                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                            <video
                                                src={`${img.src}#t=0.1`}
                                                preload="metadata"
                                                playsInline
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                                            />
                                            <div style={{
                                                position: 'absolute', inset: 0, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                background: 'rgba(0,0,0,0.3)',
                                            }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <img src={img.src} alt={img.alt}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}

export default LightBox
