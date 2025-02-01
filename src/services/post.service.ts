import { CapacitorHttp } from '@capacitor/core';
import {
    Post,
    PostFilters,
    CreatePostData,
    PaginatedPosts,
    ApiResponse
} from "@/types/post";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Media {
    id: string;
    type: string;
    url: string;
    width: number;
    height: number;
}

interface User {
    id: string;
    email: string;
    username: string;
    isVerified: boolean;
}

class PostService {
    /**
     * Récupère la liste des posts
     */
    async getPosts(): Promise<ApiResponse<Post[]>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/posts?include=likes,favorites`,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des posts');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get posts error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des posts');
        }
    }

    /**
     * Crée un nouveau post
     */
    async createPost(data: CreatePostData): Promise<Post> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création du post');
            }

            return response.data;
        } catch (error: any) {
            console.error('Create post error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la création du post');
        }
    }

    /**
     * Récupère les détails d'un post spécifique
     */
    async getPost(id: string): Promise<ApiResponse<Post>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/posts/${id}`,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Post non trouvé');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get post error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du post');
        }
    }

    /**
     * Supprime un post
     */
    async deletePost(id: string): Promise<void> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/posts/${id}`,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du post');
            }
        } catch (error: any) {
            console.error('Delete post error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du post');
        }
    }

    /**
     * Met à jour un post existant
     */
    async updatePost(id: string, data: Partial<CreatePostData>): Promise<Post> {
        try {
            const response = await CapacitorHttp.put({
                url: `${API_URL}/posts/${id}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour du post');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update post error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du post');
        }
    }
}

export const postService = new PostService(); 