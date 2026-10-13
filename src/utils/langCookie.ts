const LANG_COOKIE_NAME = "lang_code";
const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const setLangCookie = (langCode: string) => {
    if (typeof document === "undefined" || !langCode) return;
    const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${LANG_COOKIE_NAME}=${encodeURIComponent(langCode)}; Path=/; Max-Age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
};
