"use client";

import { getRandomNarrativeMessage } from "@/utils/gamificationUtils";
import { Crown, Flame, Scroll, Sparkles, Star, Trophy } from "lucide-react";
import { toast } from "sonner";

type ToastType =
  | "levelUp"
  | "missionComplete"
  | "badgeEarned"
  | "streakMaintained";

interface NarrativeToastOptions {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  duration?: number;
}

export const narrativeToast = {
  levelUp: (level: number, title: string, options?: NarrativeToastOptions) => {
    toast.success(options?.title || `Niveau ${level} atteint !`, {
      description: options?.description || getRandomNarrativeMessage("levelUp"),
      icon: options?.icon || <Crown className="h-4 w-4 text-amber-500" />,
      duration: options?.duration || 6000,
      className: "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50",
    });
  },

  missionComplete: (
    missionName: string,
    xpGained: number,
    options?: NarrativeToastOptions
  ) => {
    toast.success(options?.title || `Mission "${missionName}" accomplie !`, {
      description:
        options?.description ||
        `${getRandomNarrativeMessage("missionComplete")} (+${xpGained} XP)`,
      icon: options?.icon || <Scroll className="h-4 w-4 text-blue-500" />,
      duration: options?.duration || 4000,
      className: "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50",
    });
  },

  badgeEarned: (badgeName: string, options?: NarrativeToastOptions) => {
    toast.success(options?.title || `Nouvel artefact : ${badgeName}`, {
      description:
        options?.description || getRandomNarrativeMessage("badgeEarned"),
      icon: options?.icon || <Trophy className="h-4 w-4 text-purple-500" />,
      duration: options?.duration || 5000,
      className:
        "border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50",
    });
  },

  streakMaintained: (days: number, options?: NarrativeToastOptions) => {
    toast.success(options?.title || `Série de ${days} jours maintenue !`, {
      description:
        options?.description || getRandomNarrativeMessage("streakMaintained"),
      icon: options?.icon || <Flame className="h-4 w-4 text-orange-500" />,
      duration: options?.duration || 4000,
      className: "border-orange-200 bg-gradient-to-r from-orange-50 to-red-50",
    });
  },

  zen: (message: string, options?: NarrativeToastOptions) => {
    toast.info(options?.title || "Mode Zen", {
      description: message,
      icon: options?.icon || <Sparkles className="h-4 w-4 text-emerald-500" />,
      duration: options?.duration || 3000,
      className:
        "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50",
    });
  },

  challenge: (message: string, options?: NarrativeToastOptions) => {
    toast.info(options?.title || "Mode Challenge", {
      description: message,
      icon: options?.icon || <Star className="h-4 w-4 text-red-500" />,
      duration: options?.duration || 3000,
      className: "border-red-200 bg-gradient-to-r from-red-50 to-orange-50",
    });
  },

  custom: (
    type: ToastType,
    customMessage: string,
    options?: NarrativeToastOptions
  ) => {
    const configs = {
      levelUp: {
        icon: <Crown className="h-4 w-4 text-amber-500" />,
        className:
          "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50",
      },
      missionComplete: {
        icon: <Scroll className="h-4 w-4 text-blue-500" />,
        className: "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50",
      },
      badgeEarned: {
        icon: <Trophy className="h-4 w-4 text-purple-500" />,
        className:
          "border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50",
      },
      streakMaintained: {
        icon: <Flame className="h-4 w-4 text-orange-500" />,
        className:
          "border-orange-200 bg-gradient-to-r from-orange-50 to-red-50",
      },
    };

    const config = configs[type];

    toast.success(customMessage, {
      description: getRandomNarrativeMessage(type),
      icon: options?.icon || config.icon,
      duration: options?.duration || 4000,
      className: config.className,
    });
  },
};

// Helper function to show achievement celebration
export const celebrateAchievement = (
  type: "level" | "badge" | "mission" | "streak",
  data: {
    name: string;
    level?: number;
    xp?: number;
    days?: number;
  }
) => {
  switch (type) {
    case "level":
      narrativeToast.levelUp(data.level || 1, data.name);
      break;
    case "badge":
      narrativeToast.badgeEarned(data.name);
      break;
    case "mission":
      narrativeToast.missionComplete(data.name, data.xp || 0);
      break;
    case "streak":
      narrativeToast.streakMaintained(data.days || 1);
      break;
  }
};

// Helper for game mode switch notifications
export const notifyGameModeSwitch = (mode: "zen" | "challenge") => {
  if (mode === "zen") {
    narrativeToast.zen(
      "Profitez de la lecture dans la sérénité de la Grande Bibliothèque. 🧘📚"
    );
  } else {
    narrativeToast.challenge(
      "Prêt à relever les défis et gravir les classements ? ⚔️🏆"
    );
  }
};
