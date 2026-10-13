import { cookies, headers } from "next/headers";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/`;

interface ServerApiOptions extends Omit<RequestInit, "headers"> {
    params?: Record<string, string | number | boolean | undefined>;
    headers?: HeadersInit;
}

interface ServerApiResponse<T = any> {
    data: T;
    ok: boolean;
    status: number;
}

const buildUrl = (path: string, params?: ServerApiOptions["params"]) => {
    const url = new URL(path, BASE_URL);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) url.searchParams.set(key, String(value));
        });
    }
    return url.toString();
};

const getClientIp = async (): Promise<string | null> => {
    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for");
    if (forwardedFor) return forwardedFor.split(",")[0].trim();
    return headerStore.get("x-real-ip");
};

const buildHeaders = async (customHeaders?: HeadersInit) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const currencyCode = cookieStore.get("currency_code")?.value;
    const langCode = cookieStore.get("lang_code")?.value;
    const clientIp = await getClientIp();

    const finalHeaders = new Headers(customHeaders);
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
    if (currencyCode) finalHeaders.set("Accept-Currency", currencyCode);
    if (langCode && !finalHeaders.has("Accept-Language")) finalHeaders.set("Accept-Language", langCode);
    if (clientIp) finalHeaders.set("X-Forwarded-For", clientIp);
    return finalHeaders;
};

const request = async <T = any>(path: string, options: ServerApiOptions = {}): Promise<ServerApiResponse<T>> => {
    const { params, headers, ...rest } = options;
    const response = await fetch(buildUrl(path, params), {
        ...rest,
        headers: await buildHeaders(headers),
    });
    const data = await response.json().catch(() => null);
    return { data, ok: response.ok, status: response.status };
};

const api = {
    get: <T = any>(path: string, options: ServerApiOptions = {}) => request<T>(path, { ...options, method: "GET" }),
};

export default api;
