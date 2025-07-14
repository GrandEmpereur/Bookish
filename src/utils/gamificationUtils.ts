// Gamification utilities for Bookish
// Inspired by the "Grande Bibliothèque" narrative theme

export interface LevelTier {
  name: string;
  range: [number, number];
  color: string;
  icon: string;
  description: string;
}

export const LEVEL_TIERS: LevelTier[] = [
  {
    name: "Apprenti",
    range: [1, 25],
    color: "#4A9B8E", // primary-500
    icon: "BookOpen",
    description: "Les premiers pas dans la Grande Bibliothèque"
  },
  {
    name: "Gardien Novice", 
    range: [26, 50],
    color: "#35856B", // primary-700
    icon: "Shield",
    description: "Protecteur des connaissances naissantes"
  },
  {
    name: "Bibliothécaire",
    range: [51, 100], 
    color: "#D2691E", // secondary-500
    icon: "Crown",
    description: "Gardien des savoirs précieux"
  },
  {
    name: "Maître Lettré",
    range: [101, 150],
    color: "#E6C14F", // accent-400
    icon: "Sparkles",
    description: "Maître des arts littéraires"
  },
  {
    name: "Grand Sage",
    range: [151, 200],
    color: "#F59E0B", // warning
    icon: "Zap",
    description: "Sage ultime de la Grande Bibliothèque"
  }
];

export const LEVEL_TITLES: Record<number, string> = {
  // Apprenti (1-25)
  1: "Novice Lecteur",
  2: "Novice Lecteur",
  3: "Initié des Lettres",
  4: "Initié des Lettres", 
  5: "Disciple du Savoir",
  6: "Disciple du Savoir",
  7: "Disciple du Savoir",
  8: "Apprenti Gardien",
  9: "Apprenti Gardien",
  10: "Apprenti Gardien",
  11: "Disciple Avancé du Savoir",
  12: "Disciple Avancé du Savoir",
  13: "Disciple Avancé du Savoir",
  14: "Disciple Avancé du Savoir",
  15: "Apprenti Gardien Confirmé",
  16: "Apprenti Gardien Confirmé",
  17: "Apprenti Gardien Confirmé",
  18: "Apprenti Gardien Confirmé",
  19: "Apprenti Gardien Confirmé",
  20: "Explorateur de Mondes",
  21: "Explorateur de Mondes",
  22: "Explorateur de Mondes",
  23: "Explorateur de Mondes",
  24: "Explorateur de Mondes",
  25: "Explorateur de Mondes",

  // Gardien Novice (26-50)
  26: "Érudit des Bibliothèques",
  27: "Érudit des Bibliothèques",
  28: "Érudit des Bibliothèques",
  29: "Érudit des Bibliothèques",
  30: "Sage Lecteur",
  31: "Sage Lecteur",
  32: "Sage Lecteur",
  33: "Sage Lecteur",
  34: "Sage Lecteur",
  35: "Gardien des Textes Sacrés",
  36: "Gardien des Textes Sacrés",
  37: "Gardien des Textes Sacrés",
  38: "Gardien des Textes Sacrés",
  39: "Gardien des Textes Sacrés",
  40: "Maître Archiviste",
  41: "Maître Archiviste",
  42: "Maître Archiviste",
  43: "Maître Archiviste",
  44: "Maître Archiviste",
  45: "Expert des Savoirs",
  46: "Expert des Savoirs",
  47: "Expert des Savoirs",
  48: "Expert des Savoirs",
  49: "Expert des Savoirs",
  50: "Expert des Savoirs",

  // Bibliothécaire (51-100)
  51: "Archiviste Confirmé",
  59: "Archiviste Confirmé",
  60: "Maître Lecteur",
  69: "Maître Lecteur",
  70: "Sage des Grimoires Anciens",
  79: "Sage des Grimoires Anciens",
  80: "Gardien des Manuscrits Rares",
  89: "Gardien des Manuscrits Rares",
  90: "Maître Bibliothécaire",
  99: "Maître Bibliothécaire",
  100: "Maître Bibliothécaire",

  // Maître Lettré (101-150)
  101: "Grand Archiviste",
  109: "Grand Archiviste",
  110: "Sage des Mille Volumes",
  119: "Sage des Mille Volumes",
  120: "Maître Encyclopédiste",
  129: "Maître Encyclopédiste", 
  130: "Gardien des Chroniques Sacrées",
  139: "Gardien des Chroniques Sacrées",
  140: "Archiviste Légendaire",
  149: "Archiviste Légendaire",
  150: "Archiviste Légendaire",

  // Grand Sage (151-200)
  151: "Sage des Dimensions Littéraires",
  159: "Sage des Dimensions Littéraires",
  160: "Gardien des Secrets Anciens",
  169: "Gardien des Secrets Anciens",
  170: "Maître des Mystères Cosmiques",
  179: "Maître des Mystères Cosmiques",
  180: "Oracle des Connaissances Universelles",
  189: "Oracle des Connaissances Universelles",
  190: "Transcendant des Savoirs Infinis",
  199: "Transcendant des Savoirs Infinis",
  200: "Gardien Éternel de la Grande Bibliothèque"
};

