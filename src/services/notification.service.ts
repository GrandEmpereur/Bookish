import { apiRequest } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import {
  Notification,
  NotificationType,
  NotificationChannel,
  NotificationPreference,
  NotificationPreferences,
  GetNotificationsResponse,
  GetNotificationPreferencesResponse,
  UpdateNotificationPreferencesRequest,
  UpdateNotificationPreferencesResponse,
} from "@/types/notificationTypes";

class NotificationService {
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

  async getNotifications(options?: {
    unreadOnly?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<GetNotificationsResponse>> {
    const params: Record<string, string | number | boolean> = {};
    if (options?.unreadOnly) params.unread_only = true;
    if (options?.page) params.page = options.page;
    if (options?.limit) params.limit = options.limit;

    return this.makeRequest<ApiResponse<GetNotificationsResponse>>(
      "GET",
      "/notifications",
      { params }
    );
  }

  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    return this.makeRequest<ApiResponse<Notification>>(
      "PATCH",
      `/notifications/${notificationId}/read`
    );
  }

  async markAllAsRead(): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "POST",
      "/notifications/mark-all-read"
    );
  }

  async deleteNotification(notificationId: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "DELETE",
      `/notifications/${notificationId}`
    );
  }

  async getPreferences(): Promise<
    ApiResponse<GetNotificationPreferencesResponse>
  > {
    return this.makeRequest<ApiResponse<GetNotificationPreferencesResponse>>(
      "GET",
      "/notifications/preferences"
    );
  }

  async updatePreferences(
    data: UpdateNotificationPreferencesRequest
  ): Promise<ApiResponse<UpdateNotificationPreferencesResponse>> {
    return this.makeRequest<ApiResponse<UpdateNotificationPreferencesResponse>>(
      "PATCH",
      "/notifications/preferences",
      { data }
    );
  }

  async isEnabled(
    type: NotificationType,
    channel: NotificationChannel
  ): Promise<boolean> {
    const response = await this.makeRequest<{ enabled: boolean }>(
      "GET",
      `/notifications/enabled/${type}/${channel}`
    );
    return response.enabled;
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    data: Record<string, any>
  ): Promise<ApiResponse<Notification>> {
    return this.makeRequest<ApiResponse<Notification>>(
      "POST",
      "/notifications",
      {
        data: { user_id: userId, type, data },
      }
    );
  }
}

export const notificationService = new NotificationService();
