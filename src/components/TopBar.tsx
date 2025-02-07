"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronLeft,
  Bell,
  SendHorizontal,
  Settings,
  QrCode,
  Search,
  Plus,
  Pencil,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import topBarConfig from "@lib/data/topBarConfig.json";
import useListInfo from "@/hooks/TopBar/useListAction";

interface TitleConfig {
  text: string;
  icon?: string;
}

interface TopBarConfig {
  showBackButton: boolean;
  title: TitleConfig;
  rightIcons: string[];
}

// Fonction pour normaliser les routes dynamiques
const normalizePath = (path: string): string => {
  if (/^\/feed\/[^\/]+\/comments\/?$/.test(path)) return "/feed/[id]/comments";

  // Lists
  if (/^\/lists\/create\/?$/.test(path)) return "/lists/create";
  if (/^\/lists\/[^\/]+\/?$/.test(path)) return "/lists/[id]";
  if (/^\/lists\/[^\/]+\/edit\/?$/.test(path)) return "/lists/[id]/edit";
  return path;
};

const TopBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { listName, isCreateList, isEditList, isListPage, listId } =
    useListInfo();

  const normalizedPath = normalizePath(pathname);

  // Charger la configuration de la top bar
  const config: TopBarConfig = topBarConfig[
    normalizedPath as keyof typeof topBarConfig
  ] || {
    showBackButton: false,
    title: { text: "", icon: "" },
    rightIcons: [],
  };

  // Modifier le titre si on est sur une page de liste
  if (isListPage && !isCreateList) {
    config.title.text = listName || "";
  }

  // Mapping des icônes
  const iconMap: Record<string, JSX.Element> = {
    notifications: (
      <Link href="/notifications" key="notifications">
        <Button size="icon" variant="icon">
          <Bell size={20} stroke="#2f5046" />
        </Button>
      </Link>
    ),
    messages: (
      <Link href="/messages" key="messages">
        <Button size="icon" variant="icon">
          <SendHorizontal size={20} stroke="#2f5046" />
        </Button>
      </Link>
    ),
    settings: (
      <Link href="/profile/settings" key="settings">
        <Button size="icon" variant="icon">
          <Settings size={20} stroke="#2f5046" />
        </Button>
      </Link>
    ),
    search: (
      <Link href="/search" key="search">
        <Button size="icon" variant="icon">
          <Search size={20} stroke="#2f5046" />
        </Button>
      </Link>
    ),
    plus: (
      <Link href="/lists/create" key="plus">
        <Button size="icon" variant="icon">
          <Plus size={20} stroke="#2f5046" />
        </Button>
      </Link>
    ),
    modifyList: isListPage && !isEditList && listId && (
      <Link href={`/lists/${listId}/edit`} key="edit">
        <Button size="icon" variant="icon">
          <Pencil size={20} stroke="#2f5046" />
        </Button>
      </Link>
    ),
    validate: isEditList && listId && (
      <Link href={`/lists/${listId}`} key="validate">
        <Button size="icon" variant="icon">
          <Check size={20} stroke="#2f5046" />
        </Button>
      </Link>
    ),
  };

  // Rendre dynamiquement les icônes de droite
  const renderRightIcons = (): JSX.Element[] => {
    const icons = config.rightIcons
      .filter((icon) => icon in iconMap)
      .map((icon) => iconMap[icon]);

    // Ajouter le bouton "create" sur /lists/, sauf si on est en train d'éditer
    if (!isListPage && !isCreateList && !isEditList) {
      icons.push(iconMap.plus);
    }

    return icons;
  };

  return (
    <div className="fixed left-0 right-0 bg-white text-black flex justify-between items-center z-50 h-[100px]">
      <div className="w-full pt-12">
        <div className="flex w-full items-center justify-between px-5">
          {/* Bouton retour ou logo */}
          {config.showBackButton ? (
            <Button size="icon" variant="ghost" onClick={() => router.back()}>
              <ChevronLeft size={20} stroke="#b2511a" />
            </Button>
          ) : (
            <Link href="/feed">
              <Image
                src="/Bookish2.svg"
                alt="logo"
                width={24}
                height={24}
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
          )}

          {/* Titre avec icône QR code si nécessaire */}
          <div className="flex items-center">
            {config.title.icon === "qr-code" && (
              <QrCode size={20} className="mr-2" />
            )}
            <h1 className="text-lg font-heading">{config.title.text}</h1>
          </div>

          {/* Icônes à droite */}
          <div className="flex gap-x-2 min-w-10">{renderRightIcons()}</div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
