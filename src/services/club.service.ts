import { apiRequest } from "@/lib/api-client";
import {
  // Types de base
  Club,
  ClubType,
  ClubMemberRole,
  ClubPost,
  ClubMessage,
  ClubInvitation,
  JoinRequest,
  Report,
  ClubBan,
  ClubConversation,
  ClubMember,
  ReportStatus,
  RequestStatus,

  // Types de requêtes
  CreateClubRequest,
  UpdateClubRequest,
  ChangeRoleRequest,
  BanUserRequest,
  CreatePostRequest,
  UpdatePostRequest,
  SendMessageRequest,
  CreateInvitationRequest,
  CreateJoinRequestRequest,
  ReviewJoinRequestRequest,
  CreateReportRequest,
  ReviewReportRequest,
  CreateConversationRequest,
  UploadMediaRequest,

  // Types de réponses
  GetClubsResponse,
  GetClubResponse,
  CreateClubResponse,
  UpdateClubResponse,
  GetMembersResponse,
  JoinClubResponse,
  GetBannedUsersResponse,
  GetPostsResponse,
  CreatePostResponse,
  UpdatePostResponse,
  GetMessagesResponse,
  SendMessageResponse,
  GetInvitationsResponse,
  CreateInvitationResponse,
  JoinByInvitationResponse,
  GetJoinRequestsResponse,
  CreateJoinRequestResponse,
  GetMyJoinRequestsResponse,
  GetReportsResponse,
  CreateReportResponse,
  GetConversationsResponse,
  CreateConversationResponse,
  UploadMediaResponse,
} from "@/types/clubTypes";
import { ApiResponse } from "@/types/api";

export class ClubService {
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

  // ========================================
  // 🏠 GESTION DES CLUBS
  // ========================================

