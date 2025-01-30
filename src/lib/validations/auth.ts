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
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8).regex(/[!@#$%^&*(),.?":{}|<>]/),
    birthdate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export const verificationSchema = z.object({
    code: z.string().length(6),
})

export const purposeSchema = z.object({
    usagePurpose: z.enum(['discover', 'community', 'both']),
})

export const habitsSchema = z.object({
    readingHabit: z.enum(['bookworm', 'casual', 'beginner']),
})

export const genresSchema = z.object({
    preferredGenres: z.array(z.string()).min(1),
}) 