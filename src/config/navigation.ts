import { Bell, Send, Search, Settings } from "lucide-react";

type ModalType = "drawer" | "dialog";

export type TopBarConfig = {
  variant: "standard" | "back" | "conversation";
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  hideTopBar?: boolean;
  showBackAbsolute?: boolean;
  showConversationUser?: boolean; // Pour afficher avatar + nom utilisateur
  rightIcons?: {
    icon: typeof Bell | typeof Send | typeof Search | typeof Settings;
    onClick?: () => void;
    href?: string;
    modalType?: ModalType;
  }[];
};

export const topBarConfigs: Record<string, TopBarConfig> = {
  // Default configuration
  default: {
    variant: "back",
    title: "Page",
    showBack: true,
  },

  // Feed
  "/feed": {
    variant: "standard",
    showLogo: true,
    rightIcons: [
      {
        icon: Bell,
        href: "/notifications",
      },
      {
        icon: Send,
        href: "/messages",
      },
    ],
  },
  "/feed/[id]": {
    variant: "back",
    title: "Commentaires",
    showBack: true,
    rightIcons: [
      {
        icon: Bell,
        href: "/notifications",
      },
      {
        icon: Send,
        href: "/messages",
      },
    ],
  },
  "/feed/create": {
    variant: "back",
    title: "Nouveau post",
    showBack: true,
  },

  // Library
  "/library": {
    variant: "back",
    title: "Listes",
    showBack: true,
    rightIcons: [
      {
        icon: Search,
        onClick: () => { },
        modalType: "dialog",
      },
    ],
  },
  "/library/[id]": {
    variant: "back",
    title: "Liste",
    showBack: true,
    rightIcons: [
      {
        icon: Search,
        onClick: () => { },
        modalType: "dialog",
      },
    ],
  },
  "/library/create": {
    variant: "back",
    title: "Ajouter une liste",
    showBack: true,
  },
  "/library/[id]/edit": {
    variant: "back",
    title: "Modifier la liste",
    showBack: true,
  },
  "/library/[id]/add-book": {
    variant: "back",
    title: "Ajouter des livres",
    showBack: true,
  },

  // Search
  "/search": {
    variant: "back",
    title: "Recherche",
    showBack: true,
  },

  // Recommendations
  "/recommendations": {
    variant: "back",
    title: "Recommandations",
    showBack: true,
  },

  // Profile
  "/profile": {
    variant: "back",
    title: "Profile",
    showBack: true,
    rightIcons: [
      {
        icon: Settings,
        href: "/profile/settings",
      },
    ],
  },
  "/profile/suivie/classements": {
    variant: "back",
    title: "Classements",
    showBack: true,
  },
  "/profile/suivie/objectifs": {
    variant: "back",
    title: "Objectifs",
    showBack: true,
  },
  "/profile/following": {
    variant: "back",
    title: "Following",
    showBack: true,
  },
  "/profile/followers": {
    variant: "back",
    title: "Followers",
    showBack: true,
  },
  "/profile/requests": {
    variant: "back",
    title: "Mes demandes",
    showBack: true,
  },
  "/profile/gamification": {
    variant: "back",
    title: "Gamification",
    showBack: true,
  },
  // Books
  "/books/[id]": {
    variant: "back",
    showBackAbsolute: true,
    // hideTopBar: true,
  },

  // Authors
  "/authors/[id]": {
    variant: "back",
    showBackAbsolute: true,
    // hideTopBar: true,
  },

  // Notifications
  "/notifications": {
    variant: "back",
    title: "Notifications",
    showBack: true,
  },

  // Messages
  "/messages": {
    variant: "back",
    title: "Messages",
    showBack: true,
  },
  "/messages/[id]": {
    variant: "conversation",
    showBack: true,
    showConversationUser: true,
  },

  // Profile settings
  "/profile/settings": {
    variant: "back",
    title: "Paramètres",
    showBack: true,
  },
  "/profile/settings/profile": {
    variant: "back",
    title: "Mon profile",
    showBack: true,
  },
  "/profile/settings/bookmarked": {
    variant: "back",
    title: "Mes favoris",
    showBack: true,
  },
  "/profile/settings/statistics": {
    variant: "back",
    title: "Statistiques",
    showBack: true,
  },
  "/profile/settings/notifications": {
    variant: "back",
    title: "Notificationsss",
    showBack: true,
  },
  "/profile/settings/help": {
    variant: "back",
    title: "Aide",
    showBack: true,
  },
  "/profile/settings/policy": {
    variant: "back",
    title: "Politique de confidentialité",
    showBack: true,
  },
  "/profile/settings/delete": {
    variant: "back",
    title: "Supprimer mon compte",
    showBack: true,
  },

  // Clubs 
  "/clubs": {
    variant: "back",
    title: "Clubs",
    showBack: true,
  },
  "/clubs/[id]": {
    variant: "back",
    title: "Club",
    showBack: true,
  },
  "/clubs/create": {
    variant: "back",
    title: "Création de club",
    showBack: true,
  },

  "/clubs/[id]/members": {
    variant: "back",
    title: "Membres",
    showBack: true,
  },

  "/clubs/[id]/moderation": {
    variant: "back",
    title: "Modération",
    showBack: true,
  },
  "/clubs/[id]/join-request": {
    variant: "back",
    title: "Demande d'adhésion",
    showBack: true,
  },
  "/clubs/[id]/invitations": {
    variant: "back",
    title: "Invitations",
    showBack: true,
  },
};

