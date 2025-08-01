import { ApiResponse } from "./api";
import type { UserProfile } from "./userTypes";
import { Book } from "./bookTypes";

// Types énumérés
export type BookListVisibility = "public" | "private";
export type ReadingStatus = "to_read" | "reading" | "finished";

// Type principal pour les listes de livres
export interface BookList {
  id: string;
  name: string;
  description: string;
  cover_image: string;
  visibility: BookListVisibility;
  genre: string;
  book_count: number;
  created_at: string;
  book_ids: [];
  books?: Array<{
    id: string;
    title: string;
    author: string;
    genre: string;
    coverImage: string;
  }>;
}

// Types pour les requêtes
export interface CreateBookListRequest {
  name: string;
  description: string;
  visibility: BookListVisibility;
  genre: string;
  coverImage?: File | null;
}

export interface UpdateBookListRequest {
  name?: string;
  description?: string;
  visibility?: BookListVisibility;
  genre?: string;
  coverImage?: File | null;
}

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
  data: BookList;
  status: string;
  message: string;
}

export interface SearchParams {
  query?: string;
  genre?: string;
}

export interface SearchMyBookListResponse {
  data: BookList[];
  message: string;
  status: string;
}

export interface CreateBookListResponse {
  bookList: BookList;
}

export interface UpdateBookListResponse {
  bookList: BookList;
}

export interface AddBookToListResponse {
  status: string;
  message: string;
  data: {
    bookCount: number;
    addedCount: number;
    existingBooks: Array<{
      id: string;
      title: string;
    }>;
  };
}

export interface RemoveBookFromListResponse {
  bookCount: number;
}

export interface UpdateReadingStatusResponse {
  bookId: string;
  readingStatus: ReadingStatus;
}

export interface GetBookListsByGenreResponse {
  book_lists: Array<
    BookList & {
      user: {
        id: string;
        username: string;
      };
    }
  >;
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

  createBookList(
    data: CreateBookListRequest
  ): Promise<ApiResponse<CreateBookListResponse>>;

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
