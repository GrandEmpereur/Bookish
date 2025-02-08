import { CapacitorHttp } from '@capacitor/core';
import { ApiResponse } from '@/types/api';
import {
    Post,
    PostSubject,
    CreatePostRequest,
    UpdatePostRequest,
    GetPostResponse,
    GetPostsResponse,
    CreatePostResponse,
    UpdatePostResponse,
    ToggleLikeResponse,
    ToggleFavoriteResponse
} from '@/types/postTypes';
import { CreatePostFormData } from '@/validations/post';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class PostService {
    async getPosts(): Promise<GetPostsResponse> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/posts`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des posts');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get posts error:', error);
            throw error;
        }
    }

    async getPost(id: string): Promise<GetPostResponse> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/posts/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération du post');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get post error:', error);
            throw error;
        }
    }

    async createPost(data: CreatePostFormData): Promise<GetPostResponse> {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('subject', data.subject);
            formData.append('content', data.content);

            if (data.media && data.media.length > 0) {
                data.media.forEach(file => {
                    formData.append('media', file);
                });
            }

            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts`,
                data: formData,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création du post');
            }

            return response.data;
        } catch (error: any) {
            console.error('Create post error:', error);
            throw error;
        }
    }

    async updatePost(id: string, data: UpdatePostRequest): Promise<ApiResponse<UpdatePostResponse>> {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'media' && Array.isArray(value)) {
                    value.forEach((file, index) => {
                        formData.append(`media[${index}]`, file);
                    });
                } else if (value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            const response = await CapacitorHttp.patch({
                url: `${API_URL}/posts/${id}`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour du post');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update post error:', error);
            throw error;
        }
    }

    async deletePost(id: string): Promise<void> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/posts/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du post');
            }
        } catch (error: any) {
            console.error('Delete post error:', error);
            throw error;
        }
    }

    async toggleLike(id: string): Promise<ApiResponse<ToggleLikeResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts/${id}/like`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du like/unlike');
            }

            return response.data;
        } catch (error: any) {
            console.error('Toggle like error:', error);
            throw error;
        }
    }

    async toggleFavorite(id: string): Promise<ApiResponse<ToggleFavoriteResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts/${id}/favorite`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de l\'ajout/retrait des favoris');
            }

            return response.data;
        } catch (error: any) {
            console.error('Toggle favorite error:', error);
            throw error;
        }
    }

    async reportPost(id: string, reason: string): Promise<ApiResponse<null>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts/${id}/report`,
                headers: { 'Content-Type': 'application/json' },
                data: { reason },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du signalement');
            }

            return response.data;
        } catch (error: any) {
            console.error('Report post error:', error);
            throw error;
        }
    }
}

export const postService = new PostService(); 