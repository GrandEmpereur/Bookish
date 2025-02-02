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

    useEffect(() => {
        let inactivityTimer: NodeJS.Timeout;

        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(checkAuth, 30 * 60 * 1000); // 30 minutes
        };

        document.addEventListener('mousemove', resetInactivityTimer);
        document.addEventListener('keypress', resetInactivityTimer);

        checkAuth();

        return () => {
            document.removeEventListener('mousemove', resetInactivityTimer);
            document.removeEventListener('keypress', resetInactivityTimer);
            clearTimeout(inactivityTimer);
        };
    }, []);

    const checkAuth = async () => {
        try {
            const response = await userService.getProfile();
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginInput) => {
        try {
            const authResponse = await authService.login(data);
            const userResponse = await userService.getProfile();
            setUser(userResponse.data);
            
            toast({
                title: "Connexion réussie",
                description: "Bienvenue sur Bookish !",
            });

            router.push("/feed");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur de connexion",
                description: error.message || "Une erreur est survenue lors de la connexion",
            });
            throw error;
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
            await authService.logout();
            setUser(null);
            router.push("/auth/login");
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
        }
    };

    const refreshUser = async () => {
        try {
            const response = await userService.getProfile();
            setUser(response.data);
        } catch (error) {
            setUser(null);
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