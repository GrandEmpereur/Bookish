import {
  Badge,
  BadgeRequirement,
  BadgeReward,
} from "@/types/gamificationTypes";

// Predefined badge definitions following the specification
export const BADGE_DEFINITIONS: Record<
  string,
  Omit<Badge, "id" | "unlockedAt" | "isUnlocked">[]
> = {
  // Lecteur Marathonien Series - Reading consistency
  reading_marathon: [
    {
      name: "Lecteur Marathonien I",
      description: "Lire 3 jours consécutifs",
      category: "streak",
      level: "bronze",
      tier: 1,
      iconUrl: "/icons/badges/marathon-bronze.svg",
      requirements: {
        type: "streak_days",
        target: 3,
        description: "Maintenir une série de lecture de 3 jours",
      },
      reward: {
        bookcoins: 50,
        xp: 100,
        title: "Marathonien Débutant",
      },
      rarity: "common",
      series: "Lecteur Marathonien",
      narrativeTitle: "Marcheur de Mots",
      shareableMessage:
        "J'ai maintenu ma série de lecture 3 jours d'affilée sur Bookish ! 📚✨",
    },
    {
      name: "Lecteur Marathonien II",
      description: "Lire 7 jours consécutifs",
      category: "streak",
      level: "silver",
      tier: 2,
      iconUrl: "/icons/badges/marathon-silver.svg",
      requirements: {
        type: "streak_days",
        target: 7,
        description: "Maintenir une série de lecture d'une semaine complète",
      },
      reward: {
        bookcoins: 100,
        xp: 200,
        title: "Marathonien Confirmé",
      },
      rarity: "uncommon",
      series: "Lecteur Marathonien",
      narrativeTitle: "Coureur de Chapitres",
      shareableMessage:
        "Une semaine complète de lecture ! Mon marathon littéraire continue sur Bookish 🏃‍♂️📖",
    },
    {
      name: "Lecteur Marathonien III",
      description: "Lire 30 jours consécutifs",
      category: "streak",
      level: "gold",
      tier: 3,
      iconUrl: "/icons/badges/marathon-gold.svg",
      requirements: {
        type: "streak_days",
        target: 30,
        description: "Maintenir une série de lecture d'un mois complet",
      },
      reward: {
        bookcoins: 300,
        xp: 500,
        title: "Marathonien Expert",
        cosmetic: {
          type: "profile_frame",
          itemId: "frame_marathon_gold",
        },
      },
      rarity: "rare",
      series: "Lecteur Marathonien",
      narrativeTitle: "Champion des Pages",
      shareableMessage:
        "30 jours de lecture non-stop ! Je suis officiellement accro aux livres ! 🏆📚",
    },
  ],

  // Bibliophile Series - Book completion
  bibliophile: [
    {
      name: "Bibliophile Novice",
      description: "Terminer 5 livres",
      category: "reading",
      level: "bronze",
      tier: 1,
      iconUrl: "/icons/badges/bibliophile-bronze.svg",
      requirements: {
        type: "books_read",
        target: 5,
        description: "Lire et terminer 5 livres complets",
      },
      reward: {
        bookcoins: 75,
        xp: 150,
      },
      rarity: "common",
      series: "Bibliophile",
      shareableMessage:
        "5 livres terminés ! Ma bibliothèque virtuelle commence à prendre forme 📚",
    },
    {
      name: "Bibliophile Confirmé",
      description: "Terminer 25 livres",
      category: "reading",
      level: "silver",
      tier: 2,
      iconUrl: "/icons/badges/bibliophile-silver.svg",
      requirements: {
        type: "books_read",
        target: 25,
        description: "Lire et terminer 25 livres complets",
      },
      reward: {
        bookcoins: 150,
        xp: 300,
        title: "Lecteur Assidu",
      },
      rarity: "uncommon",
      series: "Bibliophile",
      shareableMessage:
        "25 livres au compteur ! Je deviens un vrai bibliophile 📖✨",
    },
    {
      name: "Bibliophile Expert",
      description: "Terminer 50 livres",
      category: "reading",
      level: "gold",
      tier: 3,
      iconUrl: "/icons/badges/bibliophile-gold.svg",
      requirements: {
        type: "books_read",
        target: 50,
        description: "Lire et terminer 50 livres complets",
      },
      reward: {
        bookcoins: 250,
        xp: 500,
        title: "Maître Bibliophile",
      },
      rarity: "rare",
      series: "Bibliophile",
      shareableMessage:
        "50 livres ! Mon cerveau est officiellement une bibliothèque ambulante 🧠📚",
    },
    {
      name: "Bibliophile Légendaire",
      description: "Terminer 100 livres",
      category: "reading",
      level: "platinum",
      tier: 4,
      iconUrl: "/icons/badges/bibliophile-platinum.svg",
      requirements: {
        type: "books_read",
        target: 100,
        description: "Lire et terminer 100 livres complets",
      },
      reward: {
        bookcoins: 500,
        xp: 1000,
        title: "Légende Vivante",
        cosmetic: {
          type: "avatar_accessory",
          itemId: "accessory_golden_book",
        },
      },
      rarity: "legendary",
      series: "Bibliophile",
      narrativeTitle: "Gardien des Mille Histoires",
      shareableMessage:
        "100 LIVRES ! 🏆 Je suis officiellement une légende de la lecture sur Bookish !",
    },
  ],

  // Critique d'Élite Series - Review writing
  critic_elite: [
    {
      name: "Critique Amateur",
      description: "Écrire 5 critiques",
      category: "critic",
      level: "bronze",
      tier: 1,
      iconUrl: "/icons/badges/critic-bronze.svg",
      requirements: {
        type: "reviews_written",
        target: 5,
        description: "Rédiger 5 critiques de livres",
      },
      reward: {
        bookcoins: 60,
        xp: 120,
      },
      rarity: "common",
      series: "Critique d'Élite",
      shareableMessage:
        "Mes premiers pas dans la critique littéraire ! 5 avis partagés ✍️📖",
    },
    {
      name: "Critique Confirmé",
      description: "Écrire 15 critiques",
      category: "critic",
      level: "silver",
      tier: 2,
      iconUrl: "/icons/badges/critic-silver.svg",
      requirements: {
        type: "reviews_written",
        target: 15,
        description: "Rédiger 15 critiques de livres",
      },
      reward: {
        bookcoins: 120,
        xp: 250,
        title: "Critique Éclairé",
      },
      rarity: "uncommon",
      series: "Critique d'Élite",
      shareableMessage:
        "15 critiques ! Ma plume s'affûte et mes analyses s'approfondissent 🖋️✨",
    },
    {
      name: "Critique d'Élite",
      description: "Écrire 50 critiques",
      category: "critic",
      level: "gold",
      tier: 3,
      iconUrl: "/icons/badges/critic-gold.svg",
      requirements: {
        type: "reviews_written",
        target: 50,
        description: "Rédiger 50 critiques de livres",
      },
      reward: {
        bookcoins: 300,
        xp: 600,
        title: "Maître Critique",
        cosmetic: {
          type: "theme",
          itemId: "theme_critic_elite",
        },
      },
      rarity: "rare",
      series: "Critique d'Élite",
      narrativeTitle: "Plume d'Or",
      shareableMessage:
        "50 critiques ! Mes mots guident maintenant d'autres lecteurs 🏆📝",
    },
  ],

  // Découvreur de Genres Series - Genre diversity
  genre_explorer: [
    {
      name: "Découvreur Curieux",
      description: "Lire dans 3 genres différents",
      category: "discovery",
      level: "bronze",
      tier: 1,
      iconUrl: "/icons/badges/explorer-bronze.svg",
      requirements: {
        type: "genres_explored",
        target: 3,
        description: "Lire au moins un livre dans 3 genres différents",
      },
      reward: {
        bookcoins: 80,
        xp: 160,
      },
      rarity: "common",
      series: "Découvreur de Genres",
      shareableMessage:
        "J'explore de nouveaux horizons littéraires ! 3 genres découverts 🌟📚",
    },
    {
      name: "Explorateur de Genres",
      description: "Lire dans 7 genres différents",
      category: "discovery",
      level: "silver",
      tier: 2,
      iconUrl: "/icons/badges/explorer-silver.svg",
      requirements: {
        type: "genres_explored",
        target: 7,
        description: "Lire au moins un livre dans 7 genres différents",
      },
      reward: {
        bookcoins: 160,
        xp: 320,
        title: "Explorateur Littéraire",
      },
      rarity: "uncommon",
      series: "Découvreur de Genres",
      shareableMessage:
        "7 genres explorés ! Ma curiosité littéraire n'a plus de limites 🗺️📖",
    },
    {
      name: "Maître Découvreur",
      description: "Lire dans 15 genres différents",
      category: "discovery",
      level: "gold",
      tier: 3,
      iconUrl: "/icons/badges/explorer-gold.svg",
      requirements: {
        type: "genres_explored",
        target: 15,
        description: "Lire au moins un livre dans 15 genres différents",
      },
      reward: {
        bookcoins: 400,
        xp: 800,
        title: "Navigateur des Mots",
        cosmetic: {
          type: "avatar_accessory",
          itemId: "accessory_explorer_compass",
        },
      },
      rarity: "epic",
      series: "Découvreur de Genres",
      narrativeTitle: "Cartographe Littéraire",
      shareableMessage:
        "15 genres maîtrisés ! Je suis un vrai caméléon de la lecture ! 🦎📚",
    },
  ],

  // Community badges
  community_badges: [
    {
      name: "Ami des Livres",
      description: "Rejoindre votre premier club de lecture",
      category: "community",
      level: "bronze",
      tier: 1,
      iconUrl: "/icons/badges/community-bronze.svg",
      requirements: {
        type: "community_engagement",
        target: 1,
        description: "Rejoindre un club de lecture",
      },
      reward: {
        bookcoins: 40,
        xp: 80,
      },
      rarity: "common",
      shareableMessage:
        "J'ai rejoint ma première communauté de lecteurs ! 👥📚",
    },
    {
      name: "Mentor Littéraire",
      description: "Aider 10 nouveaux lecteurs",
      category: "community",
      level: "gold",
      tier: 2,
      iconUrl: "/icons/badges/mentor-gold.svg",
      requirements: {
        type: "community_engagement",
        target: 10,
        description: "Aider 10 nouveaux membres de la communauté",
      },
      reward: {
        bookcoins: 200,
        xp: 400,
        title: "Mentor Bienveillant",
      },
      rarity: "rare",
      narrativeTitle: "Guide des Mots",
      shareableMessage:
        "J'ai guidé 10 nouveaux lecteurs dans leur aventure ! Ensemble, nous sommes plus forts 🤝📖",
    },
  ],
};