export function getLevelTitle(level: number): string {
  // Find exact match first
  if (LEVEL_TITLES[level]) {
    return LEVEL_TITLES[level];
  }
  
  // Find range match
  for (const [key, title] of Object.entries(LEVEL_TITLES)) {
    const levelNum = parseInt(key);
    if (level >= levelNum && level <= levelNum + 9) {
      return title;
    }
  }
  
  return "Lecteur Mystérieux";
}

export function getLevelTier(level: number): LevelTier {
  for (const tier of LEVEL_TIERS) {
    if (level >= tier.range[0] && level <= tier.range[1]) {
      return tier;
    }
  }
  return LEVEL_TIERS[0]; // Default to Apprenti
}

export function getExperienceForLevel(level: number): number {
  // Exponential curve as described in documentation
  // Level 1->2: 100 XP, Level 9->10: 1000 XP
  if (level <= 1) return 0;
  
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += getExperienceForLevelUp(i);
  }
  
  return totalXP;
}

export function getExperienceForLevelUp(level: number): number {
  // Exponential curve: Level 1->2: 100 XP, Level 9->10: 1000 XP
  if (level <= 1) return 100;
  
  const baseXP = 100;
  const exponentialFactor = 1.334; // Adjusted to match spec (9->10 = 1000 XP)
  
  return Math.floor(baseXP * Math.pow(exponentialFactor, level - 1));
}

export function getExperienceToNextLevel(currentLevel: number, currentXP: number): number {
  const nextLevelXP = getExperienceForLevel(currentLevel + 1);
  return Math.max(0, nextLevelXP - currentXP);
}

export function getProgressToNextLevel(currentLevel: number, currentXP: number): number {
  const currentLevelXP = getExperienceForLevel(currentLevel);
  const nextLevelXP = getExperienceForLevel(currentLevel + 1);
  const levelXPRange = nextLevelXP - currentLevelXP;
  const progressInLevel = currentXP - currentLevelXP;
  
  return Math.max(0, Math.min(100, (progressInLevel / levelXPRange) * 100));
}

// Level up rewards system
export function getLevelUpRewards(level: number): { experience: number; bookcoins: number; items?: string[]; features?: string[] } {
  const baseRewards = {
    experience: 0, // Already gained through leveling
    bookcoins: level * 25 + 50, // Increasing rewards
    items: [] as string[],
    features: [] as string[]
  };

  // Special rewards for milestone levels
  if (level === 5) {
    baseRewards.features.push('club_challenges_access');
    baseRewards.items.push('club_badge');
  }
  
  if (level === 10) {
    baseRewards.features.push('special_genres_access');
    baseRewards.items.push('explorer_badge');
  }
  
  if (level === 15) {
    baseRewards.features.push('narrative_chapter_2');
    baseRewards.bookcoins += 100;
  }
  
  if (level === 20) {
    baseRewards.features.push('advanced_missions');
    baseRewards.items.push('master_reader_badge');
  }
  
  if (level === 25) {
    baseRewards.features.push('content_creation_tools');
    baseRewards.items.push('creator_badge');
  }
  
  if (level === 30) {
    baseRewards.features.push('premium_statistics');
    baseRewards.bookcoins += 200;
  }
  
  if (level === 50) {
    baseRewards.features.push('mentor_program');
    baseRewards.items.push('mentor_badge');
  }
  
  if (level === 100) {
    baseRewards.features.push('legendary_status');
    baseRewards.items.push('legendary_badge');
    baseRewards.bookcoins += 500;
  }
  
  return baseRewards;
}

