export type ReadingStatus = 'to_read' | 'reading' | 'finished';
export type Visibility = 'public' | 'private';
export type Genre =
    | 'fantasy'
    | 'science-fiction'
    | 'romance'
    | 'thriller'
    | 'mystery'
    | 'horror'
    | 'historical'
    | 'contemporary'
    | 'literary'
    | 'young-adult'
    | 'non-fiction'
    | 'biography'
    | 'poetry'
    | 'comics'
    | 'mixed';

export interface Book {
    id: string;
    title: string;
    author: string;
    reading_status: ReadingStatus;
}

export interface BookInList {
    id: string;
    title: string;
    author: string;
    coverImage?: string;
    genre: Genre;
    reading_status?: ReadingStatus;
}

export interface BookList {
    id: string;
    name: string;
    description?: string;
    coverImage?: string;
    visibility: Visibility;
    genre: Genre;
    bookCount: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
    books?: BookInList[];
    user?: {
        id: string;
        username: string;
    };
}

export interface CreateBookListResponse {
    id: string;
    name: string;
    description?: string;
    coverImage?: string;
    visibility: Visibility;
    genre: Genre;
    bookCount: number;
    userId: string;
}

export interface UpdateBookListResponse {
    id: string;
    name: string;
    description?: string;
    coverImage?: string;
    visibility: Visibility;
    genre: Genre;
    bookCount: number;
    userId: string;
}

export interface BookListActionResponse {
    message: string;
    bookCount?: number;
}

export interface ShareBookListResponse {
    message: string;
    shareUrl: string;
}

export interface BookListFilters {
    page?: number;
    limit?: number;
    sort?: 'created_at' | 'updated_at' | 'name';
    order?: 'asc' | 'desc';
}

export interface PaginatedBookLists {
    items: BookList[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BookListShare {
    userId: string;
    permission: 'read' | 'write';
} 