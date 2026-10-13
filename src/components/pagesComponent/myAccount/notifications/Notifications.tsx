'use client'

import Layout from "@/components/layout/Layout";
import ProfileLayout from "../ProfileLayout";
import Pagination from "@/components/storyBook/atoms/Pagination";
import { NotificationItem } from "@/components/storyBook/molecules/NotificationItem";
import NotificationPreferencesModal from "@/components/modalsAndSheets/NotificationPreferencesModal";
import { useNotifications, NotificationItem as NotificationItemType } from "@/hooks/queries/notifications/useNotifications";
import { useCallback, useEffect, useState } from "react";
import { PaginationType } from "@/types/GlobalTypes";
import NoDataFound from "@/components/systemStates/NoDataFound";
import { PiGearSix } from "react-icons/pi";
import { useTranslation } from "@/hooks/useTranslation";
import EmptyStatus from "@/components/commonComponents/EmptyStatus";


const NotificationSkeleton = () => (
    <div className="flex items-start gap-4 py-4 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
            <div className="h-4 w-52 bg-gray-200 rounded" />
            <div className="h-3 w-3/4 bg-gray-200 rounded" />
        </div>
        <div className="h-3 w-16 bg-gray-200 rounded shrink-0" />
    </div>
);

const Notifications = () => {
    const { t } = useTranslation();
    const [openPreferences, setOpenPreferences] = useState(false);

    /* ── Desktop pagination ──────────────────────────── */
    const [desktopPage, setDesktopPage] = useState(1);
    const { data: desktopData, isLoading: desktopLoading } = useNotifications(desktopPage);
    const desktopPagination: PaginationType | undefined = desktopData?.data?.pagination;
    const desktopNotifications: NotificationItemType[] = desktopData?.data?.items ?? [];

    /* ── Mobile load-more ────────────────────────────── */
    const [mobilePage, setMobilePage] = useState(1);
    const [mobileItems, setMobileItems] = useState<NotificationItemType[]>([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const { data: mobileData, isLoading: mobileLoading } = useNotifications(mobilePage);
    const mobilePagination: PaginationType | undefined = mobileData?.data?.pagination;
    const hasMore = mobilePagination ? mobilePage < (mobilePagination.last_page ?? 1) : false;

    useEffect(() => {
        if (!mobileData?.data?.items) return;
        setMobileItems(prev =>
            mobilePage === 1 ? mobileData.data.items : [...prev, ...mobileData.data.items]
        );
        setLoadingMore(false);
    }, [mobileData]);

    const handleLoadMore = () => {
        setLoadingMore(true);
        setMobilePage(prev => prev + 1);
    };

    const handleDesktopPageChange = useCallback((page: number) => {
        setDesktopPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    /* Responsive preferences trigger */
    const preferencesBtn = (
        <button
            type="button"
            onClick={() => setOpenPreferences(true)}
            className="w-9 h-9 flexCenter rounded-full hover:bg-gray-100 transition-colors"
            title={t('preferences')}
        >
            <PiGearSix size={20} />
        </button>
    );

    const renderItem = (n: NotificationItemType, last: boolean) => (
        <div key={n.id} className={!last ? 'border-b border-gray-100' : ''}>
            <NotificationItem
                title={n.title}
                body={n.body}
                createdAt={n.created_at}
                isRead={!!n.read_at}
                type={n.type}
                image={n.image}
                link={n.link}
            />
        </div>
    );

    return (
        <Layout>
            <ProfileLayout title={t('notifications')} headerAction={preferencesBtn} notificationsPage={true}>

                {/* ── MOBILE: load-more list ───────────────────── */}
                <div className="md:hidden px-4">
                    {mobileLoading && mobilePage === 1 && (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="border-b border-gray-100">
                                <NotificationSkeleton />
                            </div>
                        ))
                    )}

                    {!mobileLoading && mobileItems.length === 0 && (
                        <div className="py-10"><NoDataFound /></div>
                    )}

                    {mobileItems.map((n, i) => renderItem(n, i === mobileItems.length - 1 && !hasMore))}

                    {/* Load more */}
                    {hasMore && (
                        <div className="py-4 flex justify-center">
                            <button
                                type="button"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-sm font-medium textPrimaryColor hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {loadingMore ? (
                                    <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                ) : null}
                                {loadingMore ? t('loading') : t('loadMore')}
                            </button>
                        </div>
                    )}
                </div>

                {/* ── DESKTOP: pagination list ─────────────────── */}
                <div className="hidden md:block">
                    <div className="px-5">
                        {desktopLoading && (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className={i < 4 ? 'border-b border-gray-100' : ''}>
                                    <NotificationSkeleton />
                                </div>
                            ))
                        )}

                        {!desktopLoading && desktopNotifications.length === 0 && (
                            <div className="py-8"><EmptyStatus title={t('noNotificationsTitle')} description={t('noNotificationsDescription')} type="noNotification" /></div>
                        )}

                        {!desktopLoading && desktopNotifications.map((n, i) =>
                            renderItem(n, i === desktopNotifications.length - 1)
                        )}
                    </div>

                    {(desktopPagination?.last_page ?? 1) > 1 && (
                        <div className="border-t border-gray-100 px-5 py-4">
                            <Pagination
                                totalPages={desktopPagination?.last_page ?? 1}
                                currentPage={desktopPage}
                                onPageChange={handleDesktopPageChange}
                                siblingCount={1}
                                className="justify-center"
                            />
                        </div>
                    )}
                </div>

            </ProfileLayout>

            <NotificationPreferencesModal
                open={openPreferences}
                setOpen={setOpenPreferences}
            />
        </Layout>
    );
};

export default Notifications;
