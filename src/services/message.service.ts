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

  async getMessages(options: {
    page?: number;
    limit?: number;
    conversation_with?: string;
  }): Promise<ApiResponse<GetMessagesResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.limit) params.limit = options.limit;
    if (options?.conversation_with) params.with = options.conversation_with;

    return this.makeRequest<ApiResponse<GetMessagesResponse>>(
      "GET",
      "/messages",
      { params }
    );
  }

  async getMessage(
    messageId: string
  ): Promise<ApiResponse<GetMessageResponse>> {
    return this.makeRequest<ApiResponse<GetMessageResponse>>(
      "GET",
      `/messages/${messageId}`
    );
  }

  async sendMessage(
    data: SendMessageRequest
  ): Promise<ApiResponse<SendMessageResponse>> {
    return this.makeRequest<ApiResponse<SendMessageResponse>>(
      "POST",
      "/messages",
      { data }
    );
  }

  async updateMessage(
    messageId: string,
    data: UpdateMessageRequest
  ): Promise<ApiResponse<UpdateMessageResponse>> {
    return this.makeRequest<ApiResponse<UpdateMessageResponse>>(
      "PATCH",
      `/messages/${messageId}`,
      { data }
    );
  }

  async deleteMessage(messageId: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "DELETE",
      `/messages/${messageId}`
    );
  }

  async getConversations(): Promise<ApiResponse<GetConversationsResponse>> {
    return this.makeRequest<ApiResponse<GetConversationsResponse>>(
      "GET",
      "/messages/conversations"
    );
  }

  async markConversationAsRead(userId: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "POST",
      `/messages/read/${userId}`
    );
  }

  async getMessageStats(): Promise<ApiResponse<MessageStats>> {
    return this.makeRequest<ApiResponse<MessageStats>>(
      "GET",
      "/messages/stats"
    );
  }
}

export const messageService = new MessageService();
