import { ApiResponse } from "./api";
import type { UserProfile } from "./userTypes";

// Types énumérés
export type ClubType = "Public" | "Private" | "Archived";
export type ClubMemberRole = "owner" | "moderator" | "member";

// Type principal pour les clubs
export interface Club {
  id: string;
  name: string;
  description: string;
  type: ClubType;
  genre: string;
  memberCount: number;
  owner_id: string;
  coverImage: string | null;
  created_at: string;
  updated_at: string;
  owner: UserProfile;
  members: UserProfile[];
}

// Type pour les messages du club
export interface ClubMessage {
  id: string;
  content: string;
  user_id: string;
  club_id: string;
  media_url: string | null;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
}

// Type pour les invitations
export interface ClubInvitation {
  id: string;
  club_id: string;
  code: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
  updated_at: string;
  club?: Club;
}

// Types pour les requêtes
export interface CreateClubRequest {
  name: string;
  description: string;
  type: ClubType;
  genre: string;
  club_picture?: File;
}

export interface UpdateClubRequest extends Partial<CreateClubRequest> {}

export interface SendMessageRequest {
  content: string;
  media?: File;
}

export interface JoinClubRequest {
  invitation_code?: string;
}

// Types pour les réponses
export interface GetClubResponse {
  club: Club;
  current_user_role?: ClubMemberRole;
  is_member: boolean;
}

export interface GetClubsResponse {
  clubs: Club[];
}

export interface CreateClubResponse {
  club: Club;
}

export interface UpdateClubResponse {
  club: Club;
}

export interface GetClubMessagesResponse {
  messages: ClubMessage[];
}

export interface SendMessageResponse {
  message: ClubMessage;
}

export interface GenerateInviteLinkResponse {
  invitation: {
    code: string;
    expires_at: string;
    invitation_link: string;
  };
}

export interface JoinClubResponse {
  club: Club;
  role: ClubMemberRole;
}

// Interface pour le service de clubs
export interface ClubService {
  getClubs(): Promise<ApiResponse<GetClubsResponse>>;
  getClub(id: string): Promise<ApiResponse<GetClubResponse>>;
  createClub(data: CreateClubRequest): Promise<ApiResponse<CreateClubResponse>>;
  updateClub(
    id: string,
    data: UpdateClubRequest
  ): Promise<ApiResponse<UpdateClubResponse>>;
  deleteClub(id: string): Promise<ApiResponse<null>>;
  joinClub(
    id: string,
    data: JoinClubRequest
  ): Promise<ApiResponse<JoinClubResponse>>;
  leaveClub(id: string): Promise<ApiResponse<null>>;
  getMessages(clubId: string): Promise<ApiResponse<GetClubMessagesResponse>>;
  sendMessage(
    clubId: string,
    data: SendMessageRequest
  ): Promise<ApiResponse<SendMessageResponse>>;
  generateInviteLink(
    clubId: string
  ): Promise<ApiResponse<GenerateInviteLinkResponse>>;
  banMember(clubId: string, userId: string): Promise<ApiResponse<null>>;
  reportMessage(messageId: string): Promise<ApiResponse<null>>;
}
