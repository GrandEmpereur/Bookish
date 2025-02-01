export interface Media {
    id: string;
    type: string;
    url: string;
    width: number;
    height: number;
}

export interface User {
    id: string;
    email: string;
    username: string;
    isVerified: boolean;
}

export interface Post {
    id: string;
    title: string;
    subject: string;
    content: string;
    likesCount: number;
    commentsCount: number;
    userId: string;
    clubId: string | null;
    createdAt: string;
    updatedAt: string;
    user: User;
    media: Media[];
    isLiked?: boolean;
    isFavorite?: boolean;
}

export interface PostFilters {
    page?: number;
    limit?: number;
    sort?: 'created_at' | 'likes_count' | 'comments_count';
    order?: 'asc' | 'desc';
    bookId?: string;
}

export interface CreatePostData {
    title: string;
    content: string;
    bookId: string;
    tags?: string[];
    spoilerAlert?: boolean;
}

export interface PaginatedPosts {
    items: Post[];
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