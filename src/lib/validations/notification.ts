import * as z from "zod"

// Validation pour les préférences de notification
export const notificationPreferencesSchema = z.object({
    email_notifications: z.boolean(),
    push_notifications: z.boolean(),
    newsletter_subscribed: z.boolean(),
    notification_types: z.object({
        new_follower: z.boolean(),
        new_comment: z.boolean(),
        new_like: z.boolean(),
        club_updates: z.boolean()
    })
});

export type UpdateNotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema> 