// Check if level unlocks new features
export function getUnlockedFeatures(level: number): string[] {
  const features: string[] = [];
  
  if (level >= 5) features.push('Accès aux défis de club');
  if (level >= 10) features.push('Genres littéraires spéciaux');
  if (level >= 15) features.push('Chapitre 2 du récit principal');
  if (level >= 20) features.push('Missions avancées');
  if (level >= 25) features.push('Outils de création de contenu');
  if (level >= 30) features.push('Statistiques premium');
  if (level >= 50) features.push('Programme de mentorat');
  if (level >= 100) features.push('Statut légendaire');
  
  return features;
}

export const NARRATIVE_MESSAGES = {
  levelUp: [
    "Votre quête dans la Grande Bibliothèque continue ! 📚✨",
    "Les secrets des grimoires anciens se révèlent à vous...",
    "Vous gravissez les échelons de la sagesse littéraire !",
    "La Grande Bibliothèque reconnaît votre dévouement ! 🏛️"
  ],
  
  missionComplete: [
    "Mission accomplie, noble lecteur ! 🎯",
    "Vous avez déchiffré un mystère de plus...",
    "Les gardiens de la bibliothèque vous félicitent !",
    "Votre savoir s'enrichit de jour en jour ! 📖"
  ],
  
  badgeEarned: [
    "Un nouveau titre vous est décerné ! 🏅",
    "Votre réputation grandit dans la Grande Bibliothèque !",
    "Les sages reconnaissent votre accomplissement !",
    "Vous avez gagné l'estime des maîtres lettrés ! ✨"
  ],
  
  streakMaintained: [
    "Votre constance impressionne les gardiens ! 🔥",
    "Jour après jour, vous honorez votre quête...",
    "Votre flamme de la connaissance ne s'éteint jamais !",
    "Les maîtres admirent votre persévérance ! 📚"
  ]
};

export function getRandomNarrativeMessage(category: keyof typeof NARRATIVE_MESSAGES): string {
  const messages = NARRATIVE_MESSAGES[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

export const GAME_MODES = {
  zen: {
    name: "Mode Zen",
    description: "Progressez à votre rythme dans la sérénité de la Grande Bibliothèque",
    icon: "🧘",
    features: [
      "Pas de pression temporelle",
      "Série flexible avec période de grâce",
      "Notifications douces et bienveillantes",
      "Focus sur le progrès personnel"
    ]
  },
  challenge: {
    name: "Mode Challenge", 
    description: "Relevez les défis et grimpez dans les classements !",
    icon: "⚔️",
    features: [
      "Classements compétitifs",
      "Défis temporaires",
      "Récompenses exclusives",
      "Émulation entre lecteurs"
    ]
  }
};

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  } else {
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    return remainingHours > 0 ? `${days}j ${remainingHours}h` : `${days}j`;
  }
}

export function getRarityColor(rarity: string): string {
  switch (rarity.toLowerCase()) {
    case 'common':
      return '#6B7280'; // gray-500
    case 'uncommon':
      return '#10B981'; // emerald-500
    case 'rare':
      return '#3B82F6'; // blue-500
    case 'epic':
      return '#8B5CF6'; // violet-500
    case 'legendary':
      return '#F59E0B'; // amber-500
    default:
      return '#6B7280';
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return '#10B981'; // emerald-500
    case 'medium':
      return '#F59E0B'; // amber-500
    case 'hard':
      return '#EF4444'; // red-500
    case 'expert':
      return '#8B5CF6'; // violet-500
    default:
      return '#6B7280';
  }
} 

// Enhanced Mission System - 5 Categories
export const MISSION_CATEGORIES = {
  reading: {
    name: 'Lecture',
    description: 'Missions centrées sur la lecture de livres',
    icon: '📚',
    color: '#3B82F6'
  },
  exploration: {
    name: 'Exploration',
    description: 'Découverte de nouveaux genres et auteurs',
    icon: '🔍',
    color: '#10B981'
  },
  community: {
    name: 'Communauté',
    description: 'Interactions sociales et partage',
    icon: '👥',
    color: '#8B5CF6'
  },
  creation: {
    name: 'Création',
    description: 'Création de contenu et critiques',
    icon: '✍️',
    color: '#F59E0B'
  },
  engagement: {
    name: 'Engagement',
    description: 'Participation active et régularité',
    icon: '🎯',
    color: '#EF4444'
  }
} as const;

