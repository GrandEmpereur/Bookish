import { apiRequest } from "@/lib/api-client";
import {
  Book,
  CreateBookRequest,
  UpdateBookRequest,
  GetBookResponse,
  GetBooksResponse,
  CreateBookResponse,
  UpdateBookResponse,
  BookFormat,
  BookAvailability,
} from "@/types/bookTypes";
import { ApiResponse } from "@/types/api";

interface SearchBooksParams {
  query?: string;
  author?: string;
  isbn?: string;
  genres?: string[];
  publisher?: string;
  publication_year?: number;
  language?: string;
  format?: string;
  rating_min?: number;
  rating_max?: number;
  page_count_min?: number;
  page_count_max?: number;
  available?: boolean;
  page?: number;
  limit?: number;
  sort_by?: "relevance" | "publication_date" | "title" | "rating";
}

interface SearchBooksResponse {
  books: Book[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    first_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    previous_page_url: string | null;
  };
}

class BookService {
  async getBooks(options?: {
    page?: number;
    limit?: number;
    genre?: string;
    format?: BookFormat;
    availability?: BookAvailability;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<ApiResponse<GetBooksResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.limit) params.limit = options.limit;
    if (options?.genre) params.genre = options.genre;
    if (options?.format) params.format = options.format;
    if (options?.availability) params.availability = options.availability;
    if (options?.search) params.search = options.search;
    if (options?.sort) params.sort = options.sort;
    if (options?.order) params.order = options.order;

    return await apiRequest<ApiResponse<GetBooksResponse>>("GET", "/books", {
      params,
    });
  }

  async getBook(id: string): Promise<ApiResponse<GetBookResponse>> {
    return await apiRequest<ApiResponse<GetBookResponse>>(
      "GET",
      `/books/${id}`
    );
  }

  async createBook(
    data: CreateBookRequest
  ): Promise<ApiResponse<CreateBookResponse>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "cover_image" && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    return await apiRequest<ApiResponse<CreateBookResponse>>("POST", "/books", {
      data: formData,
    });
  }

  async updateBook(
    id: string,
    data: UpdateBookRequest
  ): Promise<ApiResponse<UpdateBookResponse>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "cover_image" && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    return await apiRequest<ApiResponse<UpdateBookResponse>>(
      "PATCH",
      `/books/${id}`,
      { data: formData }
    );
  }

  async deleteBook(id: string): Promise<ApiResponse<null>> {
    return await apiRequest<ApiResponse<null>>("DELETE", `/books/${id}`);
  }

  async searchBooks(query: string): Promise<GetBooksResponse> {
    return await apiRequest<GetBooksResponse>("GET", "/search/books", {
      params: { query },
    });
  }
}

export const bookService = new BookService();
