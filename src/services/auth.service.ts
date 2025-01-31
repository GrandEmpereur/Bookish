import { LoginInput, RegisterInput } from "@/lib/validations/auth";
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

            // Nettoyage complet du localStorage
            localStorage.removeItem('hasSeenOnboarding');
            // Ajout d'autres removeItem si nécessaire
        } catch (error) {
            console.error('Logout error:', error);
            throw error; // Important de propager l'erreur
        }
    }

    async register(data: RegisterInput) {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/register`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    birthDate: data.birthdate // Conversion du format de date
                },
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    async verifyEmail(email: string, code: string) {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/verify-email`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { email, code }
            });

            return response.data;
        } catch (error) {
            console.error('Email verification error:', error);
            throw error;
        }
    }

    async resendVerification(email: string) {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/resend-verification`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { email }
            });

            return response.data;
        } catch (error) {
            console.error('Resend verification error:', error);
            throw error;
        }
    }

    async completeStep1(email: string, usagePurpose: string) {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/register/step1`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { email, usagePurpose }
            });

            return response.data;
        } catch (error) {
            console.error('Step 1 error:', error);
            throw error;
        }
    }

    async completeStep2(email: string, readingHabit: string) {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/register/step2`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { email, readingHabit }
            });

            return response.data;
        } catch (error) {
            console.error('Step 2 error:', error);
            throw error;
        }
    }

    async completeStep3(email: string, preferredGenres: string[]) {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/register/step3`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { email, preferredGenres }
            });

            return response.data;
        } catch (error) {
            console.error('Step 3 error:', error);
            throw error;
        }
    }

    async forgotPassword(email: string) {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/forgot-password`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { email }
            });

            return response.data;
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    }

    async verifyResetCode(email: string, code: string) {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/verify-reset-code`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { email, code }
            });

            return response.data;
        } catch (error) {
            console.error('Verify reset code error:', error);
            throw error;
        }
    }

    async resetPassword(email: string, newPassword: string) {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/reset-password`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { email, newPassword }
            });

            return response.data;
        } catch (error) {
            console.error('Reset password error:', error);
            throw error;
        }
    }
}

export const authService = new AuthService(); 