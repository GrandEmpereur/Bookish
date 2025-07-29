"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Library, Search, Users, User } from "lucide-react";
import { Capacitor } from "@capacitor/core";

const navigationItems = [
  {
    href: "/feed/",
    label: "Accueil",
    icon: Home,
  },
  {
    href: "/library/",
    label: "Mes listes",
    icon: Library,
  },
  {
    href: "/search/",
    label: "Recherche",
    icon: Search,
    isSearch: true,
  },
  {
    href: "/clubs/",
    label: "Clubs",
    icon: Users,
  },
  {
    href: "/profile/",
    label: "Mon profil",
    icon: User,
  },
];

export function BottomBar() {
  const pathname = usePathname();

  // Détection de la plateforme
  const isNative = Capacitor.isNativePlatform();
  const isBrowser = !isNative;

  return (
    <nav
      className={cn(
        "z-100 fixed bottom-0 left-0 right-0 bg-background border-t rounded-t-[30px] shadow-lg",
        isNative ? "pb-[30px]" : "pb-[30px]"
      )}
    >
      <div
        className={cn(
          "flex justify-around items-end relative",
          isNative ? "py-2" : "py-3"
        )}
      >
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 w-[20%]",
              pathname === item.href
                ? "text-primary-500"
                : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center",
                item.isSearch &&
                  "bg-primary p-3 rounded-full shadow-lg -mt-10 [box-shadow:var(--shadow-strong)]"
              )}
            >
              <item.icon
                size={item.isSearch ? 20 : 20}
                className={cn(
                  item.isSearch
                    ? "text-white"
                    : pathname === item.href
                      ? "text-primary-800 "
                      : "text-muted-foreground "
                )}
              />
            </div>
            <span
              className={cn(
                "text-xs",
                pathname === item.href
                  ? "text-primary-800 font-semibold"
                  : "text-muted-foreground font-normal"
              )}
            >
              {item.label}
            </span>{" "}
          </Link>
        ))}
      </div>
    </nav>
  );
}
