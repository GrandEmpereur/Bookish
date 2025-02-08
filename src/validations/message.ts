import * as z from "zod";

export const sendMessageSchema = z.object({
    content: z.string()
        .min(1, "Le message ne peut pas être vide")
        .max(1000, "Le message ne doit pas dépasser 1000 caractères"),
    recipient_id: z.string()
});

export const updateMessageSchema = z.object({
    is_read: z.boolean()
}); 