// Mission Templates for each category
export const MISSION_TEMPLATES = {
  reading: [
    {
      id: 'read_book',
      title: 'Déchiffrer un grimoire',
      description: 'Terminer la lecture d\'un livre',
      target: 1,
      rewards: { experience: 100, bookcoins: 50 },
      narrativeContext: 'Les anciens grimoires révèlent leurs secrets à ceux qui persévèrent...'
    },
    {
      id: 'read_pages',
      title: 'Parcourir les parchemins',
      description: 'Lire {target} pages aujourd\'hui',
      target: 50,
      rewards: { experience: 25, bookcoins: 10 },
      narrativeContext: 'Chaque page tournée vous rapproche de la sagesse universelle.'
    },
    {
      id: 'reading_streak',
      title: 'Maintenir la flamme',
      description: 'Lire pendant {target} jours consécutifs',
      target: 7,
      rewards: { experience: 200, bookcoins: 100, special: 'streak_freeze' },
      narrativeContext: 'La flamme de la connaissance ne doit jamais s\'éteindre.'
    }
  ],
  exploration: [
    {
      id: 'new_genre',
      title: 'Explorer un nouveau royaume',
      description: 'Lire un livre d\'un genre jamais exploré',
      target: 1,
      rewards: { experience: 150, bookcoins: 75, badge: 'explorer' },
      narrativeContext: 'Les territoires inconnus recèlent des trésors insoupçonnés.'
    },
    {
      id: 'author_discovery',
      title: 'Rencontrer un nouveau sage',
      description: 'Découvrir un auteur que vous n\'avez jamais lu',
      target: 1,
      rewards: { experience: 100, bookcoins: 50 },
      narrativeContext: 'Chaque auteur apporte sa propre vision du monde.'
    },
    {
      id: 'diverse_reading',
      title: 'Parcourir trois royaumes',
      description: 'Lire des livres de 3 genres différents cette semaine',
      target: 3,
      rewards: { experience: 300, bookcoins: 150, badge: 'polyglot' },
      narrativeContext: 'La diversité des lectures enrichit l\'esprit et ouvre les horizons.'
    }
  ],
  community: [
    {
      id: 'write_review',
      title: 'Partager sa sagesse',
      description: 'Écrire une critique constructive',
      target: 1,
      rewards: { experience: 75, bookcoins: 25 },
      narrativeContext: 'Votre sagesse guidera d\'autres lecteurs dans leur quête.'
    },
    {
      id: 'help_recommendation',
      title: 'Guider un apprenti',
      description: 'Recommander un livre à un autre lecteur',
      target: 1,
      rewards: { experience: 50, bookcoins: 20 },
      narrativeContext: 'Les maîtres transmettent leur savoir aux nouveaux apprentis.'
    },
    {
      id: 'join_discussion',
      title: 'Participer au conseil',
      description: 'Rejoindre une discussion de groupe de lecture',
      target: 1,
      rewards: { experience: 100, bookcoins: 40 },
      narrativeContext: 'Les échanges d\'idées font grandir la communauté.'
    }
  ],
  creation: [
    {
      id: 'detailed_review',
      title: 'Rédiger un parchemin détaillé',
      description: 'Écrire une critique de plus de 200 mots',
      target: 1,
      rewards: { experience: 125, bookcoins: 60 },
      narrativeContext: 'Les analyses approfondies éclairent les subtilités des œuvres.'
    },
    {
      id: 'create_list',
      title: 'Compiler un recueil',
      description: 'Créer une liste thématique de recommandations',
      target: 1,
      rewards: { experience: 150, bookcoins: 75 },
      narrativeContext: 'Les collections thématiques sont des guides précieux pour les lecteurs.'
    },
    {
      id: 'photo_challenge',
      title: 'Immortaliser sa lecture',
      description: 'Partager une photo créative de votre lecture',
      target: 1,
      rewards: { experience: 75, bookcoins: 30 },
      narrativeContext: 'Les images capturent l\'essence de nos moments de lecture.'
    }
  ],
  engagement: [
    {
      id: 'daily_login',
      title: 'Visiter la bibliothèque',
      description: 'Se connecter quotidiennement pendant {target} jours',
      target: 7,
      rewards: { experience: 100, bookcoins: 50 },
      narrativeContext: 'La régularité est la clé de la progression dans la Grande Bibliothèque.'
    },
    {
      id: 'complete_missions',
      title: 'Accomplir ses quêtes',
      description: 'Terminer {target} missions cette semaine',
      target: 5,
      rewards: { experience: 200, bookcoins: 100 },
      narrativeContext: 'Chaque mission accomplie vous rapproche de votre destinée.'
    },
    {
      id: 'weekend_reading',
      title: 'Rituel du week-end',
      description: 'Lire pendant au moins 2 heures ce week-end',
      target: 120,
      rewards: { experience: 150, bookcoins: 75 },
      narrativeContext: 'Les week-ends offrent des moments privilégiés pour la contemplation.'
    }
  ]
} as const;

