import * as z from "zod";

export const createBookListSchema = z.object({
    name: z.string()
        .min(3, "Le nom doit faire au moins 3 caractères")
        .max(50, "Le nom ne doit pas dépasser 50 caractères"),
    description: z.string()
        .max(500, "La description ne doit pas dépasser 500 caractères")
        .nullable()
        .optional(),
    visibility: z.enum(['public', 'private']),
    genre: z.string(),
    cover_image: z.instanceof(File).optional()
});

export const updateBookListSchema = createBookListSchema.partial();

export const addBookToListSchema = z.object({
    book_id: z.string(),
    reading_status: z.enum(['to_read', 'reading', 'finished'])
});

export const updateReadingStatusSchema = z.object({
    reading_status: z.enum(['to_read', 'reading', 'finished'])
}); 