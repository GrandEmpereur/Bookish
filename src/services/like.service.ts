import { CapacitorHttp } from '@capacitor/core';
import { LikeStats, LikeResponse, LikeableType } from '@/types/like';
import { LikePostInput, LikeCommentInput } from '@/lib/validations/like';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class LikeService {
    // Like/Unlike un post
    async togglePostLike(data: LikePostInput): Promise<ApiResponse<LikeResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/like/post`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du like du post');
            }

            return response.data;
        } catch (error: any) {
            console.error('Toggle post like error:', error);
            throw error;
        }
    }

    // Like/Unlike un commentaire
    async toggleCommentLike(data: LikeCommentInput): Promise<ApiResponse<LikeResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/like/comment`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du like du commentaire');
            }

            return response.data;
        } catch (error: any) {
            console.error('Toggle comment like error:', error);
            throw error;
        }
    }

    // Récupérer les statistiques de likes
    async getLikeStats(type: LikeableType, id: string): Promise<ApiResponse<LikeStats>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/like/stats/${type}/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des statistiques');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get like stats error:', error);
            throw error;
        }
    }
}

export const likeService = new LikeService(); 