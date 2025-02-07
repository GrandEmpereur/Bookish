import { CapacitorHttp } from '@capacitor/core';
import type {
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
} from '@/types/bookListTypes';
import type { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class BookListService {
    // GET /book-lists
    async getBookLists(): Promise<GetBookListsResponse> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/book-lists`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des listes');
            }

            return response.data;
        } catch (error: any) {
            throw error;
        }
    }

    // GET /book-lists/:id
    async getBookList(id: string): Promise<GetBookListResponse> {
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
            throw error;
        }
    }

    // POST /book-lists
    async createBookList(data: CreateBookListRequest): Promise<ApiResponse<CreateBookListResponse>> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/book-lists`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 201) {
                throw new Error(response.data.message || 'Erreur lors de la création de la liste');
            }

            return response.data;
        } catch (error: any) {
            throw error;
        }
    }

    // PUT /book-lists/:id
    async updateBookList(id: string, data: UpdateBookListRequest): Promise<UpdateBookListResponse> {
        try {
            // Créer un FormData si on a une image
            let requestData: any;
            let headers: { [key: string]: string } = {};

            if (data.coverImage instanceof File) {
                const formData = new FormData();
                formData.append('coverImage', data.coverImage);
                if (data.name) formData.append('name', data.name);
                if (data.description) formData.append('description', data.description);
                if (data.visibility) formData.append('visibility', data.visibility);
                if (data.genre) formData.append('genre', data.genre);
                requestData = formData;
            } else {
                // Si pas d'image, envoyer en JSON
                const { coverImage, ...jsonData } = data;
                requestData = jsonData;
                headers['Content-Type'] = 'application/json';
            }

            const response = await CapacitorHttp.put({
                url: `${API_URL}/book-lists/${id}`,
                headers,
                data: requestData,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la mise à jour de la liste');
            }

            return response.data;
        } catch (error: any) {
            throw error;
        }
    }

    // DELETE /book-lists/:id
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
            throw error;
        }
    }

    // POST /book-lists/:id/books
    async addBookToList(listId: string, data: AddBookToListRequest): Promise<AddBookToListResponse> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/book-lists/${listId}/books`,
                headers: { 'Content-Type': 'application/json' },
                data,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de l\'ajout du livre');
            }

            return response.data;
        } catch (error: any) {
            throw error;
        }
    }

    // DELETE /book-lists/:listId/books/:bookId
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
            throw error;
        }
    }

    // PUT /book-lists/:listId/books/:bookId/status
    async updateReadingStatus(
        listId: string,
        bookId: string,
        data: UpdateReadingStatusRequest
    ): Promise<ApiResponse<UpdateReadingStatusResponse>> {
        try {
            const response = await CapacitorHttp.put({
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
            throw error;
        }
    }
}

export const bookListService = new BookListService(); 