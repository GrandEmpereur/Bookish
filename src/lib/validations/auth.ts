import * as z from "zod"

export const loginSchema = z.object({
    email: z.string()
        .email("L'email est invalide")
        .min(1, "L'email est requis"),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    rememberMe: z.boolean().optional().default(true)
});

export const registerSchema = z.object({
    username: z.string()
        .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
        .max(20, "Le nom d'utilisateur ne doit pas dépasser 20 caractères"),
    email: z.string()
        .email("L'email est invalide"),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    birthDate: z.string()
        .regex(/^\d{2}\/\d{2}\/\d{4}$/, "La date doit être au format DD/MM/YYYY")
        .transform((date) => {
            const [day, month, year] = date.split('/');
            const formattedDay = day.padStart(2, '0');
            const formattedMonth = month.padStart(2, '0');
            return `${year}-${formattedMonth}-${formattedDay}`;
        })
});

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export const verificationSchema = z.object({
    email: z.string().email(),
    code: z.string().length(6),
})

export const purposeSchema = z.object({
    usagePurpose: z.enum(['find_books', 'find_community', 'both'] as const),
})

export const habitsSchema = z.object({
    readingHabit: z.enum(['library_rat', 'occasional_reader', 'beginner_reader'] as const),
})

export const genresSchema = z.object({
    preferredGenres: z.array(z.string()).min(1),
})

export const forgotPasswordSchema = z.object({
    email: z.string()
        .email("L'email est invalide")
        .min(1, "L'email est requis"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
    email: z.string().email("L'email est invalide"),
    newPassword: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial"),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>; 