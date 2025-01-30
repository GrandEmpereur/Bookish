'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function useAuthGuard() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            const publicRoutes = ['/auth/login', '/auth/register'];
            const isPublicRoute = publicRoutes.includes(pathname);

            if (!isAuthenticated && !isPublicRoute) {
                router.replace('/auth/login');
            } else if (isAuthenticated && isPublicRoute) {
                router.replace('/feed');
            }
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    return { isLoading };
} 