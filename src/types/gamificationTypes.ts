// Gamification Types

export interface GamificationDashboard {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalBooks: number;
  currentStreak: number;
  badges: Badge[];
  recentAchievements: Achievement[];
  // Enhanced fields from documentation
  currency: CurrencyBalance;
  gameMode: 'zen' | 'challenge';
  currentWeeklyChallenge?: WeeklyChallenge;
  currentMonthlyChallenge?: MonthlyChallenge;
  weeklyProgress: {
    booksRead: number;
    experienceGained: number;
    missionsCompleted: number;
    target: number;
  };
  monthlyProgress: {
    booksRead: number;
    experienceGained: number;
    badgesEarned: number;
    targets: {
      books: number;
      experience: number;
      badges: number;
    };
  };
  narrativeProgress: {
    currentChapter: string;
    storyUnlocked: string[];
    nextMilestone: string;
    completionPercentage: number;
  };
  longestStreak: number;
  rank: number;
  totalBadges: number;
  unlockedBadges: number;
  currentPoints: number;
  nextLevelRequirement: number;
  streakLastUpdated: string;
}

export interface GameMode {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  rewards: Reward[];
}

export interface EventData {
  eventType: 'session_reading' | 'book_completed';
  sessionDuration?: number; // for session reading
  bookId?: string; // for book completion
  rating?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: 'reading' | 'exploration' | 'community' | 'creation' | 'engagement';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  progress: number;
  target: number;
  reward: Reward;
  isCompleted: boolean;
  isAccepted: boolean;
  expiresAt: string;
  createdAt: string;
  prerequisites?: string[];
  streakRequired?: number;
  genre?: string;
  bookId?: string;
  narrativeContext?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'reading' | 'social' | 'achievement' | 'streak' | 'discovery' | 'community' | 'critic' | 'marathon';
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  tier: number; // 1, 2, 3, etc. for multiple levels within same achievement
  iconUrl: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  requirements: BadgeRequirement;
  reward?: BadgeReward;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  series?: string; // For grouped badges like "Lecteur Marathonien I, II, III"
  narrativeTitle?: string; // Special title unlocked with badge
  shareableMessage?: string; // Message for social sharing
}

export interface BadgeRequirement {
  type: 'books_read' | 'streak_days' | 'reviews_written' | 'genres_explored' | 'reading_time' | 'community_engagement' | 'custom';
  target: number;
  description: string;
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'lifetime';
  specificConditions?: string[]; // e.g., ["fantasy", "sci-fi"] for genre badges
}

export interface BadgeReward {
  bookcoins: number;
  xp: number;
  title?: string; // Special title like "Bibliophile", "Critic Elite"
  cosmetic?: {
    type: 'avatar_accessory' | 'profile_frame' | 'theme';
    itemId: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  unlockedAt: string;
  experienceReward: number;
}

export interface Leaderboard {
  type: 'global' | 'friends';
  entries: LeaderboardEntry[];
}

export interface LeaderboardAPIResponse {
  leaderboard: LeaderboardEntry[];
  userStats: {
    global: UserLeaderboardStats | null;
    weekly: UserLeaderboardStats | null;
    monthly: UserLeaderboardStats | null;
  };
}

export interface UserLeaderboardStats {
  rank: number;
  score: number;
  level: number;
  username: string;
  profilePicture?: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  profilePicture?: string;
  score: number;
  rank: number;
  level: number;
  title?: string;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakGoal: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'themes' | 'badges' | 'avatars' | 'boosts' | 'utility' | 'cosmetic' | 'boost';
  iconUrl: string;
  isPurchased: boolean;
  isAvailable: boolean;
}

export interface Shop {
  items: ShopItem[];
  userCoins: number; // Changed from userPoints to match API
}

export interface Reward {
  type: 'experience' | 'points' | 'badge' | 'item' | 'bookcoins' | 'streak_freeze' | 'xp_boost';
  amount?: number;
  badgeId?: string;
  itemId?: string;
  boostDuration?: number; // in minutes
  description?: string;
}

// BookCoins Currency System
export interface CurrencyBalance {
  bookcoins: number;
  lastUpdated: string;
}

// Weekly/Monthly Challenge Loop
export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'individual' | 'community' | 'club';
  startDate: string;
  endDate: string;
  isActive: boolean;
  objective: ChallengeObjective;
  rewards: Reward[];
  participants: number;
  completionRate: number;
  narrativeTheme: string;
}

