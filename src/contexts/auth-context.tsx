'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import type { UserProfile as User } from "@/types/userTypes";
import type { LoginRequest, RegisterRequest, VerifyEmailRequest, ResendVerificationRequest, RegisterStepOneRequest, RegisterStepTwoRequest, RegisterStepThreeRequest, ForgotPasswordRequest, VerifyResetCodeRequest, ResetPasswordRequest } from "@/types/authTypes";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    verifyEmail: (data: VerifyEmailRequest) => Promise<void>;
    resendVerification: (data: ResendVerificationRequest) => Promise<void>;
    completeStepOne: (data: RegisterStepOneRequest) => Promise<void>;
    completeStepTwo: (data: RegisterStepTwoRequest) => Promise<void>;
    completeStepThree: (data: RegisterStepThreeRequest) => Promise<void>;
    requestPasswordReset: (data: ForgotPasswordRequest) => Promise<void>;
    verifyResetCode: (data: VerifyResetCodeRequest) => Promise<void>;
    resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    // Vérification initiale de l'authentification
    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await userService.getAuthenticatedProfile();
                setUser(response.data);
            } catch (error: any) {
                // Si l'erreur est 401, c'est normal - l'utilisateur n'est pas connecté
                if (error.status === 401) {
                    setUser(null);
                } else {
                    console.error('Auth init error:', error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (data: LoginRequest) => {
        try {
            setIsLoading(true);
            await authService.login(data);
            
            // Attendre un peu pour s'assurer que les cookies sont bien définis
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const userResponse = await userService.getAuthenticatedProfile();
            setUser(userResponse.data);
            
            toast({
                title: "Connexion réussie",
                description: "Bienvenue sur Bookish !",
            });

            router.replace("/feed");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: error.message || "Une erreur est survenue lors de la connexion",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        try {
            await authService.register(data);
            toast({
                title: "Inscription réussie",
                description: "Veuillez vérifier votre email pour continuer",
            });
            router.push("/auth/register/verification");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur d'inscription",
                description: error.message || "Une erreur est survenue lors de l'inscription",
            });
            throw error;
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await authService.logout();
            setUser(null);
            router.replace("/auth/login");
            toast({
                title: "Déconnexion réussie",
                description: "À bientôt !",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur de déconnexion",
                description: error.message || "Une erreur est survenue lors de la déconnexion",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUser = async () => {
        try {
            const response = await userService.getAuthenticatedProfile();
            setUser(response.data);
        } catch (error: any) {
            if (error.status === 401) {
                setUser(null);
                router.replace('/auth/login');
            }
        }
    };

    const verifyEmail = async (data: VerifyEmailRequest) => {
        try {
            await authService.verifyEmail(data);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur de vérification",
                description: error.message || "Une erreur est survenue lors de la vérification"
            });
            throw error;
        }
    };

    const resendVerification = async (data: ResendVerificationRequest) => {
        try {
            await authService.resendVerification(data);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors du renvoi du code"
            });
            throw error;
        }
    };

    const completeStepOne = async (data: RegisterStepOneRequest) => {
        try {
            await authService.completeStep1(data);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de la sélection"
            });
            throw error;
        }
    };

    const completeStepTwo = async (data: RegisterStepTwoRequest) => {
        try {
            await authService.completeStep2(data);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de la sélection"
            });
            throw error;
        }
    };

    const completeStepThree = async (data: RegisterStepThreeRequest) => {
        try {
            await authService.completeStep3(data);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de la sélection"
            });
            throw error;
        }
    };

    const requestPasswordReset = async (data: ForgotPasswordRequest) => {
        try {
            await authService.requestPasswordReset(data);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue"
            });
            throw error;
        }
    };

    const verifyResetCode = async (data: VerifyResetCodeRequest) => {
        try {
            await authService.verifyResetCode(data);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Code invalide"
            });
            throw error;
        }
    };

    const resetPassword = async (data: ResetPasswordRequest) => {
        try {
            await authService.resetPassword(data);
            toast({
                title: "Succès",
                description: "Votre mot de passe a été réinitialisé"
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue"
            });
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
                verifyEmail,
                resendVerification,
                completeStepOne,
                completeStepTwo,
                completeStepThree,
                requestPasswordReset,
                verifyResetCode,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
} 