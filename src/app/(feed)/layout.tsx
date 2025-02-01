'use client';

import { TopBar } from "@/components/layout/top-bar";
import { BottomBar } from "@/components/layout/bottom-bar";

export default function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-[100dvh] flex flex-col bg-background">
            <TopBar />
            <main className="flex-1 safe-area-pt pb-[80px]">
                {children}
            </main>
            <BottomBar />
        </div>
    );
} 