// Utility functions for badge management
export function getAllBadgeDefinitions(): Badge[] {
  const allBadges: Badge[] = [];
  let badgeCounter = 1;

  Object.values(BADGE_DEFINITIONS).forEach((badgeCategory) => {
    badgeCategory.forEach((badgeDef) => {
      allBadges.push({
        id: `badge_${badgeCounter++}`,
        ...badgeDef,
        unlockedAt: undefined,
        isUnlocked: false,
      });
    });
  });

  return allBadges;
}

export function getBadgesByCategory(category: Badge["category"]): Badge[] {
  return getAllBadgeDefinitions().filter(
    (badge) => badge.category === category
  );
}

export function getBadgesBySeries(seriesName: string): Badge[] {
  return getAllBadgeDefinitions().filter(
    (badge) => badge.series === seriesName
  );
}

export function getNextBadgeInSeries(currentBadge: Badge): Badge | null {
  if (!currentBadge.series) return null;

  const seriesBadges = getBadgesBySeries(currentBadge.series).sort(
    (a, b) => a.tier - b.tier
  );

  const currentIndex = seriesBadges.findIndex(
    (badge) => badge.tier === currentBadge.tier
  );
  return currentIndex < seriesBadges.length - 1
    ? seriesBadges[currentIndex + 1]
    : null;
}

