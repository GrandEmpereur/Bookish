import { apiRequest } from "@/lib/api-client";
import { ReadingStatisticsResponse } from "@/types/statisticsTypes";

class StatisticsService {
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

  // GET /users/reading-statistics/dashboard
  async getReadingStatistics(): Promise<ReadingStatisticsResponse> {
    return this.makeRequest<ReadingStatisticsResponse>(
      "GET",
      "/users/reading-statistics/dashboard"
    );
  }
}

export const statisticsService = new StatisticsService();
