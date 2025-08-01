import { ApiResponse } from "./api";
import type { UserProfile } from "./userTypes";

// Types pour les sujets de posts
export type PostSubject =
  | "book_review"
  | "book_recommendation"
  | "reading_progress"
  | "book_discussion"
  | "author_spotlight"
  | "reading_challenge"
  | "book_quote"
  | "book_collection"
  | "reading_list"
  | "literary_event";

// Type principal pour les posts
export interface Post {
  id: string;
  title: string;
  subject: PostSubject;
  content: string;
  userId: string;
  clubId?: string | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  user: UserProfile;
  media?: Media[];
}

// Type pour les médias
export interface Media {
  id: string;
  userId: string;
  postId: string | null;
  type: "image" | "video";
  url: string;
  key: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  thumbnailKey?: string;
  signedUrl?: string;
  mimeType: string;
  originalName: string;
  visibility: "public" | "private";
}

// Type pour les commentaires
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  repliesCount: number;
  replies?: Array<{
    id: string;
    content: string;
    createdAt: string;
    likesCount: number;
    user: {
      id: string;
      username: string;
      profilePicture?: string;
    };
  }>;
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
}

// Type pour les likes
export interface Like {
  id: string;
  user_id: string;
  post_id: string | null;
  comment_id: string | null;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
}

// Types pour les requêtes
export interface CreatePostRequest {
  title: string;
  subject: PostSubject;
  content: string;
  media?: File[];
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {}

export interface CreateCommentRequest {
  content: string;
  parent_comment_id?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

// Types pour les réponses
export interface GetPostsResponse {
  status: string;
  message: string;
  data: Post[];
}

export interface GetPostResponse {
  status: string;
  message: string;
  data: Post;
}

export interface CreatePostResponse {
  post: Post;
}

export interface UpdatePostResponse {
  post: Post;
}

export interface GetCommentsResponse {
  status: string;
  message: string;
  data: Comment[];
}

export interface CreateCommentResponse {
  status: string;
  message: string;
  data: {
    comment: Comment;
    post: {
      id: string;
      title: string;
      subject: PostSubject;
      commentsCount: number;
    };
    user: {
      id: string;
      username: string;
    };
  };
}

export interface UpdateCommentResponse {
  status: string;
  message: string;
  data: {
    comment: Comment;
    user: {
      id: string;
      username: string;
    };
  };
}

export interface ToggleLikeResponse {
  status: string;
  message: string;
  data: {
    commentId: string;
    isLiked: boolean;
    likesCount: number;
    user: {
      id: string;
      username: string;
    };
  };
}

export interface ToggleFavoriteResponse {
  status: string;
  message: string;
  data: {
    postId: string;
    isFavorited: boolean;
  };
}

// Interface pour le service de posts
export interface PostService {
  getPosts(): Promise<ApiResponse<GetPostsResponse>>;
  getPost(id: string): Promise<ApiResponse<GetPostResponse>>;
  createPost(data: CreatePostRequest): Promise<ApiResponse<CreatePostResponse>>;
  updatePost(
    id: string,
    data: UpdatePostRequest
  ): Promise<ApiResponse<UpdatePostResponse>>;
  deletePost(id: string): Promise<ApiResponse<null>>;
  getComments(postId: string): Promise<ApiResponse<GetCommentsResponse>>;
  createComment(
    postId: string,
    data: CreateCommentRequest
  ): Promise<ApiResponse<CreateCommentResponse>>;
  updateComment(
    commentId: string,
    data: UpdateCommentRequest
  ): Promise<ApiResponse<UpdateCommentResponse>>;
  deleteComment(commentId: string): Promise<ApiResponse<null>>;
  toggleLike(postId: string): Promise<ApiResponse<ToggleLikeResponse>>;
  toggleCommentLike(
    commentId: string
  ): Promise<ApiResponse<ToggleLikeResponse>>;
  toggleFavorite(postId: string): Promise<ApiResponse<ToggleFavoriteResponse>>;
}

// Mise à jour de l'interface pour la réponse de reply
export interface ReplyCommentResponse {
  status: string;
  message: string;
  data: {
    reply: Comment;
    user: {
      id: string;
      username: string;
    };
  };
}

// Types pour le système de signalement
export type ReportType =
  | "spam"
  | "harassment"
  | "hate_speech"
  | "inappropriate"
  | "violence"
  | "misinformation"
  | "copyright"
  | "privacy"
  | "other";

export type ReportStatus =
  | "pending"
  | "in_review"
  | "resolved"
  | "dismissed"
  | "escalated";

export type ActionTaken =
  | "none"
  | "warning"
  | "post_removed"
  | "post_edited"
  | "user_suspended"
  | "user_banned"
  | "other";

export type ReportPriority = "low" | "medium" | "high" | "critical";

export interface PostReport {
  id: string;
  post_id: string;
  reported_by: string;
  reviewed_by?: string;
  report_type: ReportType;
  description?: string;
  additional_context?: string;
  status: ReportStatus;
  action_taken?: ActionTaken;
  admin_notes?: string;
  resolution_notes?: string;
  priority: ReportPriority;
  user_agent?: string;
  ip_address?: string;
  metadata?: Record<string, any>;
  reported_at: string;
  reviewed_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  post?: Post;
  reporter?: UserProfile;
  reviewer?: UserProfile;
}

// Requêtes pour le signalement
export interface CreateReportRequest {
  postId: string;
  reportType: ReportType;
  description?: string;
  additionalContext?: string;
}

export interface QuickReportRequest {
  reportType: ReportType;
  description?: string;
}

// Réponses pour le signalement
export interface CreateReportResponse {
  status: string;
  message: string;
  data: {
    report: PostReport;
  };
}

export interface GetReportsResponse {
  status: string;
  message: string;
  data: {
    reports: PostReport[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
      has_more: boolean;
      next_page: number | null;
      prev_page: number | null;
    };
  };
}

export interface ReportStatsResponse {
  status: string;
  message: string;
  data: {
    total: number;
    by_status: Record<ReportStatus, number>;
    by_type: Record<ReportType, number>;
    by_priority: Record<ReportPriority, number>;
  };
}
