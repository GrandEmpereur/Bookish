export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    isbn: string;
    genre: string;
    publicationYear: number;
    coverImage?: string;
    publisher?: string;
    language: string;
    pageCount?: number;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
    stats?: {
        averageRating: number;
        reviewsCount: number;
        readersCount: number;
    };
}

export interface BookFilters {
    page?: number;
    limit?: number;
    genre?: string;
    sort?: 'title' | 'author' | 'publicationYear';
    order?: 'asc' | 'desc';
}

export interface PaginatedBooks {
    items: Book[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} 