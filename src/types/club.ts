export interface Club {
    id: string;
    name: string;
    description: string;
    type: 'public' | 'private';
    genre: string;
    rules?: string;
    maxMembers?: number;
    coverImage?: string;
    tags?: string[];
    memberCount: number;
    members: ClubMember[];
    createdAt: string;
    updatedAt: string;
}

export interface ClubMember {
    id: string;
    userId: string;
    username: string;
    role: 'admin' | 'moderator' | 'member';
    joinedAt: string;
    avatarUrl?: string;
}

export interface ClubPost {
    id: string;
    title: string;
    content: string;
    tags?: string[];
    author: {
        id: string;
        username: string;
        avatarUrl?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ClubMessage {
    id: string;
    content: string;
    userId: string;
    username: string;
    avatarUrl?: string;
    attachments?: {
        id: string;
        url: string;
        type: string;
    }[];
    createdAt: string;
}

export interface ClubInvite {
    code: string;
    expiresAt: string;
}

export interface ClubFilters {
    page?: number;
    limit?: number;
    type?: 'public' | 'private';
    sort?: 'created_at' | 'name' | 'member_count';
    order?: 'asc' | 'desc';
}

export interface PaginatedClubs {
    items: Club[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} 