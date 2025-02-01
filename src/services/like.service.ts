import { CapacitorHttp } from '@capacitor/core';
import { ApiResponse } from "@/types/post";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LikeResponseUnlike {
    likesCount: number;
    postId: string;
    user: {
        id: string;
        username: string;
    };
}

interface LikeResponseLike {
    like: {
        id: string;
        createdAt: string;
    };
    post: {
        id: string;
        likesCount: number;
        title: string;
    };
    user: {
        id: string;
        username: string;
    };
}

class LikeService {
    async togglePostLike(postId: string): Promise<ApiResponse<LikeResponseLike | LikeResponseUnlike>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/like/post`,
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
            console.error('Toggle like error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors du like');
        }
    }
}

export const likeService = new LikeService(); 