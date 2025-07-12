import { apiRequest } from "@/lib/api-client";
import type { Author } from "@/types/authorTypes";
import type { ApiResponse } from "@/types/api";

class AuthorService {
  async getAuthors(): Promise<ApiResponse<Author[]>> {
    return apiRequest<ApiResponse<Author[]>>("GET", "/authors");
  }

  async getAuthor(id: string): Promise<ApiResponse<Author>> {
    return apiRequest<ApiResponse<Author>>("GET", `/authors/${id}`);
  }
}

export const authorService = new AuthorService();
