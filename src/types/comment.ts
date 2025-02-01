export interface Comment {
    id: string;
    content: string;
    spoilerAlert: boolean;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    user: {
        id: string;
        username: string;
    };
    replies?: Comment[];
}

export interface CreateCommentData {
    content: string;
    spoilerAlert?: boolean;
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

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: string;
} 