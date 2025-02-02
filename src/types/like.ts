export interface LikePostResponse {
    status: string;
    message: string;
    data: {
        like: {
            id: string;
            createdAt: string;
        },
        post: {
            id: string;
            title: string;
            likesCount: number;
        },
        user: {
            id: string;
            username: string;
        }
    }
}

export interface UnLikePostResponse {
    status: string;
    message: string;
    data: {
        postId: string;
        likesCount: number;
        user: {
            id: string;
            username: string;
        }
    }
}

export interface LikeCommentResponse {
    status: string;
    message: string;
    data: {
        commentId: string;
        likesCount: number;
        user: {
            id: string;
            username: string;
        }
    }
}