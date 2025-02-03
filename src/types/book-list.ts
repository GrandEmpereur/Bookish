export type ReadingStatus = 'to_read' | 'reading' | 'finished';

export interface Book {
    id: string;
    title: string;
    author: string;
    reading_status: ReadingStatus;
}

export interface BookList {
    createdAt: string;
    description: string;
    id: string;
    name: string;
    updatedAt: string;
    userId: string;
    visibility: string;
    books: Book[];
}

export interface CreateBookListResponse {
    status: string;
    data: BookList;
}

export interface UpdateBookListResponse {
    status: string;
    data: BookList;
}

export interface ShareBookListResponse {
    status: string;
    message: string;
    shareUrl: string;
}

export interface BookListActionResponse {
    status: string;
    message: string;
}

export interface BookInList {
    id: string;
    bookId: string;
    status: 'to_read' | 'reading' | 'finished';
    currentPage?: number;
    notes?: string;
    addedAt: string;
    book: {
        title: string;
        author: string;
        coverImage?: string;
    };
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