'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from "@/services/auth.service";

interface User {
    id: string;
    email: string;
    username: string;
    is_verified: boolean;
    has_logged_in: boolean;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

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
            const userData = await authService.checkAuth();
            
            if (userData) {
                setUser(userData);
                setIsAuthenticated(true);
                
                if (window.location.pathname.startsWith('/auth')) {
                    router.replace('/feed');
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                if (!window.location.pathname.startsWith('/auth')) {
                    router.replace('/auth/login');
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string, rememberMe: boolean) => {
        try {
            setIsLoading(true);
            const result = await authService.login({ email, password, rememberMe });
            
            if (result.status === 'success') {
                await checkAuth();
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        router.replace('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 