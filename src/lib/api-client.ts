// Centralized API client for all HTTP requests.
// This helper ensures `credentials: 'include'` is always set and provides
// basic retry / error-handling logic that can be shared by every service.

import { CapacitorHttp } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// Generic helper options
interface RequestOptions {
    data?: any;
    params?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
    retries?: number;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Main request helper – always includes credentials
export async function apiRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    { data, params, headers = {}, retries = 3 }: RequestOptions = {}
): Promise<T> {
    const url = new URL(`${API_URL}${endpoint}`);

    // Append any query-string params
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, String(value));
        });
    }

    // Configuration spécifique pour mobile (cookies)
    const isNative = Capacitor.isNativePlatform();

    // Gestion spéciale pour FormData (uploads de fichiers)
    const isFormData = data instanceof FormData;
    const requestHeaders = isFormData
        ? { ...headers } // Ne pas inclure Content-Type pour FormData
        : { 'Content-Type': 'application/json', 'Accept': 'application/json', ...headers };

    const requestConfig: any = {
        method,
        url: url.toString(),
        headers: requestHeaders,
        data,
        // Configuration critique pour les cookies sur mobile
        webFetchExtra: {
            credentials: 'include'
        },
    };

    // Options supplémentaires pour améliorer la gestion des cookies sur mobile
    if (isNative) {
        requestConfig.connectTimeout = 10000;
        requestConfig.readTimeout = 10000;
    }

    const response = await CapacitorHttp.request(requestConfig);

    // Retry on 429 (rate-limit) if header present
    if (response.status === 429 && retries > 0) {
        const retryAfter = parseInt((response.headers as any)?.['retry-after'] ?? '1', 10);
        await delay(retryAfter * 1000);
        return apiRequest<T>(method, endpoint, { data, params, headers, retries: retries - 1 });
    }

    // Handle 4xx / 5xx errors
    if (response.status < 200 || response.status >= 300) {
        const message = (response.data as any)?.message || `Erreur ${response.status}`;
        throw new Error(message);
    }

    // Successful response
    return response.data as T;
} 