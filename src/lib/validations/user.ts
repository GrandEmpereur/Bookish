import * as z from "zod"

// Validation de la mise à jour du profil
export const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    bio: z.string().max(500, "La bio ne doit pas dépasser 500 caractères").optional(),
    location: z.string().max(100, "La localisation ne doit pas dépasser 100 caractères").optional(),
    readingHabit: z.enum(['library_rat', 'occasional_reader', 'beginner_reader']).optional(),
    usagePurpose: z.enum(['find_books', 'find_community', 'both']).optional(),
    preferredGenres: z.array(z.string()).min(1, "Sélectionnez au moins un genre").optional(),
    profileVisibility: z.enum(['public', 'private']).optional()
});

// Validation de la réponse à une demande d'ami
export const friendRequestResponseSchema = z.object({
    status: z.enum(['accepted', 'rejected'])
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type FriendRequestResponseInput = z.infer<typeof friendRequestResponseSchema> 