'use client'
import SearchBar from "@/components/commonComponents/SearchBar";
import Layout from "@/components/layout/Layout";
import { Typography } from "@/components/storyBook/atoms/Typography";
import SidebarFilter from "@/components/storyBook/organisms/SidebarFilter";
import { useTranslation } from "@/hooks/useTranslation";
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SelectOpt } from "@/components/storyBook/atoms/SelectOpt"
import { Button } from "@/components/storyBook/atoms/Button";
import { PiMapPinBold, PiXCircleFill } from "react-icons/pi";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { SidebarFilterTypes } from "@/types/GlobalTypes";
import SearchCard from "@/components/storyBook/organisms/searchCard";
import Pagination from "@/components/storyBook/atoms/Pagination";
import SidebarFilterSheet from "@/components/modalsAndSheets/SidebarFilterShee";
import { MobileBreadcrum } from "../../storyBook/molecules/mobileBreadcrum";
import { Room, useRooms, RoomsResponseData } from "@/hooks/queries/useRooms";
import { PaginationType } from "@/types/GlobalTypes";
import SearchCardSkeleton from "../../skeletons/SearchCardSkeleton";
import NoDataFound from "../../systemStates/NoDataFound";
import { Property, useProperties, PropertiesResponseData, PropertyType } from "@/hooks/queries/useProperties";
import { useDispatch, useSelector } from "react-redux";
import { businessModeSelector, latLongSelector, selectedLocationSelector, setLatLong, setSelectedLocation } from "@/redux/reducers/settingsSlice";
import { BasicDetails } from "@/hooks/queries/useSettings";
import { bookingDetailsSelector } from "@/redux/reducers/bookingDetailsSlice";
import { formateDateForApi } from "@/utils/helpers";
import { isFromSearchSelector } from "@/redux/reducers/helpersReducer";
import MapOverlay from "./MapOverlay";
import { PropertyRulePillOption, useGetPropertyRules } from "@/hooks/multiModeQueries/useGetPropertyRules";
import { Facility } from "@/api/server/getHomePageContent";