// Weekly Challenge Templates
export const WEEKLY_CHALLENGE_TEMPLATES = [
  {
    id: 'weekly_reading_sprint',
    title: 'Sprint de Lecture Hebdomadaire',
    description: 'Défi intensif de lecture pour les plus dévoués',
    narrativeTheme: 'La Semaine du Savoir Intense',
    objectives: [
      { type: 'books_read', target: 3, title: 'Compléter 3 grimoires' },
      { type: 'time_spent', target: 600, title: 'Lire 10 heures au total' }
    ],
    rewards: [
      { type: 'experience' as const, amount: 500 },
      { type: 'bookcoins' as const, amount: 250 },
      { type: 'badge' as const, badgeId: 'weekly_champion' }
    ]
  },
  {
    id: 'genre_exploration',
    title: 'Exploration des Royaumes Littéraires',
    description: 'Découvrez la diversité des genres littéraires',
    narrativeTheme: 'La Quête des Territoires Inconnus',
    objectives: [
      { type: 'genres_explored', target: 4, title: 'Explorer 4 genres différents' },
      { type: 'books_read', target: 4, title: 'Lire au moins 4 livres' }
    ],
    rewards: [
      { type: 'experience' as const, amount: 400 },
      { type: 'bookcoins' as const, amount: 200 },
      { type: 'badge' as const, badgeId: 'genre_explorer' }
    ]
  },
  {
    id: 'community_engagement',
    title: 'Semaine de la Communauté',
    description: 'Participez activement à la vie de la communauté',
    narrativeTheme: 'L\'Union des Gardiens',
    objectives: [
      { type: 'reviews_written', target: 3, title: 'Écrire 3 critiques' },
      { type: 'custom', target: 5, title: 'Aider 5 autres lecteurs' }
    ],
    rewards: [
      { type: 'experience' as const, amount: 300 },
      { type: 'bookcoins' as const, amount: 150 },
      { type: 'badge' as const, badgeId: 'community_hero' }
    ]
  }
];

// Monthly Challenge Templates
export const MONTHLY_CHALLENGE_TEMPLATES = [
  {
    id: 'monthly_reading_odyssey',
    title: 'Odyssée Littéraire du Mois',
    description: 'Un voyage épique à travers les livres',
    theme: 'L\'Odyssée des Mille Pages',
    narrativeStory: 'Ce mois-ci, entreprenez une odyssée littéraire qui vous mènera à travers des mondes fantastiques, des histoires captivantes et des sagesses ancestrales. Chaque livre terminé vous rapprochera de la maîtrise ultime.',
    objectives: [
      { type: 'books_read', target: 8, title: 'Terminer 8 grimoires sacrés' },
      { type: 'pages_read', target: 2000, title: 'Parcourir 2000 pages de sagesse' },
      { type: 'genres_explored', target: 5, title: 'Explorer 5 royaumes différents' }
    ],
    rewards: [
      { type: 'experience' as const, amount: 1000 },
      { type: 'bookcoins' as const, amount: 500 },
      { type: 'badge' as const, badgeId: 'monthly_odyssey_master' }
    ]
  },
  {
    id: 'classics_month',
    title: 'Le Mois des Classiques Éternels',
    description: 'Redécouvrez les œuvres qui ont marqué l\'histoire',
    theme: 'Renaissance des Classiques',
    narrativeStory: 'Les classiques de la littérature sont les piliers de la Grande Bibliothèque. Ce mois-ci, plongez dans ces œuvres intemporelles qui ont façonné notre compréhension du monde.',
    objectives: [
      { type: 'books_read', target: 4, title: 'Lire 4 classiques' },
      { type: 'reviews_written', target: 4, title: 'Analyser chaque œuvre' },
      { type: 'custom', target: 2, title: 'Participer à 2 discussions' }
    ],
    rewards: [
      { type: 'experience' as const, amount: 800 },
      { type: 'bookcoins' as const, amount: 400 },
      { type: 'badge' as const, badgeId: 'classics_scholar' }
    ]
  }
];

