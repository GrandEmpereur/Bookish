import { CapacitorHttp } from '@capacitor/core';
import { Book, BookFilters, PaginatedBooks } from '@/types/book';
import { CreateBookInput, UpdateBookInput } from '@/lib/validations/book';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
}

export const bookService = new BookService(); 