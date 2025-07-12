"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookSuggestions } from "@/components/ui/book-suggestions";

import { authorService } from "@/services/author.service";
import { bookService } from "@/services/book.service";

import type { Author } from "@/types/authorTypes";
import type { Book } from "@/types/bookTypes";

interface AuthorProps {
  id: string;
}

export default function AuthorDetail({ id }: AuthorProps) {
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorRes, booksRes] = await Promise.all([
          authorService.getAuthor(id),
          bookService.getBooks(),
        ]);

        setAuthor(authorRes.data);

        const booksArray = Array.isArray(booksRes.data) ? booksRes.data : [];
        const related = booksArray.filter(
          (book: Book) => book.author === authorRes.data.name
        );

        setBooks(related);
      } catch (err) {
        toast.error("Erreur de chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!author) {
    return <div className="text-center p-6">Auteur introuvable</div>;
  }

  return (
    <div className="space-y-2 pt-[38px] bg-accent-100">
      {/* Image */}
      <div className="w-[160px] h-[160px] relative mx-auto px-5">
        <Avatar className="absolute inset-0 w-full h-full rounded-full shadow-lg">
          {author.avatar ? (
            <AvatarImage
              src={author.avatar}
              alt={author.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <AvatarFallback
              className="w-full h-full text-3xl font-bold flex items-center justify-center bg-gradient-to-br from-yellow-300 to-secondary-500 text-white"
            >
              {author.name[0]?.toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      {/* Stats */}
      <div className="flex flex-col justify-center gap-1 text-center">
        <p className="text-sm">
          <span className="font-semibold">{books.length}</span>
          {books.length > 1 ? " livres" : " livre"}
        </p>

        {books[0]?.genre && (
          <div className="flex gap-2 flex-wrap justify-center">
            <Badge variant="default" className="capitalize">
              {books[0].genre}
            </Badge>
          </div>
        )}
      </div>

      {/* Vague */}
      <div className="relative">
        <div className="absolute top-[-130px] -translate-x-1/2 w-full z-1">
          <svg
            className="block w-[200%] h-[200px] drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            viewBox="0 0 200 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,100 Q100,0 200,100 L200,100 L0,100 Z" fill="white" />
          </svg>
        </div>

        {/* Contenu */}
        <div className="space-y-6 bg-white mt-16 pt-2 px-5 z-[8] relative">
          {/* Nom */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{author.name}</h1>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">Biographie</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {author.bio || "Biographie non disponible."}
            </p>
          </div>

          {/* Suggestions */}
          {books.length > 0 && (
            <BookSuggestions books={books} title="A publié" />
          )}
        </div>
      </div>
    </div>
  );
}
