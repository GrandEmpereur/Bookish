'use client';

import { TopBar } from "@/components/layout/top-bar";
import { BottomBar } from "@/components/layout/bottom-bar";
import { getTopBarConfig } from "@/config/navigation";
import { usePathname } from 'next/navigation';

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const topBarConfig = getTopBarConfig(pathname);

    return (
        <div className="min-h-[100dvh] flex flex-col bg-background">
            <TopBar config={topBarConfig} />
            <main className="flex-1 safe-area-pt pb-[80px]">
                {children}
            </main>
            <BottomBar />
        </div>
    );
} 