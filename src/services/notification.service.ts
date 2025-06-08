import { apiRequest } from '@/lib/api-client';
import { ApiResponse } from '@/types/api';
import {
    Notification,
    NotificationType,
    NotificationChannel,
    NotificationPreference,
    NotificationPreferences,
    GetNotificationsResponse,
    GetNotificationPreferencesResponse,
    UpdateNotificationPreferencesRequest,
    UpdateNotificationPreferencesResponse
} from '@/types/notificationTypes';

class NotificationService {
    async getNotifications(options?: {
        unreadOnly?: boolean;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<GetNotificationsResponse>> {
        const params: Record<string, string | number | boolean> = {};
        if (options?.unreadOnly) params.unread_only = true;
        if (options?.page) params.page = options.page;
        if (options?.limit) params.limit = options.limit;

        return await apiRequest<ApiResponse<GetNotificationsResponse>>('GET', '/notifications', { params });
    }

    async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
        return await apiRequest<ApiResponse<Notification>>('PATCH', `/notifications/${notificationId}/read`);
    }

    async markAllAsRead(): Promise<ApiResponse<null>> {
        return await apiRequest<ApiResponse<null>>('POST', '/notifications/mark-all-read');
    }

    async deleteNotification(notificationId: string): Promise<ApiResponse<null>> {
        return await apiRequest<ApiResponse<null>>('DELETE', `/notifications/${notificationId}`);
    }

    async getPreferences(): Promise<ApiResponse<GetNotificationPreferencesResponse>> {
        return await apiRequest<ApiResponse<GetNotificationPreferencesResponse>>('GET', '/notifications/preferences');
    }

    async updatePreferences(data: UpdateNotificationPreferencesRequest): Promise<ApiResponse<UpdateNotificationPreferencesResponse>> {
        return await apiRequest<ApiResponse<UpdateNotificationPreferencesResponse>>('PATCH', '/notifications/preferences', { data });
    }

    async isEnabled(type: NotificationType, channel: NotificationChannel): Promise<boolean> {
        const response = await apiRequest<{ enabled: boolean }>('GET', `/notifications/enabled/${type}/${channel}`);
        return response.enabled;
    }

    async createNotification(userId: string, type: NotificationType, data: Record<string, any>): Promise<ApiResponse<Notification>> {
        return await apiRequest<ApiResponse<Notification>>('POST', '/notifications', {
            data: { user_id: userId, type, data }
        });
    }
}

export const notificationService = new NotificationService(); 