import { Bell, Send } from "lucide-react";

export type TopBarConfig = {
    variant: 'standard' | 'back';
    title?: string;
    showBack?: boolean;
    showLogo?: boolean;
    rightIcons?: {
        icon: typeof Bell | typeof Send;
        onClick?: () => void;
    }[];
};

export const topBarConfigs: Record<string, TopBarConfig> = {
    // Configuration standard (feed)
    '/feed/': {
        variant: 'standard',
        showLogo: true,
        rightIcons: [
            { icon: Bell },
            { icon: Send }
        ]
    },
    // Configuration pour la recherche
    '/search/': {
        variant: 'back',
        title: 'Recherche',
        showBack: true
    },
    // Configuration pour les messages
    '/messages/': {
        variant: 'back',
        title: 'Messages',
        showBack: true,
        rightIcons: [
            { icon: Bell }
        ]
    },
    // Configuration par défaut
    default: {
        variant: 'standard',
        showLogo: true,
        rightIcons: [
            { icon: Bell },
            { icon: Send }
        ]
    }
};

export function getTopBarConfig(path: string): TopBarConfig {
    return topBarConfigs[path] || topBarConfigs.default;
} 