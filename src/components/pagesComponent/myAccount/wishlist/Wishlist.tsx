'use client'
import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { PiTrash } from 'react-icons/pi'

import Layout from '@/components/layout/Layout'
import ProfileLayout from '../ProfileLayout'
import { useTranslation } from '@/hooks/useTranslation'
import { useGetWishlist } from '@/hooks/multiModeQueries/useGetWishlist'
import { useAddRemoveFavorites } from '@/hooks/addRemoveFavorites'
import { currentLangCodeSelector } from '@/redux/reducers/languageSlice'
import { PaginationType } from '@/types/GlobalTypes'
import { Property } from '@/hooks/queries/useProperties'

import ImagePreview from '@/components/storyBook/atoms/ImagePreview'
import { Typography } from '@/components/storyBook/atoms/Typography'
import PropertyPrice from '@/components/storyBook/atoms/PropertyPrice'
import Pagination from '@/components/storyBook/atoms/Pagination'
import { Skeleton } from '@/components/ui/skeleton'
import NoDataFound from '@/components/systemStates/NoDataFound'
import Divider from '@/components/storyBook/atoms/Divider'
import WishlistBtn from '@/components/storyBook/atoms/WishlistBtn'


const Wishlist = () => {

    const LIMIT = 5
    const { t } = useTranslation();
    const langCode = useSelector(currentLangCodeSelector);
    const { toggleFavorite, isTogglingFavorite } = useAddRemoveFavorites();

    const [currentPage, setCurrentPage] = useState(1);

    const { data: listData, isLoading, error, refetch } = useGetWishlist({
        limit: LIMIT,
        offset: (currentPage - 1) * LIMIT,
    });

    const resData = listData?.data;
    const pagination: PaginationType | undefined = resData?.pagination;
    const totalPages = pagination?.last_page ?? 1;
    const properties: Property[] = resData?.items ?? [];

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleRemove = async (slug: string) => {
        const result = await toggleFavorite(slug, true);
        if (result !== null) {
            refetch();
        }
    };

    return (
        <Layout>
            <ProfileLayout title={t('wishlist')}>
                <div className="px-4 md:px-6 py-4 md:py-6 pb-28 md:pb-6 flex flex-col gap-4">
                    {isLoading && (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border p-4">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="shrink-0 w-24 h-20 md:w-28 md:h-24 rounded-xl" />
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-40" />
                                                <Skeleton className="h-3 w-28" />
                                            </div>
                                            <Skeleton className="h-4 w-16" />
                                        </div>
                                        <Skeleton className="h-3 w-16 mt-4" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {!isLoading && !error && properties.length === 0 && (
                        <NoDataFound />
                    )}

                    {!isLoading && properties.map((property) => (
                        <div key={property.slug} className="bg-white rounded-2xl border max-399:p-2 p-4">
                            <div className="flex items-start gap-4">
                                <Link
                                    href={`/${langCode}/properties/${property.slug}`}
                                >
                                    <div className={`shrink-0 max-375:w-32 w-36 md:w-42 h-35 relative propertyImg`}>
                                        <ImagePreview
                                            src={property?.image}
                                            alt={property?.name}
                                            objectFit="cover"
                                            rounded="2xl"
                                            aspectRatio="square"
                                        />
                                        <WishlistBtn isWishlisted={property?.is_favorited} slug={property?.slug} className='top-2! right-2! md:hidden' />
                                    </div>
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <Link href={`/${langCode}/properties/${property.slug}`} className="block min-w-0">
                                            <Typography variant="subtitle2" weight="semibold" className="textPrimaryColor! line-clamp-1">
                                                {property.name}
                                            </Typography>
                                            <Typography variant="caption" className="textSecondaryColor! block mt-1 line-clamp-1">
                                                {[property.city, property.state].filter(Boolean).join(' · ')}
                                            </Typography>
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => handleRemove(property.slug)}
                                            disabled={isTogglingFavorite(property.slug)}
                                            className="flex items-center gap-1 errorColor text-sm font-medium shrink-0 disabled:opacity-50 max-md:hidden"
                                        >
                                            <PiTrash className="text-lg" />
                                            <span className="hidden sm:inline">{t('remove')}</span>
                                        </button>
                                    </div>
                                    <Divider className='mt-3' />

                                    <PropertyPrice
                                        price={property.converted_starting_price}
                                        currency={property.converted_currency_symbol}
                                        className='max-375:[&_span]:text-sm!'
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            siblingCount={1}
                            className="mt-4 justify-center"
                        />
                    )}
                </div>
            </ProfileLayout>
        </Layout>
    )
}

export default Wishlist