export interface MonthlyChallenge {
  id: string;
  title: string;
  description: string;
  theme: string; // e.g. "Octobre Fantastique", "Défi Classiques de Mai"
  startDate: string;
  endDate: string;
  isActive: boolean;
  objectives: ChallengeObjective[];
  rewards: Reward[];
  badges: Badge[];
  participants: number;
  leaderboard: LeaderboardEntry[];
  narrativeStory: string;
}

// Anti-cheat verification system
export interface VerificationChallenge {
  id: string;
  type: 'quiz' | 'summary' | 'qr_code' | 'photo_proof';
  question?: string;
  options?: string[];
  correctAnswer?: string;
  qrCode?: string;
  bookId?: string;
  isOptional: boolean;
  xpBonus: number;
}

// API Response Types
export interface GamificationDashboardResponse {
  status: 'success';
  data: GamificationDashboard;
}

export interface GameModeResponse {
  status: 'success';
  data: GameMode;
}

export interface MissionsResponse {
  status: 'success';
  data: {
    available: Mission[];
    active: Mission[];
    completed: Mission[];
  };
}

export interface BadgesResponse {
  status: 'success';
  data: {
    badges: Badge[];
    counts: {
      common: number;
      uncommon: number;
      rare: number;
      epic: number;
      legendary: number;
    };
  };
}

export interface LeaderboardResponse {
  status: 'success';
  data: LeaderboardAPIResponse;
}

export interface StreakResponse {
  status: 'success';
  data: Streak;
}

export interface ShopResponse {
  status: 'success';
  data: Shop;
}

export interface BasicGamificationResponse {
  status: 'success';
  message: string;
}

// Temporal Events Types
export interface EventsOverview {
  activeHappyHours: HappyHour[];
  activeFlashContests: FlashContest[];
  specialEvents: SpecialEvent[];
  activeMultipliers: Multiplier[];
  upcomingEvents: UpcomingEvent[];
}

export interface EventsOverviewAPIResponse {
  happyHours: HappyHour[];
  flashContests: FlashContest[];
  specialEvents: SpecialEvent[];
  multipliers: {
    xpMultiplier: number;
    coinMultiplier: number;
    specialMultipliers: Multiplier[];
  };
}

export interface HappyHour {
  id: string;
  title: string;
  description: string;
  multiplier: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  category: 'reading' | 'social' | 'missions' | 'all';
  participantCount: number;
  maxParticipants?: number;
}

export interface FlashContest {
  id: string;
  title: string;
  description: string;
  objective: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  participantCount: number;
  maxParticipants?: number;
  prizes: ContestPrize[];
  requirements: string[];
  progress?: number;
  target?: number;
}

export interface ContestPrize {
  position: number;
  reward: Reward;
  description: string;
}

export interface SpecialEvent {
  id: string;
  title: string;
  description: string;
  type: 'seasonal' | 'anniversary' | 'community' | 'challenge';
  startDate: string;
  endDate: string;
  isActive: boolean;
  rewards: Reward[];
  participants: number;
  objectives: EventObjective[];
  bannerUrl?: string;
}

export interface EventObjective {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  isCompleted: boolean;
  reward: Reward;
}

export interface Multiplier {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  category: 'experience' | 'points' | 'streak' | 'all';
  startTime: string;
  endTime: string;
  isActive: boolean;
  iconUrl?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  type: 'happy_hour' | 'flash_contest' | 'special_event';
  scheduledFor: string;
  estimatedDuration: number; // in minutes
}

