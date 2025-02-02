export interface FavoriteResponse {
    status: string;
    message: string;
    data: {
        favorite: {
            id: string;
            createdAt: string;
        },
        post: {
            id: string;
            title: string;
            subject: string;
        },
        user: {
            id: string;
            username: string;
        }
    }
}

export interface UnFavoriteResponse {
    status: string;
    message: string;
    data: {
        favorite: {
            id: string;
            createdAt: string;
        },
        post: {
            id: string;
            title: string;
            subject: string;
        },
        user: {
            id: string;
            username: string;
        }
    }
}