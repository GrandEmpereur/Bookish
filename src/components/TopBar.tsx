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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import topBarConfig from "@lib/data/topBarConfig.json";
import { useState, useEffect } from "react";
import { getListById } from "@/services/listsService"; // Assurez-vous que cette fonction existe pour récupérer les informations

interface TitleConfig {
  text: string;
  icon?: string;
}

interface TopBarConfig {
  showBackButton: boolean;
  title: TitleConfig;
  rightIcons: string[];
}

// Fonction pour normaliser le chemin de la route
const normalizePath = (path: string): string => {
  const feedCommentsRegex = /^\/feed\/[^\/]+\/comments\/?$/;
  if (feedCommentsRegex.test(path)) {
    return "/feed/[id]/comments";
  }
  const listsIdRegex = /^\/lists\/[^\/]+\/?$/;

  if (listsIdRegex.test(path)) {
    return "/lists/[id]";
  }
  return path;
};

const TopBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [listName, setListName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Normaliser le chemin de la route
  const normalizedPath = normalizePath(pathname);

  // Vérifier si on est sur une page de type /lists/[id]
  const isListPage = normalizedPath === "/lists/[id]";

  // Si on est sur une page /lists/[id], on charge le nom de la bibliothèque depuis l'API
  useEffect(() => {
    if (isListPage) {
      const listId = pathname.split("/")[2]; // Extraction de l'ID de la liste depuis l'URL

      if (listId) {
        setLoading(true);
        setListName(null); // Réinitialiser le nom de la liste pendant le chargement

        getListById(listId)
          .then((response) => {
            setListName(response.data.name); // Mettre à jour avec le nom de la bibliothèque
          })
          .catch((error) => {
            console.error(
              "Erreur lors de la récupération de la liste :",
              error
            );
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [pathname]);

  // Charger la configuration pour la route actuelle ou utiliser une configuration par défaut
  const config: TopBarConfig = topBarConfig[
    normalizedPath as keyof typeof topBarConfig
  ] || {
    showBackButton: false,
    title: { text: "", icon: "" },
    rightIcons: [],
  };

  // Si on est sur une page de liste, modifier le titre
  if (isListPage) {
    config.title.text = loading ? "Chargement..." : listName || "Bibliothèque";
  }

  // Mapper les icônes aux composants JSX
  const iconMap: { [key: string]: JSX.Element } = {
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
      <Link href="/search" key="plus">
        <Button size="icon" variant="icon">
          <Plus size={20} stroke="#2f5046" />
        </Button>
      </Link>
    ),
    pencil: (
      <Link href="/search" key="pencil">
        <Button size="icon" variant="icon">
          <Pencil size={20} stroke="#2f5046" />
        </Button>
      </Link>
    ),
  };

  // Rendre dynamiquement les icônes de droite en fonction de la configuration
  const renderRightIcons = (): JSX.Element[] => {
    return config.rightIcons
      .filter((icon) => icon in iconMap)
      .map((icon) => iconMap[icon]);
  };

  return (
    <div className="fixed left-0 right-0 bg-white text-black flex justify-between items-center z-50 h-[100px]">
      <div className="w-full pt-12">
        <div className="flex w-full items-center justify-between px-5">
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

          <div className="flex items-center">
            {config.title.icon === "qr-code" && (
              <QrCode size={20} className="mr-2" />
            )}
            <h1 className="text-lg font-heading">{config.title.text}</h1>
          </div>

          <div className="flex gap-x-[5px]">{renderRightIcons()}</div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
