export interface Comment {
    id: string;
    content: string;
    spoilerAlert: boolean;
    user: {
        id: string;
        username: string;
        avatarUrl?: string;
    };
    post: {
        id: string;
        title: string;
    };
    stats: {
        likesCount: number;
        isLiked: boolean;
    };
    replies?: Comment[];
    parentId?: string;
    isEdited: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CommentFilters {
    page?: number;
    limit?: number;
    sort?: 'created_at' | 'likes_count';
    order?: 'asc' | 'desc';
}

export interface PaginatedComments {
    items: Comment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} 