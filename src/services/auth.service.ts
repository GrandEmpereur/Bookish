import { LoginInput } from "@/lib/validations/auth";
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

// Interface pour la réponse de l'API
interface ApiResponse {
    status: 'success' | 'error';
    message: string;
    data?: {
        id: string;
        username: string;
        email: string;
        is_verified: boolean;
        has_logged_in: boolean;
        created_at: string;
        updated_at: string;
    };
}

// Interface pour les erreurs
interface ApiError {
    message: string;
    status?: number;
    stack?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class AuthService {
    async login(data: LoginInput) {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/login`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur de connexion');
            }

            const result = response.data as ApiResponse;

            if (result.status === "success" && result.data) {
                localStorage.setItem('user', JSON.stringify(result.data));
                if (data.rememberMe) {
                    localStorage.setItem('isLoggedIn', 'true');
                }
            }

            return result;
        } catch (error: unknown) {
            const apiError: ApiError = {
                message: error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
                stack: error instanceof Error ? error.stack : undefined
            };

            console.log('Error details:', apiError);
            throw apiError;
        }
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
    }

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    isLoggedIn() {
        return !!this.getCurrentUser();
    }
}

export const authService = new AuthService(); 