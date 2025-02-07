import { ApiResponse } from './api';
import { UserProfile as User, UserRole } from './userTypes';
import { Book } from './bookTypes';
import { Club } from './clubTypes';
import { Post } from './postTypes';
import type { UserProfile } from './userTypes';
import { BookList } from './bookListTypes';

// Types pour les options de recherche de base
export interface BaseSearchOptions {
    query?: string;
    page?: number;
    limit?: number;
    sort_by?: string;
    order?: 'asc' | 'desc';
}

// Types pour la recherche d'utilisateurs
export interface UserSearchOptions extends BaseSearchOptions {
    role?: UserRole;
    preferred_genres?: string[];
    location?: string;
    sort_by?: 'relevance' | 'registration_date' | 'username' | 'name';
}

// Types pour la recherche de livres
export interface BookSearchOptions extends BaseSearchOptions {
    author?: string;
    isbn?: string;
    genres?: string[];
    publisher?: string;
    publication_year?: number;
    language?: string;
    format?: 'paperback' | 'ebook' | 'audiobook';
    rating_min?: number;
    rating_max?: number;
    page_count_min?: number;
    page_count_max?: number;
    available?: 'in_stock' | 'out_of_stock';
    sort_by?: 'relevance' | 'publication_date' | 'title' | 'rating';
}

// Types pour la recherche de clubs
export interface ClubSearchOptions extends BaseSearchOptions {
    genres?: string[];
    member_count?: number;
    visibility?: 'Public' | 'Private' | 'Archived';
    sort_by?: 'relevance' | 'member_count' | 'creation_date';
}

// Types pour la recherche de listes de lecture
export interface BookListSearchOptions extends BaseSearchOptions {
    genres?: string[];
    created_by?: string;
    book_count?: number;
    visibility?: 'public' | 'private';
    sort_by?: 'relevance' | 'book_count' | 'creation_date';
}

// Types pour la recherche par catégorie
export interface CategorySearchOptions extends BaseSearchOptions {
    category: string;
    subcategory?: string;
}

// Types pour la recherche de contributeurs
export interface ContributorSearchOptions extends BaseSearchOptions {
    type: 'author' | 'publisher' | 'editor';
    sort_by?: 'relevance' | 'registration_date';
}

// Types pour les résultats de recherche
export interface SearchResult<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

export interface SearchResponse<T> {
    data: T[];
    total: number;
}

export interface UserSearchResponse {
    data: {
        users: UserProfile[];
        total: number;
    };
}

export interface BookSearchResponse {
    data: {
        books: Book[];
        total: number;
    };
}

export interface ClubSearchResponse {
    clubs: SearchResult<Club>;
}

export interface BookListSearchResponse {
    book_lists: SearchResult<{
        id: string;
        name: string;
        description: string | null;
        book_count: number;
        user: {
            id: string;
            username: string;
        };
    }>;
}

export interface CategorySearchResponse {
    results: SearchResult<{
        id: string;
        type: string;
        title: string;
        description: string;
        category: string;
        subcategory?: string;
    }>;
}

export interface ContributorSearchResponse {
    contributors: SearchResult<User>;
}

export interface PaginationMeta {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    firstPage: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    previousPageUrl: string | null;
}

export interface SearchResultSection<T> {
    data: T[];
    pagination: PaginationMeta;
}

export interface GeneralSearchResponse {
    status: string;
    message: string;
    data: {
        currentPage: number;
        limit: number;
        query: string;
        results: {
            BookLists: {
                data: BookList[];
            };
            Books: {
                data: Book[];
            };
            Clubs: {
                data: Club[];
            };
            Users: {
                data: UserProfile[];
            };
        };
        totals: {
            bookLists: number;
            books: number;
            clubs: number;
            users: number;
            total: number;
        };
    };
}

export interface SearchOptions {
    query: string;
    page?: number;
    limit?: number;
}

// Interface pour le service de recherche
export interface SearchService {
    searchUsers: (options: SearchOptions) => Promise<UserSearchResponse>;
    searchBooks: (options: SearchOptions) => Promise<BookSearchResponse>;
    searchClubs(options: ClubSearchOptions): Promise<ApiResponse<ClubSearchResponse>>;
    searchBookLists(options: BookListSearchOptions): Promise<ApiResponse<BookListSearchResponse>>;
    searchByCategory(options: CategorySearchOptions): Promise<ApiResponse<CategorySearchResponse>>;
    searchContributors(options: ContributorSearchOptions): Promise<ApiResponse<ContributorSearchResponse>>;
    searchGeneral(options: SearchOptions): Promise<GeneralSearchResponse>;
}

export interface SearchResults {
    users: UserProfile[];
    // ... autres résultats
} 