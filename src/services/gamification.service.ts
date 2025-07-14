import { apiRequest } from "@/lib/api-client";
import {
  GamificationDashboardResponse,
  GameModeResponse,
  MissionsResponse,
  BadgesResponse,
  LeaderboardResponse,
  StreakResponse,
  ShopResponse,
  BasicGamificationResponse,
  EventData,
  EventsOverviewResponse,
  HappyHoursResponse,
  FlashContestsResponse,
  SpecialEventsResponse,
  MultipliersResponse,
  CreateHappyHourRequest,
  CreateFlashContestRequest,
  InventoryResponse,
  EquippedItemsResponse,
  InventoryStatsResponse,
  InventoryShopResponse,
  MysteryBoxOpenResponse,
  InventoryPurchaseRequest,
  ChallengesResponse,
  ChallengeResponse,
  PersonalChallengeStatsResponse,
  PopularChallengesResponse,
  CreateChallengeRequest,
  UpdateProgressRequest
} from "@/types/gamificationTypes";

class GamificationService {
  /**
   * Utility method to handle HTTP requests via the centralized client
   */
  private makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    options?: { data?: unknown; params?: Record<string, any> }
  ): Promise<T> {
    return apiRequest<T>(method, endpoint, options);
  }

  // GET /gamification/dashboard
  async getDashboard(): Promise<GamificationDashboardResponse> {
    return this.makeRequest<GamificationDashboardResponse>("GET", "/gamification/dashboard");
  }

  // POST /gamification/game-mode
  async changeGameMode(data: { modeId: string }): Promise<GameModeResponse> {
    return this.makeRequest<GameModeResponse>("POST", "/gamification/game-mode", { data });
  }

  // POST /gamification/events - Session Reading
  async submitSessionReading(data: { sessionDuration: number }): Promise<BasicGamificationResponse> {
    const eventData: EventData = {
      eventType: 'session_reading',
      sessionDuration: data.sessionDuration
    };
    return this.makeRequest<BasicGamificationResponse>("POST", "/gamification/events", { data: eventData });
  }

  // POST /gamification/events - Book Completed
  async submitBookCompleted(data: { bookId: string; rating?: number }): Promise<BasicGamificationResponse> {
    const eventData: EventData = {
      eventType: 'book_completed',
      bookId: data.bookId,
      rating: data.rating
    };
    return this.makeRequest<BasicGamificationResponse>("POST", "/gamification/events", { data: eventData });
  }

  // GET /gamification/missions
  async getMissions(): Promise<MissionsResponse> {
    return this.makeRequest<MissionsResponse>("GET", "/gamification/missions");
  }

  // POST /gamification/missions/accept
  async acceptMission(data: { missionId: string }): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", "/gamification/missions/accept", { data });
  }

  // POST /gamification/missions/complete
  async completeMission(data: { missionId: string }): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", "/gamification/missions/complete", { data });
  }

  // GET /gamification/badges
  async getBadges(category?: 'reading' | 'social' | 'achievement'): Promise<BadgesResponse> {
    const params = category ? { category } : {};
    return this.makeRequest<BadgesResponse>("GET", "/gamification/badges", { params });
  }

  // GET /gamification/leaderboards
  async getLeaderboards(type: 'global' | 'friends' = 'global', limit: number = 20): Promise<LeaderboardResponse> {
    return this.makeRequest<LeaderboardResponse>("GET", "/gamification/leaderboards", { 
      params: { type, limit } 
    });
  }

  // POST /gamification/streak
  async updateStreak(): Promise<StreakResponse> {
    return this.makeRequest<StreakResponse>("POST", "/gamification/streak");
  }

  // GET /gamification/shop
  async getShop(): Promise<ShopResponse> {
    return this.makeRequest<ShopResponse>("GET", "/gamification/shop");
  }

  // POST /gamification/shop/buy
  async buyItem(data: { itemId: string }): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", "/gamification/shop/buy", { data });
  }

  // ========================
  // TEMPORAL EVENTS ENDPOINTS
  // ========================

  // GET /gamification/events/
  async getEventsOverview(): Promise<EventsOverviewResponse> {
    return this.makeRequest<EventsOverviewResponse>("GET", "/gamification/events/");
  }

  // GET /gamification/events/happy-hours
  async getHappyHours(): Promise<HappyHoursResponse> {
    return this.makeRequest<HappyHoursResponse>("GET", "/gamification/events/happy-hours");
  }

  // POST /gamification/events/happy-hours (Admin)
  async createHappyHour(data: CreateHappyHourRequest): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", "/gamification/events/happy-hours", { data });
  }

  // GET /gamification/events/flash-contests
  async getFlashContests(): Promise<FlashContestsResponse> {
    return this.makeRequest<FlashContestsResponse>("GET", "/gamification/events/flash-contests");
  }

  // POST /gamification/events/flash-contests (Create Flash Contest)
  async createFlashContest(data: CreateFlashContestRequest): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", "/gamification/events/flash-contests", { data });
  }

  // GET /gamification/events/special-events
  async getSpecialEvents(): Promise<SpecialEventsResponse> {
    return this.makeRequest<SpecialEventsResponse>("GET", "/gamification/events/special-events");
  }

  // GET /gamification/events/multipliers
  async getMultipliers(): Promise<MultipliersResponse> {
    return this.makeRequest<MultipliersResponse>("GET", "/gamification/events/multipliers");
  }

  // Utility methods for events
  async joinHappyHour(happyHourId: string): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", `/gamification/events/happy-hours/${happyHourId}/join`);
  }

  async joinFlashContest(contestId: string): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", `/gamification/events/flash-contests/${contestId}/join`);
  }

  async participateInSpecialEvent(eventId: string): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", `/gamification/events/special-events/${eventId}/participate`);
  }

  // ========================
  // INVENTORY & COSMETICS ENDPOINTS
  // ========================

  // GET /gamification/inventory/
  async getInventory(type?: string): Promise<InventoryResponse> {
    const params = type ? { type } : {};
    return this.makeRequest<InventoryResponse>("GET", "/gamification/inventory/", { params });
  }

  // GET /gamification/inventory/equipped
  async getEquippedItems(): Promise<EquippedItemsResponse> {
    return this.makeRequest<EquippedItemsResponse>("GET", "/gamification/inventory/equipped");
  }

  // GET /gamification/inventory/stats
  async getInventoryStats(): Promise<InventoryStatsResponse> {
    return this.makeRequest<InventoryStatsResponse>("GET", "/gamification/inventory/stats");
  }

  // GET /gamification/inventory/shop
  async getInventoryShop(): Promise<InventoryShopResponse> {
    return this.makeRequest<InventoryShopResponse>("GET", "/gamification/inventory/shop");
  }

  // POST /gamification/inventory/shop/purchase
  async purchaseInventoryItem(data: InventoryPurchaseRequest): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", "/gamification/inventory/shop/purchase", { data });
  }

  // POST /gamification/inventory/mystery-box/open
  async openMysteryBox(boxType: string, cost: number): Promise<MysteryBoxOpenResponse> {
    return this.makeRequest<MysteryBoxOpenResponse>("POST", "/gamification/inventory/mystery-box/open", { 
      data: { boxType, cost } 
    });
  }

  // Utility methods for inventory
  async equipItem(itemId: string): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", `/gamification/inventory/items/${itemId}/equip`);
  }

  async unequipItem(itemId: string): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", `/gamification/inventory/items/${itemId}/unequip`);
  }

  // ========================
  // USER CHALLENGES ENDPOINTS
  // ========================

  // GET /gamification/challenges/?status=active
  async getChallenges(status?: string, page?: number, limit?: number): Promise<ChallengesResponse> {
    const params: Record<string, any> = {};
    if (status) params.status = status;
    if (page) params.page = page;
    if (limit) params.limit = limit;
    
    return this.makeRequest<ChallengesResponse>("GET", "/gamification/challenges/", { params });
  }

  // POST /gamification/challenges/
  async createChallenge(data: CreateChallengeRequest): Promise<ChallengeResponse> {
    return this.makeRequest<ChallengeResponse>("POST", "/gamification/challenges/", { data });
  }

  // GET /gamification/challenges/{{challenge_id}}
  async getChallenge(challengeId: string): Promise<ChallengeResponse> {
    return this.makeRequest<ChallengeResponse>("GET", `/gamification/challenges/${challengeId}`);
  }

  // POST /gamification/challenges/{{challenge_id}}/accept
  async acceptChallenge(challengeId: string): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", `/gamification/challenges/${challengeId}/accept`);
  }

  // POST /gamification/challenges/{{challenge_id}}/decline
  async declineChallenge(challengeId: string): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", `/gamification/challenges/${challengeId}/decline`);
  }

  // POST /gamification/challenges/{{challenge_id}}/update-progress
  async updateChallengeProgress(challengeId: string, data: UpdateProgressRequest): Promise<BasicGamificationResponse> {
    return this.makeRequest<BasicGamificationResponse>("POST", `/gamification/challenges/${challengeId}/update-progress`, { data });
  }

  // GET /gamification/challenges/public/popular
  async getPopularChallenges(): Promise<PopularChallengesResponse> {
    return this.makeRequest<PopularChallengesResponse>("GET", "/gamification/challenges/public/popular");
  }

  // GET /gamification/challenges/stats/personal
  async getPersonalChallengeStats(): Promise<PersonalChallengeStatsResponse> {
    return this.makeRequest<PersonalChallengeStatsResponse>("GET", "/gamification/challenges/stats/personal");
  }

  // Utility methods for challenges
  async getMyChallenges(): Promise<ChallengesResponse> {
    return this.getChallenges('active');
  }

  async getCompletedChallenges(): Promise<ChallengesResponse> {
    return this.getChallenges('completed');
  }

  async joinPublicChallenge(challengeId: string): Promise<BasicGamificationResponse> {
    return this.acceptChallenge(challengeId);
  }

  async leaveChallenge(challengeId: string): Promise<BasicGamificationResponse> {
    return this.declineChallenge(challengeId);
  }
}

export const gamificationService = new GamificationService(); 