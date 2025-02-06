import { CapacitorHttp } from '@capacitor/core';
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class NotificationService {
    async getNotifications(options?: {
        unreadOnly?: boolean;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<GetNotificationsResponse>> {
        try {
            const queryParams = new URLSearchParams();
            if (options?.unreadOnly) queryParams.append('unread_only', 'true');
            if (options?.page) queryParams.append('page', options.page.toString());
            if (options?.limit) queryParams.append('limit', options.limit.toString());

            const response = await CapacitorHttp.get({
                url: `${API_URL}/notifications?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des notifications');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get notifications error:', error);
            throw error;
        }
    }

    async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
        try {
            const response = await CapacitorHttp.patch({
                url: `${API_URL}/notifications/${notificationId}/read`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du marquage de la notification');
            }

            return response.data;
        } catch (error: any) {
            console.error('Mark notification as read error:', error);
            throw error;
        }
    }

    async markAllAsRead(): Promise<ApiResponse<null>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/notifications/mark-all-read`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du marquage des notifications');
            }

            return response.data;
        } catch (error: any) {
            console.error('Mark all notifications as read error:', error);
            throw error;
        }
    }

    async deleteNotification(notificationId: string): Promise<ApiResponse<null>> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/notifications/${notificationId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression de la notification');
            }

            return response.data;
        } catch (error: any) {
            console.error('Delete notification error:', error);
            throw error;
        }
    }

    async getPreferences(): Promise<ApiResponse<GetNotificationPreferencesResponse>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/notifications/preferences`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des préférences');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get notification preferences error:', error);
            throw error;
        }
    }

    async updatePreferences(data: UpdateNotificationPreferencesRequest): Promise<ApiResponse<UpdateNotificationPreferencesResponse>> {
        try {
            const response = await CapacitorHttp.patch({
                url: `${API_URL}/notifications/preferences`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour des préférences');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update notification preferences error:', error);
            throw error;
        }
    }

    async isEnabled(type: NotificationType, channel: NotificationChannel): Promise<boolean> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/notifications/enabled/${type}/${channel}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la vérification des préférences');
            }

            return response.data.enabled;
        } catch (error: any) {
            console.error('Check notification enabled error:', error);
            throw error;
        }
    }

    async createNotification(userId: string, type: NotificationType, data: Record<string, any>): Promise<ApiResponse<Notification>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/notifications`,
                headers: { 'Content-Type': 'application/json' },
                data: { user_id: userId, type, data },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création de la notification');
            }

            return response.data;
        } catch (error: any) {
            console.error('Create notification error:', error);
            throw error;
        }
    }
}

export const notificationService = new NotificationService(); 