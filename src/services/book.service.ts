import { CapacitorHttp } from '@capacitor/core';
import {
    Book,
    CreateBookRequest,
    UpdateBookRequest,
    GetBookResponse,
    GetBooksResponse,
    CreateBookResponse,
    UpdateBookResponse,
    BookFormat,
    BookAvailability
} from '@/types/bookTypes';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    sort_by?: 'relevance' | 'publication_date' | 'title' | 'rating';
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
        order?: 'asc' | 'desc';
    }): Promise<ApiResponse<GetBooksResponse>> {
        try {
            const queryParams = new URLSearchParams();
            if (options?.page) queryParams.append('page', options.page.toString());
            if (options?.limit) queryParams.append('limit', options.limit.toString());
            if (options?.genre) queryParams.append('genre', options.genre);
            if (options?.format) queryParams.append('format', options.format);
            if (options?.availability) queryParams.append('availability', options.availability);
            if (options?.search) queryParams.append('search', options.search);
            if (options?.sort) queryParams.append('sort', options.sort);
            if (options?.order) queryParams.append('order', options.order);

            const response = await CapacitorHttp.get({
                url: `${API_URL}/books?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des livres');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get books error:', error);
            throw error;
        }
    }

    async getBook(id: string): Promise<ApiResponse<GetBookResponse>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/books/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération du livre');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get book error:', error);
            throw error;
        }
    }

    async createBook(data: CreateBookRequest): Promise<ApiResponse<CreateBookResponse>> {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'cover_image' && value instanceof File) {
                    formData.append(key, value);
                } else if (value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            const response = await CapacitorHttp.post({
                url: `${API_URL}/books`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création du livre');
            }

            return response.data;
        } catch (error: any) {
            console.error('Create book error:', error);
            throw error;
        }
    }

    async updateBook(id: string, data: UpdateBookRequest): Promise<ApiResponse<UpdateBookResponse>> {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'cover_image' && value instanceof File) {
                    formData.append(key, value);
                } else if (value !== undefined) {
                    formData.append(key, String(value));
                }
            });

            const response = await CapacitorHttp.patch({
                url: `${API_URL}/books/${id}`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour du livre');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update book error:', error);
            throw error;
        }
    }

    async deleteBook(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/books/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du livre');
            }

            return response.data;
        } catch (error: any) {
            console.error('Delete book error:', error);
            throw error;
        }
    }

    async searchBooks(query: string): Promise<ApiResponse<GetBooksResponse>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/books/search?q=${encodeURIComponent(query)}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la recherche de livres');
            }

            return response.data;
        } catch (error: any) {
            console.error('Search books error:', error);
            throw error;
        }
    }
}

export const bookService = new BookService(); 