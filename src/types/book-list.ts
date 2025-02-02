export interface BookList {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    tags?: string[];
    coverImage?: string;
    userId: string;
    books: BookInList[];
    createdAt: string;
    updatedAt: string;
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