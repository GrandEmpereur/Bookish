import * as z from "zod";

export const createBookListSchema = z.object({
    name: z.string()
        .min(1, "Le nom est requis")
        .max(100, "Le nom ne doit pas dépasser 100 caractères"),
    description: z.string()
        .max(500, "La description ne doit pas dépasser 500 caractères")
        .optional(),
    visibility: z.enum(['public', 'private'] as const),
    genre: z.string().min(1, "Le genre est requis"),
    cover_image: z.instanceof(File).optional()
});

export type CreateBookListInput = z.infer<typeof createBookListSchema>;

export const genres = [
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'science-fiction', label: 'Science-fiction' },
    { value: 'romance', label: 'Romance' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'mystery', label: 'Mystère' },
    { value: 'horror', label: 'Horreur' },
    { value: 'historical', label: 'Historique' },
    { value: 'contemporary', label: 'Contemporain' },
    { value: 'literary', label: 'Littéraire' },
    { value: 'young-adult', label: 'Young Adult' },
    { value: 'non-fiction', label: 'Non-fiction' },
    { value: 'biography', label: 'Biographie' },
    { value: 'poetry', label: 'Poésie' },
    { value: 'comics', label: 'Comics' },
    { value: 'mixed', label: 'Mixte' }
] as const;

export type Genre = typeof genres[number]['value'];

export const updateBookListSchema = createBookListSchema.partial();

export const addBookToListSchema = z.object({
    book_id: z.string(),
    reading_status: z.enum(['to_read', 'reading', 'finished'])
});

export const updateReadingStatusSchema = z.object({
    reading_status: z.enum(['to_read', 'reading', 'finished'])
}); 