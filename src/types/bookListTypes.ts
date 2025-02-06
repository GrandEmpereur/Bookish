import { ApiResponse } from './api';
import type { UserProfile } from './userTypes';
import { Book } from './bookTypes';

// Types énumérés
export type BookListVisibility = 'public' | 'private';
export type ReadingStatus = 'to_read' | 'reading' | 'finished';

// Type principal pour les listes de livres
export interface BookList {
    bookCount: number;
    books: Book[];
    coverImage: string;
    createdAt: string;
    description: string;
    genre: string;
    id: string;
    name: string;
    updatedAt: string;
    userId: string;
    visibility: BookListVisibility;
}

// Types pour les requêtes
export interface CreateBookListRequest {
    name: string;
    description?: string;
    visibility: BookListVisibility;
    genre: string;
}

export interface UpdateBookListRequest extends Partial<CreateBookListRequest> { }

export interface AddBookToListRequest {
    bookIds: string[];
}

export interface UpdateReadingStatusRequest {
    status: ReadingStatus;
}

// Types pour les réponses
export interface GetBookListsResponse {
    status: string;
    message: string;
    data: BookList[];
}

export interface GetBookListResponse {
    bookList: BookList;
}

export interface CreateBookListResponse {
    bookList: BookList;
}

export interface UpdateBookListResponse {
    bookList: BookList;
}

export interface AddBookToListResponse {
    bookCount: number;
    addedCount: number;
    existingBooks: Array<{
        id: string;
        title: string;
    }>;
}

export interface RemoveBookFromListResponse {
    bookCount: number;
}

export interface UpdateReadingStatusResponse {
    bookId: string;
    readingStatus: ReadingStatus;
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