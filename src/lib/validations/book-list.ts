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

export const createBookListSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne doit pas dépasser 100 caractères"),
  description: z
    .string()
    .max(500, "La description ne doit pas dépasser 500 caractères")
    .optional(),
  visibility: z.enum(["public", "private"] as const),
  genre: z.string().min(1, "Le genre est requis"),
  coverImage: z
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

export type CreateBookListInput = z.infer<typeof createBookListSchema>;

export const updateBookListSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne doit pas dépasser 100 caractères")
    .optional(),
  description: z
    .string()
    .max(500, "La description ne doit pas dépasser 500 caractères")
    .optional()
    .nullable(),
  visibility: z.enum(["public", "private"] as const).optional(),
  genre: z.string().min(1, "Le genre est requis").optional(),
  coverImage: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "L'image ne doit pas dépasser 10MB"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Format accepté : JPG, JPEG, PNG, WEBP"
    )
    .optional()
    .nullable(),
});

export type UpdateBookListInput = z.infer<typeof updateBookListSchema>;

export const genres = [
  { value: "fantasy", label: "Fantasy" },
  { value: "science-fiction", label: "Science-fiction" },
  { value: "romance", label: "Romance" },
  { value: "thriller", label: "Thriller" },
  { value: "mystery", label: "Mystère" },
  { value: "horror", label: "Horreur" },
  { value: "historical", label: "Historique" },
  { value: "contemporary", label: "Contemporain" },
  { value: "literary", label: "Littéraire" },
  { value: "young-adult", label: "Young Adult" },
  { value: "non-fiction", label: "Non-fiction" },
  { value: "biography", label: "Biographie" },
  { value: "poetry", label: "Poésie" },
  { value: "comics", label: "Comics" },
  { value: "mixed", label: "Mixte" },
] as const;

export type Genre = (typeof genres)[number]["value"];

export const addBookToListSchema = z.object({
  bookIds: z
    .array(z.string())
    .min(1, "Sélectionnez au moins un livre")
    .max(50, "Vous ne pouvez pas ajouter plus de 50 livres à la fois"),
});

export type AddBookToListInput = z.infer<typeof addBookToListSchema>;

export const updateReadingStatusSchema = z.object({
  reading_status: z.enum(["to_read", "reading", "finished"]),
});
