const CURRENCY_COOKIE_NAME = "currency_code";
const CURRENCY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const setCurrencyCookie = (currencyCode: string) => {
    if (typeof document === "undefined" || !currencyCode) return;
    const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${CURRENCY_COOKIE_NAME}=${encodeURIComponent(currencyCode)}; Path=/; Max-Age=${CURRENCY_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
};
