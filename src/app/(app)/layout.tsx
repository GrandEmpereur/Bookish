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

  return (
    <div className="min-h-dvh flex flex-col bg-background w-full">
      <TopBar config={topBarConfig} />
      <main className="">{children}</main>
      <BottomBar />
    </div>
  );
}
