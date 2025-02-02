import * as z from "zod"

// Validation pour la création d'un livre
export const createBookSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    author: z.string().min(1, "L'auteur est requis"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
    isbn: z.string().regex(/^(?:\d{10}|\d{13})$/, "L'ISBN doit être au format ISBN-10 ou ISBN-13"),
    genre: z.string().min(1, "Le genre est requis"),
    publicationYear: z.number()
        .min(1000, "L'année doit être supérieure à 1000")
        .max(new Date().getFullYear(), "L'année ne peut pas être dans le futur"),
    coverImage: z.string().url("L'URL de la couverture est invalide").optional(),
    publisher: z.string().optional(),
    language: z.string().length(2, "Le code langue doit être au format ISO (2 caractères)"),
    pageCount: z.number().positive("Le nombre de pages doit être positif").optional(),
    tags: z.array(z.string()).optional()
});

// Validation pour la mise à jour d'un livre
export const updateBookSchema = createBookSchema.partial();

export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema> 