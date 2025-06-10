import { ApiResponse } from "./api";
import { UserProfile as User } from "./userTypes";

// Types énumérés
export type BookFormat = "paperback" | "ebook" | "audiobook";
export type BookAvailability = "in_stock" | "out_of_stock";
export type ReadingStatus = "to_read" | "reading" | "finished";

// Type principal pour les livres
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  isbn: string | null;
  genre: string | null;
  publicationYear: number | null;
  coverImage: string | null;
  publisher_id: string | null;
  language: string | null;
  format: BookFormat | null;
  page_count: number | null;
  rating: number | null;
  availability: BookAvailability | null;
  created_at: string;
  updated_at: string;
  publisher?: User;
  genres: string[];
}

// Types pour les requêtes
export interface CreateBookRequest {
  title: string;
  author: string;
  description?: string;
  isbn?: string;
  genre?: string;
  publication_year?: number;
  cover_image?: File;
  publisher_id?: string;
  language?: string;
  format?: BookFormat;
  page_count?: number;
  rating?: number;
  availability?: BookAvailability;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {}

// Types pour les réponses
export interface GetBookResponse {
  book: Book;
}

export interface GetBooksResponse {
  status: string;
  message: string;
  data: {
    books: Book[];
  };
}

export interface CreateBookResponse {
  book: Book;
}

export interface UpdateBookResponse {
  book: Book;
}

// Interface pour le service de livres
export interface BookService {
  getBooks(): Promise<ApiResponse<GetBooksResponse>>;
  getBook(id: string): Promise<ApiResponse<GetBookResponse>>;
  createBook(data: CreateBookRequest): Promise<ApiResponse<CreateBookResponse>>;
  updateBook(
    id: string,
    data: UpdateBookRequest
  ): Promise<ApiResponse<UpdateBookResponse>>;
  deleteBook(id: string): Promise<ApiResponse<null>>;
}