// Enhanced mission generation system with adaptive difficulty
export const generateDailyMissions = (userProfile: { level: number; preferences: string[]; recentGenres: string[]; gameMode?: 'zen' | 'challenge' }) => {
  const missions = [];
  const gameMode = userProfile.gameMode || 'zen';
  
  // Always include one reading mission with adaptive difficulty
  const readingMission = generateAdaptiveReadingMission(userProfile);
  missions.push(readingMission);
  
  // Add exploration mission based on user's reading history
  if (userProfile.level >= 5) {
    const explorationMission = generateExplorationMission(userProfile);
    if (explorationMission) {
      missions.push(explorationMission);
    }
  }
  
  // Add community missions for social engagement
  if (userProfile.level >= 10) {
    const communityMission = generateCommunityMission(userProfile);
    missions.push(communityMission);
  }
  
  // Add creation missions for higher levels
  if (userProfile.level >= 15) {
    const creationMission = generateCreationMission(userProfile);
    if (Math.random() < 0.6) { // 60% chance
      missions.push(creationMission);
    }
  }
  
  // Add engagement missions
  if (userProfile.level >= 20) {
    const engagementMission = generateEngagementMission(userProfile);
    missions.push(engagementMission);
  }
  
  // Add competitive missions only in Challenge mode
  if (gameMode === 'challenge' && userProfile.level >= 15) {
    const competitiveMission = generateCompetitiveMission(userProfile);
    if (Math.random() < 0.4) { // 40% chance
      missions.push(competitiveMission);
    }
  }
  
  // Limit missions based on game mode
  const maxMissions = gameMode === 'zen' ? 3 : 5;
  return missions.slice(0, maxMissions);
};

function generateAdaptiveReadingMission(userProfile: { level: number; preferences: string[]; recentGenres: string[] }) {
  const basePages = 20;
  const adaptivePages = Math.max(basePages, userProfile.level * 2);
  const difficulty = getDifficultyForLevel(userProfile.level, 'reading');
  
  // Progressive missions based on level
  if (userProfile.level < 5) {
      return {
    id: `daily_reading_${Date.now()}`,
    title: 'Premiers pas dans la bibliothèque',
    description: `Lire ${adaptivePages} pages aujourd'hui`,
    type: 'daily',
    category: 'reading',
    difficulty,
    progress: 0,
    target: adaptivePages,
    reward: calculateReward(userProfile.level, 'reading'),
    isCompleted: false,
    isAccepted: false,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    narrativeContext: 'Chaque page vous rapproche de la sagesse des anciens.'
  };
  } else if (userProfile.level < 20) {
    return {
      id: `daily_reading_${Date.now()}`,
      title: 'Parcourir les parchemins sacrés',
      description: `Lire ${adaptivePages} pages ou terminer un chapitre`,
      type: 'daily',
      category: 'reading',
      difficulty,
      progress: 0,
      target: adaptivePages,
      reward: calculateReward(userProfile.level, 'reading'),
      isCompleted: false,
      isAccepted: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      narrativeContext: 'Les secrets des grimoires se révèlent à votre esprit attentif.'
    };
  } else {
    // Expert level missions
    const timeTarget = Math.max(60, userProfile.level * 2);
    return {
      id: `daily_reading_${Date.now()}`,
      title: 'Maîtrise de la lecture profonde',
      description: `Lire sans interruption pendant ${timeTarget} minutes`,
      type: 'daily',
      category: 'reading',
      difficulty,
      progress: 0,
      target: timeTarget,
      reward: calculateReward(userProfile.level, 'reading'),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      narrativeContext: 'La concentration profonde déverrouille les mystères les plus profonds.'
    };
  }
}

function generateExplorationMission(userProfile: { level: number; preferences: string[]; recentGenres: string[] }) {
  const allGenres = ['fantasy', 'science-fiction', 'mystery', 'romance', 'thriller', 'historical', 'biography', 'poetry', 'philosophy', 'classics'];
  const unexploredGenres = allGenres.filter(genre => !userProfile.recentGenres.includes(genre));
  
  if (unexploredGenres.length === 0) {
    return null; // User has explored all genres recently
  }
  
  const targetGenre = unexploredGenres[Math.floor(Math.random() * unexploredGenres.length)];
  const difficulty = getDifficultyForLevel(userProfile.level, 'exploration');
  
  return {
      id: `daily_exploration_${Date.now()}`,
    title: 'Explorer un nouveau royaume',
    description: `Découvrir le genre ${targetGenre} en lisant un livre`,
      type: 'daily',
      category: 'exploration',
    difficulty,
    progress: 0,
    target: 1,
    reward: calculateReward(userProfile.level, 'exploration'),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    narrativeContext: 'Les territoires inconnus recèlent des trésors insoupçonnés.',
    genre: targetGenre
  };
}

