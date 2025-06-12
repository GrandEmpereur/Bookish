import { apiRequest } from "@/lib/api-client";
import {
  UserSearchOptions,
  BookSearchOptions,
  ClubSearchOptions,
  BookListSearchOptions,
  CategorySearchOptions,
  ProfessionalSearchOptions,
  UserSearchResponse,
  BookSearchResponse,
  ClubSearchResponse,
  BookListSearchResponse,
  CategorySearchResponse,
  ProfessionalSearchResponse,
  GeneralSearchResponse,
  SearchOptions,
} from "@/types/searchTypes";

const API_ENDPOINTS = {
  search: {
    users: "/search/users",
    books: "/search/books",
    clubs: "/search/clubs",
    bookLists: "/search/book-lists",
    category: "/search/category",
    professionals: "/search/professionals",
    general: "/search/general"
  }
};

class SearchService {
  private buildSearchParams(options: any): URLSearchParams {
    const params = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(`${key}[]`, String(item)));
        } else {
          params.append(key, String(value));
        }
      }
    });

    return params;
  }

  async searchUsers(options: UserSearchOptions): Promise<UserSearchResponse> {
    const params = this.buildSearchParams(options);
    const url = `${API_ENDPOINTS.search.users}?${params.toString()}`;

    const result = await apiRequest<UserSearchResponse>("GET", url);
    return result;
  }

  async searchBooks(options: BookSearchOptions): Promise<BookSearchResponse> {
    const params = this.buildSearchParams(options);
    const url = `${API_ENDPOINTS.search.books}?${params.toString()}`;

    const result = await apiRequest<BookSearchResponse>("GET", url);
    return result;
  }

  async searchClubs(options: ClubSearchOptions): Promise<ClubSearchResponse> {
    const params = this.buildSearchParams(options);
    const url = `${API_ENDPOINTS.search.clubs}?${params.toString()}`;

    const result = await apiRequest<ClubSearchResponse>("GET", url);
    return result;
  }

  async searchBookLists(options: BookListSearchOptions): Promise<BookListSearchResponse> {
    const params = this.buildSearchParams(options);
    const url = `${API_ENDPOINTS.search.bookLists}?${params.toString()}`;

    const result = await apiRequest<BookListSearchResponse>("GET", url);
    return result;
  }

  async searchByCategory(options: CategorySearchOptions): Promise<CategorySearchResponse> {
    const params = this.buildSearchParams(options);
    const url = `${API_ENDPOINTS.search.category}?${params.toString()}`;

    const result = await apiRequest<CategorySearchResponse>("GET", url);
    return result;
  }

  async searchProfessionals(options: ProfessionalSearchOptions): Promise<ProfessionalSearchResponse> {
    const params = this.buildSearchParams(options);
    const url = `${API_ENDPOINTS.search.professionals}?${params.toString()}`;

    const result = await apiRequest<ProfessionalSearchResponse>("GET", url);
    return result;
  }

  async searchGeneral(options: SearchOptions): Promise<GeneralSearchResponse> {
    const params = this.buildSearchParams(options);
    const url = `${API_ENDPOINTS.search.general}?${params.toString()}`;

    const result = await apiRequest<GeneralSearchResponse>("GET", url);
    return result;
  }
}

export const searchService = new SearchService();
