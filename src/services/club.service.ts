import { apiRequest } from "@/lib/api-client";
import {
  Club,
  ClubType,
  ClubMemberRole,
  CreateClubRequest,
  UpdateClubRequest,
  SendMessageRequest,
  JoinClubRequest,
  GetClubResponse,
  GetClubsResponse,
  CreateClubResponse,
  UpdateClubResponse,
  GetClubMessagesResponse,
  SendMessageResponse,
  GenerateInviteLinkResponse,
  JoinClubResponse,
} from "@/types/clubTypes";
import { ApiResponse } from "@/types/api";

class ClubService {
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

  async getClubs(options?: {
    page?: number;
    limit?: number;
    type?: ClubType;
    genre?: string;
    search?: string;
  }): Promise<ApiResponse<GetClubsResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.limit) params.limit = options.limit;
    if (options?.type) params.type = options.type;
    if (options?.genre) params.genre = options.genre;
    if (options?.search) params.search = options.search;

    return this.makeRequest<ApiResponse<GetClubsResponse>>("GET", "/clubs", {
      params,
    });
  }

  async getClub(id: string): Promise<ApiResponse<GetClubResponse>> {
    return this.makeRequest<ApiResponse<GetClubResponse>>(
      "GET",
      `/clubs/${id}`
    );
  }

  async createClub(
    data: CreateClubRequest
  ): Promise<ApiResponse<CreateClubResponse>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "club_picture" && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    return this.makeRequest<ApiResponse<CreateClubResponse>>("POST", "/clubs", {
      data: formData,
    });
  }

  async updateClub(
    id: string,
    data: UpdateClubRequest
  ): Promise<ApiResponse<UpdateClubResponse>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "club_picture" && value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    return this.makeRequest<ApiResponse<UpdateClubResponse>>(
      "PATCH",
      `/clubs/${id}`,
      { data: formData }
    );
  }

  async deleteClub(id: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>("DELETE", `/clubs/${id}`);
  }

  async getMessages(
    clubId: string,
    page = 1
  ): Promise<ApiResponse<GetClubMessagesResponse>> {
    return this.makeRequest<ApiResponse<GetClubMessagesResponse>>(
      "GET",
      `/clubs/${clubId}/messages`,
      { params: { page } }
    );
  }

  async sendMessage(
    clubId: string,
    data: SendMessageRequest
  ): Promise<ApiResponse<SendMessageResponse>> {
    const formData = new FormData();
    formData.append("content", data.content);
    if (data.media) {
      formData.append("media", data.media);
    }

    return this.makeRequest<ApiResponse<SendMessageResponse>>(
      "POST",
      `/clubs/${clubId}/messages`,
      { data: formData }
    );
  }

  async joinClub(
    id: string,
    data: JoinClubRequest
  ): Promise<ApiResponse<JoinClubResponse>> {
    return this.makeRequest<ApiResponse<JoinClubResponse>>(
      "POST",
      `/clubs/${id}/join`,
      { data }
    );
  }

  async leaveClub(id: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>("POST", `/clubs/${id}/leave`);
  }

  async generateInviteLink(
    clubId: string
  ): Promise<ApiResponse<GenerateInviteLinkResponse>> {
    return this.makeRequest<ApiResponse<GenerateInviteLinkResponse>>(
      "POST",
      `/clubs/${clubId}/invite`
    );
  }

  async banMember(clubId: string, userId: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "POST",
      `/clubs/${clubId}/ban/${userId}`
    );
  }

  async reportMessage(messageId: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "POST",
      `/clubs/messages/${messageId}/report`
    );
  }
}

export const clubService = new ClubService();
