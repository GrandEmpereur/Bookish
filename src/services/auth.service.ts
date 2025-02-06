import { CapacitorHttp } from '@capacitor/core';
import {
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    RegisterResponse,
    LoginResponse,
    LogoutResponse,
    VerifyEmailRequest,
    ResendVerificationRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyResetCodeRequest,
    RegisterStepOneRequest,
    RegisterStepTwoRequest,
    RegisterStepThreeRequest
} from '@/types/authTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class AuthService {
    // POST /auth/register
    async register(data: RegisterRequest): Promise<AuthResponse<RegisterResponse>> {
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

    // POST /auth/register/step1
    async completeStep1(data: RegisterStepOneRequest): Promise<AuthResponse<{ message: string }>> {
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
            console.error('Complete step 1 error:', error);
            throw error;
        }
    }

    // POST /auth/register/step2
    async completeStep2(data: RegisterStepTwoRequest): Promise<AuthResponse<{ message: string }>> {
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
            console.error('Complete step 2 error:', error);
            throw error;
        }
    }

    // POST /auth/register/step3
    async completeStep3(data: RegisterStepThreeRequest): Promise<AuthResponse<{ message: string }>> {
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
            console.error('Complete step 3 error:', error);
            throw error;
        }
    }

    // POST /auth/login
    async login(data: LoginRequest): Promise<AuthResponse<LoginResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/login`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la connexion');
            }

            return response.data;
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // POST /auth/verify-email
    async verifyEmail(data: VerifyEmailRequest): Promise<AuthResponse<{ message: string }>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/verify-email`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la vérification de l\'email');
            }

            return response.data;
        } catch (error: any) {
            console.error('Verify email error:', error);
            throw error;
        }
    }

    // POST /auth/resend-verification
    async resendVerification(data: ResendVerificationRequest): Promise<AuthResponse<{ message: string }>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/resend-verification`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du renvoi du code');
            }

            return response.data;
        } catch (error: any) {
            console.error('Resend verification error:', error);
            throw error;
        }
    }

    // POST /auth/forgot-password
    async requestPasswordReset(data: ForgotPasswordRequest): Promise<AuthResponse<{ message: string }>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/forgot-password`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la demande de réinitialisation');
            }

            return response.data;
        } catch (error: any) {
            console.error('Request password reset error:', error);
            throw error;
        }
    }

    // POST /auth/verify-reset-code
    async verifyResetCode(data: VerifyResetCodeRequest): Promise<AuthResponse<{ message: string }>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/verify-reset-code`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la vérification du code');
            }

            return response.data;
        } catch (error: any) {
            console.error('Verify reset code error:', error);
            throw error;
        }
    }

    // POST /auth/reset-password
    async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse<{ message: string }>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/reset-password`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la réinitialisation du mot de passe');
            }

            return response.data;
        } catch (error: any) {
            console.error('Reset password error:', error);
            throw error;
        }
    }

    // POST /auth/logout
    async logout(): Promise<AuthResponse<LogoutResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/auth/logout`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la déconnexion');
            }

            return response.data;
        } catch (error: any) {
            console.error('Logout error:', error);
            throw error;
        }
    }
}

export const authService = new AuthService(); 