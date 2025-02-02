import { CapacitorHttp } from '@capacitor/core';
import {
    Notification,
    NotificationFilters,
    NotificationPreferences,
    PaginatedNotifications
} from '@/types/notification';
import { UpdateNotificationPreferencesInput } from '@/lib/validations/notification';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class NotificationService {
    // Récupérer la liste des notifications
    async getNotifications(filters: NotificationFilters = {}): Promise<ApiResponse<PaginatedNotifications>> {
        try {
            const queryParams = new URLSearchParams({
                page: (filters.page || 1).toString(),
                limit: (filters.limit || 20).toString(),
                ...(filters.status && { status: filters.status }),
                ...(filters.sort && { sort: filters.sort }),
                ...(filters.order && { order: filters.order })
            });

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

    // Marquer une notification comme lue
    async markAsRead(id: string): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/notifications/${id}/read`,
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

    // Marquer toutes les notifications comme lues
    async markAllAsRead(): Promise<ApiResponse<void>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/notifications/mark-all-as-read`,
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

    // Supprimer une notification
    async deleteNotification(id: string): Promise<void> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/notifications/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression de la notification');
            }
        } catch (error: any) {
            console.error('Delete notification error:', error);
            throw error;
        }
    }

    // Récupérer les préférences de notification
    async getPreferences(): Promise<ApiResponse<NotificationPreferences>> {
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

    // Mettre à jour les préférences de notification
    async updatePreferences(data: UpdateNotificationPreferencesInput): Promise<ApiResponse<NotificationPreferences>> {
        try {
            const response = await CapacitorHttp.put({
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
}

export const notificationService = new NotificationService(); 