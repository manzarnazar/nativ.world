'use client'

import React, { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useIsMobile } from '@/hooks/useMobile'
import { NearbyPlacesGroup } from '@/hooks/queries/useNearbyPlaces'
import { useJsApiLoader } from '@react-google-maps/api'
import { PiArrowsIn, PiArrowsOutSimple } from 'react-icons/pi'
import { useTranslation } from '@/hooks/useTranslation'
import { Typography } from '@/components/storyBook/atoms/Typography'
import Divider from '@/components/storyBook/atoms/Divider'
import ImagePreview from '@/components/storyBook/atoms/ImagePreview'
import { FlatPlace, formatDistance } from './maps/shared'
import GoogleMapView from './maps/GoogleMapView'
import type L from 'leaflet'

const OpenStreetMapView = dynamic(() => import('./maps/OpenStreetMapView'), { ssr: false })

interface NearbyPlacesProps {
    placesGroups?: NearbyPlacesGroup[]
    lat?: string | number
    lng?: string | number
    className?: string
}

const INITIAL_VISIBLE = 5

// ─── Main component ──────────────────────────────────────────────────────────

const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ placesGroups, lat, lng, className = '' }) => {

    const { t } = useTranslation();

    const isMobile = useIsMobile()
    const [activePlace, setActivePlace] = useState<FlatPlace | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showAll, setShowAll] = useState(false)

    const mapRef = useRef<google.maps.Map | null>(null)
    const fsMapRef = useRef<google.maps.Map | null>(null)
    const osmMapRef = useRef<L.Map | null>(null)
    const osmFsMapRef = useRef<L.Map | null>(null)

    const showGoogleMap = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_MAPS === 'true';

    const { isLoaded } = useJsApiLoader({ googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY ?? '' })

    const onLoad = useCallback((m: google.maps.Map) => { mapRef.current = m }, [])
    const onUnmount = useCallback(() => { mapRef.current = null }, [])
    const onFsLoad = useCallback((m: google.maps.Map) => { fsMapRef.current = m }, [])
    const onFsUnmount = useCallback(() => { fsMapRef.current = null }, [])
    const onOsmLoad = useCallback((m: L.Map) => { osmMapRef.current = m }, [])
    const onOsmUnmount = useCallback(() => { osmMapRef.current = null }, [])
    const onOsmFsLoad = useCallback((m: L.Map) => { osmFsMapRef.current = m }, [])
    const onOsmFsUnmount = useCallback(() => { osmFsMapRef.current = null }, [])

    if (!placesGroups || placesGroups.length === 0) return null

    const allPlaces: FlatPlace[] = placesGroups.flatMap(group =>
        group.places.map(place => ({
            id: place.id,
            name: place.name,
            distance_km: place.distance_km,
            address: place.address,
            latitude: place.latitude,
            longitude: place.longitude,
            rating: place.rating,
            google_place_id: place.google_place_id,
            categoryName: group.category.name,
            categoryIcon: group.category.icon,
        }))
    )

    const totalExtra = allPlaces.length - INITIAL_VISIBLE
    const visiblePlaces = showAll ? allPlaces : allPlaces.slice(0, INITIAL_VISIBLE)

    const propertyCenter =
        lat && lng ? { lat: parseFloat(String(lat)), lng: parseFloat(String(lng)) } : { lat: 20.5937, lng: 78.9629 }

    const handlePlaceClick = (place: FlatPlace) => {
        setActivePlace(place)
        if (showGoogleMap) {
            const ref = isFullscreen ? fsMapRef.current : mapRef.current
            if (ref) {
                ref.panTo({ lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) })
                ref.setZoom(15)
            }
        } else {
            const ref = isFullscreen ? osmFsMapRef.current : osmMapRef.current
            if (ref) {
                ref.panTo([parseFloat(place.latitude), parseFloat(place.longitude)])
                ref.setZoom(15)
            }
        }
    }

    const handlePlaceHover = (place: FlatPlace | null) => {
        setActivePlace(place)
    }

    const mapSharedProps = {
        center: propertyCenter,
        places: allPlaces,
        activePlace,
        onPlaceHover: handlePlaceHover,
        onPopupClose: () => setActivePlace(null),
        onMapClick: () => setActivePlace(null),
    }

    return (
        <>
            <div className={`bg-white rounded-2xl md:border ${isMobile ? 'container' : ''} overflow-hidden p-4 flex flex-col gap-y-4 items-start w-full ${className}`}>
                <Typography variant="h5" weight="semibold">{t("locationNearPlaces")}</Typography>

                <Divider width='bleed' />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {/* Map */}
                    <div className="rounded-xl overflow-hidden h-72 md:h-full min-h-64 relative">
                        {showGoogleMap ? (
                            isLoaded ? (
                                <>
                                    <GoogleMapView
                                        {...mapSharedProps}
                                        onLoad={onLoad}
                                        onUnmount={onUnmount}
                                    />
                                    {/* Fullscreen button — top right */}
                                    <button
                                        onClick={() => setIsFullscreen(true)}
                                        className="absolute top-3 right-3 z-10 bg-black rounded-full p-2"
                                        title="Fullscreen"
                                    >
                                        <PiArrowsOutSimple className="text-xl text-white" />
                                    </button>
                                </>
                            ) : (
                                <div className="w-full h-full bodyBg animate-pulse rounded-xl" />
                            )
                        ) : (
                            <>
                                <OpenStreetMapView
                                    {...mapSharedProps}
                                    onLoad={onOsmLoad}
                                    onUnmount={onOsmUnmount}
                                />
                                {/* Fullscreen button — top right */}
                                <button
                                    onClick={() => setIsFullscreen(true)}
                                    className="absolute top-3 right-3 z-10 bg-black rounded-full p-2"
                                    title="Fullscreen"
                                >
                                    <PiArrowsOutSimple className="text-xl text-white" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Places list */}
                    <div className="flex flex-col gap-0 bodyBg rounded-2xl p-4">
                        <Typography variant="h6" weight="semibold" className="mb-3">{t("nearbyPlaces")}</Typography>
                        <div className='flex flex-col gap-4'>
                            {visiblePlaces.map(place => {
                                const isActive = activePlace?.id === place.id
                                return (
                                    <button
                                        key={place.id}
                                        onClick={() => handlePlaceClick(place)}
                                        className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-0 w-full text-left transition-colors rounded-lg px-2 -mx-2 bg-white ${isActive ? 'border primaryBorder' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="shrink-0 h-6 w-6 flex items-center justify-center">
                                                <ImagePreview src={place.categoryIcon} alt={place.categoryName} className="h-5 w-5 object-contain" />
                                            </span>
                                            <Typography variant="desc1" weight={isActive ? 'semibold' : 'medium'} className="truncate">
                                                {place.name}
                                            </Typography>
                                        </div>
                                        <Typography variant="desc2" className="textSecondaryColor shrink-0 ml-4">
                                            {formatDistance(place.distance_km)}
                                        </Typography>
                                    </button>
                                )
                            })}
                        </div>

                        {totalExtra > 0 && !showAll && (
                            <button
                               onClick={() => setIsFullscreen(true)}
                                className="mt-2 text-sm font-medium primaryColor text-left"
                            >
                                {t('view')} {totalExtra}+ {t('more')}
                            </button>
                        )}
                        {showAll && (
                            <button
                                onClick={() => setShowAll(false)}
                                className="mt-2 text-sm font-medium primaryColor text-left"
                            >
                                Show Less
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Fullscreen map — full viewport, no modal ── */}
            {isFullscreen && (showGoogleMap ? isLoaded : true) && (
                <div className="fixed inset-0 z-9999">
                    {showGoogleMap ? (
                        <GoogleMapView
                            {...mapSharedProps}
                            onLoad={onFsLoad}
                            onUnmount={onFsUnmount}
                        />
                    ) : (
                        <OpenStreetMapView
                            {...mapSharedProps}
                            onLoad={onOsmFsLoad}
                            onUnmount={onOsmFsUnmount}
                        />
                    )}
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 z-999 bg-white rounded-lg shadow-md p-2 hover:bg-gray-50 transition-colors"
                        title="Exit fullscreen"
                    >
                        <PiArrowsIn className="text-lg text-gray-600" />
                    </button>
                </div>
            )}

        </>
    )
}

export default NearbyPlaces