function generateCommunityMission(userProfile: { level: number; preferences: string[]; recentGenres: string[] }) {
  const communityActions = [
    {
      title: 'Partager sa sagesse',
      description: 'Écrire un commentaire constructif sur une critique',
      target: 1,
      narrativeContext: 'Votre sagesse guidera d\'autres lecteurs dans leur quête.'
    },
    {
      title: 'Guider un apprenti',
      description: 'Recommander un livre à un autre lecteur',
      target: 1,
      narrativeContext: 'Les maîtres transmettent leur savoir aux nouveaux apprentis.'
    },
    {
      title: 'Rejoindre le conseil',
      description: 'Participer à une discussion de groupe de lecture',
      target: 1,
      narrativeContext: 'Les échanges d\'idées font grandir la communauté.'
    }
  ];
  
  const action = communityActions[Math.floor(Math.random() * communityActions.length)];
  const difficulty = getDifficultyForLevel(userProfile.level, 'community');
  
  return {
    id: `daily_community_${Date.now()}`,
    title: action.title,
    description: action.description,
    type: 'daily',
    category: 'community',
    difficulty,
    progress: 0,
    target: action.target,
    reward: calculateReward(userProfile.level, 'community'),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    narrativeContext: action.narrativeContext
  };
}

function generateCreationMission(userProfile: { level: number; preferences: string[]; recentGenres: string[] }) {
  const creationActions = [
    {
      title: 'Rédiger un parchemin',
      description: 'Écrire une critique détaillée d\'un livre (min. 100 mots)',
      target: 1,
      narrativeContext: 'Les analyses approfondies éclairent les subtilités des œuvres.'
    },
    {
      title: 'Créer une collection',
      description: 'Compiler une liste thématique de recommandations',
      target: 1,
      narrativeContext: 'Les collections thématiques sont des guides précieux.'
    },
    {
      title: 'Immortaliser sa lecture',
      description: 'Partager une photo créative de votre moment de lecture',
      target: 1,
      narrativeContext: 'Les images capturent l\'essence de nos moments de lecture.'
    }
  ];
  
  const action = creationActions[Math.floor(Math.random() * creationActions.length)];
  const difficulty = getDifficultyForLevel(userProfile.level, 'creation');
  
  return {
    id: `daily_creation_${Date.now()}`,
    title: action.title,
    description: action.description,
    type: 'daily',
    category: 'creation',
    difficulty,
    progress: 0,
    target: action.target,
    reward: calculateReward(userProfile.level, 'creation'),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    narrativeContext: action.narrativeContext
  };
}

function generateEngagementMission(userProfile: { level: number; preferences: string[]; recentGenres: string[] }) {
  const engagementActions = [
    {
      title: 'Maintenir la flamme',
      description: 'Continuer votre série de lecture quotidienne',
      target: 1,
      narrativeContext: 'La régularité est la clé de la progression.'
    },
    {
      title: 'Exploration approfondie',
      description: 'Passer au moins 30 minutes dans l\'application',
      target: 30,
      narrativeContext: 'L\'exploration approfondie révèle des trésors cachés.'
    }
  ];
  
  const action = engagementActions[Math.floor(Math.random() * engagementActions.length)];
  const difficulty = getDifficultyForLevel(userProfile.level, 'engagement');
  
  return {
    id: `daily_engagement_${Date.now()}`,
    title: action.title,
    description: action.description,
    type: 'daily',
    category: 'engagement',
    difficulty,
    progress: 0,
    target: action.target,
    reward: calculateReward(userProfile.level, 'engagement'),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    narrativeContext: action.narrativeContext
  };
}

