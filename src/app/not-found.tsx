"use client";

import { TopBar } from "@/components/layout/top-bar";
import { BottomBar } from "@/components/layout/bottom-bar";
import { getTopBarConfig } from "@/config/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function NotFound({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const topBarConfig = getTopBarConfig(pathname);

  return (
    <div className="min-h-dvh flex flex-col bg-background w-full">
      <TopBar config={topBarConfig} />
      <main className="">
        <div className="flex flex-col items-center justify-center h-dvh">
          <Image
            src="/mascote/surprised.svg"
            width={200}
            height={200}
            alt="Surprised"
            priority
            className="pb-6"
          />
          <h1 className="text-2xl font-bold">404 - Page non trouvée</h1>
          <p className="text-gray-500">
            La page que vous cherchez n'existe pas.
          </p>
        </div>
      </main>
      <BottomBar />
    </div>
  );
}
