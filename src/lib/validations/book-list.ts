import * as z from "zod"
import { Visibility, Genre } from "@/types/book-list"

const genres = [
    'fantasy', 'science-fiction', 'romance', 'thriller', 'mystery',
    'horror', 'historical', 'contemporary', 'literary', 'young-adult',
    'non-fiction', 'biography', 'poetry', 'comics', 'mixed'
] as const;

// Validation pour la création d'une liste de lecture
export const createBookListSchema = z.object({
    name: z.string()
        .min(3, "Le nom doit faire au moins 3 caractères")
        .max(100, "Le nom ne doit pas dépasser 100 caractères"),
    description: z.string()
        .max(500, "La description ne doit pas dépasser 500 caractères")
        .optional()
        .nullable(),
    visibility: z.enum(['public', 'private']).default('private'),
    genre: z.string(),
    coverImage: z
        .instanceof(File)
        .optional()
        .nullable()
        .refine(
            (file) => {
                if (!file) return true;
                return file.size <= 2 * 1024 * 1024; // 2MB
            },
            { message: "L'image ne doit pas dépasser 2MB" }
        )
        .refine(
            (file) => {
                if (!file) return true;
                return file.type.startsWith('image/');
            },
            { message: "Le fichier doit être une image" }
        )
});

export const updateBookListSchema = createBookListSchema.partial();

// Validation pour l'ajout d'un livre à la liste
export const addBooksToListSchema = z.object({
    bookIds: z.array(z.string().uuid())
        .min(1, "Vous devez sélectionner au moins un livre")
});

// Validation pour la mise à jour du statut de lecture
export const updateReadingStatusSchema = z.object({
    status: z.enum(['to_read', 'reading', 'read'])
});

export type CreateBookListInput = z.infer<typeof createBookListSchema>
export type UpdateBookListInput = z.infer<typeof updateBookListSchema>
export type UpdateReadingStatusInput = z.infer<typeof updateReadingStatusSchema>
export type AddBooksToListInput = z.infer<typeof addBooksToListSchema>