function generateCompetitiveMission(userProfile: { level: number; preferences: string[]; recentGenres: string[] }) {
  const competitiveActions = [
    {
      title: 'Duel de lecture',
      description: 'Lire plus de pages qu\'un autre lecteur aujourd\'hui',
      target: 50,
      narrativeContext: 'La compétition amicale pousse vers l\'excellence.'
    },
    {
      title: 'Course au sommet',
      description: 'Gagner des places dans le classement hebdomadaire',
      target: 3,
      narrativeContext: 'Chaque position gagnée est une victoire sur soi-même.'
    },
    {
      title: 'Champion du jour',
      description: 'Terminer dans le top 10 du classement quotidien',
      target: 1,
      narrativeContext: 'Les champions se révèlent dans l\'adversité.'
    },
    {
      title: 'Défi de vitesse',
      description: 'Terminer un livre avant la fin de la semaine',
      target: 1,
      narrativeContext: 'La vitesse sans la compréhension n\'est rien, mais les deux ensemble font les maîtres.'
    }
  ];
  
  const action = competitiveActions[Math.floor(Math.random() * competitiveActions.length)];
  const difficulty = getDifficultyForLevel(userProfile.level, 'engagement');
  
  return {
    id: `daily_competitive_${Date.now()}`,
    title: action.title,
    description: action.description,
    type: 'daily',
    category: 'engagement',
    difficulty,
    progress: 0,
    target: action.target,
    reward: {
      ...calculateReward(userProfile.level, 'engagement'),
      experience: Math.floor(calculateReward(userProfile.level, 'engagement').experience * 1.3), // 30% bonus pour défis compétitifs
      bookcoins: Math.floor(calculateReward(userProfile.level, 'engagement').bookcoins * 1.2) // 20% bonus
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    narrativeContext: action.narrativeContext
  };
}

function getDifficultyForLevel(level: number, category: string): 'easy' | 'medium' | 'hard' | 'expert' {
  if (level < 10) return 'easy';
  if (level < 25) return 'medium';
  if (level < 50) return 'hard';
  return 'expert';
}

function calculateReward(level: number, category: 'reading' | 'exploration' | 'community' | 'creation' | 'engagement'): { experience: number; bookcoins: number; badge?: string } {
  const baseXP = 50;
  const baseCoins = 25;
  const levelMultiplier = Math.max(1, level / 10);
  
  const categoryMultipliers: Record<string, number> = {
    reading: 1.0,
    exploration: 1.2,
    community: 1.1,
    creation: 1.3,
    engagement: 0.9
  };
  
  const multiplier = categoryMultipliers[category] || 1.0;
  
  return {
    experience: Math.floor(baseXP * levelMultiplier * multiplier),
    bookcoins: Math.floor(baseCoins * levelMultiplier * multiplier)
  };
}

// Helper function to add missing properties to missions
function completeMissionObject(mission: any): any {
  return {
    ...mission,
    isCompleted: false,
    isAccepted: false,
    createdAt: new Date().toISOString()
  };
}

export const generateWeeklyChallenge = () => {
  const template = WEEKLY_CHALLENGE_TEMPLATES[Math.floor(Math.random() * WEEKLY_CHALLENGE_TEMPLATES.length)];
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return {
    ...template,
    id: `weekly_${Date.now()}`,
    type: 'individual' as const,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    isActive: true,
    participants: Math.floor(Math.random() * 1000) + 100,
    completionRate: Math.floor(Math.random() * 40) + 10,
    objective: {
      id: 'weekly_obj_1',
      title: template.objectives[0].title,
      description: template.description,
      type: template.objectives[0].type as 'books_read' | 'pages_read' | 'time_spent' | 'streak_days' | 'genres_explored' | 'reviews_written' | 'custom',
      target: template.objectives[0].target,
      current: 0,
      unit: template.objectives[0].type === 'books_read' ? 'livres' : 'minutes',
      isCompleted: false
    }
  };
};

export const generateMonthlyChallenge = () => {
  const template = MONTHLY_CHALLENGE_TEMPLATES[Math.floor(Math.random() * MONTHLY_CHALLENGE_TEMPLATES.length)];
  const startDate = new Date();
  startDate.setDate(1); // Start of month
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0); // End of month
  
  return {
    ...template,
    id: `monthly_${Date.now()}`,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    isActive: true,
    participants: Math.floor(Math.random() * 5000) + 1000,
    leaderboard: generateMockLeaderboard(),
    objectives: template.objectives.map((obj, index) => ({
      id: `monthly_obj_${index + 1}`,
      title: obj.title,
      description: `Objectif ${index + 1} du défi mensuel`,
      type: obj.type as 'books_read' | 'pages_read' | 'time_spent' | 'streak_days' | 'genres_explored' | 'reviews_written' | 'custom',
      target: obj.target,
      current: Math.floor(Math.random() * obj.target * 0.3),
      unit: obj.type === 'books_read' ? 'livres' : obj.type === 'pages_read' ? 'pages' : 'genres',
      isCompleted: false
    })),
    badges: [] // Temporarily empty to avoid type conflicts
  };
};

const generateMockLeaderboard = () => {
  const names = ['Alexandre', 'Sophie', 'Marie', 'Pierre', 'Lucie', 'Antoine', 'Camille', 'Thomas'];
  return names.map((name, index) => ({
    userId: `user_${index}`,
    username: name,
    score: Math.floor(Math.random() * 1000) + 500,
    rank: index + 1,
    level: Math.floor(Math.random() * 50) + 10
  }));
}; 