'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useSelector } from 'react-redux'
import { Property } from '@/hooks/queries/useProperties'
import ImagePreview from '@/components/storyBook/atoms/ImagePreview'
import { useTranslation } from '@/hooks/useTranslation'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice'
import { Typography } from '@/components/storyBook/atoms/Typography'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface OpenStreetMapProps {
  properties: Property[]
  onClose?: () => void
  hoverPropId?: number | null
}

interface GeoProperty extends Property {
  lat: number
  lng: number
}

// Geographic centre of India — fallback when no property has coordinates
const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629]

const formatPrice = (symbol: string, price: number) => `${symbol}${Math.round(price).toLocaleString()}.00`

// Pill marker — white by default, flips dark + scales up while hovered/active
const buildPriceIcon = (label: string, isActive: boolean) =>
  L.divIcon({
    html: `<div style="
      transform: translate(-50%, -50%) scale(${isActive ? 1.12 : 1});
      background: #1a1a1a;
      color: #FFFF;
      border: 2px solid #1a1a1a;
      border-radius: 20px;
      padding: 5px 12px;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: ${isActive ? '0 4px 16px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.18)'};
      cursor: pointer;
      transition: transform 0.15s, background 0.15s;
      user-select: none;
      width: max-content;
    ">${label}</div>`,
    className: '',
    iconSize: [0, 0],
    // Anchors the popup tail just above the pill's top edge instead of its vertical center
    popupAnchor: [0, -20],
  })

