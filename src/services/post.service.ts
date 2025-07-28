import { apiRequest } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import {
  Post,
  UpdatePostRequest,
  GetPostResponse,
  GetPostsResponse,
  UpdatePostResponse,
  ToggleLikeResponse,
  ToggleFavoriteResponse,
  CreateReportRequest,
  QuickReportRequest,
  CreateReportResponse,
  GetReportsResponse,
  ReportStatsResponse,
  ReportType,
  ReportStatus,
  ReportPriority,
} from "@/types/postTypes";
import { AdItem } from "@/types/adTypes";
import { CreatePostFormData } from "@/lib/validations/post";

// Union type for items returned by the feed
export type FeedItem = Post | AdItem;

// Nouveaux types pour la pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: 'created_at' | 'updated_at' | 'likes_count' | 'comments_count';
  orderDirection?: 'desc' | 'asc';
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_more: boolean;
  next_page: number | null;
  prev_page: number | null;
}

export interface GetPostsPaginatedResponse {
  status: string;
  message: string;
  data: {
    posts: FeedItem[];
    pagination: PaginationInfo;
  };
}

// Adaptateur pour transformer les données backend vers frontend
function adaptPostFromBackend(backendPost: any): Post {
  return {
    id: backendPost.id,
    title: backendPost.title,
    subject: backendPost.subject,
    content: backendPost.content,
    userId: backendPost.user_id || "unknown", // fallback si pas d'user_id
    clubId: backendPost.club_id || null,
    likesCount: backendPost.likes_count || 0,
    commentsCount: backendPost.comments_count || 0,
    createdAt: backendPost.created_at,
    updatedAt: backendPost.updated_at,
    // Transformer les images en media
    media: backendPost.images?.map((img: any) => ({
      id: img.id,
      userId: backendPost.user_id || "unknown",
      postId: backendPost.id,
      type: "image" as const,
      url: img.url,
      key: img.id, // fallback
      size: 0, // pas dans la réponse backend
      width: img.width,
      height: img.height,
      thumbnailUrl: img.thumbnail_url,
      mimeType: "image/jpeg", // fallback
      originalName: "", // pas dans la réponse backend
      visibility: "public" as const,
    })) || [],
    // Créer un utilisateur par défaut car le backend ne l'envoie pas
    user: {
      id: backendPost.user_id || "unknown",
      username: "Utilisateur", // placeholder
      requesterUsername: "Utilisateur", // placeholder
      email: "",
      created_at: "",
      is_verified: false,
      profile: {
        id: "",
        first_name: "",
        last_name: "",
        birth_date: "",
        bio: "",
        profile_picture_url: null,
        role: "USER" as const,
        reading_habit: "occasional_reader" as const,
        usage_purpose: "both" as const,
        preferred_genres: [],
        profile_visibility: "public" as const,
        allow_follow_requests: true,
        email_notifications: true,
        push_notifications: true,
        newsletter_subscribed: false,
      },
      stats: {
        followers_count: 0,
        following_count: 0,
      },
    },
  };
}

function adaptAdFromBackend(backendItem: any): AdItem {
  return {
    type: "ad",
    ad: backendItem.ad,
  };
}

class PostService {
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

  async getPosts(params: PaginationParams = {}): Promise<GetPostsPaginatedResponse> {
    const {
      page = 1,
      limit = 20,
      orderBy = 'created_at',
      orderDirection = 'desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      orderBy,
      orderDirection
    });

    const response = await this.makeRequest<any>("GET", `/posts?${queryParams.toString()}`);

    // Adapter les posts du backend vers le format frontend
    const adaptedPosts: FeedItem[] = [];

    if (Array.isArray(response.data?.posts)) {
      for (const item of response.data.posts) {
        if (item.type === "ad") {
          adaptedPosts.push(adaptAdFromBackend(item));
        } else {
          adaptedPosts.push(adaptPostFromBackend(item));
        }
      }
    }

