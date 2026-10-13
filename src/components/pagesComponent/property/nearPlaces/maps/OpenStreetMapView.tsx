'use client'

import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FlatPlace, PlacePopup } from './shared'

// ─── Icon builders — mirror PropertyPin/PlacePin markup from GoogleMapView ───

const buildPropertyPinIcon = () =>
    L.divIcon({
        html: `<div style="filter: drop-shadow(0 2px 6px rgba(0,0,0,0.30)); cursor: default;">
      <svg width="33" height="48" viewBox="0 0 33 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.394059 16.2449C0.440106 8.69524 6.13461 2.1083 13.6454 0.790911C22.2153 -0.713951 30.6368 5.02682 32.1922 13.7672C32.6578 16.3817 32.2536 18.8746 31.3736 21.3371C29.895 25.4767 27.828 29.3428 25.6279 33.1378C23.0493 37.5866 20.2506 41.8934 17.3036 46.109C17.2166 46.2307 17.1348 46.3573 17.0376 46.4739C16.6283 46.9451 16.1422 46.9501 15.7636 46.4587C15.4361 46.0381 15.1343 45.5922 14.8324 45.1514C10.8672 39.3752 7.10672 33.4824 3.96016 27.2197C2.65549 24.6154 1.4685 21.9603 0.772672 19.1229C0.542436 18.1804 0.363361 17.2279 0.394059 16.255V16.2449ZM16.4287 5.65005C10.6575 5.55884 5.50018 10.2052 5.51553 16.5185C5.52577 22.3961 10.4682 27.1944 16.4594 27.1691C22.5018 27.1488 27.3266 22.2846 27.301 16.2601C27.2703 10.4281 22.3483 5.61964 16.4338 5.65005H16.4287Z" fill="var(--primary-color, #1A73E8)" />
        <ellipse cx="16.3727" cy="16.5186" rx="11.4606" ry="11.3498" fill="white" />
        <path d="M16.352 21.6153C15.0371 21.6153 13.7222 21.6153 12.4073 21.6153C11.6347 21.6153 11.3635 21.3721 11.3533 20.602C11.338 19.3656 11.3431 18.1293 11.3533 16.8981C11.3533 16.5434 11.3328 16.3103 10.857 16.2799C10.3045 16.2444 10.064 15.6516 10.3659 15.1905C10.4477 15.0639 10.5603 14.9625 10.6677 14.8561C12.3101 13.2246 13.9575 11.5981 15.605 9.97166C16.2087 9.37883 16.5515 9.3687 17.1399 9.95139C18.8027 11.588 20.4553 13.2297 22.1181 14.8663C22.3381 15.0841 22.5325 15.3121 22.5018 15.6466C22.466 16.057 22.2256 16.3255 21.8265 16.3154C21.3916 16.3002 21.3814 16.5181 21.3814 16.8373C21.3916 18.0736 21.3865 19.3099 21.3814 20.5412C21.3814 21.3671 21.1255 21.6153 20.2967 21.6153C18.9818 21.6153 17.6669 21.6153 16.352 21.6153Z" fill="var(--primary-color, #1A73E8)" />
      </svg>
    </div>`,
        className: '',
        iconSize: [33, 48],
        iconAnchor: [16.5, 48],
    })

const buildPlaceIcon = (iconUrl: string, isActive: boolean) => {
    const w = isActive ? 44 : 36
    const tailH = isActive ? 14 : 11
    const totalH = w + tailH
    const cx = w / 2
    const iconSize = isActive ? 22 : 18
    const iconOffset = (w - iconSize) / 2

    return L.divIcon({
        html: `<div style="width:${w}px; height:${totalH}px; position:relative; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.28));">
      <svg width="${w}" height="${totalH}" viewBox="0 0 ${w} ${totalH}" style="position:absolute; top:0; left:0;">
        <circle cx="${cx}" cy="${cx}" r="${cx - 2}" fill="white" stroke="#d1d5db" stroke-width="1.5" />
        <polygon points="${cx - 5},${w - 5} ${cx + 5},${w - 5} ${cx},${totalH}" fill="white" />
      </svg>
      <img src="${iconUrl}" alt="" style="position:absolute; top:${iconOffset}px; left:${iconOffset}px; width:${iconSize}px; height:${iconSize}px; object-fit:contain; z-index: 1000;" />
    </div>`,
        className: 'cursor-pointer select-none',
        iconSize: [w, totalH],
        iconAnchor: [cx, totalH],
        popupAnchor: [0, -60],
    })
}

// ─── Small controller components — react-leaflet has no onLoad/onClick props on MapContainer ───

const MapController: React.FC<{ onLoad: (m: L.Map) => void; onUnmount: () => void }> = ({ onLoad, onUnmount }) => {
    const map = useMap()
    useEffect(() => {
        onLoad(map)
        return () => onUnmount()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map])
    return null
}

const ClickHandler: React.FC<{ onMapClick: () => void }> = ({ onMapClick }) => {
    useMapEvent('click', onMapClick)
    return null
}

// ─── OpenStreetMapView (reusable for normal + fullscreen) ────────────────────

interface OpenStreetMapViewProps {
    center: { lat: number; lng: number }
    places: FlatPlace[]
    activePlace: FlatPlace | null
    onPlaceHover: (place: FlatPlace | null) => void
    onPopupClose: () => void
    onMapClick: () => void
    onLoad: (m: L.Map) => void
    onUnmount: () => void
}

const OpenStreetMapView: React.FC<OpenStreetMapViewProps> = ({ center, places, activePlace, onPlaceHover, onPopupClose, onMapClick, onLoad, onUnmount }) => {
    const markerRefs = useRef<Record<number, L.Marker | null>>({})
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const cancelHide = () => {
        if (hideTimer.current) clearTimeout(hideTimer.current)
    }

    const scheduleHide = () => {
        cancelHide()
        hideTimer.current = setTimeout(() => {
            onPlaceHover(null)
        }, 80)
    }

    useEffect(() => {
        if (activePlace == null) {
            Object.values(markerRefs.current).forEach(m => m?.closePopup())
            return
        }
        markerRefs.current[activePlace.id]?.openPopup()
    }, [activePlace])

    return (
        <MapContainer
            center={[center.lat, center.lng]}
            zoom={12}
            zoomControl={false}
            scrollWheelZoom
            className="w-full h-full"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController onLoad={onLoad} onUnmount={onUnmount} />
            <ClickHandler onMapClick={onMapClick} />

            <Marker position={[center.lat, center.lng]} icon={buildPropertyPinIcon()} interactive={false} zIndexOffset={500} />

            {places.map(place => {
                const isActive = activePlace?.id === place.id
                return (
                    <Marker
                        key={place.id}
                        ref={(marker) => {
                            markerRefs.current[place.id] = marker
                        }}
                        position={[parseFloat(place.latitude), parseFloat(place.longitude)]}
                        icon={buildPlaceIcon(place.categoryIcon, isActive)}
                        zIndexOffset={isActive ? 100 : 1}
                        eventHandlers={{
                            mouseover: () => {
                                cancelHide()
                                onPlaceHover(place)
                            },
                            mouseout: () => scheduleHide(),
                        }}
                    >
                        <Popup className="place-map-popup" closeButton={false} autoPan={false}>
                            <div onMouseEnter={cancelHide} onMouseLeave={() => scheduleHide()}>
                                <PlacePopup place={place} onClose={onPopupClose} />
                            </div>
                        </Popup>
                    </Marker>
                )
            })}
        </MapContainer>
    )
}

export default OpenStreetMapView
