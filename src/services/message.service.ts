import { CapacitorHttp } from '@capacitor/core';
import {
    Conversation,
    Message,
    ConversationFilters,
    MessageFilters,
    PaginatedConversations,
    PaginatedMessages
} from '@/types/message';
import {
    CreateConversationInput,
    SendMessageInput
} from '@/lib/validations/message';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class MessageService {
    // Récupérer la liste des conversations
    async getConversations(filters: ConversationFilters = {}): Promise<ApiResponse<PaginatedConversations>> {
        try {
            const queryParams = new URLSearchParams({
                page: (filters.page || 1).toString(),
                limit: (filters.limit || 20).toString(),
                ...(filters.sort && { sort: filters.sort }),
                ...(filters.order && { order: filters.order })
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/messages/conversations?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des conversations');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get conversations error:', error);
            throw error;
        }
    }

    // Récupérer les messages d'une conversation
    async getMessages(
        conversationId: string,
        filters: MessageFilters = {}
    ): Promise<ApiResponse<PaginatedMessages>> {
        try {
            const queryParams = new URLSearchParams({
                page: (filters.page || 1).toString(),
                limit: (filters.limit || 50).toString()
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/messages/conversations/${conversationId}?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des messages');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get messages error:', error);
            throw error;
        }
    }

    // Créer une nouvelle conversation
    async createConversation(data: CreateConversationInput): Promise<ApiResponse<Conversation>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/messages/conversations`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création de la conversation');
            }

            return response.data;
        } catch (error: any) {
            console.error('Create conversation error:', error);
            throw error;
        }
    }

    // Envoyer un message
    async sendMessage(
        conversationId: string,
        data: SendMessageInput
    ): Promise<ApiResponse<Message>> {
        try {
            const formData = new FormData();
            formData.append('content', data.content);

            if (data.attachments?.length) {
                data.attachments.forEach((file, index) => {
                    formData.append(`attachments[${index}]`, file);
                });
            }

            const response = await CapacitorHttp.post({
                url: `${API_URL}/messages/conversations/${conversationId}/messages`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de l\'envoi du message');
            }

            return response.data;
        } catch (error: any) {
            console.error('Send message error:', error);
            throw error;
        }
    }

    // Marquer une conversation comme lue
    async markAsRead(conversationId: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/messages/conversations/${conversationId}/read`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du marquage de la conversation');
            }

            return response.data;
        } catch (error: any) {
            console.error('Mark conversation as read error:', error);
            throw error;
        }
    }

    // Archiver une conversation
    async archiveConversation(conversationId: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/messages/conversations/${conversationId}/archive`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de l\'archivage de la conversation');
            }

            return response.data;
        } catch (error: any) {
            console.error('Archive conversation error:', error);
            throw error;
        }
    }

    // Supprimer une conversation
    async deleteConversation(conversationId: string): Promise<void> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/messages/conversations/${conversationId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression de la conversation');
            }
        } catch (error: any) {
            console.error('Delete conversation error:', error);
            throw error;
        }
    }
}

export const messageService = new MessageService(); 