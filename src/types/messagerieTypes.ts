import { ApiResponse } from "./api";
import type { UserProfile } from "./userTypes";

// Type principal pour les messages
export interface Message {
  id: string;
  content: string;
  sender: UserProfile;
  recipient: UserProfile;
  is_read: boolean;
  created_at: string;
}

// Types pour les requêtes (nouvelles API conversations)
export interface SendMessageRequest {
  content: string;
}

export interface CreateGroupConversationRequest {
  participantIds: string[];
  title: string;
  isGroup: true;
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

// Types pour les conversations (structure backend Instagram-style)
export interface Conversation {
  id: string;
  title?: string; // pour les groupes
  isGroup: boolean;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  id: string;
  username: string;
  profilePictureUrl?: string;
  // Autres champs utilisateur essentiels
}

export interface GetConversationsResponse {
  conversations: Conversation[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

// Interface pour le service de messagerie (nouvelle API)
export interface MessagerieService {
  // Conversations
  getConversations(): Promise<ApiResponse<GetConversationsResponse>>;
  createGroupConversation(data: CreateGroupConversationRequest): Promise<ApiResponse<Conversation>>;

  // Messages
  getConversationMessages(
    conversationId: string,
    options?: { page?: number; limit?: number }
  ): Promise<ApiResponse<GetMessagesResponse>>;

  // Route intelligente (conversationId OU userId)
  sendMessage(
    conversationIdOrUserId: string,
    data: SendMessageRequest
  ): Promise<ApiResponse<SendMessageResponse>>;

  // Actions
  markConversationAsRead(conversationId: string): Promise<ApiResponse<null>>;

  // Legacy (rétrocompatibilité)
  getMessages(options?: {
    page?: number;
    limit?: number;
    conversation_with?: string;
  }): Promise<ApiResponse<GetMessagesResponse>>;
}
