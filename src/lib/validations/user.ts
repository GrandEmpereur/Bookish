import * as z from "zod";

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit faire au moins 3 caractères")
    .max(30, "Le nom d'utilisateur ne doit pas dépasser 30 caractères")
    .optional(),
  email: z.string().email("Email invalide").optional(),
  first_name: z
    .string()
    .min(2, "Le prénom doit faire au moins 2 caractères")
    .max(50, "Le prénom ne doit pas dépasser 50 caractères")
    .nullable()
    .optional(),
  last_name: z
    .string()
    .min(2, "Le nom doit faire au moins 2 caractères")
    .max(50, "Le nom ne doit pas dépasser 50 caractères")
    .nullable()
    .optional(),
  bio: z
    .string()
    .max(500, "La bio ne doit pas dépasser 500 caractères")
    .nullable()
    .optional(),
  location: z
    .string()
    .max(100, "La localisation ne doit pas dépasser 100 caractères")
    .nullable()
    .optional(),
  website: z.string().url("URL invalide").nullable().optional(),
  reading_habit: z
    .enum(["library_rat", "occasional_reader", "beginner_reader"])
    .nullable()
    .optional(),
  usage_purpose: z
    .enum(["find_books", "find_community", "both"])
    .nullable()
    .optional(),
  preferred_genres: z
    .array(z.string())
    .min(1, "Sélectionnez au moins un genre")
    .max(5, "Vous ne pouvez pas sélectionner plus de 5 genres")
    .optional(),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Le mot de passe est requis"),
});
