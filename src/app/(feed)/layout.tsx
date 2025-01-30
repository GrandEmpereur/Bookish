'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/contexts/auth-context";

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Simple vérification : si pas authentifié, redirection vers login
        if (!isAuthenticated) {
            router.replace('/auth/login');
        }
    }, [isAuthenticated, router]);

    // Ne rendre les enfants que si l'utilisateur est authentifié
    if (!isAuthenticated) {
        return null;
    }

    return children;
} 