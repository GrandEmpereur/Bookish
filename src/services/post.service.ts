import { CapacitorHttp } from '@capacitor/core';
import { Post, PostFilters, PaginatedPosts } from '@/types/post';
import { CreatePostInput, UpdatePostInput } from '@/lib/validations/post';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class PostService {
    // Récupérer la liste des posts
    async getPosts(filters: PostFilters = {}): Promise<ApiResponse<PaginatedPosts>> {
        try {
            const queryParams = new URLSearchParams({
                page: (filters.page || 1).toString(),
                limit: (filters.limit || 20).toString(),
                ...(filters.sort && { sort: filters.sort }),
                ...(filters.order && { order: filters.order }),
                ...(filters.bookId && { bookId: filters.bookId })
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/posts?${queryParams.toString()}`,
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

    // Créer un post
    async createPost(data: CreatePostInput): Promise<ApiResponse<Post>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts`,
                headers: { 'Content-Type': 'application/json' },
                data,
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

    // Récupérer un post
    async getPost(id: string): Promise<ApiResponse<Post>> {
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

    // Supprimer un post
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

    // Mettre à jour un post
    async updatePost(id: string, data: UpdatePostInput): Promise<ApiResponse<Post>> {
        try {
            const response = await CapacitorHttp.put({
                url: `${API_URL}/posts/${id}`,
                headers: { 'Content-Type': 'application/json' },
                data,
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
}

export const postService = new PostService(); 