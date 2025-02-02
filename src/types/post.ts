export interface Post {
    id: string;
    title: string;
    subject: string;
    content: string;
    likesCount: number;
    commentsCount: number;
    user_id: string;
    clubId: string;
    createdAt: string;
    updatedAt: string;
    user: User;
    media: Media[];
    stats: {
        isLiked: boolean;
        isBookmarked: boolean;
    };
}

export interface User {
    id: string;
    email: string;
    username: string;
    isVerified: boolean;
    verificationToken: string | null;
    verificationTokenExpiresAt: string | null;
    resetPasswordToken: string | null;
    resetPasswordTokenExpiresAt: string | null;
    hasLoggedIn: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Media {
    id: string;
    userId: string;
    postId: string;
    type: string;
    mimeType: string;
    originalName: string;
    size: string;
    folder: string;
    disk: string;
    visibility: string;
    quality: string | null;
    maxWidth: number | null;
    maxHeight: number | null;
    aspectRatio: number | null;
    expiresIn: number | null;
    url: string;
    key: string;
    signedUrl: string | null;
    width: number;
    height: number;
    duration: number | null;
    thumbnailUrl: string | null;
    thumbnailKey: string | null;
    createdAt: string;
    updatedAt: string;
}