'use client';

import { TopBar } from "@/components/layout/top-bar";
import { BottomBar } from "@/components/layout/bottom-bar";
import { getTopBarConfig } from "@/config/navigation";
import { usePathname } from 'next/navigation';
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { Loader2 } from "lucide-react";

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading } = useAuthGuard();
    const pathname = usePathname();
    const topBarConfig = getTopBarConfig(pathname);

    if (isLoading) {
        return (
            <div className="h-[100dvh] w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] flex flex-col bg-background w-full">
            <TopBar config={topBarConfig} />
            <main className="">
                {children}
            </main>
            <BottomBar />
        </div>
    );
} 