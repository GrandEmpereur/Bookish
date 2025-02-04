import { CapacitorHttp } from '@capacitor/core';
import {
    BookList,
    CreateBookListResponse,
    UpdateBookListResponse,
    BookListActionResponse,
    ShareBookListResponse,
    Genre
} from '@/types/book-list';
import {
    CreateBookListInput,
    UpdateBookListInput,
    AddBookToListInput,
    UpdateReadingStatusInput
} from '@/lib/validations/book-list';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class BookListService {
    // Récupérer les listes de lecture
    async getBookLists(): Promise<BookList[]> {
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
            console.error('Get book lists error:', error);
            throw error;
        }
    }

    // Récupérer les listes par genre
    async getBookListsByGenre(genre: Genre): Promise<BookList[]> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/book-lists/genre/${genre}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération des listes');
            }

            return response.data;
        } catch (error: any) {
            console.error('Get book lists by genre error:', error);
            throw error;
        }
    }

    // Créer une liste de lecture
    async createBookList(data: CreateBookListInput): Promise<CreateBookListResponse> {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            if (data.description) formData.append('description', data.description);
            formData.append('visibility', data.visibility);
            formData.append('genre', data.genre);
            if (data.coverImage) formData.append('coverImage', data.coverImage);

            const response = await CapacitorHttp.post({
                url: `${API_URL}/book-lists`,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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

    // Récupérer une liste de lecture
    async getBookList(id: string): Promise<BookList> {
        try {
            const response = await CapacitorHttp.get({
                url: `${API_URL}/book-lists/${id}`,
                webFetchExtra: { credentials: 'include' }
            });
            console.log("response", response);

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la récupération de la liste');
            }

            return response.data.data;
        } catch (error: any) {
            console.error('Get book list error:', error);
            throw error;
        }
    }

    // Mettre à jour une liste de lecture
    async updateBookList(id: string, data: UpdateBookListInput): Promise<UpdateBookListResponse> {
        try {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.description) formData.append('description', data.description);
            if (data.visibility) formData.append('visibility', data.visibility);
            if (data.coverImage) formData.append('coverImage', data.coverImage);

            const response = await CapacitorHttp.put({
                url: `${API_URL}/book-lists/${id}`,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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

    // Supprimer une liste de lecture
    async deleteBookList(id: string): Promise<void> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/book-lists/${id}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 204) {
                throw new Error(response.data.message || 'Erreur lors de la suppression de la liste');
            }
        } catch (error: any) {
            console.error('Delete book list error:', error);
            throw error;
        }
    }

    // Ajouter un livre à la liste
    async addBookToList(listId: string, data: AddBookToListInput): Promise<BookListActionResponse> {
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
            console.error('Add book to list error:', error);
            throw error;
        }
    }

    // Retirer un livre de la liste
    async removeBookFromList(listId: string, bookId: string): Promise<BookListActionResponse> {
        try {
            const response = await CapacitorHttp.delete({
                url: `${API_URL}/book-lists/${listId}/books/${bookId}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du retrait du livre');
            }

            return response.data;
        } catch (error: any) {
            console.error('Remove book from list error:', error);
            throw error;
        }
    }

    // Mettre à jour le statut de lecture
    async updateBookStatus(
        listId: string,
        bookId: string,
        data: UpdateReadingStatusInput
    ): Promise<BookListActionResponse> {
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
            console.error('Update book status error:', error);
            throw error;
        }
    }

    // Partager une liste
    async shareBookList(id: string): Promise<ShareBookListResponse> {
        try {
            const response = await CapacitorHttp.post({
                url: `${API_URL}/book-lists/${id}/share`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors du partage de la liste');
            }

            return response.data;
        } catch (error: any) {
            console.error('Share book list error:', error);
            throw error;
        }
    }
}

export const bookListService = new BookListService(); 