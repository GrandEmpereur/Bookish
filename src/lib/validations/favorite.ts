import * as z from "zod"

// Validation pour l'ajout/retrait des favoris
export const toggleFavoriteSchema = z.object({
    postId: z.string().uuid("ID de post invalide")
});

export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema> 