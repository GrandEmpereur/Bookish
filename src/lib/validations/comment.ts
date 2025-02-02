import * as z from "zod"

// Validation pour la création d'un commentaire
export const createCommentSchema = z.object({
    content: z.string().min(1, "Le contenu est requis"),
    spoilerAlert: z.boolean().default(false)
});

// Validation pour la modification d'un commentaire
export const updateCommentSchema = createCommentSchema;

// Les types sont identiques pour la création et la modification
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema> 