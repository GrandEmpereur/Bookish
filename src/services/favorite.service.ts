import { apiRequest } from "@/lib/api-client";
import { ToggleFavoriteResponse } from "@/types/postTypes";

class FavoriteService {
  /**
   * Méthode utilitaire pour gérer les requêtes HTTP via le client centralisé
   */
  private makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    options?: { data?: unknown; params?: Record<string, any> }
  ): Promise<T> {
    return apiRequest<T>(method, endpoint, options);
  }

  async toggleFavorite(postId: string): Promise<ToggleFavoriteResponse> {
    return this.makeRequest<ToggleFavoriteResponse>(
      "POST",
      "/posts/favorites",
      { data: { postId } }
    );
  }
}

export const favoriteService = new FavoriteService();
