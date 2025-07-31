import { ApiResponse } from "./api";
import type { UserProfile } from "./userTypes";

// Types énumérés
export type ClubType = "Public" | "Private";
export type ClubMemberRole = "MEMBER" | "MODERATOR" | "ADMIN" | "OWNER";
export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";
export type ReportReason = "spam" | "harassment" | "inappropriate" | "hate_speech" | "misinformation" | "other";
export type RequestStatus = "pending" | "approved" | "rejected";
export type ReportAction = "resolve" | "dismiss";
export type RequestAction = "approve" | "reject";
export type MediaType = "profile" | "cover" | "post";

// Type principal pour les clubs - structure API réelle
export interface Club {
  id: string;
  name: string;
  description: string;
  type: ClubType;
  genre: string;
  club_picture: string | null;
  member_count: number;
  created_at: string;
  updated_at: string;
  owner: {
    id: string;
    username: string;
  };
  members: Array<{
    id: string;
    username: string;
    email: string;
    role: ClubMemberRole;
    joined_at: string | null;
  }>;
  // Propriétés calculées côté client
  isMember?: boolean;
  currentUserRole?: ClubMemberRole;
}

// Type pour les membres du club - selon l'API réelle (pour autres endpoints)
export interface ClubMember {
  id: string;
  username: string;
  email: string;
  role: ClubMemberRole;
  joined_at: string | null;
  profile_picture: string | null;
}

// Type pour les posts du club
export interface ClubPost {
  id: string;
  title: string;
  subject: string;
  content: string;
  likes_count: string;
  comments_count: string;
  images: Array<{
    id: string;
    url: string;
    thumbnail_url: string;
    width: number;
    height: number;
    size: string;
    mime_type: string;
    original_name: string;
  }>;
  has_images: boolean;
  images_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
    profile_picture_path: string;
  };
  // Legacy fields for backward compatibility
  mediaUrl?: string;
  clubId?: string;
  authorId?: string;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
  author?: UserProfile;
  likesCount?: number;
  commentsCount?: number;
}

// Type pour les messages du club - Structure API réelle
export interface ClubMessage {
  id: string;
  content: string;
  mediaUrl?: string | null;
  isReported: boolean;
  createdAt: string;
  isOwnMessage: boolean; // Fourni par l'API pour savoir si c'est mon message
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  // Propriétés pour compatibilité chat (legacy)
  sender?: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  is_mine?: boolean;
  clubId?: string;
  userId?: string;
  updatedAt?: string;
}

// Type pour les invitations
export interface ClubInvitation {
  id: string;
  clubId: string;
  code: string;
  expiresAt: string;
  usedAt?: string;
  createdAt: string;
  createdBy: string;
  club?: Club;
  creator?: UserProfile;
  // Propriétés calculées/optionnelles
  isUsed?: boolean;
  usedBy?: UserProfile;
  usesCount?: number;
}

// Type pour les demandes d'adhésion
export interface JoinRequest {
  id: string;
  clubId: string;
  userId: string;
  message: string;
  status: RequestStatus;
  reviewMessage?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  user: UserProfile;
  club: Club;
  reviewer?: UserProfile;
}

// Type pour les signalements
export interface Report {
  id: string;
  messageId: string;
  clubId: string;
  reportedBy: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  message: ClubMessage;
  reporter: UserProfile;
  reviewer?: UserProfile;
}

// Type pour les bannissements
export interface ClubBan {
  id: string;
  clubId: string;
  userId: string;
  bannedBy: string;
  reason: string;
  createdAt: string;
  user: UserProfile;
  moderator: UserProfile;
  club: Club;
}

// Type pour les conversations
export interface ClubConversation {
  id: string;
  title: string;
  clubId: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  club: Club;
  creator: UserProfile;
}

// === TYPES POUR LES REQUÊTES ===

// Gestion des clubs
export interface CreateClubRequest {
  name: string;
  description: string;
  type: ClubType;
  genre?: string; // Optionnel selon votre API
  clubPicture?: string; // URL optionnelle de l'image
}

export interface UpdateClubRequest {
  name?: string;
  description?: string;
  genre?: string;
}

// Gestion des membres
export interface ChangeRoleRequest {
  userId: string;
  newRole: ClubMemberRole;
}

