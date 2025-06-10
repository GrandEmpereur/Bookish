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
  async getMessages(options: {
    page?: number;
    limit?: number;
    conversation_with?: string;
  }): Promise<ApiResponse<GetMessagesResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.limit) params.limit = options.limit;
    if (options?.conversation_with) params.with = options.conversation_with;

    return await apiRequest<ApiResponse<GetMessagesResponse>>(
      "GET",
      "/messages",
      { params }
    );
  }

  async getMessage(
    messageId: string
  ): Promise<ApiResponse<GetMessageResponse>> {
    return await apiRequest<ApiResponse<GetMessageResponse>>(
      "GET",
      `/messages/${messageId}`
    );
  }

  async sendMessage(
    data: SendMessageRequest
  ): Promise<ApiResponse<SendMessageResponse>> {
    return await apiRequest<ApiResponse<SendMessageResponse>>(
      "POST",
      "/messages",
      { data }
    );
  }

  async updateMessage(
    messageId: string,
    data: UpdateMessageRequest
  ): Promise<ApiResponse<UpdateMessageResponse>> {
    return await apiRequest<ApiResponse<UpdateMessageResponse>>(
      "PATCH",
      `/messages/${messageId}`,
      { data }
    );
  }

  async deleteMessage(messageId: string): Promise<ApiResponse<null>> {
    return await apiRequest<ApiResponse<null>>(
      "DELETE",
      `/messages/${messageId}`
    );
  }

  async getConversations(): Promise<ApiResponse<GetConversationsResponse>> {
    return await apiRequest<ApiResponse<GetConversationsResponse>>(
      "GET",
      "/messages/conversations"
    );
  }

  async markConversationAsRead(userId: string): Promise<ApiResponse<null>> {
    return await apiRequest<ApiResponse<null>>(
      "POST",
      `/messages/read/${userId}`
    );
  }

  async getMessageStats(): Promise<ApiResponse<MessageStats>> {
    return await apiRequest<ApiResponse<MessageStats>>(
      "GET",
      "/messages/stats"
    );
  }
}

export const messageService = new MessageService();
