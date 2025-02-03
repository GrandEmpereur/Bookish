import * as z from "zod"

// Validation pour la création d'une liste de lecture
export const createBookListSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    visibility: z.enum(['public', 'private']).default('private')
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