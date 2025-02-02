import { CapacitorHttp } from '@capacitor/core';
import {
    PaginatedUserSearch,
    PaginatedBookSearch,
    PaginatedClubSearch,
    PaginatedBookListSearch,
    PaginatedContributorSearch,
    CategorySearchResult
} from '@/types/search';
import {
    SearchBooksInput,
    SearchClubsInput,
    SearchBookListsInput,
    SearchByCategoryInput,
    SearchContributorsInput
} from '@/lib/validations/search';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class SearchService {
    // Rechercher des utilisateurs
    async searchUsers(query: string, page = 1, limit = 10): Promise<ApiResponse<PaginatedUserSearch>> {
        try {
            const queryParams = new URLSearchParams({
                query,
                page: page.toString(),
                limit: limit.toString()
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/search/users?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la recherche d\'utilisateurs');
            }

            return response.data;
        } catch (error: any) {
            console.error('Search users error:', error);
            throw error;
        }
    }

    // Rechercher des livres
    async searchBooks(params: SearchBooksInput): Promise<ApiResponse<PaginatedBookSearch>> {
        try {
            const queryParams = new URLSearchParams({
                query: params.query,
                page: (params.page || 1).toString(),
                limit: (params.limit || 10).toString(),
                ...(params.genre && { genre: params.genre })
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/search/books?${queryParams.toString()}`,
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

    // Rechercher des clubs
    async searchClubs(params: SearchClubsInput): Promise<ApiResponse<PaginatedClubSearch>> {
        try {
            const queryParams = new URLSearchParams({
                query: params.query,
                page: (params.page || 1).toString(),
                limit: (params.limit || 10).toString(),
                ...(params.type && { type: params.type })
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/search/clubs?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la recherche de clubs');
            }

            return response.data;
        } catch (error: any) {
            console.error('Search clubs error:', error);
            throw error;
        }
    }

    // Rechercher des listes de lecture
    async searchBookLists(params: SearchBookListsInput): Promise<ApiResponse<PaginatedBookListSearch>> {
        try {
            const queryParams = new URLSearchParams({
                query: params.query,
                page: (params.page || 1).toString(),
                limit: (params.limit || 10).toString(),
                ...(params.visibility && { visibility: params.visibility })
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/search/book-lists?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la recherche de listes');
            }

            return response.data;
        } catch (error: any) {
            console.error('Search book lists error:', error);
            throw error;
        }
    }

    // Rechercher par catégorie
    async searchByCategory(params: SearchByCategoryInput): Promise<ApiResponse<CategorySearchResult>> {
        try {
            const queryParams = new URLSearchParams({
                category: params.category,
                type: params.type,
                page: (params.page || 1).toString(),
                limit: (params.limit || 10).toString()
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/search/category?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la recherche par catégorie');
            }

            return response.data;
        } catch (error: any) {
            console.error('Search by category error:', error);
            throw error;
        }
    }

    // Rechercher des contributeurs
    async searchContributors(params: SearchContributorsInput): Promise<ApiResponse<PaginatedContributorSearch>> {
        try {
            const queryParams = new URLSearchParams({
                query: params.query,
                page: (params.page || 1).toString(),
                limit: (params.limit || 10).toString(),
                ...(params.role && { role: params.role })
            });

            const response = await CapacitorHttp.get({
                url: `${API_URL}/search/contributors?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la recherche de contributeurs');
            }

            return response.data;
        } catch (error: any) {
            console.error('Search contributors error:', error);
            throw error;
        }
    }
}

export const searchService = new SearchService(); 