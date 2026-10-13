export const BASIC_DETAILS_COOKIE_NAME = "basic_details";
const BASIC_DETAILS_COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day

export const setBasicDetailsCookie = (basicDetails: unknown) => {
    if (typeof document === "undefined" || !basicDetails) return;
    const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${BASIC_DETAILS_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(basicDetails))}; Path=/; Max-Age=${BASIC_DETAILS_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
};
