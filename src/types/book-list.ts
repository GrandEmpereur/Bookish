export type Visibility = 'public' | 'private';
export type Genre = 'fantasy' | 'science-fiction' | 'romance' | 'thriller' | 'mystery' |
    'horror' | 'historical' | 'contemporary' | 'literary' | 'young-adult' |
    'non-fiction' | 'biography' | 'poetry' | 'comics' | 'mixed';
export type ReadingStatus = 'to_read' | 'reading' | 'read';

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
    coverImage?: string | null;
    genre: string;
}

export interface BookList {
    id: string;
    name: string;
    description: string | null;
    visibility: Visibility;
    genre: string;
    bookCount: number;
    coverImage: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
    books?: BookInList[];
    user?: {
        id: string;
        name: string;
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

export interface BookListResponse {
    id: string;
    name: string;
    description?: string;
    coverImage?: string;
    visibility: Visibility;
    genre: Genre;
    bookCount: number;
    userId: string;
    books?: BookInList[];
    user?: {
        id: string;
        username: string;
    };
}

export interface existingBooks {
    id: string;
    title: string;
}

export interface AddBooksToListResponse {
    existingBooks?: existingBooks[];
    status: 'success';
    message: string;
    data: {
        bookCount: number;
        addedCount: number;
        existingBooks: existingBooks[];
    };
}

export interface RemoveBookFromListResponse {
    message: string;
    bookCount: number;
}

export interface UpdateReadingStatusResponse {
    message: string;
}

export interface ShareBookListResponse {
    status: 'success';
    message: string;
    data: {
        shareUrl: string;
    };
}

export interface ValidationError {
    field: string;
    message: string;
} 