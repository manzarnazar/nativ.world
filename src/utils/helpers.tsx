import { format } from "date-fns";
import { getStore } from "@/redux/store";

export const isSingleHotelBranch = () => {
    return true;
}

export const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const tabbar = document.getElementById('page-tabbar')
    const offset = tabbar ? tabbar.getBoundingClientRect().bottom : 0
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
}

export const formateDate = (date: Date | string | null | undefined): string => {
    if (!date) return "";

    const d = date instanceof Date ? date : new Date(date);

    if (isNaN(d.getTime())) return ""; // guard against invalid dates

    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
};

export const parseDate = (date: string | Date | null | undefined): Date | undefined => {
    if (!date) return undefined;

    const d = date instanceof Date ? date : new Date(date);

    return isNaN(d.getTime()) ? undefined : d;
};

export const parseCustomDate = (date: Date | string | null | undefined): Date | null => {
    if (!date) return null;

    if (date instanceof Date) return date;

    // Handle format: "dd-mm-yyyy" (ISO strings start with 4-digit year, skip those)
    const parts = date.split("-");
    if (parts.length === 3 && parts[0].length <= 2) {
        const [day, month, year] = parts.map(Number);
        const parsed = new Date(year, month - 1, day);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    // fallback (ISO or other valid formats)
    const fallback = new Date(date);
    return isNaN(fallback.getTime()) ? null : fallback;
};

export const formateDateForApi = (date: Date | string | null | undefined): string => {
    const d = parseCustomDate(date);
    if (!d) return "";

    return format(d, "yyyy-MM-dd");
};

export const formateDatePretty = (date: Date | string | null | undefined): string => {
    const d = parseCustomDate(date);
    if (!d) return "";

    const locale = getStore().getState()?.language?.currentLanguage?.code ?? "en-US";
    return d.toLocaleDateString(locale, {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

export const formatTime = (time: string | null | undefined): string => {
    if (!time) return "";
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // converts 0 → 12 for midnight
    return `${formattedHour}:${minute} ${period}`;
};

export const formatLocalDate = (utc: string | null | undefined): string => {
    if (!utc) return "";
    const d = new Date(utc);
    const locale = getStore().getState()?.language?.currentLanguage?.code ?? "en-US";
    return d.toLocaleDateString(locale, { month: "short", day: "2-digit", year: "numeric" });
};

export const formatLocalTime = (utc: string | null | undefined): string => {
    if (!utc) return "";
    const d = new Date(utc);
    const hour = d.getHours();
    const minute = String(d.getMinutes()).padStart(2, '0');
    const period = hour >= 12 ? 'PM' : 'AM';
    return `${hour % 12 || 12}:${minute} ${period}`;
};

export const getPercentage = (amount: number, percent: number): number => {
    if (!amount || isNaN(amount) || !percent) return 0;

    return (amount * percent) / 100;
};

export const formatPriceHelper = (val: number) => {
    return `${val?.toFixed(2)}`;
}

export const getDirection = (): "ltr" | "rtl" => {
  if (typeof document !== "undefined") {
    return (document.documentElement.dir as "ltr" | "rtl") || "ltr";
  }
  return "ltr";
};