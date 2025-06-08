// Centralized API client for all HTTP requests.
// This helper detects the platform and uses the appropriate HTTP client:
// - Browser: native fetch with credentials
// - iOS/Capacitor: CapacitorHttp for better file upload support

import { CapacitorHttp } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// Generic helper options
interface RequestOptions {
    data?: any;
    params?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
    retries?: number;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Browser request using native fetch
async function browserRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    headers: Record<string, string> = {}
): Promise<T> {
    const isFormData = data instanceof FormData;

    const requestInit: RequestInit = {
        method,
        credentials: 'include', // Important pour les cookies
        headers: isFormData
            ? { ...headers } // Ne pas ajouter Content-Type pour FormData
            : { 'Content-Type': 'application/json', ...headers }
    };

    if (data) {
        if (isFormData) {
            requestInit.body = data; // FormData tel quel
        } else {
            requestInit.body = JSON.stringify(data);
        }
    }

    const response = await fetch(url, requestInit);

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorData}`);
    }

    const responseData = await response.json();
    return responseData as T;
}

// Capacitor request using CapacitorHttp avec gestion native du multipart
async function capacitorRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    data?: any,
    headers: Record<string, string> = {}
): Promise<T> {
    const isFormData = data instanceof FormData;

    let requestData = data;
    let requestHeaders = { ...headers };

    // Pour FormData sur Capacitor, utilisons l'approche native avec files
    if (isFormData) {
        const formFields: Record<string, string> = {};
        const formFiles: Record<string, any> = {};

        for (const [key, value] of data.entries()) {
            if (value instanceof File) {
                try {
                    // Convertir le fichier en base64 pour CapacitorHttp
                    const arrayBuffer = await value.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);
                    let binary = '';
                    for (let i = 0; i < uint8Array.byteLength; i++) {
                        binary += String.fromCharCode(uint8Array[i]);
                    }
                    const base64Data = btoa(binary);

                    // CapacitorHttp attend cette structure pour les fichiers
                    formFiles[key] = {
                        type: value.type,
                        name: value.name,
                        data: base64Data
                    };
                } catch (error) {
                    throw new Error(`Erreur lors de la conversion du fichier ${key}`);
                }
            } else {
                formFields[key] = String(value);
            }
        }

        // Utiliser l'API multipart de CapacitorHttp
        requestData = {
            ...formFields,
            ...formFiles
        };

        // CapacitorHttp gère automatiquement multipart/form-data quand il y a des fichiers
        // Ne pas spécifier Content-Type
        delete requestHeaders['Content-Type'];

    } else if (data && typeof data === 'object') {
        requestHeaders['Content-Type'] = 'application/json';
        requestData = JSON.stringify(data);
    }

    const requestConfig = {
        method,
        url,
        headers: requestHeaders,
        data: requestData,
        webFetchExtra: {
            credentials: 'include' as RequestCredentials
        }
    };

    try {
        const response = await CapacitorHttp.request(requestConfig);

        if (response.status < 200 || response.status >= 300) {
            const message = (response.data as any)?.message || `Erreur ${response.status}`;
            throw new Error(message);
        }

        return response.data as T;

    } catch (error) {
        throw error;
    }
}

// Main request helper – detects platform and uses appropriate HTTP client
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

    // Détection de la plateforme
    const isNative = Capacitor.isNativePlatform();
    const isBrowser = !isNative;
    const isFormData = data instanceof FormData;

    try {
        let result: T;

        // TOUJOURS utiliser fetch() pour FormData (multipart fonctionne mieux)
        if (isFormData) {
            result = await browserRequest<T>(method, url.toString(), data, headers);
        } else if (isBrowser) {
            // Utiliser fetch natif sur browser pour les autres requêtes
            result = await browserRequest<T>(method, url.toString(), data, headers);
        } else {
            // Utiliser CapacitorHttp sur mobile/natif pour les requêtes non-FormData
            result = await capacitorRequest<T>(method, url.toString(), data, headers);
        }

        return result;

    } catch (error: any) {
        // Retry logic pour les erreurs 429
        if (error.message?.includes('429') && retries > 0) {
            await delay(1000);
            return apiRequest<T>(method, endpoint, { data, params, headers, retries: retries - 1 });
        }

        throw error;
    }
} 