import * as z from "zod";

export const registerSchema = z.object({
    username: z.string()
        .min(3, "Le nom d'utilisateur doit faire au moins 3 caractères")
        .max(30, "Le nom d'utilisateur ne doit pas dépasser 30 caractères"),
    email: z.string()
        .email("Email invalide"),
    password: z.string()
        .min(8, "Le mot de passe doit faire au moins 8 caractères")
        .regex(
            /^(?=.*[!@#$%^&*])/,
            "Le mot de passe doit contenir au moins un caractère spécial"
        ),
    birthDate: z.string()
        .regex(
            /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
            "Format de date invalide (JJ/MM/AAAA)"
        ),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string()
        .email("Email invalide"),
    password: z.string()
        .min(1, "Le mot de passe est requis"),
    rememberMe: z.boolean()
        .optional()
        .default(true)
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string()
        .email("Email invalide")
});

export const verifyResetCodeSchema = z.object({
    email: z.string()
        .email("Email invalide"),
    code: z.string()
        .length(6, "Le code doit contenir 6 caractères")
});

export const resetPasswordSchema = z.object({
    email: z.string()
        .email("Email invalide"),
    newPassword: z.string()
        .min(8, "Le mot de passe doit faire au moins 8 caractères")
        .regex(
            /^(?=.*[!@#$%^&*])/,
            "Le mot de passe doit contenir au moins un caractère spécial"
        ),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export const changePasswordSchema = z.object({
    current_password: z.string(),
    new_password: z.string()
        .min(8, "Le mot de passe doit faire au moins 8 caractères")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"),
    new_password_confirmation: z.string()
}).refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["new_password_confirmation"],
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyResetCodeInput = z.infer<typeof verifyResetCodeSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>; 