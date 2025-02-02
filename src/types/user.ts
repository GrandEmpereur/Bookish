export interface User {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    location?: string;
    readingHabit?: 'library_rat' | 'occasional_reader' | 'beginner_reader';
    usagePurpose?: 'find_books' | 'find_community' | 'both';
    preferredGenres?: string[];
    profileVisibility: 'public' | 'private';
    avatarUrl?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserRelations {
    friends: Friend[];
    followers: Follower[];
    following: Following[];
    blocked: BlockedUser[];
    pendingRequests: FriendRequest[];
}

export interface Friend {
    id: string;
    userId: string;
    username: string;
    avatarUrl?: string;
    friendsSince: string;
}

export interface Follower {
    id: string;
    userId: string;
    username: string;
    avatarUrl?: string;
    followingSince: string;
}

export interface Following {
    id: string;
    userId: string;
    username: string;
    avatarUrl?: string;
    followedSince: string;
}

export interface BlockedUser {
    id: string;
    userId: string;
    username: string;
    blockedAt: string;
}

export interface FriendRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    sender: {
        username: string;
        avatarUrl?: string;
    };
}

export interface FriendshipStatus {
    status: 'none' | 'pending' | 'friends' | 'blocked';
    requestId?: string;
} 