import { CapacitorHttp } from '@capacitor/core';
import { ApiResponse } from '@/types/api';
import {
    BaseSearchOptions,
    UserSearchOptions,
    BookSearchOptions,
    ClubSearchOptions,
    BookListSearchOptions,
    CategorySearchOptions,
    ContributorSearchOptions,
    UserSearchResponse,
    BookSearchResponse,
    ClubSearchResponse,
    BookListSearchResponse,
    CategorySearchResponse,
    ContributorSearchResponse,
    GeneralSearchResponse,
    SearchOptions
} from '@/types/searchTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class SearchService {
    async searchUsers(options: UserSearchOptions): Promise<ApiResponse<UserSearchResponse>> {
        try {
            const queryParams = new URLSearchParams();
            if (options.query) queryParams.append('query', options.query);
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.role) queryParams.append('role', options.role);
            if (options.preferred_genres) {
                options.preferred_genres.forEach(genre => {
                    queryParams.append('genres[]', genre);
                });
            }
            if (options.location) queryParams.append('location', options.location);
            if (options.sort_by) queryParams.append('sort_by', options.sort_by);
            if (options.order) queryParams.append('order', options.order);

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

    async searchBooks(options: BookSearchOptions): Promise<ApiResponse<BookSearchResponse>> {
        try {
            const queryParams = new URLSearchParams();
            if (options.query) queryParams.append('query', options.query);
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.author) queryParams.append('author', options.author);
            if (options.isbn) queryParams.append('isbn', options.isbn);
            if (options.genres) {
                options.genres.forEach(genre => {
                    queryParams.append('genres[]', genre);
                });
            }
            if (options.publisher) queryParams.append('publisher', options.publisher);
            if (options.publication_year) queryParams.append('year', options.publication_year.toString());
            if (options.language) queryParams.append('language', options.language);
            if (options.format) queryParams.append('format', options.format);
            if (options.rating_min) queryParams.append('rating_min', options.rating_min.toString());
            if (options.rating_max) queryParams.append('rating_max', options.rating_max.toString());
            if (options.sort_by) queryParams.append('sort_by', options.sort_by);
            if (options.order) queryParams.append('order', options.order);

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

    async searchClubs(options: ClubSearchOptions): Promise<ApiResponse<ClubSearchResponse>> {
        try {
            const queryParams = new URLSearchParams();
            if (options.query) queryParams.append('query', options.query);
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.genres) {
                options.genres.forEach(genre => {
                    queryParams.append('genres[]', genre);
                });
            }
            if (options.member_count) queryParams.append('member_count', options.member_count.toString());
            if (options.visibility) queryParams.append('visibility', options.visibility);
            if (options.sort_by) queryParams.append('sort_by', options.sort_by);
            if (options.order) queryParams.append('order', options.order);

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

    async searchBookLists(options: BookListSearchOptions): Promise<ApiResponse<BookListSearchResponse>> {
        try {
            const queryParams = new URLSearchParams();
            if (options.query) queryParams.append('query', options.query);
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.genres) {
                options.genres.forEach(genre => {
                    queryParams.append('genres[]', genre);
                });
            }
            if (options.created_by) queryParams.append('created_by', options.created_by);
            if (options.book_count) queryParams.append('book_count', options.book_count.toString());
            if (options.visibility) queryParams.append('visibility', options.visibility);
            if (options.sort_by) queryParams.append('sort_by', options.sort_by);
            if (options.order) queryParams.append('order', options.order);

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

    async searchGeneral(options: SearchOptions): Promise<GeneralSearchResponse> {
        try {
            const queryParams = new URLSearchParams();
            if (options.query) queryParams.append('query', options.query);
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());

            const response = await CapacitorHttp.get({
                url: `${API_URL}/search/general?${queryParams.toString()}`,
                webFetchExtra: { credentials: 'include' }
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || 'Erreur lors de la recherche générale');
            }

            return response.data;
        } catch (error: any) {
            console.error('General search error:', error);
            throw error;
        }
    }
}

export const searchService = new SearchService(); 