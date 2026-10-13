'use client'

import Layout from "@/components/layout/Layout"
import { useTranslation } from "@/hooks/useTranslation"
import ProfileLayout from "../ProfileLayout"
import { BookingListItem, useBookingsList } from "@/hooks/queries/bookings/useBookingsList"
import { useCallback, useEffect, useState } from "react"
import { PaginationType } from "@/types/GlobalTypes"
import Pagination from "@/components/storyBook/atoms/Pagination"
import BookingCard from "./BookingCard"
import BookingCardSkeleton from "../../../skeletons/BookingCardSkeleton"
import NoDataFound from "@/components/systemStates/NoDataFound"
import { SelectOpt } from "@/components/storyBook/atoms/SelectOpt"

const MyBookings = () => {

    const { t } = useTranslation();

    const sortByOpts = [
        { label: t('all'), value: 'all' },
        { label: t('upcoming'), value: 'upcoming' },
        { label: t('onGoing'), value: 'ongoing' },
        { label: t('completed'), value: 'completed' },
        { label: t('cancelled'), value: 'cancelled' },
    ];

    const [sortBy, setSortBy] = useState<string>(sortByOpts[0].value);
    const [currentPage, setCurrentPage] = useState(1);
    const [refetchTrigger, setRefetchTrigger] = useState(false)

    const { data: listData, isLoading, error, refetch } = useBookingsList({ status: sortBy }, currentPage);

    const resData = listData?.data;
    const pagination: PaginationType | undefined = resData?.pagination;
    const totalPages = pagination?.last_page ?? 1;
    const bookings: BookingListItem[] = resData?.items ?? [];

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleFilterChange = (value: string) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (refetchTrigger) {
            refetch()
            setRefetchTrigger(false)
        }
    }, [refetchTrigger]);

    return (
        <Layout>
            <ProfileLayout
                title={t('myBookings')}
                headerAction={
                    <SelectOpt
                        options={sortByOpts}
                        value={sortBy}
                        onChange={handleFilterChange}
                    />
                }
            >

                {/* Mobile: horizontal scrollable status tabs */}
                <div className="flex md:hidden gap-2 overflow-x-auto px-4 py-4 no-scrollbar">
                    {sortByOpts.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleFilterChange(opt.value)}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
                                ${sortBy === opt.value
                                    ? 'primaryBorder primaryColor bg-white'
                                    : 'border-gray-200 bg-gray-50 textSecondaryColor'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Booking list */}
                <div className="px-4 md:px-6 pb-28 md:pb-6 flex flex-col gap-4">
                    {isLoading && (
                        Array.from({ length: 3 }).map((_, i) => (
                            <BookingCardSkeleton key={i} />
                        ))
                    )}
                    {!isLoading && !error && bookings.length === 0 && (
                        <NoDataFound />
                    )}
                    {!isLoading && bookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} setRefetchTrigger={setRefetchTrigger} propertySlug={booking.property?.slug} />
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

export default MyBookings
