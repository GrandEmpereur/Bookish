// Types de base pour les résultats de recherche
interface SearchResultBase {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Résultats de recherche d'utilisateurs
export interface UserSearchResult {
    id: string;
    username: string;
    avatarUrl?: string;
    bio?: string;
    isVerified: boolean;
}

export interface PaginatedUserSearch extends SearchResultBase {
    items: UserSearchResult[];
}

// Résultats de recherche de livres
export interface BookSearchResult {
    id: string;
    title: string;
    author: string;
    genre: string;
    coverImage?: string;
    rating: number;
    reviewsCount: number;
}

export interface PaginatedBookSearch extends SearchResultBase {
    items: BookSearchResult[];
}

// Résultats de recherche de clubs
export interface ClubSearchResult {
    id: string;
    name: string;
    description: string;
    type: 'public' | 'private';
    memberCount: number;
    coverImage?: string;
}

export interface PaginatedClubSearch extends SearchResultBase {
    items: ClubSearchResult[];
}

// Résultats de recherche de listes de lecture
export interface BookListSearchResult {
    id: string;
    name: string;
    description?: string;
    visibility: 'public' | 'private';
    bookCount: number;
    owner: {
        id: string;
        username: string;
    };
}

export interface PaginatedBookListSearch extends SearchResultBase {
    items: BookListSearchResult[];
}

// Résultats de recherche de contributeurs
export interface ContributorSearchResult {
    id: string;
    name: string;
    role: 'author' | 'publisher' | 'editor';
    bio?: string;
    worksCount: number;
    avatarUrl?: string;
}

export interface PaginatedContributorSearch extends SearchResultBase {
    items: ContributorSearchResult[];
}

// Résultats de recherche par catégorie
export interface CategorySearchResult {
    books?: BookSearchResult[];
    clubs?: ClubSearchResult[];
    lists?: BookListSearchResult[];
    total: number;
} 