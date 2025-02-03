export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    likesCount: number;
    repliesCount: number;
    user: UserComment;
    replies: Reply[];
}

export interface UserComment {
    id: string;
    username: string;
    profilePicture: string;
}

export interface Reply {
    id: string;
    content: string;
    createdAt: string;
    user: UserComment;
}