import { apiRequest } from "@/lib/api-client";
import { ToggleFavoriteResponse } from "@/types/postTypes";

class FavoriteService {
  async toggleFavorite(postId: string): Promise<ToggleFavoriteResponse> {
    return await apiRequest<ToggleFavoriteResponse>(
      "POST",
      "/posts/favorites",
      { data: { postId } }
    );
  }
}

export const favoriteService = new FavoriteService();
