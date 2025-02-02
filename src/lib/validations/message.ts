import * as z from "zod"

// Validation pour la création d'une conversation
export const createConversationSchema = z.object({
    recipientId: z.string().uuid("ID de destinataire invalide"),
    message: z.string()
        .min(1, "Le message est requis")
        .max(1000, "Le message ne doit pas dépasser 1000 caractères")
});

// Validation pour l'envoi d'un message
export const sendMessageSchema = z.object({
    content: z.string()
        .min(1, "Le message est requis")
        .max(1000, "Le message ne doit pas dépasser 1000 caractères"),
    attachments: z.array(z.any())
        .max(5, "Maximum 5 pièces jointes autorisées")
        .optional()
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema> 