// API Response Types for Events
export interface EventsOverviewResponse {
  status: 'success';
  data: EventsOverviewAPIResponse;
}

export interface HappyHoursResponse {
  status: 'success';
  data: HappyHour[];
}

export interface FlashContestsResponse {
  status: 'success';
  data: FlashContest[];
}

export interface SpecialEventsResponse {
  status: 'success';
  data: SpecialEvent[];
}

export interface MultipliersResponse {
  status: 'success';
  data: Multiplier[];
}

// Admin Types
export interface CreateHappyHourRequest {
  title: string;
  description: string;
  multiplier: number;
  duration: number; // in minutes
  category: 'reading' | 'social' | 'missions' | 'all';
  maxParticipants?: number;
}

export interface CreateFlashContestRequest {
  title: string;
  description: string;
  objective: string;
  duration: number; // in minutes
  maxParticipants?: number;
  prizes: ContestPrize[];
  requirements: string[];
}

// Inventory & Cosmetics Types
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'avatar' | 'frame' | 'badge' | 'theme' | 'accessory' | 'boost' | 'consumable';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  iconUrl: string;
  quantity: number;
  acquiredAt: string;
  isEquipped: boolean;
  stats?: ItemStats;
  expiresAt?: string; // for temporary items
}

export interface ItemStats {
  experienceBonus?: number;
  pointsBonus?: number;
  streakMultiplier?: number;
  readingSpeedBonus?: number;
}

export interface Inventory {
  items: InventoryItem[];
  totalItems: number;
  capacity: number;
  lastUpdated: string;
}

export interface EquippedItems {
  avatar?: InventoryItem;
  frame?: InventoryItem;
  badge?: InventoryItem;
  theme?: InventoryItem;
  accessories: InventoryItem[];
  activeBoosts: InventoryItem[];
}

export interface InventoryStats {
  totalItems: number;
  itemsByType: Record<string, number>;
  itemsByRarity: Record<string, number>;
  totalValue: number;
  favoriteItems: InventoryItem[];
  recentlyAcquired: InventoryItem[];
}

export interface InventoryShopItem {
  id: string;
  name: string;
  description: string;
  type: 'avatar' | 'frame' | 'badge' | 'theme' | 'accessory' | 'boost' | 'consumable';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  price: number;
  currency: 'points' | 'coins' | 'gems';
  iconUrl: string;
  previewUrl?: string;
  isAvailable: boolean;
  isLimited: boolean;
  stock?: number;
  discount?: number;
  tags: string[];
  stats?: ItemStats;
}

export interface InventoryShop {
  items: InventoryShopItem[];
  featured: InventoryShopItem[];
  dailyDeals: InventoryShopItem[];
  userCurrency: {
    points: number;
    coins: number;
    gems: number;
  };
  categories: string[];
}

export interface MysteryBox {
  id: string;
  name: string;
  description: string;
  type: 'common' | 'rare' | 'epic' | 'legendary';
  price: number;
  currency: 'points' | 'coins' | 'gems';
  iconUrl: string;
  possibleRewards: MysteryBoxReward[];
  guarantee?: string;
  isAvailable: boolean;
  cooldown?: number; // in seconds
}

export interface MysteryBoxReward {
  item: InventoryItem;
  probability: number;
  isGuaranteed: boolean;
}

export interface MysteryBoxOpenResult {
  reward: InventoryItem;
  isNew: boolean;
  duplicateCompensation?: {
    type: 'currency' | 'points';
    amount: number;
  };
}

// API Response Types for Inventory
export interface InventoryResponse {
  status: 'success';
  data: Inventory;
}

export interface EquippedItemsResponse {
  status: 'success';
  data: EquippedItems;
}

export interface InventoryStatsResponse {
  status: 'success';
  data: InventoryStats;
}

