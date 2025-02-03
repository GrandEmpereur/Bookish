import { CapacitorHttp } from '@capacitor/core';
import { Post, CreatePostResponse, DeletePostResponse } from '@/types/post';
import { CreatePostInput, UpdatePostInput } from '@/lib/validations/post';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class PostService {
    // Récupérer la liste des posts
    async getPosts(): Promise<ApiResponse<Post[]>> {
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

    // Créer un post
    async createPost(data: CreatePostInput): Promise<ApiResponse<CreatePostResponse>> {
        try {
            // Création du FormData pour l'upload multipart
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('subject', data.subject);
            formData.append('content', data.content);

            // Ajout des fichiers médias s'il y en a
            if (data.media && data.media.length > 0) {
                data.media.forEach((file, index) => {
                    formData.append('media', file);
                });
            }

            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts`,
                headers: {
                    // Ne pas définir Content-Type, il sera automatiquement défini avec la boundary
                },
                data: formData,
                webFetchExtra: {
                    credentials: 'include',
                }
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
    async deletePost(id: string): Promise<ApiResponse<DeletePostResponse>> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/posts/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du post');
            }

            return response.data;
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