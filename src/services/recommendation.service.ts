import { apiRequest } from "@/lib/api-client";
import { Book } from "@/types/bookTypes";

export interface RecommendedBook extends Book {
    score: number;
}

export interface RecommendationFeedback {
    bookId: string;
    liked: boolean;
    reason?: string;
}

class RecommendationService {
    private makeRequest<T>(
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        endpoint: string,
        options?: { data?: unknown; params?: Record<string, any> }
    ): Promise<T> {
        return apiRequest<T>(method, endpoint, options);
    }

    async getBookRecommendations(limit = 10): Promise<{ data: RecommendedBook[] }> {
        return this.makeRequest<{ data: RecommendedBook[] }>(
            "GET",
            "/recommendations/books",
            { params: { limit } }
        );
    }

    async sendFeedback(feedback: RecommendationFeedback): Promise<{ message: string }> {
        return this.makeRequest<{ message: string }>(
            "POST",
            "/recommendations/feedback",
            { data: feedback }
        );
    }
}

export const recommendationService = new RecommendationService(); 