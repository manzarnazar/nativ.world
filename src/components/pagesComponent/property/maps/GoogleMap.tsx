'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  InfoWindow,
} from '@vis.gl/react-google-maps'
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

interface GoogleMapProps {
  properties: Property[]
  onClose?: () => void
  hoverPropId?: number | null
}

interface GeoProperty extends Property {
  lat: number
  lng: number
}

// Geographic centre of India — fallback when no property has coordinates
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }

const formatPrice = (symbol: string, price: number) => `${symbol}${Math.round(price).toLocaleString()}.00`

// Recenters/fits the map whenever the set of geocoded properties changes
const FitBounds: React.FC<{ points: GeoProperty[] }> = ({ points }) => {
  const map = useMap()

  useEffect(() => {
    if (!map || points.length === 0) return
    if (points.length === 1) {
      map.setCenter({ lat: points[0].lat, lng: points[0].lng })
      map.setZoom(14)
      return
    }
    const bounds = new google.maps.LatLngBounds()
    points.forEach(p => bounds.extend({ lat: p.lat, lng: p.lng }))
    map.fitBounds(bounds, 48)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, points])

  return null
}

const GoogleMap: React.FC<GoogleMapProps> = ({ properties, onClose, hoverPropId }) => {
  const { t } = useTranslation()
  const langCode = useSelector(currentLangCodeSelector)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelHide = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
  }

  const scheduleHide = (propertyId: number) => {
    cancelHide()
    hideTimer.current = setTimeout(() => {
      setHoveredId(prev => (prev === propertyId ? null : prev))
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
    setHoveredId(hoverPropId!)
  }, [hoverPropId])

  const hoveredProperty = geoProperties.find(p => p.id === hoveredId) ?? null

  return (
    <div className="relative w-full h-full">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_MAP_API_KEY!}>
        <Map
          defaultCenter={geoProperties[0] ? { lat: geoProperties[0].lat, lng: geoProperties[0].lng } : DEFAULT_CENTER}
          defaultZoom={geoProperties.length ? 13 : 5}
          mapId="estay-map"
          style={{ width: '100%', height: '100%' }}
          gestureHandling="greedy"
          disableDefaultUI
        >
          <FitBounds points={geoProperties} />
          {geoProperties.map(property => {
            const isActive = hoveredId == property.id
            return (
              <AdvancedMarker
                key={property.id}
                position={{ lat: property.lat, lng: property.lng }}
                zIndex={isActive ? 1000 : 0}
                onClick={() => handleOpenProperty(property.slug)}
              >
                <div
                  onMouseEnter={() => {
                    cancelHide()
                    setHoveredId(property.id)
                  }}
                  onMouseLeave={() => scheduleHide(property.id)}
                  style={{
                    transform: `scale(${isActive ? 1.12 : 1})`,
                    background: '#1a1a1a',
                    color: '#FFFF',
                    border: '2px solid #1a1a1a',
                    borderRadius: '20px',
                    padding: '5px 12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 4px 16px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.18)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, background 0.15s',
                    userSelect: 'none',
                    width: 'max-content',
                  }}
                >
                  {formatPrice(property.converted_currency_symbol, property.converted_starting_price)}
                </div>
              </AdvancedMarker>
            )
          })}
          {hoveredProperty && (
            <InfoWindow
              position={{ lat: hoveredProperty.lat, lng: hoveredProperty.lng }}
              pixelOffset={[0, -20]}
              disableAutoPan
              headerDisabled
            >
              <div
                onMouseEnter={cancelHide}
                onMouseLeave={() => scheduleHide(hoveredProperty.id)}
                style={{ minWidth: 280, maxWidth: 300 }}
              >
                <div className={`rounded-2xl overflow-hidden bg-white cursor-pointer relative z-50`} onClick={() => handleOpenProperty(hoveredProperty.slug)}>
                  <div className="flex gap-4 flex-wrap">
                    {/* Image with wishlist overlay */}
                    <div className={`shrink-0 md:w-24 h-full relative propertyImg`}>
                      <ImagePreview
                        src={hoveredProperty?.image}
                        alt={hoveredProperty?.name}
                        objectFit="cover"
                        rounded="2xl"
                        aspectRatio="square"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col gap-3">
                      <div>
                        <Typography variant='caption' className='line-clamp-1 text-sm! first-letter:capitalize' weight='semibold'>
                          {hoveredProperty?.name}
                        </Typography>
                        <Typography variant='caption' className='line-clamp-1 text-sm!'>
                          {`${hoveredProperty?.street_address},${hoveredProperty?.city}`}
                        </Typography>
                      </div>
                      <div className="flex items-baseline gap-1 bodyBg rounded-2xl p-2">
                        <span className={`font-semibold`}>
                          {hoveredProperty?.converted_currency_symbol}{hoveredProperty?.converted_starting_price?.toFixed(2)}
                        </span>
                        <span className="font-medium text-sm textSecondaryColor">/{t('night')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 p-3 cursor-pointer lg:hidden" onClick={() => handleOpenProperty(hoveredProperty.slug)}>
                  <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                    <ImagePreview
                      src={hoveredProperty.image}
                      alt={hoveredProperty.name}
                      objectFit="cover"
                      rounded="xl"
                      aspectRatio="square"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-1 min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-gray-900 leading-tight line-clamp-2">
                      {hoveredProperty.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {[hoveredProperty.city, hoveredProperty.state].filter(Boolean).join(' · ')}
                    </p>
                    <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
                      <span className="text-[15px] font-bold text-gray-900">
                        {formatPrice(hoveredProperty.converted_currency_symbol, hoveredProperty.converted_starting_price)}
                      </span>
                      {hoveredProperty.starting_price !== hoveredProperty.converted_starting_price && (
                        <span className="text-xs text-red-400 line-through">
                          {formatPrice(hoveredProperty.currency_symbol, hoveredProperty.starting_price)}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">/{t('night')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
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

export default GoogleMap
