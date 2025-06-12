import { UserProfile } from "./userTypes";
import { Book } from "./bookTypes";
import { Club } from "./clubTypes";
import { BookList } from "./bookListTypes";

// Types de base pour les options de recherche
export interface BaseSearchOptions {
  query?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: "asc" | "desc";
}

export type SearchCategory = "all" | "users" | "books" | "clubs" | "book_lists";

// Types communs pour pagination
export interface SearchPagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_more: boolean;
  next_page: number | null;
  prev_page: number | null;
  first_item: number;
  last_item: number;
}

// Types communs pour métriques
export interface SearchMetrics {
  total_results: number;
  execution_time_ms: number;
  query_complexity: "simple" | "complex";
  cache_hit: boolean;
  suggestions?: string[];
}

// Type pour élément unifié (tous types mélangés)
export interface UnifiedSearchResult {
  id: string;
  type: "user" | "book" | "club" | "book_list";
  result_type: "user" | "book" | "club" | "book_list";
  search_score: number;
  [key: string]: any; // Pour les propriétés spécifiques à chaque type
}

// ==== RECHERCHE GÉNÉRALE ====
export interface GeneralSearchResponse {
  status: "success" | "error";
  message: string;
  data: {
    query: string;
    results: {
      unified: UnifiedSearchResult[];
      grouped: {
        users: {
          data: UserProfile[];
          total: number;
        };
        books: {
          data: Book[];
          total: number;
        };
        clubs: {
          data: Club[];
          total: number;
        };
        book_lists: {
          data: BookList[];
          total: number;
        };
      };
    };
    pagination: SearchPagination;
    totals: {
      users: number;
      books: number;
      clubs: number;
      book_lists: number;
      total: number;
    };
    metrics: SearchMetrics;
    search_params: {
      query: string;
      search_types: string[];
      ranking_method: string;
    };
  };
}

// ==== RECHERCHE USERS ====
export interface UserSearchResponse {
  status: "success" | "error";
  message: string;
  data: {
    users: UserProfile[];
    pagination: SearchPagination;
    metrics: SearchMetrics;
    search_params: {
      query: string;
      filters: {
        role: string | null;
        preferred_genres: string[] | null;
        location: string | null;
      };
      sort_by: string;
      applied_filters_count: number;
    };
  };
}

// ==== RECHERCHE BOOKS ====
export interface BookSearchResponse {
  status: "success" | "error";
  message: string;
  data: {
    books: Book[];
    pagination: SearchPagination;
    metrics: SearchMetrics;
    search_params: {
      query: string;
      filters: {
        author: string | null;
        isbn: string | null;
        genres: string[] | null;
        publisher: string | null;
        publication_year: number | null;
        language: string | null;
        format: string | null;
        rating_range: any | null;
        page_count_range: any | null;
        available: string | null;
      };
      sort_by: string;
      applied_filters_count: number;
    };
  };
}

// ==== RECHERCHE CLUBS ====
export interface ClubSearchResponse {
  status: "success" | "error";
  message: string;
  data: {
    clubs: Club[];
    pagination: SearchPagination;
    metrics: SearchMetrics;
    search_params: {
      query: string;
      filters: {
        genres: string[] | null;
        member_count: number | null;
        visibility: string | null;
      };
      sort_by: string;
      applied_filters_count: number;
    };
  };
}

// ==== RECHERCHE BOOK LISTS ====
export interface BookListSearchResponse {
  status: "success" | "error";
  message: string;
  data: {
    book_lists: BookList[];
    pagination: SearchPagination;
    metrics: SearchMetrics;
    search_params: {
      query: string | null;
      filters: {
        genres: string[] | null;
        created_by: string | null;
        book_count: number | null;
        visibility: string | null;
      };
      sort_by: string;
      applied_filters_count: number;
    };
  };
}

// ==== RECHERCHE PAR CATÉGORIE ====
export interface CategorySearchResponse {
  status: "success" | "error";
  message: string;
  data: {
    category: string;
    subcategory: string | null;
    results: Book[]; // Semble être des livres dans l'exemple
    pagination: SearchPagination;
    metrics: SearchMetrics;
  };
}

// ==== RECHERCHE PROFESSIONNELS (AUTHORS/PUBLISHERS) ====
export interface ProfessionalSearchResponse {
  status: "success" | "error";
  message: string;
  data: {
    professionals: UserProfile[];
    pagination: SearchPagination;
    metrics: SearchMetrics;
    search_params: {
      query: string;
      type: "author" | "publisher";
      role: string;
      sort_by: string;
    };
  };
}

// Options pour les recherches spécifiques
export interface UserSearchOptions extends BaseSearchOptions {
  role?: string;
  preferred_genres?: string[];
  location?: string;
}

export interface BookSearchOptions extends BaseSearchOptions {
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
  available?: string;
}

export interface ClubSearchOptions extends BaseSearchOptions {
  genres?: string[];
  member_count?: number;
  visibility?: string;
}

export interface BookListSearchOptions extends BaseSearchOptions {
  genres?: string[];
  created_by?: string;
  book_count?: number;
  visibility?: string;
}

export interface CategorySearchOptions extends BaseSearchOptions {
  category: string;
  subcategory?: string;
}

export interface ProfessionalSearchOptions extends BaseSearchOptions {
  type: "author" | "publisher";
  role?: string;
}

// Options générales pour la recherche
export interface SearchOptions {
  query: string;
  page?: number;
  limit?: number;
}
