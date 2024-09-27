// types/auth.ts

// Typage pour l'utilisateur 
export interface User {
    id: string;
    username: string;
    email: string;
    birth_date: string;
    password?: string;
    role?: string;
    profile_picture?: string;
    is_verified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserResponse {
    status: string;
    message?: string;
    data?: {
        user: User;
    };
}

// Réponse pour l'authentification (login, register, etc.)
export interface AuthResponse {
    status: string;
    message?: string;
    data?: {
        user: User;
    };
}

// Typage pour les erreurs API
export interface ApiError {
    message: string;
    code?: string;
}
