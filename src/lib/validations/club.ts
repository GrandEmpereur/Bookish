import * as z from "zod";

export const createClubSchema = z.object({
    name: z.string()
        .min(3, "Le nom doit faire au moins 3 caractères")
        .max(50, "Le nom ne doit pas dépasser 50 caractères"),
    description: z.string()
        .min(10, "La description doit faire au moins 10 caractères")
        .max(1000, "La description ne doit pas dépasser 1000 caractères"),
    type: z.enum(['Public', 'Private', 'Archived']),
    genre: z.string(),
    club_picture: z.instanceof(File).optional()
});

export const updateClubSchema = createClubSchema.partial();

export const sendClubMessageSchema = z.object({
    content: z.string()
        .min(1, "Le message ne peut pas être vide")
        .max(1000, "Le message ne doit pas dépasser 1000 caractères")
}); 