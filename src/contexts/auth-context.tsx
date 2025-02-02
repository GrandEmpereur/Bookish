'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import type { User } from "@/types/user";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginInput) => Promise<void>;
    register: (data: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
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
                const response = await userService.getProfile();
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

    const login = async (data: LoginInput) => {
        try {
            setIsLoading(true);
            await authService.login(data);
            
            // Attendre un peu pour s'assurer que les cookies sont bien définis
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const userResponse = await userService.getProfile();
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

    const register = async (data: RegisterInput) => {
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
            const response = await userService.getProfile();
            setUser(response.data);
        } catch (error: any) {
            if (error.status === 401) {
                setUser(null);
                router.replace('/auth/login');
            }
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