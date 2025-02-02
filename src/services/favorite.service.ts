import { CapacitorHttp } from '@capacitor/core';
import {
    Favorite,
    FavoriteStatus,
    FavoriteFilters,
    PaginatedFavorites
} from '@/types/favorite';
import { ToggleFavoriteInput } from '@/lib/validations/favorite';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class FavoriteService {
    // Récupérer la liste des favoris
    async getFavorites(filters: FavoriteFilters = {}): Promise<ApiResponse<PaginatedFavorites>> {
        try {
            const queryParams = new URLSearchParams({
                page: (filters.page || 1).toString(),
                limit: (filters.limit || 20).toString(),
                ...(filters.sort && { sort: filters.sort }),
                ...(filters.order && { order: filters.order })
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/posts/favorites?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des favoris');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get favorites error:', error);
            throw error;
        }
    }

    // Ajouter/Retirer des favoris
    async toggleFavorite(data: ToggleFavoriteInput): Promise<ApiResponse<FavoriteStatus>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts/favorites`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la modification des favoris');
            }

            return response.data;
        } catch (error: any) {
            console.error('Toggle favorite error:', error);
            throw error;
        }
    }

    // Vérifier le statut favori d'un post
    async getFavoriteStatus(postId: string): Promise<ApiResponse<FavoriteStatus>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/posts/${postId}/favorite-status`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la vérification du statut favori');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get favorite status error:', error);
            throw error;
        }
    }
}

export const favoriteService = new FavoriteService(); 