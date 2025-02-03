import * as z from "zod"

// Validation pour la création d'un post
export const createPostSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    subject: z.enum(['book_review', 'book_recommendation'], {
        required_error: "Le type de post est requis",
        invalid_type_error: "Type de post invalide"
    }),
    content: z.string().min(1, "Le contenu est requis"),
    media: z.array(z.instanceof(File)).optional()
});

// Validation pour la mise à jour d'un post
export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema> 