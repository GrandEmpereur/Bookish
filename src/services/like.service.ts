import { CapacitorHttp } from '@capacitor/core';
import { LikeCommentResponse, LikePostResponse, UnLikePostResponse } from '@/types/like';
import { LikePostInput, LikeCommentInput } from '@/lib/validations/like';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class LikeService {
    // Like/Unlike un post
    async togglePostLike(data: LikePostInput): Promise<ApiResponse<LikePostResponse | UnLikePostResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/like/post`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            // 201 = Like créé, 200 = Like supprimé
            if (response.status !== 201 && response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du like du post');
            }

            // Mise à jour du compteur de likes selon la réponse
            if (response.status === 201) {
                // Like créé
                const likeResponse = response.data as ApiResponse<LikePostResponse>;
                return likeResponse;
            } else {
                // Like supprimé
                const unlikeResponse = response.data as ApiResponse<UnLikePostResponse>;
                return unlikeResponse;
            }

        } catch (error: any) {
            console.error('Toggle post like error:', error);
            throw error;
        }
    }

    // Like/Unlike un commentaire
    async toggleCommentLike(data: LikeCommentInput): Promise<ApiResponse<LikeCommentResponse>> {
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
}

export const likeService = new LikeService(); 