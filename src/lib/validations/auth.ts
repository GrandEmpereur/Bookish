import * as z from "zod"

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Le mot de passe est requis"),
})

export const registerSchema = z.object({
    username: z.string()
        .min(3, "Le pseudonyme doit contenir au moins 3 caractères")
        .max(50, "Le pseudonyme ne peut pas dépasser 50 caractères"),
    birthdate: z.string()
        .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/, "Format de date invalide (jj/mm/aaaa)"),
    email: z.string().email("Email invalide"),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins 1 caractère spécial")
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema> 