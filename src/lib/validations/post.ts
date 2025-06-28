import * as z from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
];

export const POST_SUBJECTS = {
  book_review: "Critique de livre",
  book_recommendation: "Recommandation de livre",
  reading_progress: "Progression de lecture",
  book_discussion: "Discussion littéraire",
  author_spotlight: "Focus sur un auteur",
  reading_challenge: "Défi lecture",
  book_quote: "Citation de livre",
  book_collection: "Collection de livres",
  reading_list: "Liste de lecture",
  literary_event: "Événement littéraire",
} as const;

export type PostSubject = keyof typeof POST_SUBJECTS;

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne doit pas dépasser 100 caractères")
    .trim(),
  subject: z.enum(
    [
      "book_review",
      "book_recommendation",
      "reading_progress",
      "book_discussion",
      "author_spotlight",
      "reading_challenge",
      "book_quote",
      "book_collection",
      "reading_list",
      "literary_event",
    ] as const,
    {
      required_error: "Le type de post est requis",
      invalid_type_error: "Type de post invalide",
    }
  ),
  content: z
    .string()
    .min(1, "Le contenu est requis")
    .max(10000, "Le contenu ne doit pas dépasser 10000 caractères")
    .trim(),
  media: z
    .array(
      z
        .custom<File>(
          (file) => file instanceof File,
          "Le fichier n'est pas valide"
        )
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          "La taille du fichier ne doit pas dépasser 10MB"
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Type de fichier non supporté"
        )
    )
    .optional(),
});

export type CreatePostFormData = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.partial();

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(1000, "Le commentaire ne doit pas dépasser 1000 caractères"),
});

export const reportSchema = z.object({
  reason: z
    .string()
    .min(10, "La raison doit faire au moins 10 caractères")
    .max(500, "La raison ne doit pas dépasser 500 caractères"),
});
