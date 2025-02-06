import { CapacitorHttp } from '@capacitor/core';
import { ApiResponse } from '@/types/api';
import {
    Message,
    SendMessageRequest,
    UpdateMessageRequest,
    GetMessagesResponse,
    GetMessageResponse,
    SendMessageResponse,
    UpdateMessageResponse,
    MessageStats,
    Conversation,
    GetConversationsResponse
} from '@/types/messagerieTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class MessageService {
    async getMessages(options: {
        page?: number;
        limit?: number;
        conversation_with?: string;
    }): Promise<ApiResponse<GetMessagesResponse>> {
        try {
            const queryParams = new URLSearchParams();
            if (options?.page) queryParams.append('page', options.page.toString());
            if (options?.limit) queryParams.append('limit', options.limit.toString());
            if (options?.conversation_with) queryParams.append('with', options.conversation_with);

            const response = await CapacitorHttp.get({
                url: `${API_URL}/messages?${queryParams.toString()}`,
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

    async getMessage(messageId: string): Promise<ApiResponse<GetMessageResponse>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/messages/${messageId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération du message');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get message error:', error);
            throw error;
        }
    }

    async sendMessage(data: SendMessageRequest): Promise<ApiResponse<SendMessageResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/messages`,
                headers: { 'Content-Type': 'application/json' },
                data,
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

    async updateMessage(messageId: string, data: UpdateMessageRequest): Promise<ApiResponse<UpdateMessageResponse>> {
        try {
            const response = await CapacitorHttp.patch({
                url: `${API_URL}/messages/${messageId}`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour du message');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update message error:', error);
            throw error;
        }
    }

    async deleteMessage(messageId: string): Promise<ApiResponse<null>> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/messages/${messageId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du message');
            }

            return response.data;
        } catch (error: any) {
            console.error('Delete message error:', error);
            throw error;
        }
    }

    async getConversations(): Promise<ApiResponse<GetConversationsResponse>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/messages/conversations`,
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

    async markConversationAsRead(userId: string): Promise<ApiResponse<null>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/messages/read/${userId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du marquage comme lu');
            }

            return response.data;
        } catch (error: any) {
            console.error('Mark conversation as read error:', error);
            throw error;
        }
    }

    async getMessageStats(): Promise<ApiResponse<MessageStats>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/messages/stats`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des statistiques');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get message stats error:', error);
            throw error;
        }
    }
}

export const messageService = new MessageService(); 