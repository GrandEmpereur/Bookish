'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from "@/services/auth.service";

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Utiliser requestAnimationFrame pour une navigation plus fluide
        requestAnimationFrame(() => {
            if (!authService.isLoggedIn()) {
                router.replace('/auth/login'); // replace au lieu de push
            } else if (pathname === '/') {
                router.replace('/feed'); // replace au lieu de push
            }
        });
    }, [router, pathname]);

    return children;
} 