export function getTopBarConfig(path: string): TopBarConfig {
  // Nettoyer le chemin en retirant le slash final s'il existe
  const cleanPath = path.replace(/\/$/, "");

  // Pour la page feed principale
  if (cleanPath === "/feed") {
    return topBarConfigs["/feed"];
  }

  if (cleanPath === "/messages") {
    return topBarConfigs["/messages"];
  }

  // Pour les conversations avec UUID
  if (/^\/messages\/[\w-]+$/.test(cleanPath)) {
    return topBarConfigs["/messages/[id]"];
  }

  // Pour les posts avec UUID
  if (/^\/feed\/[\w-]+$/.test(cleanPath) && cleanPath !== "/feed/create") {
    return topBarConfigs["/feed/[id]"];
  }



  // Pour les book avec UUID
  if (/^\/books\/[\w-]+$/.test(cleanPath)) {
    return topBarConfigs["/books/[id]"];
  }

  // Pour les book avec UUID
  if (/^\/authors\/[\w-]+$/.test(cleanPath)) {
    return topBarConfigs["/authors/[id]"];
  }

  // Pour les bibliothèques avec UUID - add-book
  if (/^\/library\/[\w-]+\/add-book$/.test(cleanPath)) {
    return topBarConfigs["/library/[id]/add-book"];
  }

  // Pour les bibliothèques avec UUID - edit
  if (/^\/library\/[\w-]+\/edit$/.test(cleanPath)) {
    return topBarConfigs["/library/[id]/edit"];
  }

  // Pour les bibliothèques avec UUID
  if (
    /^\/library\/[\w-]+$/.test(cleanPath) &&
    cleanPath !== "/library/create"
  ) {
    return topBarConfigs["/library/[id]"];
  }

  // Clubs - Les routes plus spécifiques doivent être testées en premier
  if (cleanPath === "/clubs") {
    return topBarConfigs["/clubs"];
  }

  if (cleanPath === "/clubs/create") {
    return topBarConfigs["/clubs/create"];
  }

  if (/^\/clubs\/[\w-]+\/join-request$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[id]/join-request"];
  }

  if (/^\/profile\/requests$/.test(cleanPath)) {
    return topBarConfigs["/profile/requests"];
  }

  if (/^\/clubs\/[\w-]+\/invitations$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[id]/invitations"];
  }

  // Routes spécifiques de clubs avec UUID
  if (/^\/clubs\/[\w-]+\/members$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[id]/members"];
  }

  if (/^\/clubs\/[\w-]+\/invitations$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[id]/invitations"];
  }

  if (/^\/clubs\/[\w-]+\/moderation$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[id]/moderation"];
  }

  // Club avec UUID (route générale, doit être en dernier)
  if (/^\/clubs\/[\w-]+$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[id]"];
  }

  // Pour les autres routes
  const exactConfig = topBarConfigs[cleanPath];
  if (exactConfig) {
    return exactConfig;
  }

  // Configuration par défaut
  return topBarConfigs.default;
}
