import { ApiResponse } from './api';
import type { UserProfile } from './userTypes';

// Type principal pour les messages
export interface Message {
    id: string;
    content: string;
    sender: UserProfile;
    recipient: UserProfile;
    is_read: boolean;
    created_at: string;
}

// Types pour les requêtes
export interface SendMessageRequest {
    content: string;
    recipient_id: string;
}

export interface UpdateMessageRequest {
    is_read: boolean;
}

// Types pour les réponses
export interface GetMessagesResponse {
    messages: Message[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

export interface GetMessageResponse {
    message: Message;
}

export interface SendMessageResponse {
    message: Message;
}

export interface UpdateMessageResponse {
    message: Message;
}

// Types pour les statistiques de messagerie
export interface MessageStats {
    total_messages: number;
    unread_messages: number;
    sent_messages: number;
    received_messages: number;
}

// Types pour les conversations
export interface Conversation {
    id: string;
    participants: UserProfile[];
    last_message: Message;
    unread_count: number;
    updated_at: string;
}

export interface GetConversationsResponse {
    conversations: Conversation[];
    stats: MessageStats;
}

// Interface pour le service de messagerie
export interface MessagerieService {
    getMessages(options: {
        page?: number;
        limit?: number;
        conversation_with?: string;
    }): Promise<ApiResponse<GetMessagesResponse>>;

    getMessage(messageId: string): Promise<ApiResponse<GetMessageResponse>>;

    sendMessage(data: SendMessageRequest): Promise<ApiResponse<SendMessageResponse>>;

    updateMessage(
        messageId: string,
        data: UpdateMessageRequest
    ): Promise<ApiResponse<UpdateMessageResponse>>;

    deleteMessage(messageId: string): Promise<ApiResponse<null>>;

    getConversations(): Promise<ApiResponse<GetConversationsResponse>>;

    markConversationAsRead(userId: string): Promise<ApiResponse<null>>;

    getMessageStats(): Promise<ApiResponse<MessageStats>>;
} 