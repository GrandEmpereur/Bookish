import { CapacitorHttp } from '@capacitor/core';
import { LoginInput, RegisterInput } from "@/lib/validations/auth";
import {
    AuthResponse,
    RegisterStepOneInput,
    RegisterStepTwoInput,
    RegisterStepThreeInput,
    VerifyEmailInput,
    ForgotPasswordInput,
    ResetPasswordInput,
    VerifyResetCodeInput,
    SessionResponse
} from '@/types/auth';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class AuthService {
    // Inscription initiale
    async register(data: RegisterInput): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/register`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de l\'inscription');
            }

            return response.data;
        } catch (error: any) {
            console.error('Register error:', error);
            throw error;
        }
    }

    // Étape 1 - Objectif d'utilisation
    async registerStepOne(data: RegisterStepOneInput): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/register/step1`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de l\'étape 1');
            }

            return response.data;
        } catch (error: any) {
            console.error('Register step 1 error:', error);
            throw error;
        }
    }

    // Étape 2 - Habitudes de lecture
    async registerStepTwo(data: RegisterStepTwoInput): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/register/step2`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de l\'étape 2');
            }

            return response.data;
        } catch (error: any) {
            console.error('Register step 2 error:', error);
            throw error;
        }
    }

    // Étape 3 - Genres préférés
    async registerStepThree(data: RegisterStepThreeInput): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/register/step3`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de l\'étape 3');
            }

            return response.data;
        } catch (error: any) {
            console.error('Register step 3 error:', error);
            throw error;
        }
    }

    // Connexion
    async login(data: LoginInput): Promise<ApiResponse<AuthResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/login`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur de connexion');
            }

            return response.data;
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Déconnexion
    async logout(): Promise<void> {
        try {
            await CapacitorHttp.post({
                url: `${API_URL}/auth/logout`,
                webFetchExtra: { credentials: 'include' }
            });
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    // Vérification Email
    async verifyEmail(data: VerifyEmailInput): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/verify-email`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Code de vérification invalide');
            }

            return response.data;
        } catch (error: any) {
            console.error('Verify email error:', error);
            throw error;
        }
    }

    // Renvoyer Email de Vérification
    async resendVerification(email: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/resend-verification`,
                headers: { 'Content-Type': 'application/json' },
                data: { email },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du renvoi');
            }

            return response.data;
        } catch (error: any) {
            console.error('Resend verification error:', error);
            throw error;
        }
    }

    // Mot de passe oublié
    async forgotPassword(data: ForgotPasswordInput): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/forgot-password`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la demande');
            }

            return response.data;
        } catch (error: any) {
            console.error('Forgot password error:', error);
            throw error;
        }
    }

    // Vérifier Code de Réinitialisation
    async verifyResetCode(data: VerifyResetCodeInput): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/verify-reset-code`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Code invalide');
            }

            return response.data;
        } catch (error: any) {
            console.error('Verify reset code error:', error);
            throw error;
        }
    }

    // Réinitialisation Mot de passe
    async resetPassword(data: ResetPasswordInput): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/reset-password`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la réinitialisation');
            }

            return response.data;
        } catch (error: any) {
            console.error('Reset password error:', error);
            throw error;
        }
    }

    // Vérifier la session
    async checkSession(): Promise<ApiResponse<SessionResponse>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/auth/check-session`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error('Session non valide ou expirée');
            }

            return response.data;
        } catch (error: any) {
            console.error('Check session error:', error);
            throw error;
        }
    }
}

export const authService = new AuthService(); 