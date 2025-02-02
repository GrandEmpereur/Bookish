export interface Favorite {
    id: string;
    addedAt: string;
    post: {
        id: string;
        title: string;
        content: string;
        author: {
            id: string;
            username: string;
            avatarUrl?: string;
        };
        stats: {
            likesCount: number;
            commentsCount: number;
        };
        createdAt: string;
    };
}

export interface FavoriteStatus {
    isFavorite: boolean;
    addedAt?: string;
}

export interface FavoriteFilters {
    page?: number;
    limit?: number;
    sort?: 'added_at' | 'title';
    order?: 'asc' | 'desc';
}

export interface PaginatedFavorites {
    items: Favorite[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} 