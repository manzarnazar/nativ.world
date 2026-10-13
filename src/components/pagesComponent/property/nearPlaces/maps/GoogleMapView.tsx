'use client'

import React, { useCallback } from 'react'
import { GoogleMap, OverlayViewF, OVERLAY_MOUSE_TARGET } from '@react-google-maps/api'
import { FlatPlace, PlacePopup } from './shared'

const mapContainerStyle = { width: '100%', height: '100%' }

const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    scrollwheel: true,
    styles: [
        { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ visibility: 'on' }] },
        { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    ],
}

const getPinOffset = (w: number, h: number) => ({ x: -(w / 2), y: -h })
const getPopupOffset = (_w: number, _h: number) => ({ x: -(_w / 2), y: -(_h + 60) })
const getPropertyPinOffset = (w: number, h: number) => ({ x: -(w / 2), y: -h })

// ─── PropertyPin ────────────────────────────────────────────────────────────

const PropertyPin: React.FC = () => (
    <div style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.30))', cursor: 'default' }}>
        <svg width="33" height="48" viewBox="0 0 33 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_8674_44538)">
                <path d="M0.394059 16.2449C0.440106 8.69524 6.13461 2.1083 13.6454 0.790911C22.2153 -0.713951 30.6368 5.02682 32.1922 13.7672C32.6578 16.3817 32.2536 18.8746 31.3736 21.3371C29.895 25.4767 27.828 29.3428 25.6279 33.1378C23.0493 37.5866 20.2506 41.8934 17.3036 46.109C17.2166 46.2307 17.1348 46.3573 17.0376 46.4739C16.6283 46.9451 16.1422 46.9501 15.7636 46.4587C15.4361 46.0381 15.1343 45.5922 14.8324 45.1514C10.8672 39.3752 7.10672 33.4824 3.96016 27.2197C2.65549 24.6154 1.4685 21.9603 0.772672 19.1229C0.542436 18.1804 0.363361 17.2279 0.394059 16.255V16.2449ZM16.4287 5.65005C10.6575 5.55884 5.50018 10.2052 5.51553 16.5185C5.52577 22.3961 10.4682 27.1944 16.4594 27.1691C22.5018 27.1488 27.3266 22.2846 27.301 16.2601C27.2703 10.4281 22.3483 5.61964 16.4338 5.65005H16.4287Z" fill="var(--primary-color, #1A73E8)" />
                <ellipse cx="16.3727" cy="16.5186" rx="11.4606" ry="11.3498" fill="white" />
                <path d="M16.352 21.6153C15.0371 21.6153 13.7222 21.6153 12.4073 21.6153C11.6347 21.6153 11.3635 21.3721 11.3533 20.602C11.338 19.3656 11.3431 18.1293 11.3533 16.8981C11.3533 16.5434 11.3328 16.3103 10.857 16.2799C10.3045 16.2444 10.064 15.6516 10.3659 15.1905C10.4477 15.0639 10.5603 14.9625 10.6677 14.8561C12.3101 13.2246 13.9575 11.5981 15.605 9.97166C16.2087 9.37883 16.5515 9.3687 17.1399 9.95139C18.8027 11.588 20.4553 13.2297 22.1181 14.8663C22.3381 15.0841 22.5325 15.3121 22.5018 15.6466C22.466 16.057 22.2256 16.3255 21.8265 16.3154C21.3916 16.3002 21.3814 16.5181 21.3814 16.8373C21.3916 18.0736 21.3865 19.3099 21.3814 20.5412C21.3814 21.3671 21.1255 21.6153 20.2967 21.6153C18.9818 21.6153 17.6669 21.6153 16.352 21.6153Z" fill="var(--primary-color, #1A73E8)" />
            </g>
            <defs>
                <clipPath id="clip0_8674_44538">
                    <rect width="32.7447" height="47.6286" fill="white" />
                </clipPath>
            </defs>
        </svg>
    </div>
)

// ─── PlacePin ───────────────────────────────────────────────────────────────

interface PlacePinProps {
    iconUrl: string
    isActive: boolean
    onHover: (hovered: boolean) => void
}

const PlacePin: React.FC<PlacePinProps> = ({ iconUrl, isActive, onHover }) => {
    const w = isActive ? 44 : 36
    const tailH = isActive ? 14 : 11
    const totalH = w + tailH
    const cx = w / 2
    const iconSize = isActive ? 22 : 18
    const iconOffset = (w - iconSize) / 2

    return (
        <div
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            className="cursor-pointer select-none"
            style={{ width: w, height: totalH, position: 'relative', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.28))' }}
        >
            <svg width={w} height={totalH} viewBox={`0 0 ${w} ${totalH}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                <circle cx={cx} cy={cx} r={cx - 2} fill="white" stroke="#d1d5db" strokeWidth="1.5" />
                <polygon points={`${cx - 5},${w - 5} ${cx + 5},${w - 5} ${cx},${totalH}`} fill="white" />
            </svg>
            <img src={iconUrl} alt="" style={{ position: 'absolute', top: iconOffset, left: iconOffset, width: iconSize, height: iconSize, objectFit: 'contain' }} />
        </div>
    )
}

// ─── GoogleMapView (reusable for normal + fullscreen) ────────────────────────

interface GoogleMapViewProps {
    center: google.maps.LatLngLiteral
    places: FlatPlace[]
    activePlace: FlatPlace | null
    onPlaceHover: (place: FlatPlace | null) => void
    onPopupClose: () => void
    onMapClick: () => void
    onLoad: (m: google.maps.Map) => void
    onUnmount: () => void
}

const GoogleMapView: React.FC<GoogleMapViewProps> = ({ center, places, activePlace, onPlaceHover, onPopupClose, onMapClick, onLoad, onUnmount }) => {
    // Set initial center once on load — never re-center on re-renders
    const handleLoad = useCallback((m: google.maps.Map) => {
        m.setCenter(center)
        m.setZoom(12)
        onLoad(m)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            options={mapOptions}
            onLoad={handleLoad}
            onUnmount={onUnmount}
            onClick={onMapClick}
        >
            <OverlayViewF position={center} mapPaneName={OVERLAY_MOUSE_TARGET} getPixelPositionOffset={getPropertyPinOffset} zIndex={500}>
                <PropertyPin />
            </OverlayViewF>
            {places.map(place => {
                const pos = { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) }
                const isActive = activePlace?.id === place.id
                return (
                    <OverlayViewF key={place.id} position={pos} mapPaneName={OVERLAY_MOUSE_TARGET} getPixelPositionOffset={getPinOffset} zIndex={isActive ? 100 : 1}>
                        <PlacePin iconUrl={place.categoryIcon} isActive={isActive} onHover={hovered => onPlaceHover(hovered ? place : null)} />
                    </OverlayViewF>
                )
            })}
            {activePlace && (
                <OverlayViewF
                    position={{ lat: parseFloat(activePlace.latitude), lng: parseFloat(activePlace.longitude) }}
                    mapPaneName={OVERLAY_MOUSE_TARGET}
                    getPixelPositionOffset={getPopupOffset}
                    zIndex={999}
                >
                    <div style={{ position: 'relative', zIndex: 999 }}>
                        <PlacePopup place={activePlace} onClose={onPopupClose} />
                    </div>
                </OverlayViewF>
            )}
        </GoogleMap>
    )
}

export default GoogleMapView
