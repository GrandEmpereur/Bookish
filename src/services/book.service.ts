import { CapacitorHttp } from '@capacitor/core';
import { Book, BookFilters, PaginatedBooks } from '@/types/book';
import { CreateBookInput, UpdateBookInput } from '@/lib/validations/book';
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
    // Récupérer la liste des livres
    async getBooks(filters: BookFilters = {}): Promise<ApiResponse<PaginatedBooks>> {
        try {
            const queryParams = new URLSearchParams({
                page: (filters.page || 1).toString(),
                limit: (filters.limit || 20).toString(),
                ...(filters.genre && { genre: filters.genre }),
                ...(filters.sort && { sort: filters.sort }),
                ...(filters.order && { order: filters.order })
            });

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

    // Récupérer les détails d'un livre
    async getBook(id: string): Promise<ApiResponse<Book>> {
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

    // Créer un nouveau livre
    async createBook(data: CreateBookInput): Promise<ApiResponse<Book>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/books`,
                headers: { 'Content-Type': 'application/json' },
                data,
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

    // Mettre à jour un livre
    async updateBook(id: string, data: UpdateBookInput): Promise<ApiResponse<Book>> {
        try {
            const response = await CapacitorHttp.put({
                url: `${API_URL}/books/${id}`,
                headers: { 'Content-Type': 'application/json' },
                data,
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

    // Supprimer un livre
    async deleteBook(id: string): Promise<void> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/books/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du livre');
            }
        } catch (error: any) {
            console.error('Delete book error:', error);
            throw error;
        }
    }

    async searchBooks(params: SearchBooksParams): Promise<ApiResponse<SearchBooksResponse>> {
        try {
            const queryParams = new URLSearchParams();

            // Ajouter uniquement les paramètres définis
            if (params.query) queryParams.append('query', params.query);
            if (params.author) queryParams.append('author', params.author);
            if (params.isbn) queryParams.append('isbn', params.isbn);
            if (params.genres?.length) params.genres.forEach(genre => queryParams.append('genres[]', genre));
            if (params.publisher) queryParams.append('publisher', params.publisher);
            if (params.publication_year) queryParams.append('publication_year', params.publication_year.toString());
            if (params.language) queryParams.append('language', params.language);
            if (params.format) queryParams.append('format', params.format);
            if (params.rating_min !== undefined) queryParams.append('rating_min', params.rating_min.toString());
            if (params.rating_max !== undefined) queryParams.append('rating_max', params.rating_max.toString());
            if (params.page_count_min !== undefined) queryParams.append('page_count_min', params.page_count_min.toString());
            if (params.page_count_max !== undefined) queryParams.append('page_count_max', params.page_count_max.toString());
            if (params.available !== undefined) queryParams.append('available', params.available.toString());
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.sort_by) queryParams.append('sort_by', params.sort_by);

            const response = await CapacitorHttp.get({
                url: `${API_URL}/search/books?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la recherche des livres');
            }

            return response.data;
        } catch (error: any) {
            console.error('Search books error:', error);
            throw error;
        }
    }
}

export const bookService = new BookService(); 