export function checkBadgeEligibility(
  badgeRequirement: BadgeRequirement,
  userStats: {
    booksRead: number;
    currentStreak: number;
    longestStreak: number;
    reviewsWritten: number;
    genresExplored: number;
    readingTimeMinutes: number;
    communityActions: number;
  }
): boolean {
  switch (badgeRequirement.type) {
    case "books_read":
      return userStats.booksRead >= badgeRequirement.target;
    case "streak_days":
      return (
        userStats.currentStreak >= badgeRequirement.target ||
        userStats.longestStreak >= badgeRequirement.target
      );
    case "reviews_written":
      return userStats.reviewsWritten >= badgeRequirement.target;
    case "genres_explored":
      return userStats.genresExplored >= badgeRequirement.target;
    case "reading_time":
      return userStats.readingTimeMinutes >= badgeRequirement.target;
    case "community_engagement":
      return userStats.communityActions >= badgeRequirement.target;
    default:
      return false;
  }
}

export function getEligibleBadges(userStats: {
  booksRead: number;
  currentStreak: number;
  longestStreak: number;
  reviewsWritten: number;
  genresExplored: number;
  readingTimeMinutes: number;
  communityActions: number;
}): Badge[] {
  return getAllBadgeDefinitions().filter((badge) =>
    checkBadgeEligibility(badge.requirements, userStats)
  );
}

export function getBadgeColor(level: Badge["level"]): string {
  switch (level) {
    case "bronze":
      return "#CD7F32";
    case "silver":
      return "#C0C0C0";
    case "gold":
      return "#FFD700";
    case "platinum":
      return "#E5E4E2";
    case "diamond":
      return "#B9F2FF";
    default:
      return "#6B7280";
  }
}

export function getBadgeRarityColor(rarity: Badge["rarity"]): string {
  switch (rarity) {
    case "common":
      return "#6B7280";
    case "uncommon":
      return "#10B981";
    case "rare":
      return "#3B82F6";
    case "epic":
      return "#8B5CF6";
    case "legendary":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
}