export interface InventoryShopResponse {
  status: 'success';
  data: InventoryShop;
}

export interface MysteryBoxOpenResponse {
  status: 'success';
  data: MysteryBoxOpenResult;
}

export interface InventoryPurchaseRequest {
  itemId: string;
  quantity?: number;
}

// User Challenges Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'public' | 'community';
  status: 'active' | 'completed' | 'failed' | 'pending' | 'declined';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'reading' | 'social' | 'discovery' | 'speed' | 'consistency' | 'custom';
  createdBy: string;
  createdByUsername?: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants?: number;
  isPublic: boolean;
  tags: string[];
  objectives: ChallengeObjective[];
  rewards: ChallengeReward[];
  progress?: ChallengeProgress;
  requirements?: ChallengeRequirement[];
  stats?: ChallengeStats;
}

export interface ChallengeObjective {
  id: string;
  title: string;
  description: string;
  type: 'books_read' | 'pages_read' | 'time_spent' | 'streak_days' | 'genres_explored' | 'reviews_written' | 'custom';
  target: number;
  current: number;
  unit: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface ChallengeReward {
  id: string;
  type: 'experience' | 'points' | 'badge' | 'item' | 'title' | 'currency';
  amount?: number;
  itemId?: string;
  badgeId?: string;
  title?: string;
  description: string;
  iconUrl?: string;
}

export interface ChallengeProgress {
  overallProgress: number;
  objectivesCompleted: number;
  totalObjectives: number;
  isCompleted: boolean;
  completedAt?: string;
  lastUpdated: string;
  participantRank?: number;
}

export interface ChallengeRequirement {
  type: 'level' | 'books_read' | 'streak' | 'badge' | 'custom';
  value: number;
  description: string;
  isMet: boolean;
}

export interface ChallengeStats {
  totalParticipants: number;
  completionRate: number;
  averageProgress: number;
  topPerformers: ChallengeParticipant[];
  timeRemaining: number;
  isExpired: boolean;
}

export interface ChallengeParticipant {
  userId: string;
  username: string;
  profilePicture?: string;
  progress: number;
  rank: number;
  joinedAt: string;
  lastActivity: string;
}

export interface PersonalChallengeStats {
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  successRate: number;
  averageProgress: number;
  favoriteCategory: string;
  totalRewardsEarned: number;
  longestStreak: number;
  recentChallenges: Challenge[];
  achievements: {
    challengeCreator: boolean;
    challengeCompleter: boolean;
    challengeMaster: boolean;
    socialChallenger: boolean;
  };
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
  type: 'personal' | 'public' | 'community';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'reading' | 'social' | 'discovery' | 'speed' | 'consistency' | 'custom';
  startDate: string;
  endDate: string;
  maxParticipants?: number;
  isPublic: boolean;
  tags: string[];
  objectives: Omit<ChallengeObjective, 'id' | 'current' | 'isCompleted' | 'completedAt'>[];
  rewards: Omit<ChallengeReward, 'id'>[];
  requirements?: Omit<ChallengeRequirement, 'isMet'>[];
}

export interface UpdateProgressRequest {
  objectiveId: string;
  progress: number;
  notes?: string;
}

// API Response Types for Challenges
export interface ChallengesResponse {
  status: 'success';
  data: {
    challenges: Challenge[];
    totalCount: number;
    hasMore: boolean;
    filters: {
      categories: string[];
      difficulties: string[];
      statuses: string[];
    };
  };
}

export interface ChallengeResponse {
  status: 'success';
  data: Challenge;
}

export interface PersonalChallengeStatsResponse {
  status: 'success';
  data: PersonalChallengeStats;
}

export interface PopularChallengesResponse {
  status: 'success';
  data: {
    challenges: Challenge[];
    trending: Challenge[];
    mostParticipated: Challenge[];
    recentlyCompleted: Challenge[];
  };
} 