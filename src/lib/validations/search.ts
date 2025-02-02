import * as z from "zod"

// Validation pour les paramètres de recherche communs
const baseSearchSchema = z.object({
    query: z.string().min(1, "Le terme de recherche est requis"),
    page: z.number().optional(),
    limit: z.number().min(1).max(50).optional()
});

// Validation pour la recherche de livres
export const searchBooksSchema = baseSearchSchema.extend({
    genre: z.string().optional()
});

// Validation pour la recherche de clubs
export const searchClubsSchema = baseSearchSchema.extend({
    type: z.enum(['public', 'private']).optional()
});

// Validation pour la recherche de listes de lecture
export const searchBookListsSchema = baseSearchSchema.extend({
    visibility: z.enum(['public', 'private']).optional()
});

// Validation pour la recherche par catégorie
export const searchByCategorySchema = z.object({
    category: z.string().min(1, "La catégorie est requise"),
    type: z.enum(['book', 'club', 'list']),
    page: z.number().optional(),
    limit: z.number().min(1).max(50).optional()
});

// Validation pour la recherche de contributeurs
export const searchContributorsSchema = baseSearchSchema.extend({
    role: z.enum(['author', 'publisher', 'editor']).optional()
});

export type SearchBooksInput = z.infer<typeof searchBooksSchema>
export type SearchClubsInput = z.infer<typeof searchClubsSchema>
export type SearchBookListsInput = z.infer<typeof searchBookListsSchema>
export type SearchByCategoryInput = z.infer<typeof searchByCategorySchema>
export type SearchContributorsInput = z.infer<typeof searchContributorsSchema> 