import type { Book } from "@/types/bookTypes";

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string | null;
  book_rights: number;
  created_at: string;
  books: Book[];
  books_count: number;
}
