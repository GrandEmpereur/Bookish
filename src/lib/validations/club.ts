import * as z from "zod"

// Validation pour la création d'un club
export const createClubSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
    type: z.enum(['public', 'private']),
    genre: z.string().min(1, "Le genre est requis"),
    rules: z.string().optional(),
    maxMembers: z.number().positive().optional(),
    coverImage: z.string().url("L'URL de la couverture est invalide").optional(),
    tags: z.array(z.string()).optional()
});

// Validation pour la mise à jour d'un club
export const updateClubSchema = createClubSchema.partial();

// Validation pour le bannissement d'un membre
export const banMemberSchema = z.object({
    userId: z.string().uuid("ID utilisateur invalide"),
    reason: z.string().min(1, "La raison est requise"),
    duration: z.enum(['temporary', 'permanent'])
});

// Validation pour la création d'un post dans le club
export const createClubPostSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    content: z.string().min(1, "Le contenu est requis"),
    tags: z.array(z.string()).optional()
});

// Validation pour l'envoi d'un message
export const sendClubMessageSchema = z.object({
    content: z.string().min(1, "Le message ne peut pas être vide"),
    attachments: z.array(z.any()).optional() // TODO: Définir la validation des pièces jointes
});

// Validation pour le signalement d'un message
export const reportMessageSchema = z.object({
    reason: z.string().min(1, "La raison est requise"),
    details: z.string().optional()
});

export type CreateClubInput = z.infer<typeof createClubSchema>
export type UpdateClubInput = z.infer<typeof updateClubSchema>
export type BanMemberInput = z.infer<typeof banMemberSchema>
export type CreateClubPostInput = z.infer<typeof createClubPostSchema>
export type SendClubMessageInput = z.infer<typeof sendClubMessageSchema>
export type ReportMessageInput = z.infer<typeof reportMessageSchema> 