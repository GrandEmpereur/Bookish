// bottomBarConfig.ts
import { Bookmark, House, MessagesSquare, Search, User } from "lucide-react";
import { ReactElement } from "react";

// Interface pour chaque élément de la bottom bar
export interface BottomBarItem {
  href: string;
  icon: ReactElement; // Typage pour les icônes React
  label: string;
  special?: boolean; // Indicateur pour les éléments spéciaux comme le bouton central
}

// Interface pour la configuration de la bottom bar
export interface BottomBarConfig {
  show: boolean;
  items: BottomBarItem[];
}

// Configuration pour chaque page, avec un objet qui mappe les chemins aux configurations
export const bottomBarConfigs: Record<string, BottomBarConfig> = {
  "/feed/": {
    show: true,
    items: [
      { href: "/feed", icon: <House size={24} />, label: "Accueil" },
      { href: "/lists", icon: <Bookmark size={24} />, label: "Mes listes" },
      {
        href: "/search",
        icon: <Search size={24} className="text-white" />,
        label: "",
        special: true,
      },
      {
        href: "/community",
        icon: <MessagesSquare size={24} />,
        label: "Communautés",
      },
      { href: "/profile", icon: <User size={24} />, label: "Profile" },
    ],
  },
  "/lists/": {
    show: true,
    items: [
      { href: "/feed", icon: <House size={24} />, label: "Accueil" },
      { href: "/lists", icon: <Bookmark size={24} />, label: "Mes listes" },
      {
        href: "/search",
        icon: <Search size={24} className="text-white" />,
        label: "",
        special: true,
      },
      {
        href: "/community",
        icon: <MessagesSquare size={24} />,
        label: "Communautés",
      },
      { href: "/profile", icon: <User size={24} />, label: "Profile" },
    ],
  },
  "/profile/": {
    show: true,
    items: [
      { href: "/feed", icon: <House size={24} />, label: "Accueil" },
      { href: "/lists", icon: <Bookmark size={24} />, label: "Mes listes" },
      {
        href: "/search",
        icon: <Search size={24} className="text-white" />,
        label: "",
        special: true,
      },
      {
        href: "/community",
        icon: <MessagesSquare size={24} />,
        label: "Communautés",
      },
      { href: "/profile", icon: <User size={24} />, label: "Profile" },
    ],
  },
  "/messages/": {
    show: false,
    items: [],
  },
  // Autres configurations de pages...
};
