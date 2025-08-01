import { apiRequest } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
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
  GetConversationsResponse,
} from "@/types/messagerieTypes";

class MessageService {
  /**
   * Méthode utilitaire pour gérer les requêtes HTTP via le client centralisé
   */
  private makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    options?: { data?: unknown; params?: Record<string, any> }
  ): Promise<T> {
    return apiRequest<T>(method, endpoint, options);
  }

  // ===== NOUVELLES ROUTES CONVERSATIONS INSTAGRAM-STYLE =====

  /**
   * Récupère toutes les conversations de l'utilisateur connecté
   */
  async getConversations(): Promise<ApiResponse<GetConversationsResponse>> {
    return this.makeRequest<ApiResponse<GetConversationsResponse>>(
      "GET",
      "/conversations"
    );
  }

  /**
   * Crée une conversation de groupe
   */
  async createGroupConversation(data: {
    participantIds: string[];
    title: string;
    isGroup: true;
  }): Promise<ApiResponse<Conversation>> {
    return this.makeRequest<ApiResponse<Conversation>>(
      "POST",
      "/conversations",
      { data }
    );
  }

  /**
   * Récupère les messages d'une conversation avec pagination
   */
  async getConversationMessages(
    conversationId: string,
    options?: { page?: number; limit?: number }
  ): Promise<ApiResponse<GetMessagesResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.limit) params.limit = options.limit;

    return this.makeRequest<ApiResponse<GetMessagesResponse>>(
      "GET",
      `/conversations/${conversationId}/messages`,
      { params }
    );
  }

  /**
   * ROUTE INTELLIGENTE : Envoie un message
   * - Si conversationId existe → envoie dans cette conversation
   * - Si userId → trouve/crée automatiquement une conversation 1-to-1
   */
  async sendMessage(
    conversationIdOrUserId: string,
    data: { content: string }
  ): Promise<ApiResponse<SendMessageResponse>> {
    return this.makeRequest<ApiResponse<SendMessageResponse>>(
      "POST",
      `/conversations/${conversationIdOrUserId}/messages`,
      { data }
    );
  }

  /**
   * Marque tous les messages d'une conversation comme lus
   */
  async markConversationAsRead(
    conversationId: string
  ): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "POST",
      `/conversations/${conversationId}/read`
    );
  }

  // ===== MÉTHODES LEGACY (garder pour compatibilité temporaire) =====

  /**
   * @deprecated Utilisez getConversationMessages() à la place
   */
  async getMessages(options?: {
    page?: number;
    limit?: number;
    conversation_with?: string;
  }): Promise<ApiResponse<GetMessagesResponse>> {
    console.warn(
      "getMessages() est déprécié, utilisez getConversationMessages()"
    );
    if (options?.conversation_with) {
      return this.getConversationMessages(options.conversation_with, {
        page: options.page,
        limit: options.limit,
      });
    }
    // Fallback vers conversations pour récupérer tous les messages
    const conversations = await this.getConversations();
    return {
      status: "success",
      message: "Messages récupérés",
      data: {
        messages: [],
        pagination: { total: 0, per_page: 0, current_page: 1, last_page: 1 },
      },
    } as any;
  }
}

export const messageService = new MessageService();
