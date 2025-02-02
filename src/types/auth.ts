export interface AuthResponse {
    user: {
        id: string;
        email: string;
        username: string;
        is_verified: boolean;
        has_logged_in: boolean;
    };
}

// Étapes d'inscription
export interface RegisterStepOneInput {
    email: string;
    usagePurpose: 'find_books' | 'find_community' | 'both';
}

export interface RegisterStepTwoInput {
    email: string;
    readingHabit: 'library_rat' | 'occasional_reader' | 'beginner_reader';
}

export interface RegisterStepThreeInput {
    email: string;
    preferredGenres: string[];
}

export interface VerifyEmailInput {
    email: string;
    code: string;
}

export interface ForgotPasswordInput {
    email: string;
}

export interface ResetPasswordInput {
    email: string;
    newPassword: string;
}

export interface VerifyResetCodeInput {
    email: string;
    code: string;
}

// Nouveau type pour la réponse de vérification de session
export interface SessionResponse {
    status: string;
    message: string;
    data: {
        user: {
            id: string;
            username: string;
            email: string;
            is_verified: boolean;
            has_logged_in: boolean;
            created_at: string;
            updated_at: string;
        };
        profile: {
            firstName: string;
            lastName: string;
            role: string;
            readingHabit: string;
            usagePurpose: string;
            preferredGenres: string[];
            profileVisibility: string;
        };
    }
}