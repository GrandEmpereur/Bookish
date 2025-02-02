export interface Conversation {
    id: string;
    participants: {
        id: string;
        username: string;
        avatarUrl?: string;
    }[];
    lastMessage?: Message;
    unreadCount: number;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    content: string;
    sender: {
        id: string;
        username: string;
        avatarUrl?: string;
    };
    attachments?: {
        id: string;
        url: string;
        type: string;
        size: number;
    }[];
    isRead: boolean;
    createdAt: string;
}

export interface ConversationFilters {
    page?: number;
    limit?: number;
    sort?: 'last_message' | 'created_at';
    order?: 'asc' | 'desc';
}

export interface MessageFilters {
    page?: number;
    limit?: number;
}

export interface PaginatedConversations {
    items: Conversation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedMessages {
    items: Message[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} 