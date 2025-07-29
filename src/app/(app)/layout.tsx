"use client";

import { TopBar } from "@/components/layout/top-bar";
import { BottomBar } from "@/components/layout/bottom-bar";
import { getTopBarConfig } from "@/config/navigation";
import { usePathname } from "next/navigation";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const topBarConfig = getTopBarConfig(pathname);

  // Routes où cacher le bottom bar
  const hideBottomBarRoutes = [
    "/messages/", // Toutes les pages de conversation
  ];

  // Vérifier si on doit cacher le bottom bar
  const shouldHideBottomBar = hideBottomBarRoutes.some(route => 
    pathname.startsWith(route) && pathname !== "/messages"
  );

  return (
    <div className="min-h-dvh flex flex-col bg-background w-full">
      <TopBar config={topBarConfig} />
      <main className="">{children}</main>
      {!shouldHideBottomBar && <BottomBar />}
    </div>
  );
}
