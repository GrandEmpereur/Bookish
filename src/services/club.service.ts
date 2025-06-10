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

    return await apiRequest<ApiResponse<GetClubsResponse>>("GET", "/clubs", {
      params,
    });
  }

  async getClub(id: string): Promise<ApiResponse<GetClubResponse>> {
    return await apiRequest<ApiResponse<GetClubResponse>>(
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

    return await apiRequest<ApiResponse<CreateClubResponse>>("POST", "/clubs", {
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

    return await apiRequest<ApiResponse<UpdateClubResponse>>(
      "PATCH",
      `/clubs/${id}`,
      { data: formData }
    );
  }

  async deleteClub(id: string): Promise<ApiResponse<null>> {
    return await apiRequest<ApiResponse<null>>("DELETE", `/clubs/${id}`);
  }

  async getMessages(
    clubId: string,
    page = 1
  ): Promise<ApiResponse<GetClubMessagesResponse>> {
    return await apiRequest<ApiResponse<GetClubMessagesResponse>>(
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

    return await apiRequest<ApiResponse<SendMessageResponse>>(
      "POST",
      `/clubs/${clubId}/messages`,
      { data: formData }
    );
  }

  async joinClub(
    id: string,
    data: JoinClubRequest
  ): Promise<ApiResponse<JoinClubResponse>> {
    return await apiRequest<ApiResponse<JoinClubResponse>>(
      "POST",
      `/clubs/${id}/join`,
      { data }
    );
  }

  async leaveClub(id: string): Promise<ApiResponse<null>> {
    return await apiRequest<ApiResponse<null>>("POST", `/clubs/${id}/leave`);
  }

  async generateInviteLink(
    clubId: string
  ): Promise<ApiResponse<GenerateInviteLinkResponse>> {
    return await apiRequest<ApiResponse<GenerateInviteLinkResponse>>(
      "POST",
      `/clubs/${clubId}/invite`
    );
  }

  async banMember(clubId: string, userId: string): Promise<ApiResponse<null>> {
    return await apiRequest<ApiResponse<null>>(
      "POST",
      `/clubs/${clubId}/ban/${userId}`
    );
  }

  async reportMessage(messageId: string): Promise<ApiResponse<null>> {
    return await apiRequest<ApiResponse<null>>(
      "POST",
      `/clubs/messages/${messageId}/report`
    );
  }
}

export const clubService = new ClubService();
