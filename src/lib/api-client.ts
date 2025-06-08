// Centralized API client for all HTTP requests.
// This helper ensures `credentials: 'include'` is always set and provides
// basic retry / error-handling logic that can be shared by every service.

import { CapacitorHttp } from '@capacitor/core';

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

    // CapacitorHttp is available on both web & mobile – it falls back to fetch under the hood on web
    const response = await CapacitorHttp.request({
        method,
        url: url.toString(),
        headers: { 'Content-Type': 'application/json', ...headers },
        data,
        webFetchExtra: { credentials: 'include' },
    });

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