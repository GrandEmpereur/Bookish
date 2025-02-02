import * as z from "zod"

// Validation pour la création d'une liste de lecture
export const createBookListSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    isPublic: z.boolean(),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().url("L'URL de la couverture est invalide").optional()
});

// Validation pour l'ajout d'un livre à la liste
export const addBookToListSchema = z.object({
    bookId: z.string().uuid("ID de livre invalide"),
    status: z.enum(['to_read', 'reading', 'finished'], {
        errorMap: () => ({ message: "Le statut doit être 'to_read', 'reading' ou 'finished'" })
    }),
    notes: z.string().optional()
});

// Validation pour la mise à jour du statut de lecture
export const updateBookStatusSchema = z.object({
    status: z.enum(['to_read', 'reading', 'finished']),
    currentPage: z.number().positive("Le numéro de page doit être positif").optional(),
    notes: z.string().optional()
});

// Validation pour le partage de liste
export const shareBookListSchema = z.object({
    userIds: z.array(z.string().uuid("ID utilisateur invalide")),
    permission: z.enum(['read', 'write'])
});

export type CreateBookListInput = z.infer<typeof createBookListSchema>
export type AddBookToListInput = z.infer<typeof addBookToListSchema>
export type UpdateBookStatusInput = z.infer<typeof updateBookStatusSchema>
export type ShareBookListInput = z.infer<typeof shareBookListSchema> 