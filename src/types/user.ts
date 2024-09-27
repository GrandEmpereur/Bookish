// types/user.ts

import { Post } from "./post";
import { UserGenre } from "./userGenre";
import { UserPreference } from "./userPreference";

// Typage pour un utilisateur
export interface User {
    id: string;
    username: string | null;
    email: string;
    birth_date: string;
    role: string;
    profile_picture: string;
    bio: string;
    is_verified: boolean;
    hasLoggedIn: boolean;
    emailVerificationToken: string | null;
    emailVerificationTokenExpiresAt: string | null;
    resetPasswordToken: string | null;
    resetPasswordTokenExpiresAt: string | null;
    createdAt: string;
    updatedAt: string | null;
    posts: Post[];
    preferences: UserPreference[];
    genres: UserGenre[];
}

export interface UserResponse {
    data: User[];
}
