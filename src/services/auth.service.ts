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
import { apiRequest } from '@/lib/api-client';

class AuthService {
    /**
     * Méthode utilitaire pour gérer les requêtes HTTP via le client centralisé
     */
    private makeRequest<T>(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        endpoint: string,
        data?: unknown,
        params?: Record<string, any>
    ): Promise<AuthResponse<T>> {
        // Délègue la logique réseau au client centralisé qui inclut déjà credentials: "include"
        return apiRequest<AuthResponse<T>>(method, endpoint, { data, params });
    }

    // Inscription
    async register(data: RegisterRequest): Promise<AuthResponse<RegisterResponse>> {
        return this.makeRequest('POST', '/auth/register', data);
    }

    // Étape 1 de l'inscription
    async completeStep1(data: RegisterStepOneRequest): Promise<AuthResponse<{ message: string }>> {
        return this.makeRequest('POST', '/auth/register/step1', data);
    }

    // Étape 2 de l'inscription
    async completeStep2(data: RegisterStepTwoRequest): Promise<AuthResponse<{ message: string }>> {
        return this.makeRequest('POST', '/auth/register/step2', data);
    }

    // Étape 3 de l'inscription
    async completeStep3(data: RegisterStepThreeRequest): Promise<AuthResponse<{ message: string }>> {
        return this.makeRequest('POST', '/auth/register/step3', data);
    }

    // Connexion
    async login(data: LoginRequest): Promise<AuthResponse<LoginResponse>> {
        return this.makeRequest('POST', '/auth/login', data);
    }

    // Vérification d'email
    async verifyEmail(data: VerifyEmailRequest): Promise<AuthResponse<{ message: string }>> {
        return this.makeRequest('POST', '/auth/verify-email', data);
    }

    // Renvoi du code de vérification
    async resendVerification(data: ResendVerificationRequest): Promise<AuthResponse<{ message: string }>> {
        return this.makeRequest('POST', '/auth/resend-verification', data);
    }

    // Demande de réinitialisation de mot de passe
    async requestPasswordReset(data: ForgotPasswordRequest): Promise<AuthResponse<{ message: string }>> {
        return this.makeRequest('POST', '/auth/forgot-password', data);
    }

    // Vérification du code de réinitialisation
    async verifyResetCode(data: VerifyResetCodeRequest): Promise<AuthResponse<{ message: string }>> {
        return this.makeRequest('POST', '/auth/verify-reset-code', data);
    }

    // Réinitialisation du mot de passe
    async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse<{ message: string }>> {
        return this.makeRequest('POST', '/auth/reset-password', data);
    }

    // Déconnexion
    async logout(): Promise<AuthResponse<LogoutResponse>> {
        // Le backend s'occupe de supprimer les cookies de session.
        return this.makeRequest('POST', '/auth/logout');
    }
}

export const authService = new AuthService();