const SearchPage = () => {

  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialized = useRef(false);
  // Prevents Effect 2 from writing to URL when Effect 1 is populating state from URL
  const isUpdatingFromURL = useRef(false);
  const dispatch = useDispatch();

  const pathname = usePathname();
  const roomsPage = pathname.includes('/rooms');
  const latLong = useSelector(latLongSelector);


  const businessMode = useSelector(businessModeSelector) as BasicDetails;
  const isMultiMode = businessMode?.business_mode === 'multi';
  const bookingDetails = useSelector(bookingDetailsSelector);
  const isFromSearch = useSelector(isFromSearchSelector);
  const showMapBtn = !roomsPage && isMultiMode;
  const selectedLocation = useSelector(selectedLocationSelector);

  const [sidebarFilter, setSidebarFilter] = useState<SidebarFilterTypes>({
    payAtProperty: false,
    minPrice: '',
    maxPrice: '',
    amenities: '',
    ratings: '',
    types: '',
    rules: {},
  });

  const [citySlug, setCitySlug] = useState(searchParams.get("citySlug") || '');

  const [sortBy, setSortBy] = useState<string>();

  const [currentPage, setCurrentPage] = useState(1);
  const [showMap, setShowMap] = useState(false);

  // Helper to safely decode URL params
  const safeDecodeParam = (value: string | null): string => {
    if (!value) return '';
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  // Rules are per-question answers, encoded as "questionId:value" pairs joined by commas
  // (multiple_select answers join their values with "~"), e.g. "37:Yes,38:wifi~parking"
  const parseRulesParam = (value: string | null): Record<string, string | string[]> => {
    if (!value) return {};
    const result: Record<string, string | string[]> = {};
    value.split(',').forEach(pair => {
      const [key, val] = pair.split(':');
      if (!key || val === undefined) return;
      result[key] = val.includes('~') ? val.split('~') : val;
    });
    return result;
  };

  const serializeRulesParam = (rules: Record<string, string | string[]>): string =>
    Object.entries(rules)
      .map(([key, val]) => `${key}:${Array.isArray(val) ? val.join('~') : val}`)
      .join(',');

  // A filter counts as "active" only when it actually holds a value — rules needs its own check since it's an object
  const hasFilterValues = (filters: SidebarFilterTypes) =>
    Object.entries(filters).some(([key, value]) => {
      if (key === 'rules') {
        return value && Object.keys(value as Record<string, string | string[]>).length > 0;
      }
      return value && value !== '';
    });

  // Read filters from URL on mount / when searchParams change
  const getFiltersFromURL = (): SidebarFilterTypes => {
    const params = new URLSearchParams(searchParams.toString());
    setCitySlug(safeDecodeParam(params.get('citySlug')))
    return {
      minPrice: safeDecodeParam(params.get('minPrice')),
      maxPrice: safeDecodeParam(params.get('maxPrice')),
      amenities: safeDecodeParam(params.get('amenities')),
      ratings: safeDecodeParam(params.get('ratings')),
      types: safeDecodeParam(params.get('types')),
      rules: parseRulesParam(params.get('rules')),
    };
  };

  // Write filters back to URL (preserves non-filter params like dates, rooms, adults, etc.)
  const updateURLWithFilters = (filters: SidebarFilterTypes) => {
    const params = new URLSearchParams(window.location.search);
    setCitySlug(safeDecodeParam(params.get('citySlug')))
    // Remove all sidebar filter keys first
    const filterKeys: (keyof SidebarFilterTypes)[] = ['minPrice', 'maxPrice', 'amenities', 'ratings', 'types', 'rules'];
    filterKeys.forEach(key => params.delete(key));
    // Set the new filter values
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'rules') {
        const rulesValue = value as Record<string, string | string[]>;
        if (rulesValue && Object.keys(rulesValue).length > 0) {
          params.set(key, serializeRulesParam(rulesValue));
        }
        return;
      }
      if (value && value !== '') {
        params.set(key, String(value));
      }
    });
    // URLSearchParams encodes ',', ':' and '~' — decode them back for a cleaner, readable URL
    const queryString = params.toString().replace(/%2C/gi, ',').replace(/%3A/gi, ':').replace(/%7E/gi, '~');
    const newURL = queryString ? `?${queryString}` : window.location.pathname;
    router.replace(newURL, { scroll: false });
  };

  // Clear all filters (preserves non-filter params like dates, rooms, adults, etc.)
  const clearAllFilters = () => {
    setSidebarFilter({
      minPrice: '',
      maxPrice: '',
      amenities: '',
      ratings: '',
      types: '',
      rules: {},
    });
    const params = new URLSearchParams(window.location.search);
    ['minPrice', 'maxPrice', 'amenities', 'ratings', 'types', 'rules'].forEach(key => params.delete(key));
    const queryString = params.toString().replace(/%2C/gi, ',');
    const newURL = queryString ? `?${queryString}` : window.location.pathname;
    router.replace(newURL, { scroll: false });
  };

  // Initialize filters and searchbar params from URL on first render
  useEffect(() => {

    // Hydrate sidebar filters from URL
    const urlFilters = getFiltersFromURL();
    const hasUrlFilters = hasFilterValues(urlFilters);
    if (hasUrlFilters) {
      isUpdatingFromURL.current = true;  // flag: state change originates from URL
      setSidebarFilter(urlFilters);
    }
    isInitialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [searchParams]);

  // Sync filter state to URL whenever it changes (skip when state was set FROM the URL)
  useEffect(() => {
    if (!isInitialized.current) return;
    if (isUpdatingFromURL.current) {
      // Reset the flag and skip this round — URL is already correct
      isUpdatingFromURL.current = false;
      return;
    }
    updateURLWithFilters(sidebarFilter);

    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarFilter]);

  const hasActiveFilters = hasFilterValues(sidebarFilter);

  // Count every individual chip (amenity, rating, type, rule — a multiple_select rule counts each picked option)
  const totalFilterCount =
    (sidebarFilter.amenities ? sidebarFilter.amenities.split(',').filter(Boolean).length : 0) +
    (sidebarFilter.ratings ? sidebarFilter.ratings.split(',').filter(Boolean).length : 0) +
    (sidebarFilter.types ? sidebarFilter.types.split(',').filter(Boolean).length : 0)

  const sortByOpts = [
    {
      label: t('priceHigh'),
      value: 'price_high_low'
    },
    {
      label: t('priceLow'),
      value: 'price_low_high'
    },
    {
      label: t('highlyRated'),
      value: 'highly_rated'
    },
  ];


  // bookingDetails.location is redux initialState ("") until Layout's post-mount effect
  // corrects it — falling back to businessMode.slug (seeded synchronously via SSR
  // preloadedState, settingsSlice.ts) keeps this key matching rooms/page.tsx's server
  // prefetch on the very first render, so the hydrated cache actually hits.
  const { data: roomsData, isLoading: roomsLoading, error: roomsError } = useRooms({
    property_slug: bookingDetails.location || businessMode?.slug || '',
    ...(isFromSearch && { check_in: formateDateForApi(bookingDetails.checkIn) }),
    ...(isFromSearch && { check_out: formateDateForApi(bookingDetails.checkout) }),
    rooms: bookingDetails.rooms,
    adults: bookingDetails.adults,
    children: bookingDetails.childrenCount,
    min_price: Number(sidebarFilter.minPrice),
    max_price: Number(sidebarFilter.maxPrice),
    amenities: sidebarFilter.amenities,
    sort_by: sortBy,
  }, currentPage, roomsPage);  // only fetches when roomsPage is true


  // Read directly from the URL (synchronously, on the very first render) instead of only from
  // bookingDetails redux — redux is still its untouched initialState on first paint (booking
  // details aren't preloaded server-side, unlike settings), so relying on it alone means the
  // first fetch never reflects a deep-linked adults/children count, and the server-side
  // prefetch in page.tsx (which reads the same searchParams) could never match it either.
  const urlAdults = Number(searchParams.get('adults')) || undefined;
  const urlChildren = Number(searchParams.get('children')) || undefined;
  const urlRooms = Number(searchParams.get('rooms')) || undefined;
  const urlPetsParam = searchParams.get('pets');
  const urlPets = urlPetsParam !== null ? urlPetsParam === 'true' : undefined;

  const { data: propertiesData, isLoading: propertiesLoading, error: propertiesError } = useProperties({
    adults: urlAdults ?? bookingDetails.adults,
    amenities: sidebarFilter.amenities,
    ...(isFromSearch && { check_in: formateDateForApi(bookingDetails.checkIn) }),
    ...(isFromSearch && { check_out: formateDateForApi(bookingDetails.checkout) }),
    children: urlChildren ?? bookingDetails.childrenCount,
    min_price: Number(sidebarFilter?.minPrice),
    max_price: Number(sidebarFilter?.maxPrice),
    pay_at_property: sidebarFilter.payAtProperty ? 1 : 0,
    sort_by: sortBy,
    ...(isMultiMode && { lat: latLong?.latitude ?? selectedLocation?.latitude }),
    ...(isMultiMode && { lng: latLong?.longitude ?? selectedLocation?.longitude }),
    ...(isMultiMode && { city_slug: citySlug }),
    ...(isMultiMode && { pets: urlPets ?? bookingDetails.pets }),
    ...(isMultiMode && { property_type_id: sidebarFilter.types ? sidebarFilter.types.split(',').filter(Boolean) : [] }),
    ...(isMultiMode && { rooms: urlRooms ?? bookingDetails.rooms }),
    ...(isMultiMode && { ratings: sidebarFilter.ratings ? sidebarFilter.ratings.split(',').filter(Boolean) : [] }),
    ...(isMultiMode && { rules: Object.keys(sidebarFilter.rules).length > 0 ? JSON.stringify(sidebarFilter.rules) : '' }),
  }, currentPage, !roomsPage);  // only fetches when roomsPage is false

  // Unified variables to use throughout the component
  const resData = (roomsPage ? roomsData?.data : propertiesData?.data) as RoomsResponseData | PropertiesResponseData | undefined;
  const isLoading = roomsPage ? roomsLoading : propertiesLoading;
  const error = roomsPage ? roomsError : propertiesError;
  const pagination: PaginationType | undefined = resData?.pagination;
  const totalPages = pagination?.last_page ?? 1;

  const rooms: Room[] | Property[] = resData?.items ?? [];
  const totalResults = pagination?.total ?? 0;

  const countryId = searchParams.get("countryId") || propertiesData?.data?.items[0]?.country_id;

  const priceMin = roomsPage ? (resData as RoomsResponseData)?.converted_min_price : (resData as PropertiesResponseData)?.converted_min_price;
  const priceMax = roomsPage ? (resData as RoomsResponseData)?.converted_max_price : (resData as PropertiesResponseData)?.converted_max_price;
  const currencySymbol = roomsPage ? (resData as RoomsResponseData)?.converted_currency_symbol : (resData as PropertiesResponseData)?.converted_currency_symbol

  const [amenities, setAmenities] = useState<Facility[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);

  useEffect(() => {
    if (error) {
      console.log('error fetching rooms/properties', error)
    }
  }, [error]);

  useEffect(() => {
    if (amenities?.length < 1 && resData?.facilities) {
      setAmenities(resData.facilities)
      if (!roomsPage) {
        setPropertyTypes((resData as PropertiesResponseData).property_types)
      }
    }
  }, [resData]);

  // Reset to page 1 when filters or sort change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    document.body.style.overflow = showMap ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMap])

  useEffect(() => {
    return () => {
      // Read the live URL instead of the closed-over `pathname`: in React
      // StrictMode dev double-invoke, this cleanup fires immediately after
      // mount while still on this page, so it must not clear the location.
      // On a real navigation away, the URL has already changed by the time
      // this cleanup runs.
      // console.log('PropertyPage unmounting, checking if still on listing page to clear selectedLocation')
      const isStillOnListingPage = window.location.pathname.includes('/properties') || window.location.pathname.includes('/rooms');
      if (!isStillOnListingPage) {
        dispatch(setSelectedLocation(null));
        dispatch(setLatLong({ latitude: null, longitude: null }));
      }
    }
  }, []);

  const { data: propertyRulesData, isError: isRuleErr, error: rulesError } = useGetPropertyRules({ country_id: Number(countryId) }, isMultiMode && !!countryId && propertyTypes?.length > 0);
  const propertyRules = propertyRulesData?.data?.rules ?? [];

  useEffect(() => {
    if (isRuleErr) {
      console.log("rulesError", rulesError)
    }
  }, [isRuleErr])

  return (
    <Layout>
      <MobileBreadcrum title={t('properties')} setShowMap={setShowMap} showMapState={showMap} />
      <Suspense>
        <SearchBar />
      </Suspense>
      <section className="bg-white pb-30 md:commonPY">
        <div className="container">
          <div className="grid grid-cols-12 commonGap">
            <div className="hidden lg:block lg:col-span-3">
              <SidebarFilter sidebarFilter={sidebarFilter} setSidebarFilter={setSidebarFilter} priceMin={priceMin} priceMax={priceMax} amenities={amenities} pricePrefix={currencySymbol}
                propertyTypes={propertyTypes} countryId={countryId || ''}
              />
            </div>
            <div className="col-span-12 lg:col-span-9 space-y-6">
              {/* sortBy bar with result count  */}

              {/* desktop and tab  */}
              <div className="border rounded-2xl p-4 hidden md:flex items-center justify-between">
                <div className="flexCenter gap-4">
                  <div className="block lg:hidden">
                    <SidebarFilterSheet sidebarFilter={sidebarFilter} setSidebarFilter={setSidebarFilter} pricePrefix={currencySymbol} hasActiveFilters={hasActiveFilters} clearAll={clearAllFilters} priceMin={priceMin!} priceMax={priceMax!} amenities={amenities} propertyTypes={propertyTypes} countryId={countryId || ''} />
                  </div>
                  <div className="">
                    <Typography variant="h6" weight="semibold" children={`${t('showing')} ${rooms.length > 0 ? ((currentPage - 1) * 10) + 1 : 0}-${Math.min(currentPage * 10, totalResults)} ${t('of')} ${totalResults} ${t('results')}`} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <SelectOpt
                    options={sortByOpts}
                    value={sortBy}
                    onChange={(v) => setSortBy(v)}
                    className="w-full [&>.selectTrigger]:py-3! [&>.selectTrigger]:data-[size=default]:h-full!"
                  />
                  {showMapBtn && (
                    <button
                      onClick={() => setShowMap(true)}
                      className="flex items-center gap-2 border rounded-lg border-black p-2 w-full"
                    >
                      <span className="primaryBg rounded-full p-2 text-white">
                        <PiMapPinBold />
                      </span>
                      {t('showOnMap')}
                    </button>
                  )}
                </div>
              </div>

              {/* mobile  */}
              <div className="w-full overflow-auto md:hidden">
                <div className="flexCenter gap-2 md:hidden w-max overflow-x-auto py-2">
                  <SidebarFilterSheet sidebarFilter={sidebarFilter} setSidebarFilter={setSidebarFilter} pricePrefix={currencySymbol} hasActiveFilters={hasActiveFilters} clearAll={clearAllFilters} priceMin={priceMin!} priceMax={priceMax!} amenities={amenities} propertyTypes={propertyTypes} countryId={countryId || ''} />
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

              <div className="space-y-6">
                <div className="space-y-4">

                  <div className="md:hidden">
                    <Typography variant="h6" weight="bold" children={`${t('showing')} ${rooms.length} ${t('results')}`} />
                  </div>
                  {
                    isLoading ?
                      Array.from({ length: 6 }).map((_, index) => (
                        <SearchCardSkeleton key={index} />
                      ))
                      :
                      rooms.length > 0 ?
                        rooms.map((item: Room | Property) => (
                          <SearchCard
                            key={item.id}
                            item={item}
                            propertyData={roomsData?.data?.property}
                          />
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
                    onPageChange={handlePageChange}
                    siblingCount={1}
                    className="mt-8 justify-center"
                  />
                )}

              </div>

            </div>
          </div>
        </div>
        {showMap && !roomsPage && (
          <MapOverlay
            onClose={() => setShowMap(false)}
            properties={rooms as Property[]}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            onPageChange={handlePageChange}
            sidebarFilter={sidebarFilter}
            setSidebarFilter={setSidebarFilter}
            hasActiveFilters={hasActiveFilters}
            totalFilterCount={totalFilterCount}
            clearAllFilters={clearAllFilters}
            priceMin={priceMin}
            priceMax={priceMax}
            pricePrefix={currencySymbol}
            amenities={amenities}
            propertyTypes={propertyTypes}
            propertyRules={propertyRules}
            sortByOpts={sortByOpts}
            sortBy={sortBy}
            setSortBy={setSortBy}
            countryId={countryId || ''}
          />
        )}
      </section>
    </Layout>
  )
}

export default SearchPage
