import { CapacitorHttp } from '@capacitor/core';
import { FavoriteResponse, UnFavoriteResponse } from '@/types/favorite';
import { ToggleFavoriteInput } from '@/lib/validations/favorite';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class FavoriteService {
    // Ajouter/Retirer des favoris
    async toggleFavorite(data: ToggleFavoriteInput): Promise<ApiResponse<FavoriteResponse | UnFavoriteResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts/favorites`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            // si c'est une 201 c'est que le post a été ajouté aux favoris si c'est une 200 c'est que le post a été retiré des favoris
            if (response.status !== 201 && response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la modification des favoris');
            }

            // Mise à jour du compteur de favoris selon la réponse
            if (response.status === 201) {
                // Post ajouté aux favoris
                const favoriteResponse = response.data as ApiResponse<FavoriteResponse>;
                return favoriteResponse;
            } else {
                // Post retiré des favoris
                const unFavoriteResponse = response.data as ApiResponse<UnFavoriteResponse>;
                return unFavoriteResponse;
            }
        } catch (error: any) {
            console.error('Toggle favorite error:', error);
            throw error;
        }
    }
}

export const favoriteService = new FavoriteService(); 