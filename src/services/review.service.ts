import { apiRequest } from "@/lib/api-client";
import type { Review } from "@/types/reviewTypes";
import type { ApiResponse } from "@/types/api";

interface GetBookReviewsResponse {
  reviews: Review[];
  statistics: {
    total_reviews: number;
    average_rating: number;
    rating_distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
    recommendation_percentage: number;
  };
  pagination: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
  };
  filters: {
    sort_by: string;
    order: string;
    only_recommended: boolean;
  };
}

interface CreateReviewRequest {
  bookId: string;
  rating: number;
  title: string;
  content: string;
  spoilerWarning: boolean;
}

class ReviewService {
  private makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    options?: {
      data?: unknown;
      params?: Record<string, any>;
      headers?: Record<string, string>;
    }
  ): Promise<T> {
    return apiRequest<T>(method, endpoint, options);
  }

  async getReviewsForBook(
    bookId: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<GetBookReviewsResponse>> {
    return this.makeRequest("GET", `/reviews/book/${bookId}`, {
      params: { page, limit },
    });
  }

  async createReview(
    data: CreateReviewRequest
  ): Promise<ApiResponse<{ review: Review }>> {
    return this.makeRequest("POST", "/reviews/", {
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async deleteReview(id: string): Promise<void> {
    return apiRequest<void>("DELETE", `/reviews/${id}`);
  }
}

export const reviewService = new ReviewService();
