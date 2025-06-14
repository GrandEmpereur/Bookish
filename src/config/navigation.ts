import { Bell, Send, Search, Settings } from "lucide-react";

type ModalType = "drawer" | "dialog";

export type TopBarConfig = {
  variant: 'standard' | 'back';
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  hideTopBar?: boolean;
  showBackAbsolute?: boolean;
  rightIcons?: {
    icon: typeof Bell | typeof Send | typeof Search | typeof Settings;
    onClick?: () => void;
    href?: string;
    modalType?: ModalType;
  }[];
};

export const topBarConfigs: Record<string, TopBarConfig> = {
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
    title: "Espace commentaire",
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
    title: "Librairie",
    showBack: true,
    rightIcons: [
      {
        icon: Search,
        onClick: () => {},
        modalType: "dialog",
      },
    ],
  },
  "/library/[id]": {
    variant: "back",
    title: "Librairie",
    showBack: true,
    rightIcons: [
      {
        icon: Search,
        onClick: () => {},
        modalType: "dialog",
      },
    ],
  },
  "/library/create": {
    variant: "back",
    title: "Nouvelle librairie",
    showBack: true,
  },

    // Profile
    '/profile': {
        variant: 'back',
        title: 'Profile',
        showBack: true,
        rightIcons: [
            {
                icon: Settings,
                href: '/profile/settings'
            }
        ]
    },
    '/profile/suivie/classements': {
        variant: 'back',
        title: 'Classements',
        showBack: true
    },
    '/profile/suivie/objectifs': {
        variant: 'back',
        title: 'Objectifs',
        showBack: true
    },
    '/profile/following': {
        variant: 'back',
        title: 'Following',
        showBack: true
    },
    '/profile/followers': {
        variant: 'back',
        title: 'Followers',
        showBack: true
    },

  // Books
  '/books/[id]': {
      variant: 'back',
      showBackAbsolute: true,
      // hideTopBar: true,
  },

  // Books
  '/books/[id]': {
      variant: 'back',
      showBackAbsolute: true,
      // hideTopBar: true,
  },

  // Authors
  '/authors/[id]': {
      variant: 'back',
      showBackAbsolute: true,
      // hideTopBar: true,
  },

  // Notifications
  "/notifications": {
    variant: "back",
    title: "Notifications",
    showBack: true,
  },

    // Profile settings
    '/profile/settings': {
        variant: 'back',
        title: 'Paramètres',
        showBack: true
    },
    '/profile/settings/profile': {
        variant: 'back',
        title: 'Mon profile',
        showBack: true
    },
    '/profile/settings/bookmarked': {
        variant: 'back',
        title: 'Mes favoris',
        showBack: true
    },
    '/profile/settings/statistics': {
        variant: 'back',
        title: 'Statistiques',
        showBack: true
    },
    '/profile/settings/notifications': {
        variant: 'back',
        title: 'Notificationsss',
        showBack: true
    },
    '/profile/settings/help': {
        variant: 'back',
        title: 'Aide',
        showBack: true
    },
    '/profile/settings/policy': {
        variant: 'back',
        title: 'Politique de confidentialité',
        showBack: true
    },
    '/profile/settings/delete': {
        variant: 'back',
        title: 'Supprimer mon compte',
        showBack: true
    },

  // Clubs
  "/clubs": {
    variant: "back",
    title: "Clubs",
    showBack: true,
    rightIcons: [
      {
        icon: Search,
        onClick: () => {},
        modalType: "dialog",
      },
    ],
  },
  "/clubs/create/": {
    variant: "back",
    title: "Créer un club",
    showBack: true,
  },
  "/clubs/[clubId]": {
    variant: "back",
    title: "Club",
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

  // Pour les posts avec UUID
  if (/^\/feed\/[\w-]+$/.test(cleanPath) && cleanPath !== "/feed/create") {
    return topBarConfigs["/feed/[id]"];
  }

  // Pour les clubs
  if (cleanPath === "/clubs") {
    return topBarConfigs["/clubs"];
  }

  // Pour les clubs avec UUID
  if (/^\/clubs\/[\w-]+$/.test(cleanPath)) {
    return topBarConfigs["/clubs/[clubId]"];
  }

  // Pour les book avec UUID
  if (/^\/books\/[\w-]+$/.test(cleanPath)) {
      return topBarConfigs['/books/[id]'];
  }

  // Pour les book avec UUID
  if (/^\/authors\/[\w-]+$/.test(cleanPath)) {
      return topBarConfigs['/authors/[id]'];
  }

  // Pour les bibliothèques avec UUID
  if (/^\/library\/[\w-]+$/.test(cleanPath) && cleanPath !== '/library/create') {
      return topBarConfigs['/library/[id]'];
  }

  // Pour les autres routes
  const exactConfig = topBarConfigs[cleanPath];
  if (exactConfig) {
    return exactConfig;
  }

  // Configuration par défaut
  return topBarConfigs.default;
}
