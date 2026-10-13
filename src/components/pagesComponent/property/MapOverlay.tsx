'use client'
import dynamic from 'next/dynamic'
import { Typography } from '@/components/storyBook/atoms/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { PiX, PiXCircleFill } from 'react-icons/pi'
import SidebarFilter from '@/components/storyBook/organisms/SidebarFilter'
import SidebarFilterSheet from '@/components/modalsAndSheets/SidebarFilterShee'
import { SelectOpt } from '@/components/storyBook/atoms/SelectOpt'
import { Button } from '@/components/storyBook/atoms/Button'
import SearchCard from '@/components/storyBook/organisms/searchCard'
import SearchCardSkeleton from '@/components/skeletons/SearchCardSkeleton'
import NoDataFound from '@/components/systemStates/NoDataFound'
import Pagination from '@/components/storyBook/atoms/Pagination'
import { Property, PropertyType } from '@/hooks/queries/useProperties'
import { PropertyRule, PropertyRulePillOption } from '@/hooks/multiModeQueries/useGetPropertyRules'
import { SidebarFilterTypes, sortByOptsType } from '@/types/GlobalTypes'
import Footer from '@/components/layout/Footer'
import { useEffect, useState } from 'react'
import GoogleMap from './maps/GoogleMap'
import { Facility } from '@/api/server/getHomePageContent'

const OpenStreetMap = dynamic(() => import('./maps/OpenStreetMap'), { ssr: false })

interface MapOverlayProps {
    onClose: () => void
    properties: Property[]
    isLoading: boolean
    currentPage: number
    totalPages: number
    totalResults: number
    onPageChange: (page: number) => void
    sidebarFilter: SidebarFilterTypes
    setSidebarFilter: React.Dispatch<React.SetStateAction<SidebarFilterTypes>>
    hasActiveFilters: boolean
    totalFilterCount: number
    clearAllFilters: () => void
    priceMin: number
    priceMax: number
    pricePrefix: string
    amenities: Facility[]
    propertyTypes?: PropertyType[]
    propertyRules?: PropertyRule[]
    sortByOpts: sortByOptsType[]
    sortBy?: string
    setSortBy: (value: string) => void
    countryId: string | number
}

