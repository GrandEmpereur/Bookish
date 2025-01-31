import * as z from "zod"

export const loginSchema = z.object({
    email: z.string()
        .email("L'email est invalide")
        .min(1, "L'email est requis"),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial"),
    rememberMe: z.boolean().optional().default(false)
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
    birthdate: z.string()
        .regex(/^(\d{2})\/(\d{2})\/(\d{4})$/, "La date doit être au format JJ/MM/AAAA")
        .refine((val) => {
            const [day, month, year] = val.split('/').map(Number);
            const date = new Date(year, month - 1, day);
            return date instanceof Date && !isNaN(date.getTime());
        }, "Date invalide")
});

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export const verificationSchema = z.object({
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