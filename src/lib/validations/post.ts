import * as z from "zod"

// Validation pour la création d'un post
export const createPostSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    content: z.string().min(1, "Le contenu est requis"),
    bookId: z.string().uuid("ID de livre invalide"),
    tags: z.array(z.string()).optional(),
    spoilerAlert: z.boolean().default(false)
});

// Validation pour la mise à jour d'un post
export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema> 