const MapOverlay: React.FC<MapOverlayProps> = ({
    onClose,
    properties,
    isLoading,
    currentPage,
    totalPages,
    totalResults,
    onPageChange,
    sidebarFilter,
    setSidebarFilter,
    hasActiveFilters,
    totalFilterCount,
    clearAllFilters,
    priceMin,
    priceMax,
    pricePrefix,
    amenities,
    propertyTypes,
    propertyRules = [],
    sortByOpts,
    sortBy,
    setSortBy,
    countryId,
}) => {

    const { t } = useTranslation();

    const [hoverPropId, setHoverPropId] = useState<number | null>(null);

    const showGoogleMap = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_MAPS === 'true';

    // One removable chip per selected rule value — multiple_select answers get one chip per picked option
    const ruleChips = Object.entries(sidebarFilter.rules).flatMap(([questionId, value]) => {
        const rule = propertyRules.find(r => String(r.question_id) === questionId);
        if (Array.isArray(value)) {
            return value.map((v) => ({
                key: `${questionId}-${v}`,
                label: (rule?.pill_labels as PropertyRulePillOption[] | undefined)?.find(p => p.value === v)?.label ?? v,
                onRemove: () => setSidebarFilter(prev => {
                    const rules = { ...prev.rules };
                    const remaining = (rules[questionId] as string[]).filter(item => item !== v);
                    if (remaining.length > 0) rules[questionId] = remaining; else delete rules[questionId];
                    return { ...prev, rules };
                }),
            }));
        }
        const label = rule?.type === 'yes_no'
            ? value
            : (rule?.pill_labels as PropertyRulePillOption[] | undefined)?.find(p => p.value === value)?.label ?? value;
        return [{
            key: questionId,
            label,
            onRemove: () => setSidebarFilter(prev => {
                const rules = { ...prev.rules };
                delete rules[questionId];
                return { ...prev, rules };
            }),
        }];
    });

    useEffect(() => {
        // console.log(hoverPropId)
    }, [hoverPropId])


    return (
        <div className='fixed inset-0 z-9999999 bg-white flex flex-col h-screen overflow-auto'>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b shrink-0 bg-white">
                <Typography variant="h5" weight="semibold">{t('showOnMap')}</Typography>
                <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 text-sm font-medium border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                    <PiX className="text-base" />
                    {t('closeMap')}
                </button>
            </div>

            <section className="bg-white pb-2 flex-1">
                <div className="px-2">
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-start">
                        <div className="max-md:hidden max-1199:order-2 col-span-12 min-1200:col-span-7 min-1620:col-span-6! space-y-6">
                            <div className="border-b p-4 hidden md:flex items-center justify-between">
                                <div className="flexCenter gap-4">
                                    <div className="block lg:hidden">
                                        <SidebarFilterSheet sidebarFilter={sidebarFilter} setSidebarFilter={setSidebarFilter} pricePrefix={pricePrefix} hasActiveFilters={hasActiveFilters} clearAll={clearAllFilters} priceMin={priceMin} priceMax={priceMax} amenities={amenities} propertyTypes={propertyTypes} countryId={countryId} />
                                    </div>
                                    <div className="">
                                        <Typography variant="h6" weight="semibold" children={`${t('showing')} ${properties?.length > 0 ? ((currentPage - 1) * 10) + 1 : 0}-${Math.min(currentPage * 10, totalResults)} ${t('of')} ${totalResults} ${t('results')}`} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <SelectOpt
                                        options={sortByOpts}
                                        value={sortBy}
                                        onChange={(v) => setSortBy(v)}
                                        className="w-full [&>.selectTrigger]:py-3! [&>.selectTrigger]:data-[size=default]:h-full!"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-12 commonGap pr-4">

                                <div className="hidden lg:block lg:col-span-4 sticky top-25">
                                    <SidebarFilter sidebarFilter={sidebarFilter} setSidebarFilter={setSidebarFilter} priceMin={priceMin} priceMax={priceMax} amenities={amenities} propertyTypes={propertyTypes} pricePrefix={pricePrefix} countryId={countryId} />
                                </div>

                                <div className='col-span-12 lg:col-span-8'>
                                    <div className="w-full overflow-auto md:hidden">
                                        <div className="flexCenter gap-2 md:hidden w-max overflow-x-auto py-2">
                                            <SidebarFilterSheet sidebarFilter={sidebarFilter} setSidebarFilter={setSidebarFilter} pricePrefix={pricePrefix} hasActiveFilters={hasActiveFilters} clearAll={clearAllFilters} priceMin={priceMin!} priceMax={priceMax!} amenities={amenities} propertyTypes={propertyTypes} countryId={countryId} />
                                            <SelectOpt
                                                options={sortByOpts}
                                                value={sortBy}
                                                onChange={(v) => setSortBy(v)}
                                                placeholder={t('sortBy')}
                                                triggerClassName="w-fit h-9 border-gray-200 rounded-lg bodyBg"
                                            />
                                            {hasActiveFilters && (
                                                <div className="flex items-center gap-2">
                                                    {sidebarFilter.amenities && sidebarFilter.amenities.split(',').filter(Boolean).map(id => (
                                                        <Button
                                                            key={id}
                                                            variant="ghost"
                                                            size="sm"
                                                            children={amenities?.find(f => String(f.id) === id)?.name}
                                                            className="rounded-lg! h-9 w-max text-black!"
                                                            onClick={() => setSidebarFilter(prev => ({
                                                                ...prev,
                                                                amenities: prev.amenities.split(',').filter(a => a !== id).join(','),
                                                            }))}
                                                        />
                                                    ))}
                                                    {sidebarFilter.ratings && sidebarFilter.ratings.split(',').filter(Boolean).map(r => (
                                                        <Button
                                                            key={r}
                                                            variant="ghost"
                                                            size="sm"
                                                            children={`${r} Stars`}
                                                            className="rounded-lg! h-9 w-max text-black!"
                                                            onClick={() => setSidebarFilter(prev => ({
                                                                ...prev,
                                                                ratings: prev.ratings.split(',').filter(s => s !== r).join(','),
                                                            }))}
                                                        />
                                                    ))}
                                                    {sidebarFilter.types && sidebarFilter.types.split(',').filter(Boolean).map(type => (
                                                        <Button
                                                            key={type}
                                                            variant="ghost"
                                                            size="sm"
                                                            children={propertyTypes?.find(p => String(p.id) === type)?.name}
                                                            className="rounded-lg! h-9 w-max text-black!"
                                                            onClick={() => setSidebarFilter(prev => ({
                                                                ...prev,
                                                                types: prev.types.split(',').filter(t => t !== type).join(','),
                                                            }))}
                                                        />
                                                    ))}
                                                    {ruleChips.map(chip => (
                                                        <Button
                                                            key={chip.key}
                                                            variant="ghost"
                                                            size="sm"
                                                            children={chip.label}
                                                            className="rounded-lg! h-9 w-max text-black!"
                                                            onClick={chip.onRemove}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* ================================== sortBy bar with result count  ends here ================= */}

                                    {/* Active filters + clear button */}
                                    {hasActiveFilters && (
                                        <div className="hidden md:flex items-center gap-2 flex-wrap">
                                            {sidebarFilter.amenities && sidebarFilter.amenities.split(',').filter(Boolean).map(id => (
                                                <Button
                                                    key={id}
                                                    variant="ghost"
                                                    size="md"
                                                    children={amenities?.find(f => String(f.id) === id)?.name}
                                                    rightIcon={<PiXCircleFill className="text-xl text-[#555555]" />}
                                                    className="rounded-2xl!"
                                                    onClick={() => setSidebarFilter(prev => ({
                                                        ...prev,
                                                        amenities: prev.amenities.split(',').filter(a => a !== id).join(','),
                                                    }))}
                                                />
                                            ))}
                                            {sidebarFilter.ratings && sidebarFilter.ratings.split(',').filter(Boolean).map(r => (
                                                <Button
                                                    key={r}
                                                    variant="ghost"
                                                    size="md"
                                                    children={`${r} Stars`}
                                                    rightIcon={<PiXCircleFill className="text-xl text-[#555555]" />}
                                                    className="rounded-2xl!"
                                                    onClick={() => setSidebarFilter(prev => ({
                                                        ...prev,
                                                        ratings: prev.ratings.split(',').filter(s => s !== r).join(','),
                                                    }))}
                                                />
                                            ))}
                                            {sidebarFilter.types && sidebarFilter.types.split(',').filter(Boolean).map(type => (
                                                <Button
                                                    key={type}
                                                    variant="ghost"
                                                    size="md"
                                                    children={propertyTypes?.find(p => String(p.id) === type)?.name}
                                                    rightIcon={<PiXCircleFill className="text-xl text-[#555555]" />}
                                                    className="rounded-2xl!"
                                                    onClick={() => setSidebarFilter(prev => ({
                                                        ...prev,
                                                        types: prev.types.split(',').filter(t => t !== type).join(','),
                                                    }))}
                                                />
                                            ))}
                                            {ruleChips.map(chip => (
                                                <Button
                                                    key={chip.key}
                                                    variant="ghost"
                                                    size="md"
                                                    children={chip.label}
                                                    rightIcon={<PiXCircleFill className="text-xl text-[#555555]" />}
                                                    className="rounded-2xl!"
                                                    onClick={chip.onRemove}
                                                />
                                            ))}
                                            {totalFilterCount > 5 && (
                                                <Button
                                                    onClick={clearAllFilters}
                                                    variant="ghost"
                                                    size="md"
                                                    children={t('clearAll')}
                                                    rightIcon={<PiXCircleFill className="text-xl" />}
                                                    className="rounded-2xl! errorColor!"
                                                />
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        {
                                            isLoading ?
                                                Array.from({ length: 6 }).map((_, index) => (
                                                    <SearchCardSkeleton key={index} />
                                                ))
                                                :
                                                properties?.length > 0 ?
                                                    properties?.map((item) => (
                                                        <div key={item?.id} onMouseEnter={() => setHoverPropId(item?.id)} onMouseLeave={() => setHoverPropId(null)}>
                                                            <SearchCard
                                                                item={item}
                                                                className={`[&_.propertyCard]:between-992-1199:flex-col [&_.propertyCard]:between-1200-1399:flex-col [&_.propertyImg]:between-992-1199:w-full! [&_.propertyImg]:between-992-1199:h-62.5! [&_.propertyImg]:between-1200-1399:w-full! [&_.propertyImg]:max-md:h-62.5! [&_.propertyImg]:between-1200-1399:h-62.5! [&_.propertyImg]:md:w-48! [&_.propertyImg]:h-full! [&_.propertyImg]:aspect-square [&_.amenitiesDiv]:hidden [&_button]:hidden`}
                                                            />
                                                        </div>
                                                    ))
                                                    :
                                                    !isLoading &&
                                                    <NoDataFound />
                                        }
                                    </div>
                                    {totalPages > 1 && (
                                        <Pagination
                                            totalPages={totalPages}
                                            currentPage={currentPage}
                                            onPageChange={onPageChange}
                                            siblingCount={1}
                                            className="mt-8 justify-center"
                                        />
                                    )}
                                </div>
                            </div>



                        </div>

                        <div className="max-1199:order-1 between-992-1199:h-100! col-span-12 min-1200:col-span-5 min-1620:col-span-6! max-md:h-screen max-md:my-4 h-100 lg:h-[calc(100vh-60px)] min-1200:sticky lg:top-0 overflow-hidden">
                            {
                                showGoogleMap ?
                                    <GoogleMap
                                        properties={properties}
                                        onClose={onClose}
                                        hoverPropId={hoverPropId}
                                    />
                                    :
                                    <OpenStreetMap
                                        properties={properties}
                                        onClose={onClose}
                                        hoverPropId={hoverPropId}
                                    />
                            }
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default MapOverlay
