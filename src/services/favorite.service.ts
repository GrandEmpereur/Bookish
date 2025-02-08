import { CapacitorHttp } from '@capacitor/core';
import { ToggleFavoriteResponse } from '@/types/postTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class FavoriteService {
    async toggleFavorite(postId: string): Promise<ToggleFavoriteResponse> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts/favorites`,
                headers: { 'Content-Type': 'application/json' },
                data: { postId },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour du favori');
            }

            return response.data;
        } catch (error: any) {
            console.error('Toggle favorite error:', error);
            throw error;
        }
    }
}

export const favoriteService = new FavoriteService(); 