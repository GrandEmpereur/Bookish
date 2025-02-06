import * as z from "zod";

export const notificationPreferencesSchema = z.object({
    email_notifications: z.boolean(),
    push_notifications: z.boolean(),
    notification_types: z.object({
        follow: z.boolean(),
        friend_request: z.boolean(),
        friend_accept: z.boolean(),
        like: z.boolean(),
        comment: z.boolean(),
        mention: z.boolean(),
        club_invite: z.boolean(),
        club_join: z.boolean(),
        message: z.boolean(),
        system: z.boolean()
    })
}); 