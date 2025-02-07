import { ApiResponse } from './api';
import type { UserProfile } from './userTypes';

// Types énumérés
export type NotificationType =
    | 'new_message'
    | 'friend_request'
    | 'friend_request_accepted'
    | 'follow'
    | 'like'
    | 'comment'
    | 'comment_reply'
    | 'club_invitation'
    | 'club_event'
    | 'club_message'
    | 'system_update';

export type NotificationChannel = 'in_app' | 'email' | 'push';

// Types pour les préférences de notification
export interface NotificationPreferenceSettings {
    in_app: boolean;
    email: boolean;
    push: boolean;
}

export interface NotificationPreferences {
    new_message: NotificationPreferenceSettings;
    friend_request: NotificationPreferenceSettings;
    friend_request_accepted: NotificationPreferenceSettings;
    follow: NotificationPreferenceSettings;
    like: NotificationPreferenceSettings;
    comment: NotificationPreferenceSettings;
    comment_reply: NotificationPreferenceSettings;
    club_invitation: NotificationPreferenceSettings;
    club_event: NotificationPreferenceSettings;
    club_message: NotificationPreferenceSettings;
    system_update: NotificationPreferenceSettings;
}

// Type principal pour les notifications
export interface Notification {
    id: string;
    user_id: string;
    type: NotificationType;
    data: Record<string, any>;
    read: boolean;
    read_at: string | null;
    created_at: string;
    updated_at: string | null;
    user: UserProfile;
}

// Type pour les préférences de notification
export interface NotificationPreference {
    id: string;
    user_id: string;
    preferences: NotificationPreferences;
    created_at: string;
    updated_at: string | null;
    user?: UserProfile;
}

// Types pour les requêtes
export interface UpdateNotificationPreferencesRequest {
    preferences: Partial<NotificationPreferences>;
}

// Types pour les réponses
export interface GetNotificationsResponse {
    notifications: Notification[];
    unread_count: number;
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

export interface GetNotificationPreferencesResponse {
    preferences: NotificationPreference;
}

export interface UpdateNotificationPreferencesResponse {
    preferences: NotificationPreference;
}

// Interface pour le service de notifications
export interface NotificationService {
    getNotifications(options: {
        unreadOnly?: boolean;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<GetNotificationsResponse>>;

    markAsRead(notificationId: string): Promise<ApiResponse<Notification>>;

    markAllAsRead(): Promise<ApiResponse<null>>;

    deleteNotification(notificationId: string): Promise<ApiResponse<null>>;

    getPreferences(): Promise<ApiResponse<GetNotificationPreferencesResponse>>;

    updatePreferences(
        data: UpdateNotificationPreferencesRequest
    ): Promise<ApiResponse<UpdateNotificationPreferencesResponse>>;

    isEnabled(type: NotificationType, channel: NotificationChannel): Promise<boolean>;

    createNotification(
        userId: string,
        type: NotificationType,
        data: Record<string, any>
    ): Promise<ApiResponse<Notification>>;
} 