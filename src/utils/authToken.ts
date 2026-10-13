const TOKEN_COOKIE_NAME = "token";
const TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const setAuthTokenCookie = (token: string) => {
    if (typeof document === "undefined" || !token) return;
    const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${TOKEN_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
};

export const removeAuthTokenCookie = () => {
    if (typeof document === "undefined") return;
    document.cookie = `${TOKEN_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
};
