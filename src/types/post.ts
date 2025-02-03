export interface Post {
    id: string;
    title: string;
    subject: 'book_review' | 'book_recommendation';
    content: string;
    userId: string;
    clubId: string | null;
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        username: string;
    };
    media?: Media[];
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
    type: 'image' | 'video';
    url: string;
    thumbnailUrl?: string;
}

export interface CreatePostResponse {
    status: string;
    message: string;
    data: Post;
}

export interface DeletePostResponse {
    status: string;
    message: string;
}