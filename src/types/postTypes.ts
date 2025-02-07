import { ApiResponse } from './api';
import type { UserProfile } from './userTypes';

// Types pour les sujets de posts
export type PostSubject =
    | 'book_review'
    | 'book_recommendation'
    | 'reading_progress'
    | 'book_discussion'
    | 'author_spotlight'
    | 'reading_challenge'
    | 'book_quote'
    | 'book_collection'
    | 'reading_list'
    | 'literary_event';

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
    type: 'image' | 'video';
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
    visibility: 'public' | 'private';
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

export interface UpdatePostRequest extends Partial<CreatePostRequest> { }

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
        }
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
    updatePost(id: string, data: UpdatePostRequest): Promise<ApiResponse<UpdatePostResponse>>;
    deletePost(id: string): Promise<ApiResponse<null>>;
    getComments(postId: string): Promise<ApiResponse<GetCommentsResponse>>;
    createComment(postId: string, data: CreateCommentRequest): Promise<ApiResponse<CreateCommentResponse>>;
    updateComment(commentId: string, data: UpdateCommentRequest): Promise<ApiResponse<UpdateCommentResponse>>;
    deleteComment(commentId: string): Promise<ApiResponse<null>>;
    toggleLike(postId: string): Promise<ApiResponse<ToggleLikeResponse>>;
    toggleCommentLike(commentId: string): Promise<ApiResponse<ToggleLikeResponse>>;
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