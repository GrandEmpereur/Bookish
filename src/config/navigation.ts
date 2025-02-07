import { Bell, Send, Search, Settings } from "lucide-react";

type ModalType = 'drawer' | 'dialog';

export type TopBarConfig = {
    variant: 'standard' | 'back';
    title?: string;
    showBack?: boolean;
    showLogo?: boolean;
    rightIcons?: {
        icon: typeof Bell | typeof Send | typeof Search | typeof Settings;
        onClick?: () => void;
        href?: string;
        modalType?: ModalType;
    }[];
};

export const topBarConfigs: Record<string, TopBarConfig> = {
    // Feed
    '/feed': {
        variant: 'standard',
        showLogo: true,
        rightIcons: [
            {
                icon: Bell,
                href: '/notifications'
            },
            {
                icon: Send,
                href: '/messages'
            }
        ]
    },
    '/feed/[id]': {
        variant: 'back',
        title: 'Espace commentaire',
        showBack: true,
        rightIcons: [
            {
                icon: Bell,
                href: '/notifications'
            },
            {
                icon: Send,
                href: '/messages'
            }
        ]
    },
    '/feed/create': {
        variant: 'back',
        title: 'Nouveau post',
        showBack: true
    },

    // Library
    '/library': {
        variant: 'back',
        title: 'Librairie',
        showBack: true,
        rightIcons: [
            {
                icon: Search,
                onClick: () => { },
                modalType: 'dialog'
            }
        ]
    },
    '/library/[id]': {
        variant: 'back',
        title: 'Librairie',
        showBack: true,
        rightIcons: [
            {
                icon: Search,
                onClick: () => { },
                modalType: 'dialog'
            }
        ]
    },
    '/library/create': {
        variant: 'back',
        title: 'Nouvelle librairie',
        showBack: true
    },

    // Profile
    '/profile': {
        variant: 'back',
        title: 'Profil',
        showBack: true,
        rightIcons: [
            {
                icon: Settings,
                href: '/profile/settings'
            }
        ]
    },

    // Configuration par défaut
    default: {
        variant: 'standard',
        showLogo: true
    }
};

export function getTopBarConfig(path: string): TopBarConfig {
    // Nettoyer le chemin en retirant le slash final s'il existe
    const cleanPath = path.replace(/\/$/, '');

    // Pour la page feed principale
    if (cleanPath === '/feed') {
        return topBarConfigs['/feed'];
    }

    // Pour les posts avec UUID
    if (/^\/feed\/[\w-]+$/.test(cleanPath) && cleanPath !== '/feed/create') {
        return topBarConfigs['/feed/[id]'];
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