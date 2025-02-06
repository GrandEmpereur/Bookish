import { CapacitorHttp } from '@capacitor/core';
import {
    BookList,
    CreateBookListRequest,
    UpdateBookListRequest,
    AddBookToListRequest,
    UpdateReadingStatusRequest,
    GetBookListResponse,
    GetBookListsResponse,
    CreateBookListResponse,
    UpdateBookListResponse,
    AddBookToListResponse,
    RemoveBookFromListResponse,
    UpdateReadingStatusResponse,
    GetBookListsByGenreResponse,
    BookListVisibility
} from '@/types/bookListTypes';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class BookListService {
    async getBookLists(options?: {
        page?: number;
        limit?: number;
        genre?: string;
        visibility?: BookListVisibility;
    }): Promise<ApiResponse<GetBookListsResponse>> {
        try {
            const queryParams = new URLSearchParams();
            if (options?.page) queryParams.append('page', options.page.toString());
            if (options?.limit) queryParams.append('limit', options.limit.toString());
            if (options?.genre) queryParams.append('genre', options.genre);
            if (options?.visibility) queryParams.append('visibility', options.visibility);

            const response = await CapacitorHttp.get({
                url: `${API_URL}/book-lists?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des listes');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get book lists error:', error);
            throw error;
        }
    }

    async getBookList(id: string): Promise<ApiResponse<GetBookListResponse>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/book-lists/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération de la liste');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get book list error:', error);
            throw error;
        }
    }

    async createBookList(data: CreateBookListRequest): Promise<ApiResponse<CreateBookListResponse>> {
        try {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'cover_image' && value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            });

            const response = await CapacitorHttp.post({
                url: `${API_URL}/book-lists`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création de la liste');
            }

            return response.data;
        } catch (error: any) {
            console.error('Create book list error:', error);
            throw error;
        }
    }

    async updateBookList(id: string, data: UpdateBookListRequest): Promise<ApiResponse<UpdateBookListResponse>> {
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
                url: `${API_URL}/book-lists/${id}`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour de la liste');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update book list error:', error);
            throw error;
        }
    }

    async deleteBookList(id: string): Promise<ApiResponse<null>> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/book-lists/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression de la liste');
            }

            return response.data;
        } catch (error: any) {
            console.error('Delete book list error:', error);
            throw error;
        }
    }

    async addBookToList(listId: string, data: AddBookToListRequest): Promise<ApiResponse<AddBookToListResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/book-lists/${listId}/books`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de l\'ajout des livres');
            }

            return response.data;
        } catch (error: any) {
            console.error('Add book to list error:', error);
            throw error;
        }
    }

    async removeBookFromList(listId: string, bookId: string): Promise<ApiResponse<RemoveBookFromListResponse>> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/book-lists/${listId}/books/${bookId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la suppression du livre');
            }

            return response.data;
        } catch (error: any) {
            console.error('Remove book from list error:', error);
            throw error;
        }
    }

    async updateReadingStatus(
        listId: string,
        bookId: string,
        data: UpdateReadingStatusRequest
    ): Promise<ApiResponse<UpdateReadingStatusResponse>> {
        try {
            const response = await CapacitorHttp.patch({
                url: `${API_URL}/book-lists/${listId}/books/${bookId}/status`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour du statut');
            }

            return response.data;
        } catch (error: any) {
            console.error('Update reading status error:', error);
            throw error;
        }
    }

    async getBookListsByGenre(genre: string): Promise<ApiResponse<GetBookListsByGenreResponse>> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/book-lists/genre/${genre}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des listes par genre');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get lists by genre error:', error);
            throw error;
        }
    }
}

export const bookListService = new BookListService(); 