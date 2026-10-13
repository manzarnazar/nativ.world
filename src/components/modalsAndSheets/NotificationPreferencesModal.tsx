'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { PiArrowLeft } from "react-icons/pi";
import { useIsMobile } from "@/hooks/useMobile";
import { Button } from "@/components/storyBook/atoms/Button";
import Checkbox from "@/components/storyBook/atoms/Checkbox";
import { Typography } from "@/components/storyBook/atoms/Typography";
import Divider from "@/components/storyBook/atoms/Divider";
import {
    useNotificationPreferences,
    NotificationPreference,
    NotificationCategory,
} from "@/hooks/queries/notifications/useNotificationPreferences";
import { useUpdateNotificationPreference } from "@/hooks/queries/notifications/useUpdateNotificationPreference";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from '@/lib/toast';
import { useTranslation } from "@/hooks/useTranslation";
import { demoModeSelector } from "@/redux/reducers/settingsSlice";
import { userDataSelector } from "@/redux/reducers/userSlice";
import { userDetailsType } from "@/types/GlobalTypes";

interface NotificationPreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

type PreferenceGroup = { labelKey: string; categories: NotificationCategory[] };

const CATEGORY_DESC_KEYS: Record<NotificationCategory, string> = {
    booking_updates: "bookingConfChangesDesc",
    reminders: "checkInOutRemindersDesc",
    payments: "paymentConfirmationsDesc",
    refund_updates: "refundWalletUpdatesDesc",
};

const CATEGORY_LABEL_KEYS: Record<NotificationCategory, string> = {
    booking_updates: "bookingConfChangesLabel",
    reminders: "checkInOutRemindersLabel",
    payments: "paymentConfirmationsLabel",
    refund_updates: "refundWalletUpdatesLabel",
};

const PREFERENCE_GROUPS: PreferenceGroup[] = [
    { labelKey: "bookingUpdatesGroup", categories: ["booking_updates", "reminders"] },
    { labelKey: "paymentsWalletGroup", categories: ["payments", "refund_updates"] },
];

const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
    open,
    setOpen,
}) => {
    const isMobile = useIsMobile();
    const { t } = useTranslation();
    const { data, isLoading } = useNotificationPreferences();
    const { mutate: updatePreference, isPending } = useUpdateNotificationPreference();
    const demoMode = useSelector(demoModeSelector);
    const userDetails = useSelector(userDataSelector) as userDetailsType;
    const isDemoRestricted = demoMode && userDetails?.is_demo_account;

    const [localPrefs, setLocalPrefs] = useState<Record<NotificationCategory, boolean>>({
        booking_updates: true,
        reminders: true,
        payments: true,
        refund_updates: true,
    });

    useEffect(() => {
        if (data?.data) {
            const map = {} as Record<NotificationCategory, boolean>;
            data.data.forEach((pref: NotificationPreference) => {
                map[pref.category] = pref.is_enabled;
            });
            setLocalPrefs((prev) => ({ ...prev, ...map }));
        }
    }, [data]);

    const handleToggle = (category: NotificationCategory, checked: boolean) => {
        setLocalPrefs((prev) => ({ ...prev, [category]: checked }));
    };

    const handleSave = () => {
        const original = data?.data ?? [];
        const changed = original.filter((p) => localPrefs[p.category] !== p.is_enabled);

        if (changed.length === 0) {
            setOpen(false);
            toast.success(t('preferencesSaved'));
            return;
        }

        let completed = 0;
        changed.forEach((pref) => {
            updatePreference(
                { category: pref.category, is_enabled: localPrefs[pref.category] },
                {
                    onSuccess: () => {
                        completed++;
                        if (completed === changed.length) {
                            toast.success(t('preferencesSaved'));
                            setOpen(false);
                        }
                    },
                    onError: (err) => {
                        toast.error(err.message || t('failedToSavePreferences'));
                    },
                }
            );
        });
    };

    /* ── Shared preference list ─────────────────────── */
    const preferencesList = (
        <div className="space-y-6">
            {isDemoRestricted && (
                <div className="px-4 py-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                    {t('demoModeRestriction')}
                </div>
            )}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                PREFERENCE_GROUPS.map((group) => (
                    <div key={group.labelKey} className="space-y-3">
                        <Typography variant="caption" weight="semibold" className="textSecondaryColor! uppercase tracking-wide">
                            {t(group.labelKey)}
                        </Typography>
                        <div className="space-y-2">
                            {group.categories.map((cat) => (
                                <div
                                    key={cat}
                                    className="flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50"
                                >
                                    <div className="min-w-0 flex-1">
                                        <Typography variant="desc1" weight="medium" className="textPrimaryColor!">
                                            {t(CATEGORY_LABEL_KEYS[cat])}
                                        </Typography>
                                        <Typography variant="caption" className="textSecondaryColor!">
                                            {t(CATEGORY_DESC_KEYS[cat])}
                                        </Typography>
                                    </div>
                                    <Checkbox
                                        checked={localPrefs[cat]}
                                        onChange={(checked) => handleToggle(cat, checked)}
                                        size="md"
                                        disabled={!!isDemoRestricted}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    return (
        <>
            {/* ── MOBILE: full-screen slide-in (CSS-driven, no JS isMobile race) ── */}
            <div
                className={`md:hidden fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
                    }`}
            >
                <div className="flex items-center gap-3 px-4 h-18 border-b border-gray-100 shrink-0">
                    <button type="button" onClick={() => setOpen(false)} className="w-8 h-8 flexCenter shrink-0">
                        <PiArrowLeft size={22} />
                    </button>
                    <Typography variant="h6" weight="semibold" className="flex-1">
                        {t('notificationPreferences')}
                    </Typography>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-5 pb-32">
                    {preferencesList}
                </div>

                <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 pt-3 pb-6">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isPending || !!isDemoRestricted}
                        className="w-full primaryBg text-white font-medium py-4 rounded-2xl text-base disabled:opacity-60 transition-opacity"
                    >
                        {isPending
                            ? <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : t('savePreferences')
                        }
                    </button>
                </div>
            </div>

            {/* ── DESKTOP: dialog (not rendered on mobile — Portal escapes CSS hidden) */}
            {!isMobile && <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="flex flex-col gap-0 p-0 overflow-hidden max-w-lg! max-h-[90vh]">
                    <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
                        <DialogTitle>{t('notificationPreferences')}</DialogTitle>
                    </DialogHeader>
                    <Divider width="bleed" />
                    <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-5 min-h-0">
                        {preferencesList}
                    </div>
                    <Divider width="bleed" />
                    <div className="px-6 py-4 flex items-center justify-end gap-3 shrink-0">
                        <Button variant="text" onClick={() => setOpen(false)} className="rounded-lg!">
                            {t('cancel')}
                        </Button>
                        <Button variant="secondary" onClick={handleSave} loading={isPending} disabled={!!isDemoRestricted} className="rounded-full!">
                            {t('savePreferences')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>}
        </>
    );
};

export default NotificationPreferencesModal;
