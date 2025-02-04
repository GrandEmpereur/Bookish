import * as z from "zod"
import { Visibility, Genre } from "@/types/book-list"

const genreEnum = z.enum([
    'fantasy',
    'science-fiction',
    'romance',
    'thriller',
    'mystery',
    'horror',
    'historical',
    'contemporary',
    'literary',
    'young-adult',
    'non-fiction',
    'biography',
    'poetry',
    'comics',
    'mixed'
] as const);

// Validation pour la création d'une liste de lecture
export const createBookListSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    visibility: z.enum(['public', 'private'] as const).default('private'),
    genre: genreEnum,
    coverImage: z
        .instanceof(File, { message: "L'image doit être un fichier" })
        .optional()
        .refine(
            (file) => {
                if (!file) return true;
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                return validTypes.includes(file.type);
            },
            {
                message: "Le format d'image doit être jpg, jpeg, png ou webp"
            }
        )
        .refine(
            (file) => {
                if (!file) return true;
                return file.size <= 10 * 1024 * 1024; // 10MB
            },
            {
                message: "L'image ne doit pas dépasser 10MB"
            }
        )
});

export const updateBookListSchema = createBookListSchema.partial();

// Validation pour l'ajout d'un livre à la liste
export const addBookToListSchema = z.object({
    bookId: z.string().uuid("ID de livre invalide")
});

// Validation pour la mise à jour du statut de lecture
export const updateReadingStatusSchema = z.object({
    status: z.enum(['to_read', 'reading', 'finished'], {
        required_error: "Le statut est requis",
        invalid_type_error: "Statut invalide"
    })
});

// Validation pour le partage de liste
export const shareBookListSchema = z.object({
    userIds: z.array(z.string().uuid("ID utilisateur invalide")),
    permission: z.enum(['read', 'write'])
});

export type CreateBookListInput = z.infer<typeof createBookListSchema>
export type UpdateBookListInput = z.infer<typeof updateBookListSchema>
export type UpdateReadingStatusInput = z.infer<typeof updateReadingStatusSchema>
export type AddBookToListInput = z.infer<typeof addBookToListSchema>
export type ShareBookListInput = z.infer<typeof shareBookListSchema> 