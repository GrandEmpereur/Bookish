import { ApiResponse } from './api';
import type { UserProfile } from './userTypes';
import { Book } from './bookTypes';

// Types énumérés
export type BookListVisibility = 'public' | 'private';
export type ReadingStatus = 'to_read' | 'reading' | 'finished';

// Type principal pour les listes de livres
export interface BookList {
    id: string;
    name: string;
    description: string | null;
    cover_image: string | null;
    user_id: string;
    visibility: BookListVisibility;
    genre: string;
    book_count: number;
    created_at: string;
    updated_at: string;
    user?: UserProfile;
    books?: Array<Book & { reading_status: ReadingStatus }>;
}

// Types pour les requêtes
export interface CreateBookListRequest {
    name: string;
    description?: string;
    visibility?: BookListVisibility;
    genre: string;
    cover_image?: File;
}

export interface UpdateBookListRequest extends Partial<CreateBookListRequest> { }

export interface AddBookToListRequest {
    book_ids: string[];
}

export interface UpdateReadingStatusRequest {
    status: ReadingStatus;
}

// Types pour les réponses
export interface GetBookListResponse {
    book_list: BookList;
}

export interface GetBookListsResponse {
    book_lists: BookList[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

export interface CreateBookListResponse {
    book_list: BookList;
}

export interface UpdateBookListResponse {
    book_list: BookList;
}

export interface AddBookToListResponse {
    book_count: number;
    added_count: number;
    existing_books: Array<{
        id: string;
        title: string;
    }>;
}

export interface RemoveBookFromListResponse {
    book_count: number;
}

export interface UpdateReadingStatusResponse {
    book_id: string;
    reading_status: ReadingStatus;
}

export interface GetBookListsByGenreResponse {
    book_lists: Array<BookList & {
        user: {
            id: string;
            username: string;
        };
    }>;
}

// Interface pour le service de listes de livres
export interface BookListService {
    getBookLists(options?: {
        page?: number;
        limit?: number;
        genre?: string;
        visibility?: BookListVisibility;
    }): Promise<ApiResponse<GetBookListsResponse>>;

    getBookList(id: string): Promise<ApiResponse<GetBookListResponse>>;

    createBookList(data: CreateBookListRequest): Promise<ApiResponse<CreateBookListResponse>>;

    updateBookList(
        id: string,
        data: UpdateBookListRequest
    ): Promise<ApiResponse<UpdateBookListResponse>>;

    deleteBookList(id: string): Promise<ApiResponse<null>>;

    addBookToList(
        listId: string,
        data: AddBookToListRequest
    ): Promise<ApiResponse<AddBookToListResponse>>;

    removeBookFromList(
        listId: string,
        bookId: string
    ): Promise<ApiResponse<RemoveBookFromListResponse>>;

    updateReadingStatus(
        listId: string,
        bookId: string,
        data: UpdateReadingStatusRequest
    ): Promise<ApiResponse<UpdateReadingStatusResponse>>;

    getBookListsByGenre(
        genre: string
    ): Promise<ApiResponse<GetBookListsByGenreResponse>>;
} 