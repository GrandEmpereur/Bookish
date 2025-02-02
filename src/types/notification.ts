export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    data?: Record<string, any>;
    createdAt: string;
}

export interface NotificationPreferences {
    email_notifications: boolean;
    push_notifications: boolean;
    newsletter_subscribed: boolean;
    notification_types: {
        new_follower: boolean;
        new_comment: boolean;
        new_like: boolean;
        club_updates: boolean;
    };
}

export interface NotificationFilters {
    page?: number;
    limit?: number;
    status?: 'all' | 'read' | 'unread';
    sort?: 'created_at';
    order?: 'asc' | 'desc';
}

export interface PaginatedNotifications {
    items: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    unreadCount: number;
} 