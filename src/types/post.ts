export interface Post {
    id: string;
    title: string;
    content: string;
    bookId: string;
    tags?: string[];
    spoilerAlert: boolean;
    user: {
        id: string;
        username: string;
        avatarUrl?: string;
    };
    book: {
        id: string;
        title: string;
        author: string;
        coverImage?: string;
    };
    stats: {
        likesCount: number;
        commentsCount: number;
        isLiked: boolean;
    };
    createdAt: string;
    updatedAt: string;
}

export interface PostFilters {
    page?: number;
    limit?: number;
    sort?: 'created_at' | 'likes_count' | 'comments_count';
    order?: 'asc' | 'desc';
    bookId?: string;
}

export interface PaginatedPosts {
    items: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} 