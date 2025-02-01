import { CapacitorHttp } from '@capacitor/core';
import { ApiResponse } from "@/types/post";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FavoriteResponseAdd {
    favorite: {
        id: string;
        createdAt: string;
    };
    post: {
        id: string;
        title: string;
    };
}

interface FavoriteResponseRemove {
    postId: string;
}

class FavoriteService {
    async toggleFavorite(postId: string): Promise<ApiResponse<FavoriteResponseAdd | FavoriteResponseRemove>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts/favorites`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { postId },
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            return response.data;
        } catch (error: any) {
            console.error('Toggle favorite error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la modification des favoris');
        }
    }

    async checkFavoriteStatus(postId: string): Promise<ApiResponse<{ isFavorite: boolean }>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/posts/${postId}/favorite-status`,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la vérification du statut');
            }

            return response.data;
        } catch (error: any) {
            console.error('Check favorite status error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du statut');
        }
    }
}

export const favoriteService = new FavoriteService(); 