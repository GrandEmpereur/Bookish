import { ApiResponse } from "./api";

// Types énumérés

export type UserRole = 'USER' | 'AUTHOR' | 'PUBLISHER' | 'PUBLISHERHOUSE' | 'MODERATOR' | 'ADMIN';
export type ReadingHabit = 'library_rat' | 'occasional_reader' | 'beginner_reader';
export type UsagePurpose = 'find_books' | 'find_community' | 'both' | 'créer_compte_professionel';
export type ProfileVisibility = 'public' | 'private' | 'friends_only';
export type RelationType = 'follow' | 'friend' | 'block';
export type RelationStatus = 'accepted' | 'declined' | 'pending';


// Types de base - Structure réelle de l'objet user
export interface UserProfile {
  id: string;
  username: string;
  requesterUsername: string;
  email: string;
  created_at: string;
  is_verified: boolean;
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    bio: string;
    profile_picture_url: string | null;
    role: UserRole;
    reading_habit: ReadingHabit;
    usage_purpose: UsagePurpose;
    preferred_genres: string[];
    profile_visibility: ProfileVisibility;
    allow_follow_requests: boolean;
    email_notifications: boolean;
    push_notifications: boolean;
    newsletter_subscribed: boolean;
  };
  stats: {
    followers_count: number;
    following_count: number;
  };
  // Structure imbriquée pour correspondre à la vraie structure
  user?: {
    id: string;
    username: string;
    email: string;
  };
}
export interface UserRelations {
  followers: {
    count: number;
    list: Array<{
      id: string;
      username: string;
      profile: {
        firstName: string | null;
        lastName: string | null;
        fullName: string;
        profilePictureUrl: string | null;
      } | null;
      following_since?: string;
    }>;
  };
  following: {
    count: number;
    list: Array<{
      id: string;
      username: string;
      profile: {
        firstName: string | null;
        lastName: string | null;
        fullName: string;
        profilePictureUrl: string | null;
      } | null;
      following_since?: string;
    }>;
  };
  friends: {
    count: number;
    list: Array<{
      id: string;
      username: string;
      profile: {
        firstName: string | null;
        lastName: string | null;
        fullName: string;
        profilePictureUrl: string | null;
      } | null;
      friends_since?: string;
    }>;
  };
  blocked: {
    count: number;
    list: Array<{
      id: string;
      username: string;
    }>;
  };
  pending_friend_requests: {
    count: number;
    list: any[]; // à adapter si besoin
  };
}


export interface FriendshipStatus {
  status: "none" | "blocked" | "pending" | "accepted" | "following";
  isBlocked: boolean;
  isBlockedBy: boolean;
  isFriend: boolean;
  hasPendingRequest: boolean;
}

// Types pour les requêtes
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  bio?: string;
  reading_habit?: ReadingHabit;
  usage_purpose?: UsagePurpose;
  preferred_genres?: string[];
  profile_visibility?: ProfileVisibility;
  allow_follow_requests?: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  newsletter_subscribed?: boolean;
}

export interface UpdateProfilePictureRequest {
  profile_picture: File;
}

export interface DeleteAccountRequest {
  password: string;
}

// Types pour les réponses API
export interface GetAuthenticatedProfileResponse {
  status: "success";
  message: string;
  data: UserProfile;
}

export interface GetUserProfileResponse {
  status: "success";
  message: string;
  data: {
    id: string;
    username: string;
    is_verified: boolean;
    created_at: string;
    profile: {
      first_name: string | null;
      last_name: string | null;
      full_name: string | null;
      profile_picture_path: string | null;
      profile_picture_url: string | null;
      bio?: string | null;
      readingHabit?: string;
      usagePurpose?: string;
      preferredGenres?: string[];
      role?: string;
    };
    stats?: {
      followers_count: number;
      following_count: number;
    };
    posts: {
      id: string;
      title: string;
      subject: string;
      content: string;
      likes_count: number;
      comments_count: number;
      images: string[];
      has_images: boolean;
      images_count: number;
      created_at: string;
      updated_at: string;
    }[];
    posts_count: number;
    clubs: any[];
    clubs_count: number;
    book_lists: {
      id: string;
      name: string;
      description: string;
      cover_image: string | null;
      visibility: string;
      genre: string;
      book_count: number;
      created_at: string;
    }[];
    book_lists_count: number;
  };
}


export interface GetUserRelationsResponse {
  status: "success";
  data: UserRelations;
}

export interface UpdateProfileResponse {
  status: "success";
  message: string;
  data: UserProfile;
}

export interface UpdateProfilePictureResponse {
  status: "success";
  message: string;
  data: {
    profile_picture_url: string;
  };
}

export interface CheckFriendshipStatusResponse {
  status: "success";
  data: FriendshipStatus;
}

export interface BasicResponse {
  status: "success";
  message: string;
}

// Interface pour le service utilisateur
export interface UserService {
  getAuthenticatedProfile(): Promise<GetAuthenticatedProfileResponse>;
  getUserProfile(userId: string): Promise<GetUserProfileResponse>;
  getRelations(): Promise<GetUserRelationsResponse>;
  updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse>;
  updateProfilePicture(file: File): Promise<UpdateProfilePictureResponse>;
  checkFriendshipStatus(userId: string): Promise<CheckFriendshipStatusResponse>;
  deleteAccount(password: string): Promise<BasicResponse>;
  blockUser(userId: string): Promise<BasicResponse>;
  unblockUser(userId: string): Promise<BasicResponse>;
  followUser(userId: string): Promise<BasicResponse>;
  unfollowUser(userId: string): Promise<BasicResponse>;
  sendFriendRequest(userId: string): Promise<BasicResponse>;
  respondToFriendRequest(
    userId: string,
    accept: boolean
  ): Promise<BasicResponse>;
  removeFriend(userId: string): Promise<BasicResponse>;
}
