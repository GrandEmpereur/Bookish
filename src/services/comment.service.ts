import { CapacitorHttp } from '@capacitor/core';
import {
    Comment,
    CreateCommentData,
    CommentFilters,
    PaginatedComments,
    ApiResponse
} from "@/types/comment";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class CommentService {
    /**
     * Récupère les commentaires d'un post
     */
    async getComments(
        postId: string,
        filters: CommentFilters = {}
    ): Promise<ApiResponse<PaginatedComments>> {
        try {
            const queryParams = new URLSearchParams({
                page: (filters.page || 1).toString(),
                limit: (filters.limit || 20).toString(),
                ...(filters.sort && { sort: filters.sort }),
                ...(filters.order && { order: filters.order })
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/posts/${postId}/comments?${queryParams.toString()}`,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des commentaires');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get comments error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des commentaires');
        }
    }

    /**
     * Crée un nouveau commentaire
     */
    async createComment(postId: string, data: CreateCommentData): Promise<ApiResponse<Comment>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts/${postId}/comments`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création du commentaire');
            }

            return response.data;
        } catch (error: any) {
            console.error('Create comment error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la création du commentaire');
        }
    }

    /**
     * Répond à un commentaire
     */
    async replyToComment(postId: string, commentId: string, data: CreateCommentData): Promise<ApiResponse<Comment>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts/${postId}/comments/${commentId}/reply`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création de la réponse');
            }

            return response.data;
        } catch (error: any) {
            console.error('Reply to comment error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la création de la réponse');
        }
    }

    /**
     * Modifie un commentaire
     */
    async updateComment(commentId: string, data: CreateCommentData): Promise<ApiResponse<Comment>> {
        try {
            const response = await CapacitorHttp.put({
                url: `${API_URL}/posts/comments/${commentId}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la modification du commentaire');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update comment error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la modification du commentaire');
        }
    }

    /**
     * Supprime un commentaire
     */
    async deleteComment(commentId: string): Promise<void> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/posts/comments/${commentId}`,
                webFetchExtra: {
                    credentials: 'include'
                }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du commentaire');
            }
        } catch (error: any) {
            console.error('Delete comment error:', error);
            throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du commentaire');
        }
    }
}

export const commentService = new CommentService(); 