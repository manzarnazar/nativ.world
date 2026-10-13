import React from 'react'
import { PiArrowUpRight, PiStar, PiX } from 'react-icons/pi'

export interface FlatPlace {
    id: number
    name: string
    distance_km: string
    address: string
    latitude: string
    longitude: string
    rating: string
    google_place_id: string
    categoryName: string
    categoryIcon: string
}

export function formatDistance(km: string): string {
    const val = parseFloat(km)
    if (val < 1) return `${Math.round(val * 1000)} M`
    return `${val.toFixed(1)} KM`
}

interface PlacePopupProps {
    place: FlatPlace
    onClose: () => void
}

export const PlacePopup: React.FC<PlacePopupProps> = ({ place, onClose }) => (
    <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', padding: '12px 14px', width: 220, position: 'relative', pointerEvents: 'all' }}>
        <button onClick={e => { e.stopPropagation(); onClose() }} style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', lineHeight: 1 }}>
            <PiX size={16} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <img src={place.categoryIcon} alt={place.categoryName} style={{ width: 16, height: 16, objectFit: 'contain' }} />
            <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 500 }}>{place.categoryName}</span>
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4, lineHeight: 1.3, paddingRight: 16 }}>{place.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#6b7280' }}>{formatDistance(place.distance_km)}</span>
            {place.rating && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#6b7280' }}>
                    <PiStar style={{ color: '#f59e0b' }} />{place.rating}
                </span>
            )}
        </div>
        <a
            href={`https://www.google.com/maps/place/?q=place_id:${place.google_place_id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--primary-color, #1A73E8)', textDecoration: 'none' }}
        >
            View on Google Maps <PiArrowUpRight size={13} />
        </a>
        <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '9px solid white', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.08))' }} />
    </div>
)
