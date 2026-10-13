'use client';

import React, { useEffect } from 'react';
import FilterTitle from '@/components/storyBook/atoms/FilterTitle';
import Range from '@/components/storyBook/atoms/Range';
import Checkbox from '@/components/storyBook/atoms/Checkbox';
import StarRatings from '@/components/storyBook/atoms/startRatings';
import { SidebarFilterProps } from './SidebarFilter.type';
import { useTranslation } from '@/hooks/useTranslation';
import { isSingleHotelBranch } from '@/utils/helpers';
import { Typography } from '../../atoms/Typography';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { businessModeSelector } from '@/redux/reducers/settingsSlice';
import { BasicDetails } from '@/hooks/queries/useSettings';
import { PropertyRule, PropertyRulePillOption, useGetPropertyRules } from '@/hooks/multiModeQueries/useGetPropertyRules';

const STAR_OPTIONS = [5, 4, 3, 2, 1] as const;
const ITEMS_PER_STEP = 5;

const SidebarFilter: React.FC<SidebarFilterProps> = ({
    className = '',
    sidebarFilter,
    setSidebarFilter,
    priceMin = 0,
    priceMax = 1250,
    priceStep = 1,
    pricePrefix = '$',
    amenities,
    propertyTypes,
    countryId
}) => {

    const { t } = useTranslation();
    const businessMode = useSelector(businessModeSelector) as BasicDetails;
    const isMultiMode = businessMode?.business_mode === 'multi';

    /* ── Derived values from shared state ── */
    const minPrice = sidebarFilter.minPrice ? Number(sidebarFilter.minPrice) : priceMin;
    const maxPrice = sidebarFilter.maxPrice ? Number(sidebarFilter.maxPrice) : priceMax;
    const currentPrice: [number, number] = [minPrice, maxPrice];
    const pathname = usePathname();

    const [localPrice, setLocalPrice] = React.useState<[number, number]>(currentPrice);

    // Track visible count per filter independently using filter id as key
    const [visibleCounts, setVisibleCounts] = React.useState<Record<string, number>>({});

    React.useEffect(() => {
        setLocalPrice(currentPrice);
    }, [currentPrice[0], currentPrice[1]]);

    const getVisibleCount = (filterId: string) => visibleCounts[filterId] ?? ITEMS_PER_STEP;

    const handleShowMore = (filterId: string, totalCount: number) => {
        setVisibleCounts(prev => ({ ...prev, [filterId]: totalCount }));
    };

    const handleShowLess = (filterId: string) => {
        setVisibleCounts(prev => ({ ...prev, [filterId]: ITEMS_PER_STEP }));
    };

    const currentAmenities = new Set(
        sidebarFilter.amenities ? sidebarFilter.amenities.split(',').filter(Boolean).map(Number) : []
    );

    const currentTypes = new Set(
        sidebarFilter.types ? sidebarFilter.types.split(',').filter(Boolean).map(Number) : []
    );

    const currentStars = new Set(
        sidebarFilter.ratings
            ? sidebarFilter.ratings.split(',').filter(Boolean).map(Number)
            : []
    );

    /* ── Handlers ── */
    const handleLocalPriceChange = (val: [number, number]) => setLocalPrice(val);

    const handlePriceChangeEnd = (val: [number, number]) => {
        setSidebarFilter(prev => ({
            ...prev,
            minPrice: String(val[0]),
            maxPrice: String(val[1]),
        }));
    };

    const handleAmenityChange = (id: string | number, checked: boolean) => {
        const numId = Number(id);
        setSidebarFilter(prev => {
            const existing = new Set(
                prev.amenities ? prev.amenities.split(',').filter(Boolean).map(Number) : []
            );
            checked ? existing.add(numId) : existing.delete(numId);
            return { ...prev, amenities: Array.from(existing).join(',') };
        });
    };

    const handleTypeChange = (id: string | number, checked: boolean) => {
        const numId = Number(id);
        setSidebarFilter(prev => {
            const existing = new Set(
                prev.types ? prev.types.split(',').filter(Boolean).map(Number) : []
            );
            checked ? existing.add(numId) : existing.delete(numId);
            return { ...prev, types: Array.from(existing).join(','), rules: {} };
        });
    };

    const handleRuleChange = (questionId: number, value: string, type: PropertyRule['type'], checked?: boolean) => {
        const key = String(questionId);
        setSidebarFilter(prev => {
            const rules = { ...prev.rules };
            if (type === 'multiple_select') {
                const existing = new Set(Array.isArray(rules[key]) ? rules[key] as string[] : []);
                checked ? existing.add(value) : existing.delete(value);
                if (existing.size > 0) {
                    rules[key] = Array.from(existing);
                } else {
                    delete rules[key];
                }
            } else {
                // yes_no / single_select — single value per question, re-clicking the same value clears it
                if (rules[key] === value) {
                    delete rules[key];
                } else {
                    rules[key] = value;
                }
            }
            return { ...prev, rules };
        });
    };

    const handleStarChange = (stars: 1 | 2 | 3 | 4 | 5, checked: boolean) => {
        setSidebarFilter(prev => {
            const existing = new Set(
                prev.ratings ? prev.ratings.split(',').filter(Boolean).map(Number) : []
            );
            checked ? existing.add(stars) : existing.delete(stars);
            return { ...prev, ratings: Array.from(existing).join(',') };
        });
    };



    const { data: propertyRules, isLoading: rulesLoading, error: rulesError } = useGetPropertyRules({
        country_id: Number(countryId),
        property_type_id: currentTypes.size > 0 ? Array.from(currentTypes).join(',') : (propertyTypes ?? []).map((pt) => pt.id).join(','),
    }, isMultiMode && !!countryId && (propertyTypes?.length ?? 0) > 0);  // only fetch

    useEffect(() => {
        if (rulesError) {
            console.log('error fetching prop-rules', rulesError)
        }
    }, [rulesError]);


    const filtersList = [
        {
            id: 'amenities',
            title: t("amenities"),
            items: amenities,
            currentSet: currentAmenities,
            onChange: handleAmenityChange,
            prefix: 'amenity',
        },
        ...((propertyTypes?.length ?? 0) > 0 ? [{
            id: 'types',
            title: t("propertyType"),
            items: propertyTypes,
            currentSet: currentTypes,
            onChange: handleTypeChange,
            prefix: 'type',
        }] : []),
        // add more filters here — Show More works independently for each
    ];

    const rules = propertyRules?.data?.rules ?? [];

    /* ── Reusable Show More/Less button ── */
    const ShowMoreButton = ({ filterId, totalCount }: { filterId: string; totalCount: number }) => {
        const visible = getVisibleCount(filterId);
        const hasMore = visible < totalCount;
        const canCollapse = visible > ITEMS_PER_STEP;

        if (!hasMore && !canCollapse) return null;

        return (
            <div className="flex gap-3 pb-2 justify-between">
                {hasMore && (
                    <button
                        type="button"
                        onClick={() => handleShowMore(filterId, totalCount)}
                        className="text-sm font-medium primaryColor"
                    >
                        + {t('showMore')}
                    </button>
                )}
                {canCollapse && (
                    <button
                        type="button"
                        onClick={() => handleShowLess(filterId)}
                        className="text-sm font-medium primaryColor"
                    >
                        - {t('showLess')}
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className='space-y-4 sticky top-0'>
            {
                pathname.includes('properties') &&
                <div className='flex gap-4 primaryLightBg rounded-2xl primaryLightBorderColor p-4'>
                    <div>
                        <Checkbox
                            checked={sidebarFilter.payAtProperty}
                            onChange={(checked) => setSidebarFilter(prev => ({ ...prev, payAtProperty: checked }))}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Typography variant='h6' weight='semibold'>
                            {t('payAtProperty')}
                        </Typography>
                        <Typography variant='desc2' weight='regular' className='text-sm'>
                            {t('payAtPropertyDesc')}
                        </Typography>
                    </div>
                </div>
            }
            <div className={`w-full bg-white md:rounded-2xl md:border md:p-4 flex flex-col overflow-hidden ${className}`}>

                {/* ── Price Range ── */}
                <div className='md:-mt-4'>
                    <FilterTitle title={t("priceRange")}>
                        <div className="pb-4">
                            <Range
                                min={priceMin}
                                max={priceMax}
                                value={localPrice}
                                step={priceStep}
                                prefix={pricePrefix}
                                onChange={handleLocalPriceChange}
                                onChangeEnd={handlePriceChangeEnd}
                                minLabel={t("minPrice")}
                                maxLabel={t("maxPrice")}
                            />
                        </div>
                    </FilterTitle>
                </div>

                {/* ── Guest Rating ── */}
                {isMultiMode && (
                    <FilterTitle title={t("guestRating")}>
                        <div className="flex md:flex-col gap-4 pb-4">
                            {STAR_OPTIONS.map((stars) => (
                                <StarRatings
                                    key={stars}
                                    stars={stars}
                                    checked={currentStars.has(stars)}
                                    onChange={(checked) => handleStarChange(stars, checked)}
                                />
                            ))}
                        </div>
                    </FilterTitle>
                )}

                {/* ── Dynamic Filters (each with independent Show More) ── */}
                {filtersList.map((filter) => {
                    const total = filter.items?.length ?? 0;
                    const visibleCount = getVisibleCount(filter.id);
                    const visibleItems = filter.items?.slice(0, visibleCount) ?? [];

                    return (
                        <FilterTitle key={filter.id} title={filter.title}>
                            {/* Desktop */}
                            <div className="hidden md:flex flex-col gap-4 pb-4">
                                {visibleItems.map((item) => (
                                    <Checkbox
                                        key={item.id}
                                        id={`${filter.prefix}-${item.id}`}
                                        label={item.name}
                                        checked={filter.currentSet.has(item.id)}
                                        onChange={(checked) => filter.onChange(item.id, checked)}
                                    />
                                ))}
                            </div>

                            {/* Mobile */}
                            <div className="flex gap-4 pb-4 md:hidden flex-wrap">
                                {visibleItems.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`flex md:hidden items-center justify-center gap-2 px-5 py-2 rounded-lg border transition-all ${filter.currentSet.has(item.id)
                                            ? 'primaryLightBg primaryBorder'
                                            : 'border-transparent bodyBg'
                                            }`}
                                        onClick={() => filter.onChange(item.id, !filter.currentSet.has(item.id))}
                                    >
                                        <span className="text-sm font-medium textPrimaryColor">{item.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Show More / Show Less — only renders if total > 5 */}
                            {total > ITEMS_PER_STEP && (
                                <ShowMoreButton filterId={filter.id} totalCount={total} />
                            )}
                        </FilterTitle>
                    );
                })}
                {/* ── Property Rules (per-question, type-specific UI) ── */}
                {
                    isMultiMode && rules.length > 0 &&
                    <FilterTitle key={'propertyRules'} title={t('propertyRules')}>
                        {rules.map((rule) => {
                            const key = String(rule.question_id);
                            const selectedValue = sidebarFilter.rules[key];
                            const selectedMultiple = Array.isArray(selectedValue) ? selectedValue : [];

                            return (
                                <FilterTitle key={rule.question_id} title={rule.filter_label}>
                                    {rule.type === 'yes_no' && (
                                        <div className="flex gap-3 pb-4">
                                            {(rule.pill_labels as string[]).map((label) => (
                                                <button
                                                    key={label}
                                                    type="button"
                                                    className={`px-5 py-2 rounded-lg border transition-all text-sm font-medium textPrimaryColor first-letter:capitalize ${selectedValue === label ? 'primaryLightBg primaryBorder' : 'border-gray-200 bodyBg'
                                                        }`}
                                                    onClick={() => handleRuleChange(rule.question_id, label, rule.type)}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {rule.type === 'single_select' && (
                                        <div className="flex flex-col gap-4 pb-4">
                                            {(rule.pill_labels as PropertyRulePillOption[]).map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    className={`text-left px-4 py-2 rounded-lg border transition-all text-sm font-medium textPrimaryColor first-letter:capitalize ${selectedValue === opt.value ? 'primaryLightBg primaryBorder' : 'border-gray-200 bodyBg'
                                                        }`}
                                                    onClick={() => handleRuleChange(rule.question_id, opt.value, rule.type)}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {rule.type === 'multiple_select' && (
                                        <div className="flex flex-col gap-4 pb-4">
                                            {(rule.pill_labels as PropertyRulePillOption[]).map((opt) => (
                                                <Checkbox
                                                    key={opt.value}
                                                    id={`rule-${rule.question_id}-${opt.value}`}
                                                    label={opt.label}
                                                    checked={selectedMultiple.includes(opt.value)}
                                                    onChange={(checked) => handleRuleChange(rule.question_id, opt.value, rule.type, checked)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </FilterTitle>
                            );
                        })}
                    </FilterTitle>
                }

            </div>
        </div >
    );
};

export default SidebarFilter;