"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tag } from "@/components/ui/tag";
import type { Book } from "@/types/bookTypes";

interface BookSuggestionsProps {
  books: Book[];
  title?: string;
}

export default function BookSuggestions({
  books,
  title = "Suggestions",
}: BookSuggestionsProps) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  if (!books || books.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="flex pt-2 gap-6 overflow-x-auto scrollbar-none h-[290px]">
        {books.map((book) => (
          <div
            key={book.id}
            className="min-w-[120px] h-[180px] cursor-pointer shrink-0 relative shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)]"
            onClick={() => router.push(`/books/${book.id}`)}
          >
            {/* Tag Nouveauté */}
            {book.publicationYear &&
              book.publicationYear >= currentYear - 1 && (
                <Tag className="absolute top-[-8px] left-1 z-10 shadow">
                  Nouveauté !
                </Tag>
              )}
            <Image
              src={book.cover_image || "/placeholder.png"}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export { BookSuggestions };