// Recenters/fits the map whenever the set of geocoded properties changes
const FitBounds: React.FC<{ points: GeoProperty[] }> = ({ points }) => {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) return
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14)
      return
    }
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]))
    map.fitBounds(bounds, { padding: [48, 48] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points])

  return null
}

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ properties, onClose, hoverPropId }) => {
  const { t } = useTranslation()
  const langCode = useSelector(currentLangCodeSelector)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const markerRefs = useRef<Record<number, L.Marker | null>>({})

  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }

  const scheduleHide = (propertyId: number) => {
    cancelHide()
    hideTimer.current = setTimeout(() => {
      setHoveredId(prev => (prev === propertyId ? null : prev))
      markerRefs.current[propertyId]?.closePopup()
    }, 80)
  }

  const geoProperties: GeoProperty[] = useMemo(() =>
    (properties ?? [])
      .filter(p => p.latitude && p.longitude && !isNaN(parseFloat(p.latitude)) && !isNaN(parseFloat(p.longitude)))
      .map(p => ({ ...p, lat: parseFloat(p.latitude as string), lng: parseFloat(p.longitude as string) })),
    [properties]
  )

  const handleOpenProperty = (slug: string) => {
    const search = typeof window !== 'undefined' ? window.location.search : ''
    window.open(`/${langCode}/properties/${slug}${search}`, '_blank')
  }

  useEffect(() => {
    if (hoverPropId == null) {
      if (hoveredId != null) markerRefs.current[hoveredId]?.closePopup()
      setHoveredId(null)
      return
    }
    setHoveredId(hoverPropId)
    markerRefs.current[hoverPropId]?.openPopup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverPropId])

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={geoProperties[0] ? [geoProperties[0].lat, geoProperties[0].lng] : DEFAULT_CENTER}
        zoom={geoProperties.length ? 13 : 5}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={geoProperties} />
        {geoProperties.map(property => {
          const isActive = hoveredId == property.id
          return (
            <Marker
              key={property.id}
              ref={(marker) => {
                markerRefs.current[property.id] = marker
              }}
              position={[property.lat, property.lng]}
              icon={buildPriceIcon(formatPrice(property.converted_currency_symbol, property.converted_starting_price), isActive)}
              riseOnHover
              zIndexOffset={isActive ? 1000 : 0}
              eventHandlers={{
                mouseover: (e) => {
                  cancelHide()
                  setHoveredId(property.id)
                  e.target.openPopup()
                },
                mouseout: () => scheduleHide(property.id),
                click: () => handleOpenProperty(property.slug),
              }}
            >
              <Popup className="property-map-popup" closeButton={false} autoPan={false} minWidth={280} maxWidth={300}>
                <div
                  onMouseEnter={cancelHide}
                  onMouseLeave={() => scheduleHide(property.id)}
                >
                  <div className={`border rounded-2xl overflow-hidden bg-white cursor-pointer relative z-50`} onClick={() => handleOpenProperty(property.slug)}>
                    <div className="flex gap-4 p-2 flex-wrap">
                      {/* Image with wishlist overlay */}
                      <div className={`shrink-0 md:w-24 h-full relative propertyImg`}>
                        <ImagePreview
                          src={property?.image}
                          alt={property?.name}
                          objectFit="cover"
                          rounded="2xl"
                          aspectRatio="square"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col gap-3">
                        <div>
                          <Typography variant='caption' className='line-clamp-1 text-sm! first-letter:capitalize' weight='semibold'>
                            {property?.name}
                          </Typography>
                          <Typography variant='caption' className='line-clamp-1 text-sm!'>
                            {`${property?.street_address},${property?.city}`}
                          </Typography>
                        </div>
                        <div className="flex items-baseline gap-1 bodyBg rounded-2xl p-2">
                          <span className={`font-semibold`}>
                            {property?.converted_currency_symbol}{property?.converted_starting_price?.toFixed(2)}
                          </span>
                          <span className="font-medium text-sm textSecondaryColor">/{t('night')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 cursor-pointer lg:hidden" onClick={() => handleOpenProperty(property.slug)}>
                    <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                      <ImagePreview
                        src={property.image}
                        alt={property.name}
                        objectFit="cover"
                        rounded="xl"
                        aspectRatio="square"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
                      <p className="text-[15px] font-bold text-gray-900 leading-tight line-clamp-2">
                        {property.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {[property.city, property.state].filter(Boolean).join(' · ')}
                      </p>
                      <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                        <span className="text-[15px] font-bold text-gray-900">
                          {formatPrice(property.converted_currency_symbol, property.converted_starting_price)}
                        </span>
                        {property.starting_price !== property.converted_starting_price && (
                          <span className="text-xs text-red-400 line-through">
                            {formatPrice(property.currency_symbol, property.starting_price)}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">/{t('night')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      <div className='absolute bottom-30 overflow-x-auto customScrollbar pl-2 z-999999 max-md:block hidden!'>

        <Carousel>
          <CarouselContent>

            {geoProperties.map(property => {
              return (
                <CarouselItem className="basis-[50%]" key={property.id}>
                  <div className={`border rounded-2xl overflow-hidden bg-white cursor-pointer`} onClick={() => handleOpenProperty(property.slug)}>
                    <div className="flex gap-4 p-2 flex-wrap">
                      {/* Image with wishlist overlay */}
                      <div className={`shrink-0 w-24 h-full relative propertyImg`}>
                        <ImagePreview
                          src={property?.image}
                          alt={property?.name}
                          objectFit="cover"
                          rounded="2xl"
                          aspectRatio="square"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col gap-3">
                        <div>
                          <Typography variant='caption' className='line-clamp-1 text-sm! first-letter:capitalize' weight='semibold'>
                            {property?.name}
                          </Typography>
                          <Typography variant='caption' className='line-clamp-1 text-sm!'>
                            {`${property?.street_address},${property?.city}`}
                          </Typography>
                        </div>
                        <div className="flex items-baseline gap-1 bodyBg rounded-2xl p-2">
                          <span className={`font-semibold`}>
                            {property?.converted_currency_symbol}{property?.converted_starting_price?.toFixed(2)}
                          </span>
                          <span className="font-medium text-sm textSecondaryColor">/{t('night')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}

export default OpenStreetMap


