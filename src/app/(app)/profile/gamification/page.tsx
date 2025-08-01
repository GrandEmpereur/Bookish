"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CelebrationModal } from "@/components/ui/celebration-modal";
import { GameModeToggle } from "@/components/ui/game-mode-toggle";
import { LevelProgress } from "@/components/ui/level-progress";
import { MissionBoard } from "@/components/ui/mission-board";
import { notifyGameModeSwitch } from "@/components/ui/narrative-toast";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { StreakDisplay } from "@/components/ui/streak-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XPToast } from "@/components/ui/xp-toast";
import { cn } from "@/lib/utils";
import { gamificationService } from "@/services/gamification.service";
import type {
  Challenge,
  ChallengeObjective,
  CreateChallengeRequest,
  CurrencyBalance,
  EquippedItems,
  EventsOverview,
  EventsOverviewAPIResponse,
  FlashContest,
  Badge as GamificationBadge,
  GamificationDashboard,
  HappyHour,
  Inventory,
  InventoryItem,
  InventoryShop,
  InventoryShopItem,
  InventoryStats,
  LeaderboardAPIResponse,
  LeaderboardEntry,
  Mission,
  MonthlyChallenge,
  Multiplier,
  PersonalChallengeStats,
  ShopItem,
  SpecialEvent,
  Streak,
  UserLeaderboardStats,
  WeeklyChallenge,
} from "@/types/gamificationTypes";
import {
  generateMonthlyChallenge,
  generateWeeklyChallenge,
  getDifficultyColor,
  MISSION_CATEGORIES,
} from "@/utils/gamificationUtils";
import { CosmeticShop } from "@/components/ui/cosmetic-shop";
import { MysteryBox } from "@/components/ui/mystery-box";
import { XPBonusSystem } from "@/components/ui/xp-bonus-system";
import {
  Award,
  BarChart3,
  BookOpen,
  Box,
  Calendar,
  Check,
  Coins,
  Crown,
  Flag,
  Flame,
  Gem,
  Gift,
  Heart,
  PaintBucket,
  Settings,
  ShoppingBag,
  Sparkle,
  Sparkles,
  Star,
  Sword,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  User,
  Users,
  Wand2,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";

export default function GamificationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tableau-de-bord");
  const [isNative, setIsNative] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Local storage keys for persistence
  const STORAGE_KEYS = {
    COMPLETED_MISSIONS: "bookish_completed_missions",
    LOCAL_XP_BONUS: "bookish_local_xp_bonus",
    LOCAL_COINS_BONUS: "bookish_local_coins_bonus",
    LOCAL_LEVEL_BONUS: "bookish_local_level_bonus",
  };

  // State
  const [dashboard, setDashboard] = useState<GamificationDashboard | null>(
    null
  );
  const [missions, setMissions] = useState<Mission[]>([]);
  const [badges, setBadges] = useState<GamificationBadge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [userCoins, setUserCoins] = useState(0);
  const [gameMode, setGameMode] = useState<"zen" | "challenge">("zen");

  // Enhanced state for weekly/monthly challenges
  const [weeklyChallenge, setWeeklyChallenge] =
    useState<WeeklyChallenge | null>(null);
  const [monthlyChallenge, setMonthlyChallenge] =
    useState<MonthlyChallenge | null>(null);
  const [userCurrency, setUserCurrency] = useState<CurrencyBalance>({
    bookcoins: 0,
    lastUpdated: new Date().toISOString(),
  });

  // Events state
  const [eventsOverview, setEventsOverview] = useState<EventsOverview | null>(
    null
  );
  const [happyHours, setHappyHours] = useState<HappyHour[]>([]);
  const [flashContests, setFlashContests] = useState<FlashContest[]>([]);
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);
  const [multipliers, setMultipliers] = useState<Multiplier[]>([]);

  // Inventory state
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [equippedItems, setEquippedItems] = useState<EquippedItems | null>(
    null
  );
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(
    null
  );
  const [inventoryShop, setInventoryShop] = useState<InventoryShop | null>(
    null
  );
  const [selectedInventoryTab, setSelectedInventoryTab] = useState<
    "items" | "equipped" | "shop" | "stats"
  >("items");

  // Challenges state
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [popularChallenges, setPopularChallenges] = useState<Challenge[]>([]);
  const [personalChallengeStats, setPersonalChallengeStats] =
    useState<PersonalChallengeStats | null>(null);
  const [selectedChallengeTab, setSelectedChallengeTab] = useState<
    "active" | "popular" | "create" | "stats"
  >("active");

  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    dashboard: true,
    missions: false,
    badges: false,
    leaderboard: false,
    shop: false,
    streak: false,
    events: false,
    inventory: false,
    equipped: false,
    inventoryStats: false,
    inventoryShop: false,
    challenges: false,
    popularChallenges: false,
    personalChallengeStats: false,
  });

  // New state for celebrations and notifications
  const [showLevelCelebration, setShowLevelCelebration] = useState(false);
  const [showMissionCelebration, setShowMissionCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<any>(null);
  const [xpToast, setXpToast] = useState<{
    amount: number;
    reason?: string;
    visible: boolean;
  }>({
    amount: 0,
    reason: "",
    visible: false,
  });

  // Set loading state helper
  const setLoading = (key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading("dashboard", true);

      const response = await gamificationService.getDashboard();

      // Check if response exists
      if (!response) {
        console.error("No response from API");
        toast.error("Aucune donnée reçue du serveur");
        return;
      }

      // The API returns data directly, not in a .data property
      const apiData = (response.data || response) as any;

      const exp = apiData.experience || {};
      const missionStats = apiData.missionStats || {};
      const xpProgress = exp.xpProgress || {};

      // Extract XP progression data properly
      const currentLevelXP = xpProgress.current || 0; // XP dans le niveau actuel
      const requiredForNextLevel =
        xpProgress.required || exp.xpToNextLevel || 100;

      const transformedDashboard = {
        level: exp.currentLevel || 1,
        experience: exp.totalXp || 0,
        currentLevelXP: currentLevelXP,
        currentStreak: exp.currentStreak || 0,
        longestStreak: exp.longestStreak || 0,
        totalBadges: apiData.totalBadges || 0,
        currency: {
          bookcoins: exp.bookCoins || 0,
        },
        weeklyProgress: {
          missionsCompleted: parseInt(missionStats.completed) || 0,
        },
        rank: apiData.leaderboard?.global?.rank || null,
        streakLastUpdated: exp.lastActiveDate || new Date().toISOString(),
        title: exp.title || "Novice Lecteur",
        gameMode: exp.gameMode || "zen",
        experienceToNextLevel: requiredForNextLevel,
        badges: apiData.recentBadges || [],
        streakFreezes: exp.streakFreezes || 0,
        streakRecoveryAvailable: exp.streakRecoveryAvailable || false,
        activeEvents: apiData.activeEvents || [],
        upcomingEvents: apiData.upcomingEvents || [],
      } as unknown as GamificationDashboard;

      // Apply local bonuses (from completed missions not yet synced with server)
      const dashboardWithLocalBonuses = applyLocalBonuses(transformedDashboard);

      setDashboard(dashboardWithLocalBonuses);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      toast.error("Impossible de charger le tableau de bord");

      // Don't set fallback data - let the UI handle empty states
      setDashboard(null);
    } finally {
      setLoading("dashboard", false);
    }
  }, []);

  // Fetch missions
  const fetchMissions = useCallback(async () => {
    try {
      setLoading("missions", true);
      const response = await gamificationService.getMissions();

      // Handle the correct API response structure: { available: [], active: [], completed: [] }
      // The API returns data directly, not wrapped in response.data
      const missionData = response.data || response; // Try response.data first, fallback to response

      const availableMissions = missionData?.available || [];
      const activeMissions = missionData?.active || [];
      const completedMissions = missionData?.completed || [];

      // Transform and combine all missions
      const missionMap = new Map<string, Mission>(); // Use Map to handle duplicates

      // Process completed missions first (highest priority)
      completedMissions.forEach((mission: any) => {
        const transformedMission = {
          id: mission.id,
          title: mission.title,
          description: mission.description,
          category: getMissionCategory(mission.requirement?.type || "reading"),
          difficulty: mission.difficulty,
          type: getMissionType(mission.frequency),
          target: mission.requirement?.value || 1,
          progress: mission.requirement?.value || 1, // Completed = progress equals target
          isCompleted: true,
          isAccepted: true,
          reward: {
            type: getRewardType(
              mission.coin_reward || 0,
              mission.xp_reward || 0
            ),
            amount:
              mission.coin_reward && mission.coin_reward > 0
                ? mission.coin_reward
                : mission.xp_reward || 0,
          },
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          narrativeContext: getNarrativeContext(
            mission.title,
            mission.description
          ),
          createdAt: new Date().toISOString(),
        };
        missionMap.set(mission.id, transformedMission); // Completed missions have highest priority
      });

      // Process active missions second (medium priority)
      activeMissions.forEach((mission: any) => {
        // Only add if not already in map (completed takes priority)
        if (!missionMap.has(mission.id)) {
          const transformedMission = {
            id: mission.id,
            title: mission.title,
            description: mission.description,
            category: getMissionCategory(
              mission.requirement?.type || "reading"
            ),
            difficulty: mission.difficulty,
            type: getMissionType(mission.frequency),
            target: mission.requirement?.value || 1,
            progress: mission.progress || 0, // Active missions have progress
            isCompleted: false,
            isAccepted: true, // Active = already accepted
            reward: {
              type: getRewardType(
                mission.coin_reward || 0,
                mission.xp_reward || 0
              ),
              amount:
                mission.coin_reward && mission.coin_reward > 0
                  ? mission.coin_reward
                  : mission.xp_reward || 0,
            },
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            narrativeContext: getNarrativeContext(
              mission.title,
              mission.description
            ),
            createdAt: new Date().toISOString(),
          };
          missionMap.set(mission.id, transformedMission);
        }
      });

      // Process available missions last (lowest priority)
      availableMissions.forEach((mission: any) => {
        // Only add if not already in map (completed and active take priority)
        if (!missionMap.has(mission.id)) {
          const transformedMission = {
            id: mission.id,
            title: mission.title,
            description: mission.description,
            category: getMissionCategory(
              mission.requirement?.type || "reading"
            ),
            difficulty: mission.difficulty,
            type: getMissionType(mission.frequency),
            target: mission.requirement?.value || 1,
            progress: 0, // Available missions have no progress
            isCompleted: false,
            isAccepted: false, // Available = not accepted yet
            reward: {
              type: getRewardType(
                mission.coin_reward || 0,
                mission.xp_reward || 0
              ),
              amount:
                mission.coin_reward && mission.coin_reward > 0
                  ? mission.coin_reward
                  : mission.xp_reward || 0,
            },
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default 24h
            narrativeContext: getNarrativeContext(
              mission.title,
              mission.description
            ),
            createdAt: new Date().toISOString(),
          };
          missionMap.set(mission.id, transformedMission);
        }
      });

      // Convert Map back to array
      let finalMissions = Array.from(missionMap.values());

      // Apply local completion status
      finalMissions = applyLocalMissionStatus(finalMissions);

      setMissions(finalMissions);
    } catch (error) {
      console.error("Error fetching missions:", error);
      toast.error("Impossible de charger les missions");

      // Fallback to dashboard missions if dedicated endpoint fails
      try {
        const dashboardResponse = await gamificationService.getDashboard();
        const apiData = (dashboardResponse.data || dashboardResponse) as any;
        const activeMissions = apiData.activeMissions || [];

        let fallbackMissions = activeMissions.map((activeMission: any) => {
          const mission = activeMission.mission;
          return {
            id: mission.id,
            title: mission.title,
            description: mission.description,
            category: getMissionCategory(
              mission.requirement?.type || "reading"
            ),
            difficulty: mission.difficulty,
            type:
              mission.frequency === "daily"
                ? "daily"
                : mission.frequency === "weekly"
                  ? "weekly"
                  : "special",
            target: mission.requirement?.value || 1,
            progress: activeMission.progress || activeMission.currentValue || 0,
            isCompleted: activeMission.isCompleted || false,
            isAccepted: activeMission.isActive || false,
            reward: {
              type:
                mission.coinReward && mission.coinReward > 0
                  ? "bookcoins"
                  : "experience",
              amount:
                mission.coinReward && mission.coinReward > 0
                  ? mission.coinReward
                  : mission.xpReward || 0,
            },
            expiresAt:
              activeMission.expiresAt ||
              new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            narrativeContext:
              mission.narrativeDescription ||
              getNarrativeContext(mission.title, mission.description),
            createdAt: activeMission.createdAt || new Date().toISOString(),
          };
        }) as Mission[];

        // Apply local completion status to fallback missions too
        fallbackMissions = applyLocalMissionStatus(fallbackMissions);

        setMissions(fallbackMissions);
      } catch (fallbackError) {
        console.error("Fallback mission fetch failed:", fallbackError);
        setMissions([]);
      }
    } finally {
      setLoading("missions", false);
    }
  }, []);

  // Fetch badges
  const fetchBadges = useCallback(async () => {
    try {
      setLoading("badges", true);
      const response = await gamificationService.getBadges();

      // Handle the correct API response structure: { badges: [], counts: { common: 0, ... } }
      const badgeData = response.data;
      const apiBadges = badgeData?.badges || [];
      const badgeCounts = badgeData?.counts || {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
      };

      if (apiBadges.length === 0) {
        setBadges([]);
        return;
      }

      const transformedBadges = apiBadges.map((badge: any) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        category: badge.category,
        level: badge.level || "bronze",
        tier: badge.tier || 1,
        iconUrl: badge.iconUrl || badge.icon || "",
        unlockedAt: badge.unlockedAt,
        isUnlocked: badge.isUnlocked || false,
        requirements: badge.requirements || {
          type: "books_read" as const,
          target: 1,
          description: "Default requirement",
        },
        reward: badge.reward,
        rarity: badge.rarity || "common",
        series: badge.series,
        narrativeTitle: badge.narrativeTitle,
        shareableMessage: badge.shareableMessage,
      })) as GamificationBadge[];

      setBadges(transformedBadges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      toast.error("Impossible de charger les badges");
      setBadges([]);
    } finally {
      setLoading("badges", false);
    }
  }, []);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading("leaderboard", true);
      const response = await gamificationService.getLeaderboards("global", 20);

      const leaderboardData = response.data as LeaderboardAPIResponse;
      // API returns { leaderboard: [], userStats: { global: null, weekly: null, monthly: null } }
      const apiLeaderboard = leaderboardData.leaderboard || [];
      const transformedLeaderboard = apiLeaderboard.map((entry: any) => ({
        userId: entry.userId,
        username: entry.username,
        profilePicture: entry.profilePicture,
        rank: entry.rank,
        score: entry.score,
        level: entry.level,
        title: entry.title,
      })) as LeaderboardEntry[];

      setLeaderboard(transformedLeaderboard);

      // Also store user stats if available
      if (leaderboardData.userStats && dashboard) {
        const globalStats = leaderboardData.userStats.global;
        if (globalStats) {
          setDashboard((prev) =>
            prev
              ? {
                  ...prev,
                  rank: globalStats.rank,
                }
              : null
          );
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Impossible de charger le classement");
      setLeaderboard([]);
    } finally {
      setLoading("leaderboard", false);
    }
  }, [dashboard]);

  // Fetch shop
  const fetchShop = useCallback(async () => {
    try {
      setLoading("shop", true);

      const response = await gamificationService.getShop();

      // Handle different response structures
      const shopData = response.data || response;

      if (!shopData) {
        console.error("❌ No shop data received");
        toast.error("Aucune donnée de boutique reçue");
        return;
      }

      // API returns { items: [], userCoins: 50 }
      const apiShopItems = shopData.items || [];

      if (!Array.isArray(apiShopItems)) {
        console.error("❌ Shop items is not an array:", apiShopItems);
        setShopItems([]);
      } else {
        const transformedShopItems = apiShopItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          iconUrl: item.iconUrl || "", // API doesn't provide iconUrl, use default
          isPurchased: item.isPurchased || false, // API doesn't provide isPurchased, default false
          isAvailable: item.available !== false, // API uses 'available' field
        })) as ShopItem[];

        setShopItems(transformedShopItems);
      }

      // Set base coins from API, then add local bonuses
      const baseCoins = shopData.userCoins || 0;

      // Get local bonuses safely
      let localCoinsBonus = 0;
      try {
        const storedBonus = localStorage.getItem(
          STORAGE_KEYS.LOCAL_COINS_BONUS
        );
        localCoinsBonus = storedBonus ? parseInt(storedBonus) : 0;
      } catch (error) {
        console.warn("Could not get local coins bonus:", error);
      }

      const totalCoins = baseCoins + localCoinsBonus;

      setUserCoins(totalCoins);
    } catch (error) {
      console.error("❌ Error fetching shop:", error);
      toast.error("Impossible de charger la boutique");
      setShopItems([]);
      setUserCoins(0);
    } finally {
      setLoading("shop", false);
    }
  }, []);

  // Fetch events overview
  const fetchEventsOverview = useCallback(async () => {
    try {
      setLoading("events", true);

      // Fetch events overview which contains all event types
      const eventsResponse = await gamificationService.getEventsOverview();
      const eventsData = eventsResponse.data;

      // API returns: { happyHours: [], flashContests: [], specialEvents: [], multipliers: { xpMultiplier: 1, coinMultiplier: 1, specialMultipliers: [] } }
      const apiData = eventsData as EventsOverviewAPIResponse;

      // Transform to EventsOverview format for backward compatibility
      const transformedOverview: EventsOverview = {
        activeHappyHours: apiData.happyHours || [],
        activeFlashContests: apiData.flashContests || [],
        specialEvents: apiData.specialEvents || [],
        activeMultipliers: [], // Will be populated below
        upcomingEvents: [], // Not provided by API
      };

      setEventsOverview(transformedOverview);
      setHappyHours(apiData.happyHours || []);
      setFlashContests(apiData.flashContests || []);
      setSpecialEvents(apiData.specialEvents || []);

      // Transform multipliers structure
      const multipliersData = apiData.multipliers || {};
      const transformedMultipliers: Multiplier[] = [];

      // Add XP multiplier if > 1
      if (multipliersData.xpMultiplier && multipliersData.xpMultiplier > 1) {
        transformedMultipliers.push({
          id: "xp_multiplier",
          name: "Multiplicateur XP",
          description: "Bonus sur l'expérience gagnée",
          multiplier: multipliersData.xpMultiplier,
          category: "experience" as const,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          iconUrl: "",
        });
      }

      // Add Coin multiplier if > 1
      if (
        multipliersData.coinMultiplier &&
        multipliersData.coinMultiplier > 1
      ) {
        transformedMultipliers.push({
          id: "coin_multiplier",
          name: "Multiplicateur BookCoins",
          description: "Bonus sur les BookCoins gagnés",
          multiplier: multipliersData.coinMultiplier,
          category: "points" as const,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
          iconUrl: "",
        });
      }

      // Add special multipliers
      if (
        multipliersData.specialMultipliers &&
        Array.isArray(multipliersData.specialMultipliers)
      ) {
        transformedMultipliers.push(...multipliersData.specialMultipliers);
      }

      setMultipliers(transformedMultipliers);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Impossible de charger les événements");
      // Set empty arrays as fallback
      setHappyHours([]);
      setFlashContests([]);
      setSpecialEvents([]);
      setMultipliers([]);
    } finally {
      setLoading("events", false);
    }
  }, []);

  // Inventory functions
  const fetchInventory = useCallback(async () => {
    try {
      setLoading("inventory", true);
      const response = await gamificationService.getInventory();
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Impossible de charger l'inventaire");
    } finally {
      setLoading("inventory", false);
    }
  }, []);

  const fetchEquippedItems = useCallback(async () => {
    try {
      setLoading("equipped", true);
      const response = await gamificationService.getEquippedItems();
      setEquippedItems(response.data);
    } catch (error) {
      console.error("Error fetching equipped items:", error);
      toast.error("Impossible de charger les objets équipés");
    } finally {
      setLoading("equipped", false);
    }
  }, []);

  const fetchInventoryStats = useCallback(async () => {
    try {
      setLoading("inventoryStats", true);
      const response = await gamificationService.getInventoryStats();
      setInventoryStats(response.data);
    } catch (error) {
      console.error("Error fetching inventory stats:", error);
      toast.error("Impossible de charger les statistiques d'inventaire");
    } finally {
      setLoading("inventoryStats", false);
    }
  }, []);

  const fetchInventoryShop = useCallback(async () => {
    try {
      setLoading("inventoryShop", true);
      const response = await gamificationService.getInventoryShop();
      setInventoryShop(response.data);
    } catch (error) {
      console.error("Error fetching inventory shop:", error);
      toast.error("Impossible de charger la boutique d'inventaire");
    } finally {
      setLoading("inventoryShop", false);
    }
  }, []);

  // Challenge functions
  const fetchChallenges = useCallback(async () => {
    try {
      setLoading("challenges", true);
      const response = await gamificationService.getChallenges("active");
      const challengeData = response.data;
      setChallenges(challengeData.challenges || []);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast.error("Impossible de charger les défis");
    } finally {
      setLoading("challenges", false);
    }
  }, []);

  const fetchPopularChallenges = useCallback(async () => {
    try {
      setLoading("popularChallenges", true);
      const response = await gamificationService.getPopularChallenges();
      const popularData = response.data;
      setPopularChallenges(popularData.challenges || []);
    } catch (error) {
      console.error("Error fetching popular challenges:", error);
      toast.error("Impossible de charger les défis populaires");
    } finally {
      setLoading("popularChallenges", false);
    }
  }, []);

  const fetchPersonalChallengeStats = useCallback(async () => {
    try {
      setLoading("personalChallengeStats", true);
      const response = await gamificationService.getPersonalChallengeStats();
      setPersonalChallengeStats(response.data);
    } catch (error) {
      console.error("Error fetching personal challenge stats:", error);
      toast.error("Impossible de charger les statistiques de défis");
    } finally {
      setLoading("personalChallengeStats", false);
    }
  }, []);

  // Handle mission acceptance
  const handleMissionAccept = useCallback(
    async (missionId: string) => {
      try {
        // Show loading state
        toast.loading("Acceptation de la mission...");

        // Call API to accept mission
        await gamificationService.acceptMission({ missionId });

        // Dismiss loading toast
        toast.dismiss();

        // Refetch missions to get updated states from server
        await fetchMissions();

        // Show acceptance feedback
        toast.success("Mission acceptée ! Vous pouvez maintenant la terminer.");
      } catch (error) {
        console.error("Error accepting mission:", error);
        toast.dismiss();

        // Check if mission was already accepted
        if (
          error instanceof Error &&
          error.message.includes("already accepted")
        ) {
          toast.error("Cette mission a déjà été acceptée");
          // Still refetch to sync state
          fetchMissions();
        } else {
          toast.error("Impossible d'accepter la mission. Veuillez réessayer.");
        }
      }
    },
    [fetchMissions]
  );

  // Handle mission completion
  const handleMissionComplete = useCallback(
    async (missionId: string) => {
      try {
        const mission = missions.find((m) => m.id === missionId);
        if (!mission) {
          toast.error("Mission introuvable");
          return;
        }

        // Calculate rewards
        const xpReward =
          mission.reward.type === "experience"
            ? mission.reward.amount || 25
            : 25; // Default 25 XP
        const bookcoinsReward =
          mission.reward.type === "bookcoins" ? mission.reward.amount || 0 : 0;

        // Show loading state
        toast.loading("Traitement de la mission...");

        try {
          // Try to call API to complete mission
          await gamificationService.completeMission({ missionId });

          // Dismiss loading toast
          toast.dismiss();

          // Refetch data from server
          await Promise.all([fetchDashboard(), fetchMissions()]);
        } catch (apiError) {
          console.warn(
            "⚠️ API endpoint not available, using local update:",
            apiError
          );
          toast.dismiss();

          // Fallback: Work with existing dashboard structure

          // Save mission completion to localStorage for persistence
          saveCompletedMission(missionId, {
            xp: xpReward,
            coins: bookcoinsReward,
          });

          // Instead of updating locally, let's refetch dashboard which will apply bonuses
          await fetchDashboard();
        }

        // Show XP toast notification
        setXpToast({
          amount: xpReward,
          reason: `Mission "${mission.title}" terminée !`,
          visible: true,
        });

        // Show celebration modal
        setCelebrationData({
          mission,
          experience: xpReward,
          bookcoins: bookcoinsReward,
        });
        setShowMissionCelebration(true);

        // Create reward message
        let rewardMessage = `Mission terminée !`;
        if (xpReward > 0) rewardMessage += ` +${xpReward} XP`;
        if (bookcoinsReward > 0)
          rewardMessage += ` +${bookcoinsReward} BookCoins`;

        toast.success(rewardMessage);
      } catch (error) {
        console.error("❌ Error completing mission:", error);
        toast.dismiss();
        toast.error("Impossible de terminer la mission. Veuillez réessayer.");
      }
    },
    [missions, dashboard, fetchDashboard, fetchMissions]
  );

  // Buy shop item
  const buyItem = async (itemId: string) => {
    try {
      // Show loading state
      toast.loading("Traitement de l'achat...");

      // Call API to buy item - this will deduct coins on the server
      await gamificationService.buyItem({ itemId });

      // Dismiss loading toast
      toast.dismiss();

      // Refetch shop data to get updated item status and user coins from server
      await fetchShop();

      // Refetch dashboard to get updated coin balance
      await fetchDashboard();

      toast.success("Achat effectué avec succès !");
    } catch (error) {
      console.error("Error buying item:", error);
      toast.dismiss();

      // Check specific error types
      if (
        error instanceof Error &&
        error.message.includes("insufficient funds")
      ) {
        toast.error("BookCoins insuffisants pour cet achat");
      } else if (
        error instanceof Error &&
        error.message.includes("already purchased")
      ) {
        toast.error("Cet article a déjà été acheté");
        // Still refetch to sync state
        fetchShop();
      } else {
        toast.error("Impossible d'acheter cet article. Veuillez réessayer.");
      }
    }
  };

  // Join happy hour
  const joinHappyHour = async (happyHourId: string) => {
    try {
      await gamificationService.joinHappyHour(happyHourId);
      toast.success("Vous avez rejoint l'Happy Hour !");

      // Update participant count
      setHappyHours((prev) =>
        prev.map((hh) =>
          hh.id === happyHourId
            ? { ...hh, participantCount: hh.participantCount + 1 }
            : hh
        )
      );
    } catch (error) {
      console.error("Error joining happy hour:", error);
      toast.error("Impossible de rejoindre l'Happy Hour");
    }
  };

  // Join flash contest
  const joinFlashContest = async (contestId: string) => {
    try {
      await gamificationService.joinFlashContest(contestId);
      toast.success("Vous avez rejoint le concours !");

      // Update participant count
      setFlashContests((prev) =>
        prev.map((contest) =>
          contest.id === contestId
            ? { ...contest, participantCount: contest.participantCount + 1 }
            : contest
        )
      );
    } catch (error) {
      console.error("Error joining flash contest:", error);
      toast.error("Impossible de rejoindre le concours");
    }
  };

  // Participate in special event
  const participateInSpecialEvent = async (eventId: string) => {
    try {
      await gamificationService.participateInSpecialEvent(eventId);
      toast.success("Vous participez à l'événement !");

      // Update participant count
      setSpecialEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, participants: event.participants + 1 }
            : event
        )
      );
    } catch (error) {
      console.error("Error participating in special event:", error);
      toast.error("Impossible de participer à l'événement");
    }
  };

  // Equip item
  const equipItem = async (itemId: string) => {
    try {
      await gamificationService.equipItem(itemId);
      toast.success("Objet équipé !");

      // Update inventory and equipped items
      setInventory((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((item) =>
                item.id === itemId ? { ...item, isEquipped: true } : item
              ),
            }
          : null
      );

      // Refresh equipped items
      setEquippedItems(null);
      fetchEquippedItems();
    } catch (error) {
      console.error("Error equipping item:", error);
      toast.error("Impossible d'équiper cet objet");
    }
  };

  // Unequip item
  const unequipItem = async (itemId: string) => {
    try {
      await gamificationService.unequipItem(itemId);
      toast.success("Objet déséquipé !");

      // Update inventory and equipped items
      setInventory((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((item) =>
                item.id === itemId ? { ...item, isEquipped: false } : item
              ),
            }
          : null
      );

      // Refresh equipped items
      setEquippedItems(null);
      fetchEquippedItems();
    } catch (error) {
      console.error("Error unequipping item:", error);
      toast.error("Impossible de déséquiper cet objet");
    }
  };

  // Purchase inventory item
  const purchaseInventoryItem = async (
    itemId: string,
    quantity: number = 1
  ) => {
    try {
      await gamificationService.purchaseInventoryItem({ itemId, quantity });
      toast.success("Achat effectué !");

      // Refresh inventory and shop
      setInventory(null);
      setInventoryShop(null);
      fetchInventory();
      fetchInventoryShop();
    } catch (error) {
      console.error("Error purchasing inventory item:", error);
      toast.error("Impossible d'acheter cet objet");
    }
  };

  // Open mystery box
  const openMysteryBox = async (boxType: string, cost: number) => {
    try {
      const response = await gamificationService.openMysteryBox(boxType, cost);
      const result = response.data;

      toast.success(`Vous avez reçu: ${result.reward.name}!`);

      // Refresh inventory and dashboard
      setInventory(null);
      fetchInventory();
      fetchDashboard(); // Refresh to update currency after purchase

      return response;
    } catch (error) {
      console.error("Error opening mystery box:", error);
      toast.error("Impossible d'ouvrir la boîte mystère");
      throw error;
    }
  };

  // Accept challenge
  const acceptChallenge = async (challengeId: string) => {
    try {
      await gamificationService.acceptChallenge(challengeId);
      toast.success("Défi accepté !");

      // Update challenge status
      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, status: "active" }
            : challenge
        )
      );

      // Refresh stats
      setPersonalChallengeStats(null);
      fetchPersonalChallengeStats();
    } catch (error) {
      console.error("Error accepting challenge:", error);
      toast.error("Impossible d'accepter le défi");
    }
  };

  // Decline challenge
  const declineChallenge = async (challengeId: string) => {
    try {
      await gamificationService.declineChallenge(challengeId);
      toast.success("Défi refusé");

      // Update challenge status
      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, status: "declined" }
            : challenge
        )
      );
    } catch (error) {
      console.error("Error declining challenge:", error);
      toast.error("Impossible de refuser le défi");
    }
  };

  // Update challenge progress
  const updateProgress = async (
    challengeId: string,
    objectiveId: string,
    progress: number
  ) => {
    try {
      await gamificationService.updateChallengeProgress(challengeId, {
        objectiveId,
        progress,
      });
      toast.success("Progression mise à jour !");

      // Update challenge progress locally
      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge.id === challengeId
            ? {
                ...challenge,
                objectives: challenge.objectives.map((obj) =>
                  obj.id === objectiveId
                    ? {
                        ...obj,
                        current: progress,
                        isCompleted: progress >= obj.target,
                      }
                    : obj
                ),
              }
            : challenge
        )
      );
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      toast.error("Impossible de mettre à jour la progression");
    }
  };

  // Create challenge
  const createChallenge = async (challengeData: CreateChallengeRequest) => {
    try {
      const response = await gamificationService.createChallenge(challengeData);
      toast.success("Défi créé avec succès !");

      // Add new challenge to the list
      setChallenges((prev) => [response.data, ...prev]);

      // Switch to active tab
      setSelectedChallengeTab("active");
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast.error("Impossible de créer le défi");
    }
  };

  // Handle game mode change
  const handleGameModeChange = (newMode: "zen" | "challenge") => {
    setGameMode(newMode);
    notifyGameModeSwitch(newMode);
  };

  // Handle challenge creation
  const handleCreateChallenge = (
    type: "reading" | "social" | "discovery" | "custom"
  ) => {
    // Challenge creation requires proper form and API implementation
    toast.error("Création de défis non disponible - API manquante");
  };

  // Tab change handler
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value);

      switch (value) {
        case "missions":
          // Always fetch missions when switching to missions tab
          setMissions([]); // Reset missions to force refetch
          fetchMissions();
          break;
        case "badges":
          fetchBadges();
          break;
        case "leaderboard":
          fetchLeaderboard();
          break;
        case "shop":
          fetchShop();
          break;
        case "events":
          fetchEventsOverview();
          break;
        case "inventory":
          fetchInventory();
          fetchEquippedItems();
          break;
        case "challenges":
          fetchChallenges();
          fetchPersonalChallengeStats();
          break;
      }
    },
    [
      fetchMissions,
      fetchBadges,
      fetchLeaderboard,
      fetchShop,
      fetchEventsOverview,
      fetchInventory,
      fetchEquippedItems,
      fetchChallenges,
      fetchPersonalChallengeStats,
    ]
  );

  // Inventory sub-tab change handler
  const handleInventoryTabChange = useCallback(
    (value: string) => {
      setSelectedInventoryTab(value as "items" | "equipped" | "shop" | "stats");

      switch (value) {
        case "shop":
          fetchInventoryShop();
          break;
        case "stats":
          fetchInventoryStats();
          break;
      }
    },
    [fetchInventoryShop, fetchInventoryStats]
  );

  // Challenges sub-tab change handler
  const handleChallengeTabChange = useCallback(
    (value: string) => {
      setSelectedChallengeTab(
        value as "active" | "popular" | "create" | "stats"
      );

      switch (value) {
        case "popular":
          fetchPopularChallenges();
          break;
        case "stats":
          fetchPersonalChallengeStats();
          break;
      }
    },
    [fetchPopularChallenges, fetchPersonalChallengeStats]
  );

  // Get locally completed missions from storage
  const getLocalCompletedMissions = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_MISSIONS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // Save completed mission to storage
  const saveCompletedMission = useCallback(
    (missionId: string, rewards: { xp: number; coins: number }) => {
      try {
        const completed = getLocalCompletedMissions();
        const existingIndex = completed.findIndex(
          (m: any) => m.missionId === missionId
        );

        if (existingIndex === -1) {
          completed.push({
            missionId,
            completedAt: new Date().toISOString(),
            rewards,
          });
          localStorage.setItem(
            STORAGE_KEYS.COMPLETED_MISSIONS,
            JSON.stringify(completed)
          );

          // Update cumulative bonuses
          const currentXpBonus = parseInt(
            localStorage.getItem(STORAGE_KEYS.LOCAL_XP_BONUS) || "0"
          );
          const currentCoinsBonus = parseInt(
            localStorage.getItem(STORAGE_KEYS.LOCAL_COINS_BONUS) || "0"
          );

          localStorage.setItem(
            STORAGE_KEYS.LOCAL_XP_BONUS,
            (currentXpBonus + rewards.xp).toString()
          );
          localStorage.setItem(
            STORAGE_KEYS.LOCAL_COINS_BONUS,
            (currentCoinsBonus + rewards.coins).toString()
          );
        }
      } catch (error) {
        console.error("Error saving completed mission:", error);
      }
    },
    [getLocalCompletedMissions]
  );

  // Get local bonuses
  const getLocalBonuses = useCallback(() => {
    return {
      xp: parseInt(localStorage.getItem(STORAGE_KEYS.LOCAL_XP_BONUS) || "0"),
      coins: parseInt(
        localStorage.getItem(STORAGE_KEYS.LOCAL_COINS_BONUS) || "0"
      ),
      level: parseInt(
        localStorage.getItem(STORAGE_KEYS.LOCAL_LEVEL_BONUS) || "0"
      ),
    };
  }, []);

  // Apply local bonuses to dashboard data
  const applyLocalBonuses = useCallback(
    (dashboardData: GamificationDashboard) => {
      const bonuses = getLocalBonuses();
      const completedMissions = getLocalCompletedMissions();

      if (bonuses.xp === 0 && bonuses.coins === 0) {
        return dashboardData; // No local changes
      }

      const baseXP = dashboardData.experience;
      const baseLevelXP = (dashboardData as any).currentLevelXP || 0;
      const newTotalXP = baseXP + bonuses.xp;
      const newCurrentLevelXP = baseLevelXP + bonuses.xp;
      const xpToNextLevel = dashboardData.experienceToNextLevel || 100;

      // Calculate level progression
      let newLevel = dashboardData.level;
      let adjustedCurrentLevelXP = newCurrentLevelXP;

      if (newCurrentLevelXP >= xpToNextLevel) {
        const levelsGained = Math.floor(newCurrentLevelXP / xpToNextLevel);
        newLevel = dashboardData.level + levelsGained;
        adjustedCurrentLevelXP = newCurrentLevelXP % xpToNextLevel;
      }

      return {
        ...dashboardData,
        level: newLevel,
        experience: newTotalXP,
        currentLevelXP: adjustedCurrentLevelXP,
        currency: {
          ...dashboardData.currency,
          bookcoins: dashboardData.currency.bookcoins + bonuses.coins,
        },
        weeklyProgress: {
          ...dashboardData.weeklyProgress,
          missionsCompleted:
            dashboardData.weeklyProgress.missionsCompleted +
            completedMissions.length,
        },
      };
    },
    [getLocalBonuses, getLocalCompletedMissions]
  );

  // Apply local completion status to missions
  const applyLocalMissionStatus = useCallback(
    (missionsData: Mission[]) => {
      const completedMissions = getLocalCompletedMissions();
      const completedIds = completedMissions.map((m: any) => m.missionId);

      return missionsData.map((mission) => {
        if (completedIds.includes(mission.id)) {
          return {
            ...mission,
            isCompleted: true,
            progress: mission.target,
          };
        }
        return mission;
      });
    },
    [getLocalCompletedMissions]
  );

  // Initialize dashboard on mount
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Update game mode when dashboard is loaded
  useEffect(() => {
    if (dashboard?.gameMode && dashboard.gameMode !== gameMode) {
      setGameMode(dashboard.gameMode);
    }
  }, [dashboard?.gameMode]);

  // Fetch missions when dashboard loads
  useEffect(() => {
    if (dashboard) {
      fetchMissions();
    }
  }, [dashboard, fetchMissions]);

  // Handle hydration and platform detection
  useEffect(() => {
    setIsMounted(true);
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );

  // Get mission category info
  const getMissionCategoryInfo = (category: string) => {
    const categoryData =
      MISSION_CATEGORIES[category as keyof typeof MISSION_CATEGORIES];
    return categoryData || { name: category, icon: "📋", color: "#6B7280" };
  };

  // Render mission card
  const renderMissionCard = (mission: Mission) => {
    const categoryInfo = getMissionCategoryInfo(mission.category);

    return (
      <Card
        key={mission.id}
        className="border border-gray-200 hover:shadow-md transition-shadow"
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: categoryInfo.color + "20" }}
                >
                  {categoryInfo.icon}
                </div>
                <h3 className="font-semibold text-sm">{mission.title}</h3>
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {mission.description}
              </p>

              {mission.narrativeContext && (
                <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-2 mb-2">
                  <p className="text-xs italic text-amber-800 dark:text-amber-200">
                    "{mission.narrativeContext}"
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={
                    mission.type === "daily"
                      ? "default"
                      : mission.type === "weekly"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {mission.type === "daily"
                    ? "Quotidien"
                    : mission.type === "weekly"
                      ? "Hebdomadaire"
                      : "Mensuel"}
                </Badge>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: categoryInfo.color,
                    color: categoryInfo.color,
                  }}
                >
                  {categoryInfo.name}
                </Badge>
                {mission.difficulty && (
                  <Badge
                    variant="outline"
                    className={getDifficultyColor(mission.difficulty)}
                  >
                    {mission.difficulty}
                  </Badge>
                )}
              </div>

              {/* Progress info without bar */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Objectif</span>
                <span className="font-medium">
                  {mission.progress}/{mission.target}
                </span>
              </div>

              {mission.reward && (
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-muted-foreground">Récompenses:</span>
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="h-3 w-3" />
                    {mission.reward.amount}{" "}
                    {mission.reward.type === "experience"
                      ? "XP"
                      : mission.reward.type === "bookcoins"
                        ? "BookCoins"
                        : "pts"}
                  </div>
                </div>
              )}
            </div>

            {mission.isCompleted ? (
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <Check className="h-4 w-4" />
                Terminé
              </div>
            ) : mission.progress >= mission.target ? (
              <Button
                size="sm"
                onClick={() => handleMissionComplete(mission.id)}
                className="ml-2 bg-green-600 hover:bg-green-700"
              >
                Récupérer
              </Button>
            ) : mission.isAccepted ? (
              <div className="flex items-center gap-1 text-blue-600 text-xs">
                <Target className="h-4 w-4" />
                En cours
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMissionAccept(mission.id)}
                className="ml-2"
              >
                Accepter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render badge card
  const renderBadgeCard = (badge: GamificationBadge) => (
    <Card
      key={badge.id}
      className={`border ${badge.isUnlocked ? "border-amber-300 bg-amber-50" : "border-gray-200"}`}
    >
      <CardContent className="p-4 text-center">
        <div
          className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
            badge.isUnlocked ? "bg-amber-200" : "bg-gray-100"
          }`}
        >
          <Award
            className={`h-6 w-6 ${badge.isUnlocked ? "text-amber-600" : "text-gray-400"}`}
          />
        </div>
        <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
        <p className="text-xs text-muted-foreground">{badge.description}</p>
        {badge.unlockedAt && (
          <p className="text-xs text-amber-600 mt-1">
            Débloqué le {new Date(badge.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );

  // Render leaderboard entry
  const renderLeaderboardEntry = (entry: LeaderboardEntry) => (
    <div
      key={entry.userId}
      className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold">
        {entry.rank <= 3 ? (
          <Crown
            className={`h-4 w-4 ${
              entry.rank === 1
                ? "text-amber-500"
                : entry.rank === 2
                  ? "text-gray-400"
                  : "text-amber-600"
            }`}
          />
        ) : (
          entry.rank
        )}
      </div>

      <Avatar className="w-8 h-8">
        <AvatarImage src={entry.profilePicture} alt={entry.username} />
        <AvatarFallback>
          {entry.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <p className="font-semibold text-sm">{entry.username}</p>
        <p className="text-xs text-muted-foreground">Niveau {entry.level}</p>
      </div>

      <div className="text-right">
        <p className="font-bold text-sm">{entry.score}</p>
        <p className="text-xs text-muted-foreground">points</p>
      </div>
    </div>
  );

  // Get shop item icon
  const getShopItemIcon = (category: string) => {
    switch (category) {
      case "utility":
        return Zap;
      case "cosmetic":
        return Sparkle;
      case "boost":
        return TrendingUp;
      case "themes":
        return PaintBucket;
      case "badges":
        return Award;
      case "avatars":
        return User;
      default:
        return Gift;
    }
  };

  // Render shop item
  const renderShopItem = (item: ShopItem) => {
    const ItemIcon = getShopItemIcon(item.category);

    return (
      <Card key={item.id} className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <ItemIcon className="h-6 w-6 text-purple-600" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm">{item.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-600">
                  <Coins className="h-4 w-4" />
                  <span className="font-bold">{item.price}</span>
                  <span className="text-xs">BookCoins</span>
                </div>

                {item.isPurchased ? (
                  <Badge variant="outline" className="text-green-600">
                    Acheté
                  </Badge>
                ) : item.isAvailable ? (
                  <Button
                    size="sm"
                    onClick={() => buyItem(item.id)}
                    disabled={userCoins < item.price}
                  >
                    Acheter
                  </Button>
                ) : (
                  <Badge variant="secondary">Indisponible</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render happy hour card
  const renderHappyHourCard = (happyHour: HappyHour) => (
    <Card
      key={happyHour.id}
      className={`border ${happyHour.isActive ? "border-orange-300 bg-orange-50" : "border-gray-200"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg flex items-center justify-center">
            <Timer className="h-6 w-6 text-orange-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{happyHour.title}</h3>
              <Badge variant={happyHour.isActive ? "default" : "secondary"}>
                {happyHour.isActive ? "Actif" : "Terminé"}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground mb-2">
              {happyHour.description}
            </p>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-orange-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold">
                  x{happyHour.multiplier}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {happyHour.participantCount} participants
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {new Date(happyHour.startTime).toLocaleTimeString()} -{" "}
                {new Date(happyHour.endTime).toLocaleTimeString()}
              </div>

              {happyHour.isActive && (
                <Button
                  size="sm"
                  onClick={() => joinHappyHour(happyHour.id)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Rejoindre
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render flash contest card
  const renderFlashContestCard = (contest: FlashContest) => (
    <Card
      key={contest.id}
      className={`border ${contest.isActive ? "border-red-300 bg-red-50" : "border-gray-200"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg flex items-center justify-center">
            <Zap className="h-6 w-6 text-red-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{contest.title}</h3>
              <Badge variant={contest.isActive ? "destructive" : "secondary"}>
                {contest.isActive ? "En cours" : "Terminé"}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground mb-2">
              {contest.description}
            </p>
            <p className="text-xs font-medium mb-2">
              Objectif: {contest.objective}
            </p>

            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-muted-foreground">
                {contest.participantCount} participants
              </div>
              <div className="text-xs text-muted-foreground">
                Prix: {contest.prizes.length} récompenses
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Fin: {new Date(contest.endTime).toLocaleString()}
              </div>

              {contest.isActive && (
                <Button
                  size="sm"
                  onClick={() => joinFlashContest(contest.id)}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Participer
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render special event card
  const renderSpecialEventCard = (event: SpecialEvent) => (
    <Card
      key={event.id}
      className={`border ${event.isActive ? "border-purple-300 bg-purple-50" : "border-gray-200"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{event.title}</h3>
              <Badge variant={event.isActive ? "default" : "secondary"}>
                {event.type === "seasonal"
                  ? "Saisonnier"
                  : event.type === "anniversary"
                    ? "Anniversaire"
                    : event.type === "community"
                      ? "Communauté"
                      : "Défi"}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground mb-2">
              {event.description}
            </p>

            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-muted-foreground">
                {event.participants} participants
              </div>
              <div className="text-xs text-muted-foreground">
                {event.objectives.length} objectifs
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {new Date(event.startDate).toLocaleDateString()} -{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </div>

              {event.isActive && (
                <Button
                  size="sm"
                  onClick={() => participateInSpecialEvent(event.id)}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Participer
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render multiplier card
  const renderMultiplierCard = (multiplier: Multiplier) => (
    <Card
      key={multiplier.id}
      className={`border ${multiplier.isActive ? "border-green-300 bg-green-50" : "border-gray-200"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{multiplier.name}</h3>
              <div className="flex items-center gap-1 text-green-600">
                <span className="text-lg font-bold">
                  x{multiplier.multiplier}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-1">
              {multiplier.description}
            </p>

            <div className="flex items-center justify-between">
              <Badge variant={multiplier.isActive ? "default" : "secondary"}>
                {multiplier.category === "experience"
                  ? "Expérience"
                  : multiplier.category === "points"
                    ? "Points"
                    : multiplier.category === "streak"
                      ? "Série"
                      : "Tous"}
              </Badge>

              <div className="text-xs text-muted-foreground">
                {multiplier.isActive ? "Actif" : "Inactif"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "avatar":
        return User;
      case "frame":
        return PaintBucket;
      case "badge":
        return Award;
      case "theme":
        return Settings;
      case "accessory":
        return Sparkle;
      case "boost":
        return Zap;
      case "consumable":
        return Wand2;
      default:
        return Box;
    }
  };

  // Get rarity classes for badges
  const getRarityClasses = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common":
        return "text-gray-600 border-gray-600";
      case "uncommon":
        return "text-green-600 border-green-600";
      case "rare":
        return "text-blue-600 border-blue-600";
      case "epic":
        return "text-purple-600 border-purple-600";
      case "legendary":
        return "text-amber-600 border-amber-600";
      default:
        return "text-gray-600 border-gray-600";
    }
  };

  // Get difficulty classes for badges
  const getDifficultyClasses = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 border-green-600";
      case "medium":
        return "text-amber-600 border-amber-600";
      case "hard":
        return "text-red-600 border-red-600";
      case "expert":
        return "text-purple-600 border-purple-600";
      default:
        return "text-gray-600 border-gray-600";
    }
  };

  // Render inventory item
  const renderInventoryItem = (item: InventoryItem) => {
    const TypeIcon = getTypeIcon(item.type);

    return (
      <Card
        key={item.id}
        className={`border ${item.isEquipped ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
              <TypeIcon className="h-6 w-6 text-purple-600" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm">{item.name}</h3>
                <Badge
                  variant="outline"
                  className={getRarityClasses(item.rarity)}
                >
                  {item.rarity}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.type}</Badge>
                  {item.quantity > 1 && (
                    <span className="text-xs text-muted-foreground">
                      x{item.quantity}
                    </span>
                  )}
                </div>

                <div className="flex gap-1">
                  {item.isEquipped ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => unequipItem(item.id)}
                      className="text-xs"
                    >
                      Retirer
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => equipItem(item.id)}
                      className="text-xs"
                    >
                      Équiper
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render equipped item
  const renderEquippedItem = (
    item: InventoryItem | undefined,
    label: string
  ) => {
    const TypeIcon = item ? getTypeIcon(item.type) : Box;

    return (
      <Card className="border border-gray-200">
        <CardContent className="p-4 text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <TypeIcon
              className={`h-6 w-6 ${item ? "text-blue-600" : "text-gray-400"}`}
            />
          </div>
          <h3 className="font-semibold text-sm">{label}</h3>
          <p className="text-xs text-muted-foreground">
            {item ? item.name : "Aucun objet"}
          </p>
          {item && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => unequipItem(item.id)}
              className="mt-2 text-xs"
            >
              Retirer
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render inventory shop item
  const renderInventoryShopItem = (item: InventoryShopItem) => {
    const TypeIcon = getTypeIcon(item.type);

    return (
      <Card key={item.id} className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
              <TypeIcon className="h-6 w-6 text-indigo-600" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm">{item.name}</h3>
                <Badge
                  variant="outline"
                  className={getRarityClasses(item.rarity)}
                >
                  {item.rarity}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {item.currency === "points" ? (
                    <Star className="h-4 w-4 text-amber-600" />
                  ) : item.currency === "coins" ? (
                    <Coins className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <Gem className="h-4 w-4 text-blue-600" />
                  )}
                  <span className="font-bold text-sm">{item.price}</span>
                </div>

                <Button
                  size="sm"
                  onClick={() => purchaseInventoryItem(item.id)}
                  disabled={!item.isAvailable}
                  className="text-xs"
                >
                  Acheter
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Get challenge icon
  const getChallengeIcon = (category: string) => {
    switch (category) {
      case "reading":
        return BookOpen;
      case "social":
        return Users;
      case "discovery":
        return Sparkles;
      case "speed":
        return Zap;
      case "consistency":
        return Flame;
      case "custom":
        return Settings;
      default:
        return Target;
    }
  };

  // Render challenge card
  const renderChallengeCard = (challenge: Challenge) => {
    const CategoryIcon = getChallengeIcon(challenge.category);
    const progress = challenge.progress?.overallProgress || 0;

    return (
      <Card
        key={challenge.id}
        className={`border ${challenge.status === "active" ? "border-blue-300 bg-blue-50" : "border-gray-200"}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <CategoryIcon className="h-6 w-6 text-blue-600" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm">{challenge.title}</h3>
                <div className="flex items-center gap-1">
                  <Badge
                    variant="outline"
                    className={getDifficultyClasses(challenge.difficulty)}
                  >
                    {challenge.difficulty}
                  </Badge>
                  <Badge
                    variant={
                      challenge.status === "active" ? "default" : "secondary"
                    }
                  >
                    {challenge.status === "active"
                      ? "Actif"
                      : challenge.status === "completed"
                        ? "Terminé"
                        : challenge.status === "failed"
                          ? "Échoué"
                          : "En attente"}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {challenge.description}
              </p>

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{challenge.category}</Badge>
                  <Badge variant="outline">{challenge.type}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {challenge.participants} participants
                </div>
              </div>

              {challenge.progress && (
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-xs">
                    <span>Progression</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {new Date(challenge.endDate).toLocaleDateString()}
                </div>

                <div className="flex gap-1">
                  {challenge.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => acceptChallenge(challenge.id)}
                        className="text-xs"
                      >
                        Accepter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => declineChallenge(challenge.id)}
                        className="text-xs"
                      >
                        Refuser
                      </Button>
                    </>
                  )}

                  {challenge.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateProgress(
                          challenge.id,
                          challenge.objectives[0]?.id || "",
                          challenge.objectives[0]?.current + 1 || 1
                        )
                      }
                      className="text-xs"
                    >
                      Progression
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render challenge objective
  const renderChallengeObjective = (objective: ChallengeObjective) => (
    <div
      key={objective.id}
      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
    >
      <div className="flex-1">
        <h4 className="font-semibold text-sm">{objective.title}</h4>
        <p className="text-xs text-muted-foreground">{objective.description}</p>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold">{objective.current}</span>
          <span className="text-xs text-muted-foreground">
            / {objective.target}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">{objective.unit}</div>
      </div>
      {objective.isCompleted && (
        <Check className="h-4 w-4 text-green-600 ml-2" />
      )}
    </div>
  );

  // Helper functions for mission transformation
  const getMissionCategory = (
    requirementType: string
  ): "reading" | "exploration" | "community" | "creation" | "engagement" => {
    switch (requirementType) {
      case "reading_minutes":
      case "pages_read":
      case "books_read":
        return "reading";
      case "profile_complete":
      case "onboarding_complete":
        return "engagement";
      case "review_write":
      case "comment_post":
        return "creation";
      case "genre_explore":
      case "author_discover":
        return "exploration";
      case "friend_add":
      case "discussion_join":
        return "community";
      default:
        return "reading";
    }
  };

  const getMissionType = (
    frequency: string
  ): "daily" | "weekly" | "monthly" | "special" => {
    switch (frequency) {
      case "daily":
        return "daily";
      case "weekly":
        return "weekly";
      case "monthly":
        return "monthly";
      case "special":
        return "special";
      default:
        return "special";
    }
  };

  const getRewardType = (
    coinReward: number,
    xpReward: number
  ): "experience" | "bookcoins" => {
    return coinReward && coinReward > 0 ? "bookcoins" : "experience";
  };

  const getNarrativeContext = (title: string, description: string): string => {
    const contexts = [
      "Votre bibliothécaire virtuel vous encourage à poursuivre cette quête !",
      "Chaque page tournée vous rapproche de nouveaux horizons littéraires.",
      "Les mots vous attendent, prêts à dévoiler leurs secrets.",
      "Votre voyage de lecture continue avec cette nouvelle aventure.",
      "Enrichissez votre esprit avec cette mission captivante.",
    ];
    return contexts[Math.floor(Math.random() * contexts.length)];
  };

  // Determine padding based on platform and hydration
  const topPadding = !isMounted
    ? "pt-[120px]"
    : isNative
      ? "pt-[70px]"
      : "pt-[30px]";

  return (
    <div className="min-h-screen bg-background">
      <main
        className={cn(
          "container mx-auto pt-8 px-5 pb-[120px] max-w-md",
          topPadding
        )}
      >
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full mt-16"
        >
          <TabsList
            className={cn(
              "grid w-full text-xs",
              gameMode === "zen" ? "grid-cols-7" : "grid-cols-9"
            )}
          >
            <TabsTrigger value="tableau-de-bord">
              <BarChart3 className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="missions">
              <Target className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="badges">
              <Award className="w-3 h-3" />
            </TabsTrigger>
            {gameMode === "challenge" && (
              <TabsTrigger value="leaderboard">
                <Trophy className="w-3 h-3" />
              </TabsTrigger>
            )}
            <TabsTrigger value="shop">
              <ShoppingBag className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Box className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="boxes">
              <Gift className="w-3 h-3" />
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="w-3 h-3" />
            </TabsTrigger>
            {gameMode === "challenge" && (
              <TabsTrigger value="challenges">
                <Flag className="w-3 h-3" />
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="tableau-de-bord" className="space-y-6">
            {loadingStates.dashboard ? (
              <div className="space-y-6">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <Skeleton className="h-32 w-full rounded-xl" />
                </div>
              </div>
            ) : dashboard ? (
              <div className="space-y-6">
                {/* Header with user info and quick stats */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-2xl p-4 md:p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex-1 mr-4">
                      <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-1 whitespace-nowrap">
                        Tableau de bord
                      </h1>
                      <p className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
                        Niveau {dashboard.level}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {dashboard.experience} XP
                      </div>
                      <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
                        {dashboard.experienceToNextLevel} XP pour le niveau
                        suivant
                      </div>
                    </div>
                  </div>

                  {/* Quick stats bar */}
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    <div className="text-center bg-white/70 dark:bg-black/30 rounded-xl p-2 md:p-4 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-center mb-1 md:mb-2">
                        <Flame className="w-4 h-4 md:w-6 md:h-6 text-orange-500 dark:text-orange-400" />
                      </div>
                      <div className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {dashboard.currentStreak}
                      </div>
                      <div className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                        Série
                      </div>
                    </div>

                    <div className="text-center bg-white/70 dark:bg-black/30 rounded-xl p-2 md:p-4 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-center mb-1 md:mb-2">
                        <Trophy className="w-4 h-4 md:w-6 md:h-6 text-yellow-500 dark:text-yellow-400" />
                      </div>
                      <div className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {dashboard.totalBadges}
                      </div>
                      <div className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                        Badges
                      </div>
                    </div>

                    <div className="text-center bg-white/70 dark:bg-black/30 rounded-xl p-2 md:p-4 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-center mb-1 md:mb-2">
                        <Coins className="w-4 h-4 md:w-6 md:h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {dashboard.currency.bookcoins}
                      </div>
                      <div className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                        Coins
                      </div>
                    </div>
                  </div>
                </div>

                {/* Level Progress - more compact */}
                <LevelProgress
                  level={dashboard.level}
                  currentXP={(dashboard as any).currentLevelXP || 0}
                  totalXP={dashboard.experienceToNextLevel || 100}
                  showCelebration={showLevelCelebration}
                  onCelebrationComplete={() => setShowLevelCelebration(false)}
                />

                {/* Game Mode Toggle - compact */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <GameModeToggle
                    currentMode={gameMode}
                    onModeChange={setGameMode}
                  />
                </div>

                {/* Mode-specific message - inline */}
                <div
                  className={cn(
                    "rounded-xl p-4 flex items-center gap-3",
                    gameMode === "zen"
                      ? "bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800"
                      : "bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800"
                  )}
                >
                  {gameMode === "zen" ? (
                    <>
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                        <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">
                          Mode Zen actif
                        </h3>
                        <p className="text-sm text-emerald-600 dark:text-emerald-300">
                          💡 Progressez à votre rythme, chaque lecture compte
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                        <Sword className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                          Mode Challenge actif
                        </h3>
                        <p className="text-sm text-orange-600 dark:text-orange-300">
                          🔥 Terminez vos missions pour gravir le classement !
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Progress Overview - Combined */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Progression
                    </h3>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1">
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Activité
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Mission Progress */}
                    <div className="space-y-4">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                        🎯 Missions
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Missions terminées
                          </span>
                          <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                            {dashboard.weeklyProgress.missionsCompleted}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Gels de série
                          </span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                            {(dashboard as any).streakFreezes || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Streak info */}
                    <div className="space-y-4">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                        🔥 Série de lecture
                      </h4>
                      <div className="text-center bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                          {dashboard.currentStreak}
                        </div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                          {dashboard.currentStreak <= 1
                            ? "jour consécutif"
                            : "jours consécutifs"}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">
                          Record : {dashboard.longestStreak}{" "}
                          {dashboard.longestStreak <= 1 ? "jour" : "jours"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {gameMode === "challenge" && dashboard.rank && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          🏆 Rang actuel
                        </span>
                        <Badge
                          variant="outline"
                          className="font-bold text-lg px-3 py-1"
                        >
                          #{dashboard.rank}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Aucune donnée disponible
                </h3>
                <p className="text-muted-foreground">
                  Impossible de charger le tableau de bord
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="missions">
            {loadingStates.missions ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-8 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <MissionBoard
                missions={missions || []}
                onMissionAccept={handleMissionAccept}
                onMissionComplete={handleMissionComplete}
              />
            )}
          </TabsContent>

          <TabsContent value="badges">
            {loadingStates.badges ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-32 w-full mb-4" />
                      <Skeleton className="h-8 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Badge Collection Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Collection de Badges</h2>
                  <div className="text-sm text-muted-foreground">
                    {badges.filter((b) => b.isUnlocked).length} /{" "}
                    {badges.length} débloqués
                  </div>
                </div>

                {/* API Badges Only */}
                {badges.length > 0 ? (
                  <>
                    {/* Unlocked API Badges */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-green-600">
                        🏆 Badges obtenus
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {badges
                          .filter((badge) => badge.isUnlocked)
                          .map(renderBadgeCard)}
                      </div>

                      {badges.filter((b) => b.isUnlocked).length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>Aucun badge débloqué pour le moment</p>
                          <p className="text-sm">
                            Continuez à lire pour obtenir vos premiers badges !
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Locked API Badges */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-600">
                        🎯 Badges à débloquer
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {badges
                          .filter((badge) => !badge.isUnlocked)
                          .slice(0, 6)
                          .map(renderBadgeCard)}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Aucun badge disponible
                    </h3>
                    <p className="text-muted-foreground">
                      Les badges seront chargés depuis l'API.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboard">
            {loadingStates.leaderboard ? (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Classement Global
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {leaderboard.length > 0 ? (
                    <div className="space-y-2">
                      {leaderboard.map(renderLeaderboardEntry)}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Classement en construction
                      </h3>
                      <p className="text-muted-foreground">
                        Le classement se remplira au fur et à mesure que les
                        utilisateurs participent aux défis.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Continuez à lire et à terminer des missions pour
                        apparaître dans le classement !
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="shop">
            {loadingStates.shop ? (
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <Skeleton className="h-4 w-full mb-4" />
                        <Skeleton className="h-8 w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* User currency display */}
                <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                          <Coins className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-amber-800">
                            Mes BookCoins
                          </h3>
                          <p className="text-sm text-amber-600">
                            Votre monnaie virtuelle
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-700">
                          {userCoins}
                        </div>
                        <div className="text-sm text-amber-600">BookCoins</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shop items */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Boutique</h2>
                  {shopItems.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {shopItems.map(renderShopItem)}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Boutique temporairement vide
                      </h3>
                      <p className="text-muted-foreground">
                        De nouveaux articles seront bientôt disponibles !
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="inventory">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Inventaire</h2>

              <Tabs
                value={selectedInventoryTab}
                onValueChange={handleInventoryTabChange}
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="items">Objets</TabsTrigger>
                  <TabsTrigger value="equipped">Équipé</TabsTrigger>
                  <TabsTrigger value="shop">Boutique</TabsTrigger>
                  <TabsTrigger value="stats">Statistiques</TabsTrigger>
                </TabsList>

                <TabsContent value="items">
                  {loadingStates.inventory ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-8 w-3/4" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {(inventory?.items || []).map(renderInventoryItem)}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="equipped">
                  {loadingStates.equipped ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-8 w-3/4" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {renderEquippedItem(equippedItems?.avatar, "Avatar")}
                      {renderEquippedItem(equippedItems?.frame, "Cadre")}
                      {renderEquippedItem(equippedItems?.badge, "Badge")}
                      {renderEquippedItem(equippedItems?.theme, "Thème")}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="shop">
                  {loadingStates.inventoryShop ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-8 w-3/4" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {(inventoryShop?.items || []).map(
                        renderInventoryShopItem
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="stats">
                  {loadingStates.inventoryStats ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-8 w-3/4" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : inventoryStats ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold">
                              {inventoryStats.totalItems}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total des objets
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold">
                              {inventoryStats.totalValue}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Valeur totale
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold">
                              {Object.keys(inventoryStats.itemsByType).length}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Types d'objets
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold">
                              {Object.keys(inventoryStats.itemsByRarity).length}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Raretés
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">
                          Aucune statistique disponible
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="boxes">
            <MysteryBox
              userCurrency={{
                bookcoins: dashboard?.currency?.bookcoins || 0,
              }}
              onPurchase={(boxId, cost, currency) => {
                // Update user currency
                if (dashboard) {
                  setDashboard((prev) =>
                    prev
                      ? {
                          ...prev,
                          currency: {
                            ...prev.currency,
                            bookcoins: prev.currency.bookcoins - cost,
                          },
                        }
                      : null
                  );
                }
                toast.success("Coffre acheté !");
              }}
              onRewardReceived={(reward) => {
                // Handle reward received
                if (reward.type === "bookcoins" && reward.amount) {
                  setDashboard((prev) =>
                    prev
                      ? {
                          ...prev,
                          currency: {
                            ...prev.currency,
                            bookcoins:
                              prev.currency.bookcoins + (reward.amount || 0),
                          },
                        }
                      : null
                  );
                } else if (reward.type === "xp" && reward.amount) {
                  setDashboard((prev) =>
                    prev
                      ? {
                          ...prev,
                          experience: prev.experience + (reward.amount || 0),
                        }
                      : null
                  );
                }

                // Show celebration for special rewards
                if (reward.rarity === "legendary" || reward.rarity === "epic") {
                  setCelebrationData({
                    reward,
                    experience: reward.type === "xp" ? reward.amount || 0 : 0,
                    bookcoins:
                      reward.type === "bookcoins" ? reward.amount || 0 : 0,
                  });
                  setShowMissionCelebration(true);
                }
              }}
              onOpenMysteryBox={openMysteryBox}
              mysteryBoxTypes={[]}
            />
          </TabsContent>

          <TabsContent value="events">
            {loadingStates.events ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-8 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* XP Bonus System */}
                <XPBonusSystem
                  currentStreak={dashboard?.currentStreak || 0}
                  dailyCombo={0}
                  userLevel={dashboard?.level || 1}
                  onClaimDailyChest={() => {
                    // Daily chest functionality requires API implementation
                    toast.error(
                      "Fonctionnalité non disponible - API manquante"
                    );
                  }}
                  onJoinHappyHour={joinHappyHour}
                  xpBonuses={[]} // API integration needed - empty array for now
                  happyHours={happyHours || []} // Use API data
                  dailyChestAvailable={false} // API integration needed
                />

                {/* Traditional Events Section */}
                <div className="border-t pt-6">
                  <h2 className="text-2xl font-bold mb-6">
                    Événements Spéciaux
                  </h2>

                  {/* Happy Hours */}
                  {(happyHours || []).length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Happy Hours</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {(happyHours || []).map(renderHappyHourCard)}
                      </div>
                    </div>
                  )}

                  {/* Flash Contests */}
                  {(flashContests || []).length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Concours Flash</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {(flashContests || []).map(renderFlashContestCard)}
                      </div>
                    </div>
                  )}

                  {/* Special Events */}
                  {(specialEvents || []).length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Événements Spéciaux
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {(specialEvents || []).map(renderSpecialEventCard)}
                      </div>
                    </div>
                  )}

                  {/* Multipliers */}
                  {(multipliers || []).length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Multiplicateurs Actifs
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {(multipliers || []).map(renderMultiplierCard)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="challenges">
            {loadingStates.challenges ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-8 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Défis</h2>

                <Tabs
                  value={selectedChallengeTab}
                  onValueChange={handleChallengeTabChange}
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="active">Actifs</TabsTrigger>
                    <TabsTrigger value="popular">Populaires</TabsTrigger>
                    <TabsTrigger value="create">Créer</TabsTrigger>
                    <TabsTrigger value="stats">Statistiques</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active">
                    <div className="grid gap-4 md:grid-cols-2">
                      {(challenges || []).map(renderChallengeCard)}
                    </div>
                  </TabsContent>

                  <TabsContent value="popular">
                    <div className="grid gap-4 md:grid-cols-2">
                      {(popularChallenges || []).map(renderChallengeCard)}
                    </div>
                  </TabsContent>

                  <TabsContent value="create">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Créer un nouveau défi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <Button
                              onClick={() => handleCreateChallenge("reading")}
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Défi de Lecture
                            </Button>
                            <Button
                              onClick={() => handleCreateChallenge("social")}
                            >
                              <Users className="w-4 h-4 mr-2" />
                              Défi Social
                            </Button>
                            <Button
                              onClick={() => handleCreateChallenge("discovery")}
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Défi Découverte
                            </Button>
                            <Button
                              onClick={() => handleCreateChallenge("custom")}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Défi Personnalisé
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats">
                    {personalChallengeStats ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                          <CardContent className="p-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold">
                                {personalChallengeStats.totalChallenges}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Total des défis
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold">
                                {personalChallengeStats.completedChallenges}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Défis terminés
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold">
                                {Math.round(personalChallengeStats.successRate)}
                                %
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Taux de réussite
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold">
                                {personalChallengeStats.longestStreak}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Plus longue série
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="p-6">
                          <p className="text-center text-muted-foreground">
                            Aucune statistique disponible
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Celebration Modals */}
      <div style={{ zIndex: 10000 }}>
        <CelebrationModal
          isOpen={showMissionCelebration && celebrationData !== null}
          onClose={() => setShowMissionCelebration(false)}
          type="mission"
          data={celebrationData || {}}
        />
      </div>

      {/* XP Toast Notifications */}
      <XPToast
        amount={xpToast.amount}
        reason={xpToast.reason}
        isVisible={xpToast.visible}
        onComplete={() => setXpToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
