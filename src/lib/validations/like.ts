import * as z from "zod"

// Validation pour le like d'un post
export const likePostSchema = z.object({
    postId: z.string().uuid("ID de post invalide")
});

// Validation pour le like d'un commentaire
export const likeCommentSchema = z.object({
    commentId: z.string().uuid("ID de commentaire invalide")
});

export type LikePostInput = z.infer<typeof likePostSchema>
export type LikeCommentInput = z.infer<typeof likeCommentSchema> 