export interface BanUserRequest {
  userId: string;
  reason: string;
}

// Gestion des posts
export interface CreatePostRequest {
  title: string;
  subject: string;
  content: string;
  mediaFile?: File;
}

export interface UpdatePostRequest {
  title?: string;
  subject?: string;
  content?: string;
}

// Gestion des messages
export interface SendMessageRequest {
  content: string;
  mediaUrl?: string;
}

// Gestion des invitations
export interface CreateInvitationRequest {
  expiresInDays?: number;
}

// Gestion des demandes d'adhésion
export interface CreateJoinRequestRequest {
  message: string;
}

export interface ReviewJoinRequestRequest {
  action: RequestAction;
  reviewMessage?: string;
}

// Gestion des signalements
export interface CreateReportRequest {
  reason: ReportReason;
  description: string;
}

export interface ReviewReportRequest {
  action: ReportAction;
  reviewNotes?: string;
}

// Gestion des conversations
export interface CreateConversationRequest {
  title: string;
  isPrivate: boolean;
}

// Upload de médias
export interface UploadMediaRequest {
  media: File;
  type: MediaType;
}

// === TYPES POUR LES RÉPONSES ===

// Structure de pagination réelle de l'API
export interface PaginationMeta {
  current_page: number;
  has_more: boolean;
  last_page: number;
  per_page: number;
  total: number;
}

// Structure générique pour les réponses de l'API réelle
export interface ApiPaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Réponses paginées selon l'ancien format (à garder pour compatibilité)
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// Gestion des clubs - Structure réelle
export interface GetClubsResponse {
  clubs: Club[];
  pagination: PaginationMeta;
}

// GetClubResponse retourne directement le Club dans response.data
export type GetClubResponse = Club;

export interface CreateClubResponse {
  id: string;
  name: string;
  description: string;
  type: ClubType;
  genre: string | null;
  club_picture: string | null;
  member_count: number;
  created_at: string;
  updated_at: string;
  owner: {
    id: string;
    username: string;
  } | null;
}

export interface UpdateClubResponse {
  data: Club;
}

// Gestion des membres - Structure réelle de l'API
export interface GetMembersResponse {
  members: ClubMember[];
  pagination: PaginationMeta;
}

export interface JoinClubResponse {
  data: {
    club: Club;
    role: ClubMemberRole;
  };
}

export interface GetBannedUsersResponse extends PaginatedResponse<ClubBan> { }

// Gestion des posts - Structure réelle de l'API  
export interface GetPostsResponse {
  posts: ClubPost[];
  pagination: PaginationMeta;
}

export interface CreatePostResponse {
  data: ClubPost;
}

export interface UpdatePostResponse {
  data: ClubPost;
}

// Gestion des messages - Structure réelle de l'API
export interface GetMessagesResponse {
  messages: ClubMessage[];
  pagination: PaginationMeta;
}

// Réponse d'envoi de message - Structure API réelle
export interface SendMessageResponse {
  id: string;
  content: string;
  mediaUrl?: string | null;
  isReported: boolean;
  createdAt: string;
  isOwnMessage: boolean;
  user: {
    id: string;
    username: string;
    profilePicture?: string;
  };
}

// Gestion des invitations
export interface GetInvitationsResponse extends PaginatedResponse<ClubInvitation> { }

export interface CreateInvitationResponse {
  data: ClubInvitation;
}

export interface JoinByInvitationResponse {
  data: {
    club: Club;
    role: ClubMemberRole;
  };
}

// Gestion des demandes d'adhésion
export interface GetJoinRequestsResponse extends PaginatedResponse<JoinRequest> { }

export interface CreateJoinRequestResponse {
  data: JoinRequest;
}

export interface GetMyJoinRequestsResponse extends PaginatedResponse<JoinRequest> { }

// Gestion des signalements
export interface GetReportsResponse extends PaginatedResponse<Report> { }

export interface CreateReportResponse {
  data: Report;
}

// Gestion des conversations
export interface GetConversationsResponse {
  data: ClubConversation[];
}

export interface CreateConversationResponse {
  data: ClubConversation;
}

// Upload de médias
export interface UploadMediaResponse {
  data: {
    url: string;
    type: MediaType;
  };
}


