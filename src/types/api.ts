// Types de base pour les réponses API
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
}

// Types d'erreur
export interface ApiError {
  status: "error";
  message: string;
  errors?: Record<string, string[]>;
}

// Types pour la pagination
export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  previous_page_url: string | null;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  meta: PaginationMeta;
}

// Types pour le cache
export interface CachedResponse<T> extends ApiResponse<T> {
  cached: boolean;
  cache_ttl?: number;
}

// Types pour les statistiques
export interface StatsResponse<T, S = Record<string, number>>
  extends ApiResponse<T> {
  stats: S;
}

// Types pour les options de requête
export interface RequestOptions {
  include?: string[];
  page?: number;
  per_page?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
  filters?: Record<string, any>;
  cache?: boolean;
  cache_ttl?: number;
}

// Types pour les codes HTTP
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
}

// Types pour les erreurs de validation
export interface ValidationError {
  field: string;
  rule: string;
  message: string;
}

// Types utilitaires
export type WithRelations<T, R extends string> = T & Record<R, any>;
export type EnsureAuthenticated<T> = T & { user: { id: string } };
