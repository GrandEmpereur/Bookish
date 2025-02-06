import { CapacitorHttp } from '@capacitor/core';
import { ApiResponse } from '@/types/api';
import { ToggleLikeResponse } from '@/types/postTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class LikeService {
    async getLikedPosts(options?: {
        page?: number;
        limit?: number;
        sort?: 'latest' | 'oldest';
    }): Promise<ApiResponse<{
        likes: Array<{
            id: string;
            post_id: string;
            created_at: string;
            post: {
                id: string;
                title: string;
                content: string;
                user: {
                    id: string;
                    username: string;
                    avatarUrl: string | null;
                };
            };
        }>;
        meta: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
    }>> {
        try {
            const queryParams = new URLSearchParams();
            if (options?.page) queryParams.append('page', options.page.toString());
            if (options?.limit) queryParams.append('limit', options.limit.toString());
            if (options?.sort) queryParams.append('sort', options.sort);

            const response = await CapacitorHttp.get({
                url: `${API_URL}/likes?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des likes');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get liked posts error:', error);
            throw error;
        }
    }

    async togglePostLike(postId: string): Promise<ToggleLikeResponse> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/like/post`,
                headers: { 'Content-Type': 'application/json' },
                data: { postId },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du like/unlike du post');
            }

            return response.data;
        } catch (error: any) {
            console.error('Toggle post like error:', error);
            throw error;
        }
    }

    async toggleCommentLike(commentId: string): Promise<ToggleLikeResponse> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/like/comment`,
                headers: { 'Content-Type': 'application/json' },
                data: { commentId },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du like/unlike');
            }

            return response.data;
        } catch (error: any) {
            console.error('Toggle comment like error:', error);
            throw error;
        }
    }

    async checkIsLiked(type: 'post' | 'comment', id: string): Promise<ApiResponse<{ is_liked: boolean }>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/${type}s/${id}/like/check`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || `Erreur lors de la vérification du like sur le ${type}`);
            }

            return response.data;
        } catch (error: any) {
            console.error('Check like error:', error);
            throw error;
        }
    }

    async getLikesByType(type: 'posts' | 'comments', options?: {
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<{
        likes: Array<{
            id: string;
            type_id: string;
            created_at: string;
        }>;
        meta: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
    }>> {
        try {
            const queryParams = new URLSearchParams();
            if (options?.page) queryParams.append('page', options.page.toString());
            if (options?.limit) queryParams.append('limit', options.limit.toString());

            const response = await CapacitorHttp.get({
                url: `${API_URL}/likes/type/${type}?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || `Erreur lors de la récupération des likes de type ${type}`);
            }

            return response.data;
        } catch (error: any) {
            console.error('Get likes by type error:', error);
            throw error;
        }
    }
}

export const likeService = new LikeService(); 