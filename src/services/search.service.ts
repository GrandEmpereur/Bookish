import { apiRequest } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
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
  SearchOptions,
} from "@/types/searchTypes";

class SearchService {
  async searchUsers(
    options: UserSearchOptions
  ): Promise<ApiResponse<UserSearchResponse>> {
    const params: Record<string, string | number | boolean> = {};
    if (options.query) params.query = options.query;
    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;
    if (options.role) params.role = options.role;
    if (options.location) params.location = options.location;
    if (options.sort_by) params.sort_by = options.sort_by;
    if (options.order) params.order = options.order;

    // Gérer les genres séparément avec apiRequest pour array
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/search/users`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    if (options.preferred_genres) {
      options.preferred_genres.forEach((genre) => {
        url.searchParams.append("genres[]", genre);
      });
    }

    return await apiRequest<ApiResponse<UserSearchResponse>>(
      "GET",
      url.pathname + url.search.replace(process.env.NEXT_PUBLIC_API_URL!, "")
    );
  }

  async searchBooks(
    options: BookSearchOptions
  ): Promise<ApiResponse<BookSearchResponse>> {
    const params: Record<string, string | number | boolean> = {};
    if (options.query) params.query = options.query;
    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;
    if (options.author) params.author = options.author;
    if (options.isbn) params.isbn = options.isbn;
    if (options.publisher) params.publisher = options.publisher;
    if (options.publication_year) params.year = options.publication_year;
    if (options.language) params.language = options.language;
    if (options.format) params.format = options.format;
    if (options.rating_min) params.rating_min = options.rating_min;
    if (options.rating_max) params.rating_max = options.rating_max;
    if (options.sort_by) params.sort_by = options.sort_by;
    if (options.order) params.order = options.order;

    // Gérer les genres séparément
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/search/books`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    if (options.genres) {
      options.genres.forEach((genre) => {
        url.searchParams.append("genres[]", genre);
      });
    }

    return await apiRequest<ApiResponse<BookSearchResponse>>(
      "GET",
      url.pathname + url.search.replace(process.env.NEXT_PUBLIC_API_URL!, "")
    );
  }

  async searchClubs(
    options: ClubSearchOptions
  ): Promise<ApiResponse<ClubSearchResponse>> {
    const params: Record<string, string | number | boolean> = {};
    if (options.query) params.query = options.query;
    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;
    if (options.member_count) params.member_count = options.member_count;
    if (options.visibility) params.visibility = options.visibility;
    if (options.sort_by) params.sort_by = options.sort_by;
    if (options.order) params.order = options.order;

    // Gérer les genres séparément
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/search/clubs`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    if (options.genres) {
      options.genres.forEach((genre) => {
        url.searchParams.append("genres[]", genre);
      });
    }

    return await apiRequest<ApiResponse<ClubSearchResponse>>(
      "GET",
      url.pathname + url.search.replace(process.env.NEXT_PUBLIC_API_URL!, "")
    );
  }

  async searchBookLists(
    options: BookListSearchOptions
  ): Promise<ApiResponse<BookListSearchResponse>> {
    const params: Record<string, string | number | boolean> = {};
    if (options.query) params.query = options.query;
    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;
    if (options.created_by) params.created_by = options.created_by;
    if (options.book_count) params.book_count = options.book_count;
    if (options.visibility) params.visibility = options.visibility;
    if (options.sort_by) params.sort_by = options.sort_by;
    if (options.order) params.order = options.order;

    // Gérer les genres séparément
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/search/book-lists`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    if (options.genres) {
      options.genres.forEach((genre) => {
        url.searchParams.append("genres[]", genre);
      });
    }

    return await apiRequest<ApiResponse<BookListSearchResponse>>(
      "GET",
      url.pathname + url.search.replace(process.env.NEXT_PUBLIC_API_URL!, "")
    );
  }

  async searchGeneral(options: SearchOptions): Promise<GeneralSearchResponse> {
    const params: Record<string, string | number | boolean> = {};
    if (options.query) params.query = options.query;
    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;

    return await apiRequest<GeneralSearchResponse>("GET", "/search/general", {
      params,
    });
  }
}

export const searchService = new SearchService();
