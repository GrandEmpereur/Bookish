import { CapacitorHttp } from '@capacitor/core';
import { ApiResponse } from "@/types/comment";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LikeResponse {
    likesCount: number;
    isLiked: boolean;
}

class CommentLikeService {
    async toggleLike(commentId: string): Promise<ApiResponse<LikeResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/like/comment`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    commentId
                },
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du like');
            }

            return response.data;
        } catch (error: any) {
            console.error('Toggle comment like error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors du like');
        }
    }
}

export const commentLikeService = new CommentLikeService(); 