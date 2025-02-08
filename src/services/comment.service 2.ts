import { CapacitorHttp } from '@capacitor/core';
import {
    GetCommentsResponse,
    CreateCommentResponse,
    UpdateCommentResponse,
    ReplyCommentResponse
} from '@/types/postTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class CommentService {
    // GET /:postId/comments
    async getComments(postId: string): Promise<GetCommentsResponse> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/posts/${postId}/comments`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des commentaires');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get comments error:', error);
            throw error;
        }
    }

    // POST /:postId/comments
    async createComment(postId: string, data: { content: string }): Promise<CreateCommentResponse> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts/${postId}/comments`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création du commentaire');
            }

            return response.data;
        } catch (error: any) {
            console.error('Create comment error:', error);
            throw error;
        }
    }

    // POST /:postId/comments/:commentId/reply
    async replyToComment(postId: string, commentId: string, data: { content: string }): Promise<ReplyCommentResponse> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/posts/${postId}/comments/${commentId}/reply`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de l\'ajout de la réponse');
            }

            return response.data;
        } catch (error: any) {
            console.error('Reply to comment error:', error);
            throw error;
        }
    }

    // PUT /comments/:id
    async updateComment(commentId: string, data: { content: string }): Promise<UpdateCommentResponse> {
        try {
            const response = await CapacitorHttp.put({
                url: `${API_URL}/comments/${commentId}`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour du commentaire');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update comment error:', error);
            throw error;
        }
    }

    // DELETE /comments/:id
    async deleteComment(commentId: string): Promise<{ status: string; message: string; data: { post: { id: string; commentsCount: number } } }> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/comments/${commentId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du commentaire');
            }

            return response.data;
        } catch (error: any) {
            console.error('Delete comment error:', error);
            throw error;
        }
    }
}

export const commentService = new CommentService(); 