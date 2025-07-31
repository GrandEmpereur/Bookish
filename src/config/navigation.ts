import { Bell, Send, Search, Settings, Plus, MoreHorizontal } from "lucide-react";

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
    icon: typeof Bell | typeof Send | typeof Search | typeof Settings | typeof Plus | typeof MoreHorizontal;
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
    title: "Notifications",
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
    rightIcons: [
      {
        icon: Search,
        onClick: () => { },
        modalType: "dialog",
      },
      {
        icon: Plus,
        href: "/clubs/create",
      },
    ],
  },

  "/clubs/create": {
    variant: "back",
    title: "Créer un club",
    showBack: true,
  },

  "/clubs/[clubId]": {
    variant: "back",
    title: "Club",
    showBack: true,
    rightIcons: [
      {
        icon: MoreHorizontal,
        onClick: () => { },
        modalType: "drawer",
      },
    ],
  },

  "/clubs/[clubId]/posts": {
    variant: "back",
    title: "Posts",
    showBack: true,
    rightIcons: [
      {
        icon: Plus,
        href: "/clubs/[clubId]/posts/create",
      },
    ],
  },

  "/clubs/[clubId]/posts/create": {
    variant: "back",
    title: "Nouveau post",
    showBack: true,
  },

  "/clubs/[clubId]/posts/[postId]": {
    variant: "back",
    title: "Post",
    showBack: true,
    rightIcons: [
      {
        icon: MoreHorizontal,
        onClick: () => { },
        modalType: "drawer",
      },
    ],
  },

  "/clubs/[clubId]/messages": {
    variant: "back",
    title: "Chat",
    showBack: true,
  },

  "/clubs/[clubId]/members": {
    variant: "back",
    title: "Membres",
    showBack: true,
    rightIcons: [
      {
        icon: Search,
        onClick: () => { },
        modalType: "dialog",
      },
    ],
  },

  "/clubs/[clubId]/invitations": {
    variant: "back",
    title: "Invitations",
    showBack: true,
    rightIcons: [
      {
        icon: Plus,
        onClick: () => { },
        modalType: "dialog",
      },
    ],
  },

  "/clubs/[clubId]/settings": {
    variant: "back",
    title: "Paramètres du club",
    showBack: true,
  },

  "/clubs/[clubId]/moderation": {
    variant: "back",
    title: "Modération",
    showBack: true,
  },

  "/clubs/[clubId]/moderation/reports": {
    variant: "back",
    title: "Signalements",
    showBack: true,
  },

  "/clubs/[clubId]/moderation/banned": {
    variant: "back",
    title: "Membres bannis",
    showBack: true,
  },

  "/clubs/[clubId]/moderation/requests": {
    variant: "back",
    title: "Demandes d'adhésion",
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

  // Pour les clubs
  if (cleanPath === "/clubs") {
    return topBarConfigs["/clubs"];
  }

  if (cleanPath === "/clubs/create") {
    return topBarConfigs["/clubs/create"];
  }

  // Routes spécifiques de clubs
  if (/^\/clubs\/[\w-]+\/posts\/create$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]/posts/create"];
  }

  if (/^\/clubs\/[\w-]+\/posts\/[\w-]+$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]/posts/[postId]"];
  }

  if (/^\/clubs\/[\w-]+\/posts$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]/posts"];
  }

  if (/^\/clubs\/[\w-]+\/messages$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]/messages"];
  }

  if (/^\/clubs\/[\w-]+\/members$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]/members"];
  }

  if (/^\/clubs\/[\w-]+\/invitations$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]/invitations"];
  }

  if (/^\/clubs\/[\w-]+\/settings$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]/settings"];
  }

  if (/^\/clubs\/[\w-]+\/moderation\/reports$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]/moderation/reports"];
  }

  if (/^\/clubs\/[\w-]+\/moderation\/banned$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]/moderation/banned"];
  }

  if (/^\/clubs\/[\w-]+\/moderation\/requests$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]/moderation/requests"];
  }

  if (/^\/clubs\/[\w-]+\/moderation$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]/moderation"];
  }

  // Pour les clubs avec UUID (route générale, doit être en dernier)
  if (/^\/clubs\/[\w-]+$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]"];
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

  // Pour les autres routes
  const exactConfig = topBarConfigs[cleanPath];
  if (exactConfig) {
    return exactConfig;
  }

  // Configuration par défaut
  return topBarConfigs.default;
}