  /**
   * 📋 Lister tous les clubs
   */
  async getClubs(options?: {
    page?: number;
    perPage?: number;
  }): Promise<ApiResponse<GetClubsResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.perPage) params.perPage = options.perPage;

    return this.makeRequest<ApiResponse<GetClubsResponse>>("GET", "/clubs", {
      params,
    });
  }

  /**
   * 📖 Détails d'un club
   */
  async getClub(id: string): Promise<ApiResponse<GetClubResponse>> {
    return this.makeRequest<ApiResponse<GetClubResponse>>(
      "GET",
      `/clubs/${id}`
    );
  }

  /**
   * 🏛️ Créer un club
   */
  async createClub(
    data: CreateClubRequest
  ): Promise<ApiResponse<CreateClubResponse>> {
    return this.makeRequest<ApiResponse<CreateClubResponse>>("POST", "/clubs", {
      data,
    });
  }

  /**
   * 🏛️ Créer un club avec média (image de couverture)
   */
  async createClubWithMedia(
    formData: FormData
  ): Promise<ApiResponse<CreateClubResponse>> {
    return this.makeRequest<ApiResponse<CreateClubResponse>>("POST", "/clubs", {
      data: formData,
    });
  }

  /**
   * ✏️ Modifier un club
   */
  async updateClub(
    id: string,
    data: UpdateClubRequest
  ): Promise<ApiResponse<UpdateClubResponse>> {
    return this.makeRequest<ApiResponse<UpdateClubResponse>>(
      "PATCH",
      `/clubs/${id}`,
      { data }
    );
  }

  /**
   * 🗑️ Supprimer un club
   */
  async deleteClub(id: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>("DELETE", `/clubs/${id}`);
  }

  // ========================================
  // 👥 GESTION DES MEMBRES
  // ========================================

  /**
   * 👥 Liste des membres
   */
  async getMembers(
    clubId: string,
    options?: { page?: number; perPage?: number }
  ): Promise<ApiResponse<GetMembersResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.perPage) params.perPage = options.perPage;

    return this.makeRequest<ApiResponse<GetMembersResponse>>(
      "GET",
      `/clubs/${clubId}/members`,
      { params }
    );
  }

  /**
   * ➕ Rejoindre un club (public)
   */
  async joinClub(clubId: string): Promise<ApiResponse<JoinClubResponse>> {
    return this.makeRequest<ApiResponse<JoinClubResponse>>(
      "POST",
      `/clubs/${clubId}/join`
    );
  }

  /**
   * ➖ Quitter un club
   */
  async leaveClub(clubId: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "POST",
      `/clubs/${clubId}/leave`
    );
  }

  /**
   * 🎭 Changer le rôle d'un membre
   */
  async changeRole(
    clubId: string,
    data: ChangeRoleRequest
  ): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "PATCH",
      `/clubs/${clubId}/members/role`,
      { data }
    );
  }

  // ========================================
  // 🚫 MODÉRATION & BANNISSEMENT
  // ========================================

  /**
   * 🔨 Bannir un utilisateur
   */
  async banUser(
    clubId: string,
    data: BanUserRequest
  ): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>("POST", `/clubs/${clubId}/ban`, {
      data,
    });
  }

  /**
   * ✅ Débannir un utilisateur
   */
  async unbanUser(clubId: string, userId: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "DELETE",
      `/clubs/${clubId}/ban/${userId}`
    );
  }

  /**
   * 📋 Liste des utilisateurs bannis
   */
  async getBannedUsers(
    clubId: string
  ): Promise<ApiResponse<GetBannedUsersResponse>> {
    return this.makeRequest<ApiResponse<GetBannedUsersResponse>>(
      "GET",
      `/clubs/${clubId}/banned`
    );
  }

  // ========================================
  // 📝 GESTION DES POSTS
  // ========================================

  /**
   * 📄 Liste des posts
   */
  async getPosts(
    clubId: string,
    options?: { page?: number; perPage?: number }
  ): Promise<ApiResponse<GetPostsResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.perPage) params.perPage = options.perPage;

    return this.makeRequest<ApiResponse<GetPostsResponse>>(
      "GET",
      `/clubs/${clubId}/posts`,
      { params }
    );
  }

  /**
   * ➕ Créer un post
   */
  async createPost(
    clubId: string,
    data: CreatePostRequest
  ): Promise<ApiResponse<CreatePostResponse>> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("subject", data.subject);
    formData.append("content", data.content);
    if (data.mediaFile) {
      formData.append("mediaFile", data.mediaFile);
    }

    return this.makeRequest<ApiResponse<CreatePostResponse>>(
      "POST",
      `/clubs/${clubId}/posts`,
      { data: formData }
    );
  }

  /**
   * ✏️ Modifier un post
   */
  async updatePost(
    clubId: string,
    postId: string,
    data: UpdatePostRequest
  ): Promise<ApiResponse<UpdatePostResponse>> {
    return this.makeRequest<ApiResponse<UpdatePostResponse>>(
      "PUT",
      `/clubs/${clubId}/posts/${postId}`,
      { data }
    );
  }

  /**
   * 🗑️ Supprimer un post
   */
  async deletePost(clubId: string, postId: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "DELETE",
      `/clubs/${clubId}/posts/${postId}`
    );
  }

  /**
   * 📌 Épingler/Désépingler un post
   */
  async togglePinPost(
    clubId: string,
    postId: string
  ): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "POST",
      `/clubs/${clubId}/posts/${postId}/pin`
    );
  }

  // ========================================
  // 💬 CHAT & MESSAGES
  // ========================================

  /**
   * 💬 Liste des messages
   */
  async getMessages(
    clubId: string,
    options?: { page?: number; perPage?: number }
  ): Promise<ApiResponse<GetMessagesResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.perPage) params.perPage = options.perPage;

    return this.makeRequest<ApiResponse<GetMessagesResponse>>(
      "GET",
      `/clubs/${clubId}/messages`,
      { params }
    );
  }

  /**
   * 📤 Envoyer un message
   */
  async sendMessage(
    clubId: string,
    data: SendMessageRequest
  ): Promise<ApiResponse<SendMessageResponse>> {
    return this.makeRequest<ApiResponse<SendMessageResponse>>(
      "POST",
      `/clubs/${clubId}/messages`,
      { data }
    );
  }

  /**
   * 🗑️ Supprimer un message
   */
  async deleteMessage(
    clubId: string,
    messageId: string
  ): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "DELETE",
      `/clubs/${clubId}/messages/${messageId}`
    );
  }

  // ========================================
  // 🚨 SYSTÈME DE SIGNALEMENT
  // ========================================

  /**
   * 🚨 Signaler un message
   */
  async reportMessage(
    clubId: string,
    messageId: string,
    data: CreateReportRequest
  ): Promise<ApiResponse<CreateReportResponse>> {
    return this.makeRequest<ApiResponse<CreateReportResponse>>(
      "POST",
      `/clubs/${clubId}/messages/${messageId}/report`,
      { data }
    );
  }

  /**
   * 📋 Liste des signalements (modérateurs)
   */
  async getReports(
    clubId: string,
    options?: { status?: ReportStatus; page?: number; perPage?: number }
  ): Promise<ApiResponse<GetReportsResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.status) params.status = options.status;
    if (options?.page) params.page = options.page;
    if (options?.perPage) params.perPage = options.perPage;

    return this.makeRequest<ApiResponse<GetReportsResponse>>(
      "GET",
      `/clubs/${clubId}/reports`,
      { params }
    );
  }

  /**
   * ✅ Résoudre un signalement
   */
  async reviewReport(
    clubId: string,
    reportId: string,
    data: ReviewReportRequest
  ): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "PUT",
      `/clubs/${clubId}/reports/${reportId}`,
      { data }
    );
  }

  // ========================================
  // 🎫 SYSTÈME D'INVITATIONS
  // ========================================

  /**
   * 🎫 Créer une invitation
   */
  async createInvitation(
    clubId: string,
    data?: CreateInvitationRequest
  ): Promise<ApiResponse<CreateInvitationResponse>> {
    return this.makeRequest<ApiResponse<CreateInvitationResponse>>(
      "POST",
      `/clubs/${clubId}/invitations`,
      { data: data || {} }
    );
  }

  /**
   * 📩 Envoyer invitation personnalisée
   */
  async sendInvitation(
    clubId: string,
    data: { userIdentifier: string; expiresInDays?: number }
  ): Promise<ApiResponse<CreateInvitationResponse>> {
    return this.makeRequest<ApiResponse<CreateInvitationResponse>>(
      "POST",
      `/clubs/${clubId}/invitations/send`,
      { data }
    );
  }

  /**
   * 🔗 Rejoindre par code d'invitation
   */
  async joinByInvitation(
    invitationCode: string
  ): Promise<ApiResponse<JoinByInvitationResponse>> {
    return this.makeRequest<ApiResponse<JoinByInvitationResponse>>(
      "GET",
      `/clubs/join/${invitationCode}`
    );
  }

  /**
   * 📋 Liste des invitations
   */
  async getInvitations(
    clubId: string,
    options?: { page?: number; perPage?: number }
  ): Promise<ApiResponse<GetInvitationsResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.perPage) params.perPage = options.perPage;

    return this.makeRequest<ApiResponse<GetInvitationsResponse>>(
      "GET",
      `/clubs/${clubId}/invitations`,
      { params }
    );
  }

  /**
   * 🗑️ Supprimer une invitation
   */
  async deleteInvitation(
    clubId: string,
    invitationId: string
  ): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "DELETE",
      `/clubs/${clubId}/invitations/${invitationId}`
    );
  }

  // ========================================
  // 🔒 CLUBS PRIVÉS & DEMANDES
  // ========================================

  /**
   * 📝 Créer demande d'adhésion
   */
  async createJoinRequest(
    clubId: string,
    data: CreateJoinRequestRequest
  ): Promise<ApiResponse<CreateJoinRequestResponse>> {
    return this.makeRequest<ApiResponse<CreateJoinRequestResponse>>(
      "POST",
      `/clubs/${clubId}/requests`,
      { data }
    );
  }

  /**
   * 📋 Liste demandes du club
   */
  async getJoinRequests(
    clubId: string,
    options?: { page?: number; perPage?: number; status?: RequestStatus }
  ): Promise<ApiResponse<GetJoinRequestsResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.perPage) params.perPage = options.perPage;
    if (options?.status) params.status = options.status;

    return this.makeRequest<ApiResponse<GetJoinRequestsResponse>>(
      "GET",
      `/clubs/${clubId}/requests`,
      { params }
    );
  }

  /**
   * ✅ Approuver/Rejeter demande
   */
  async reviewJoinRequest(
    clubId: string,
    requestId: string,
    data: ReviewJoinRequestRequest
  ): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "PUT",
      `/clubs/${clubId}/requests/${requestId}`,
      { data }
    );
  }

  /**
   * 👤 Mes demandes d'adhésion
   */
  async getMyJoinRequests(options?: {
    page?: number;
    perPage?: number;
  }): Promise<ApiResponse<GetMyJoinRequestsResponse>> {
    const params: Record<string, string | number> = {};
    if (options?.page) params.page = options.page;
    if (options?.perPage) params.perPage = options.perPage;

    return this.makeRequest<ApiResponse<GetMyJoinRequestsResponse>>(
      "GET",
      `/users/join-requests`,
      { params }
    );
  }

  /**
   * 🗑️ Annuler demande
   */
  async cancelJoinRequest(requestId: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>(
      "DELETE",
      `/users/join-requests/${requestId}`
    );
  }

  // ========================================
  // 💬 CONVERSATIONS
  // ========================================

  /**
   * 📋 Liste des conversations
   */
  async getConversations(
    clubId: string
  ): Promise<ApiResponse<GetConversationsResponse>> {
    return this.makeRequest<ApiResponse<GetConversationsResponse>>(
      "GET",
      `/clubs/${clubId}/conversations`
    );
  }

  /**
   * ➕ Créer une conversation
   */
  async createConversation(
    clubId: string,
    data: CreateConversationRequest
  ): Promise<ApiResponse<CreateConversationResponse>> {
    return this.makeRequest<ApiResponse<CreateConversationResponse>>(
      "POST",
      `/clubs/${clubId}/conversations`,
      { data }
    );
  }

  // ========================================
  // 📎 MÉDIAS
  // ========================================

  /**
   * 📤 Upload média
   */
  async uploadMedia(
    clubId: string,
    data: UploadMediaRequest
  ): Promise<ApiResponse<UploadMediaResponse>> {
    const formData = new FormData();
    formData.append("media", data.media);
    formData.append("type", data.type);

    return this.makeRequest<ApiResponse<UploadMediaResponse>>(
      "POST",
      `/clubs/${clubId}/media`,
      { data: formData }
    );
  }
}

export const clubService = new ClubService();
