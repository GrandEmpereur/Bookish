export interface LikeStats {
    totalLikes: number;
    isLikedByUser: boolean;
    recentLikers: {
        id: string;
        username: string;
        avatarUrl?: string;
    }[];
}

export interface LikeResponse {
    action: 'liked' | 'unliked';
    stats: LikeStats;
}

export type LikeableType = 'post' | 'comment' 