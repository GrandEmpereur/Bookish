import { ApiResponse } from './api';

// Types énumérés
export type UserRole = 'USER' | 'AUTHOR' | 'PUBLISHER' | 'PUBLISHERHOUSE' | 'MODERATOR' | 'ADMIN';
export type ReadingHabit = 'library_rat' | 'occasional_reader' | 'beginner_reader';
export type UsagePurpose = 'find_books' | 'find_community' | 'both' | 'créer_compte_professionel';
export type ProfileVisibility = 'public' | 'private' | 'friends_only';
export type RelationType = 'follow' | 'friend' | 'block';
export type RelationStatus = 'accepted' | 'declined' | 'pending';

// Types de base
export interface UserProfile {
    id: string;
    username: string;
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
}

export interface UserRelations {
    followers: Array<{
        id: string;
        username: string;
        profile: {
            firstName: string;
            lastName: string;
            profilePictureUrl: string | null;
        } | null;
    }>;
    following: Array<{
        id: string;
        username: string;
        profile: {
            firstName: string;
            lastName: string;
            profilePictureUrl: string | null;
        } | null;
    }>;
    friends: Array<{
        id: string;
        username: string;
        profile: {
            firstName: string;
            lastName: string;
            profilePictureUrl: string | null;
        } | null;
    }>;
    blocked: Array<{
        id: string;
        username: string;
    }>;
}

export interface FriendshipStatus {
    status: 'none' | 'blocked' | 'pending' | 'accepted' | 'following';
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
    status: 'success';
    message: string;
    data: UserProfile;
}

export interface GetUserProfileResponse {
    status: 'success';
    data: {
        profile: UserProfile;
    };
}

export interface GetUserRelationsResponse {
    status: 'success';
    data: UserRelations;
}

export interface UpdateProfileResponse {
    status: 'success';
    message: string;
    data: UserProfile;
}

export interface UpdateProfilePictureResponse {
    status: 'success';
    message: string;
    data: {
        profile_picture_url: string;
    };
}

export interface CheckFriendshipStatusResponse {
    status: 'success';
    data: FriendshipStatus;
}

export interface BasicResponse {
    status: 'success';
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
    respondToFriendRequest(userId: string, accept: boolean): Promise<BasicResponse>;
    removeFriend(userId: string): Promise<BasicResponse>;
} 