    return {
      status: response.status,
      message: response.message,
      data: {
        posts: adaptedPosts,
        pagination: response.data?.pagination || {
          current_page: page,
          per_page: limit,
          total: 0,
          total_pages: 1,
          has_more: false,
          next_page: null,
          prev_page: null,
        }
      }
    };
  }

  // Méthode dépréciée - garder pour rétrocompatibilité
  async getPostsLegacy(): Promise<GetPostsResponse> {
    console.warn('getPostsLegacy est déprécié, utilisez getPosts() avec pagination');
    const response = await this.getPosts({ limit: 100 });
    // Filtre uniquement les vrais posts, ignore les ads
    const onlyPosts = response.data.posts.filter((p): p is Post => (p as any).subject !== undefined);
    return {
      status: response.status,
      message: response.message,
      data: onlyPosts
    };
  }

  async getPost(id: string): Promise<GetPostResponse> {
    const response = await this.makeRequest<any>("GET", `/posts/${id}`);

    // Adapter le post du backend vers le format frontend
    const adaptedPost = adaptPostFromBackend(response.data);

    return {
      status: response.status,
      message: response.message,
      data: adaptedPost,
    };
  }

  async createPost(data: CreatePostFormData): Promise<GetPostResponse> {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("subject", data.subject);
    formData.append("content", data.content);

    if (data.media && data.media.length > 0) {
      data.media.forEach((file: File) => {
        formData.append("media", file);
      });
    }

    const result = await this.makeRequest<GetPostResponse>("POST", "/posts", {
      data: formData,
    });
    return result;
  }

  async updatePost(
    id: string,
    data: UpdatePostRequest
  ): Promise<ApiResponse<UpdatePostResponse>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "media" && Array.isArray(value)) {
        value.forEach((file: File, index: number) => {
          formData.append(`media[${index}]`, file);
        });
      } else if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    return this.makeRequest<ApiResponse<UpdatePostResponse>>(
      "PATCH",
      `/posts/${id}`,
      { data: formData }
    );
  }

  async deletePost(id: string): Promise<void> {
    await this.makeRequest<void>("DELETE", `/posts/${id}`);
  }

  async toggleLike(id: string): Promise<ApiResponse<ToggleLikeResponse>> {
    return this.makeRequest<ApiResponse<ToggleLikeResponse>>(
      "POST",
      `/posts/${id}/like`
    );
  }

  async toggleFavorite(
    id: string
  ): Promise<ApiResponse<ToggleFavoriteResponse>> {
    return this.makeRequest<ApiResponse<ToggleFavoriteResponse>>(
      "POST",
      `/posts/${id}/favorite`
    );
  }

  // ========== SYSTÈME DE SIGNALEMENT ==========

  /**
   * Créer un signalement de post
   */
  async createReport(data: CreateReportRequest): Promise<CreateReportResponse> {
    return this.makeRequest<CreateReportResponse>("POST", "/posts/reports", {
      data,
    });
  }

  /**
   * Signalement rapide pour mobile
   */
  async quickReport(postId: string, data: QuickReportRequest): Promise<CreateReportResponse> {
    return this.makeRequest<CreateReportResponse>("POST", `/posts/${postId}/quick-report`, {
      data,
    });
  }

  /**
   * Obtenir mes signalements
   */
  async getMyReports(): Promise<GetReportsResponse> {
    return this.makeRequest<GetReportsResponse>("GET", "/posts/reports/my-reports");
  }

  // ========== MÉTHODES POUR MODÉRATEURS/ADMINS ==========

  /**
   * Lister tous les signalements (modérateurs/admins)
   */
  async getReports(params?: {
    page?: number;
    limit?: number;
    status?: ReportStatus;
    reportType?: ReportType;
    priority?: ReportPriority;
    orderBy?: 'reported_at' | 'updated_at' | 'priority';
    orderDirection?: 'desc' | 'asc';
  }): Promise<GetReportsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.reportType) queryParams.append('reportType', params.reportType);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.orderBy) queryParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) queryParams.append('orderDirection', params.orderDirection);

    const query = queryParams.toString();
    return this.makeRequest<GetReportsResponse>("GET", `/admin/reports${query ? '?' + query : ''}`);
  }

  /**
   * Obtenir les détails d'un signalement
   */
  async getReport(id: string): Promise<{
    status: string;
    message: string;
    data: { report: any };
  }> {
    return this.makeRequest<{
      status: string;
      message: string;
      data: { report: any };
    }>("GET", `/admin/reports/${id}`);
  }

  /**
   * Prendre en charge un signalement
   */
  async takeReportInReview(id: string): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>("POST", `/admin/reports/${id}/take-review`);
  }

  /**
   * Résoudre un signalement
   */
  async resolveReport(id: string, data: {
    actionTaken: string;
    resolutionNotes?: string;
  }): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>("POST", `/admin/reports/${id}/resolve`, {
      data,
    });
  }

  /**
   * Rejeter un signalement
   */
  async dismissReport(id: string, data: {
    reason: string;
  }): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>("POST", `/admin/reports/${id}/dismiss`, {
      data,
    });
  }

  /**
   * Escalader un signalement
   */
  async escalateReport(id: string, data: {
    adminNotes: string;
  }): Promise<ApiResponse<null>> {
    return this.makeRequest<ApiResponse<null>>("POST", `/admin/reports/${id}/escalate`, {
      data,
    });
  }

  /**
   * Obtenir les statistiques des signalements
   */
  async getReportStats(): Promise<ReportStatsResponse> {
    return this.makeRequest<ReportStatsResponse>("GET", "/admin/reports/stats");
  }

  // ========== MÉTHODE LEGACY (pour compatibilité) ==========

  /**
 * @deprecated Utilisez createReport() à la place
 */
  async reportPost(id: string, reason: string): Promise<ApiResponse<null>> {
    console.warn('reportPost() est déprécié, utilisez createReport()');
    const response = await this.createReport({
      postId: id,
      reportType: 'other',
      description: reason,
    });

    // Adapter la réponse au format attendu
    return {
      status: response.status === 'success' ? 'success' : 'error',
      message: response.message,
      data: null,
    };
  }
}

export const postService = new PostService();
