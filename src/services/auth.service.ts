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
    /**
     * Méthode utilitaire pour gérer les requêtes HTTP avec retry et gestion d'erreurs
     */
    private async makeRequest<T>(
        method: 'GET' | 'POST',
        endpoint: string,
        data?: unknown,
        retries = 3
    ): Promise<AuthResponse<T>> {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const fetchOptions: RequestInit = {
            method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        if (data && method !== 'GET') {
            fetchOptions.body = JSON.stringify(data);
        }

        try {
            const res = await fetch(`${API_URL}${endpoint}`, fetchOptions);

            const responseData = (await res.json()) as AuthResponse<T>;

            switch (res.status) {
                case 429: {
                    const retryAfter = parseInt(res.headers.get('retry-after') ?? '5', 10);
                    await delay(retryAfter * 1000);
                    if (retries > 0) {
                        return this.makeRequest(method, endpoint, data, retries - 1);
                    }
                    throw new Error('Trop de requêtes. Veuillez réessayer plus tard.');
                }
                case 419:
                    if (retries > 0) {
                        await delay(1000);
                        return this.makeRequest(method, endpoint, data, retries - 1);
                    }
                    throw new Error('Session expirée. Veuillez rafraîchir la page.');
                case 401:
                    throw new Error('Non autorisé. Veuillez vous reconnecter.');
                case 403:
                    throw new Error('Accès refusé.');
            }

            if (!res.ok) {
                throw new Error((responseData as any)?.message || `Erreur ${res.status}`);
            }

            return responseData;
        } catch (error: any) {
            if (error.message?.includes('rate_limits:rlflx-get') && retries > 0) {
                await delay(1000);
                return this.makeRequest(method, endpoint, data, retries - 1);
            }
            throw new Error(error.message || 'Une erreur est survenue');
        }
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
        return this.makeRequest('POST', '/auth/logout');
    }
}

export const authService = new AuthService();