import { apiRequest } from "@/lib/api-client";
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
  SearchMyBookListResponse,
  SearchParams,
} from "@/types/bookListTypes";
import type { ApiResponse } from "@/types/api";

class BookListService {
  /**
   * Méthode utilitaire pour gérer les requêtes HTTP via le client centralisé
   */
  private makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    options?: { data?: unknown; params?: Record<string, any> }
  ): Promise<T> {
    return apiRequest<T>(method, endpoint, options);
  }

  // GET /book-lists
  async getBookLists(): Promise<GetBookListsResponse> {
    return this.makeRequest<GetBookListsResponse>("GET", "/book-lists");
  }

  // GET /book-lists/:id
  async getBookList(id: string): Promise<GetBookListResponse> {
    return this.makeRequest<GetBookListResponse>("GET", `/book-lists/${id}`);
  }

  // POST /book-lists
  async createBookList(
    data: CreateBookListRequest
  ): Promise<ApiResponse<CreateBookListResponse>> {
    return this.makeRequest<ApiResponse<CreateBookListResponse>>(
      "POST",
      "/book-lists",
      { data }
    );
  }

  // PUT /book-lists/:id
  async updateBookList(
    id: string,
    data: UpdateBookListRequest
  ): Promise<UpdateBookListResponse> {
    // Créer un FormData si on a une image, sinon JSON
    if (data.coverImage instanceof File) {
      const formData = new FormData();
      formData.append("coverImage", data.coverImage);
      if (data.name) formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.visibility) formData.append("visibility", data.visibility);
      if (data.genre) formData.append("genre", data.genre);

      return this.makeRequest<UpdateBookListResponse>(
        "PUT",
        `/book-lists/${id}`,
        { data: formData }
      );
    } else {
      // Si pas d'image, envoyer en JSON
      const { coverImage, ...jsonData } = data;
      return this.makeRequest<UpdateBookListResponse>(
        "PUT",
        `/book-lists/${id}`,
        { data: jsonData }
      );
    }
  }

  // DELETE /book-lists/:id
  async deleteBookList(id: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>("DELETE", `/book-lists/${id}`);
  }

  // POST /book-lists/:id/books
  async addBookToList(
    listId: string,
    data: AddBookToListRequest
  ): Promise<AddBookToListResponse> {
    return this.makeRequest<AddBookToListResponse>(
      "POST",
      `/book-lists/${listId}/books`,
      { data }
    );
  }

  // DELETE /book-lists/:listId/books/:bookId
  async removeBookFromList(
    listId: string,
    bookId: string
  ): Promise<ApiResponse<RemoveBookFromListResponse>> {
    return this.makeRequest<ApiResponse<RemoveBookFromListResponse>>(
      "DELETE",
      `/book-lists/${listId}/books/${bookId}`
    );
  }

  // PUT /book-lists/:listId/books/:bookId/status
  async updateReadingStatus(
    listId: string,
    bookId: string,
    data: UpdateReadingStatusRequest
  ): Promise<ApiResponse<UpdateReadingStatusResponse>> {
    return this.makeRequest<ApiResponse<UpdateReadingStatusResponse>>(
      "PUT",
      `/book-lists/${listId}/books/${bookId}/status`,
      { data }
    );
  }

  /**
   * Rechercher dans les listes de livres de l'utilisateur
   */
  async searchMyBookLists(
    params: SearchParams
  ): Promise<SearchMyBookListResponse> {
    const queryParams: Record<string, string> = {};
    if (params.query) queryParams.query = params.query;
    if (params.genre) queryParams.genre = params.genre;

    return this.makeRequest<SearchMyBookListResponse>(
      "GET",
      "/book-lists/search",
      { params: queryParams }
    );
  }
}

export const bookListService = new BookListService();
