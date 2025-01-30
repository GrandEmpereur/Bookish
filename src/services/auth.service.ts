import { LoginInput } from "@/lib/validations/auth";
import { CapacitorHttp } from '@capacitor/core';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
    id: string;
    email: string;
    username: string;
    is_verified: boolean;
    has_logged_in: boolean;
}

class AuthService {
    async login(data: LoginInput) {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/login`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    ...data,
                    rememberMe: true
                },
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur de connexion');
            }

            return response.data;
        } catch (error: unknown) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async checkAuth(): Promise<User | null> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/users/me`,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status === 200) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Check auth error:', error);
            return null;
        }
    }

    async logout() {
        try {
            await CapacitorHttp.post({
                url: `${API_URL}/auth/logout`,
                webFetchExtra: {
                    credentials: 'include'
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
}

export const authService = new AuthService(); 