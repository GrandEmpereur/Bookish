"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { bookService } from "@/services/book.service";
import { Star } from "lucide-react";
import type { Book } from "@/types/bookTypes";
interface BookProps {
  id: string;
}

export default function BookDetail({ id }: BookProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBookDetails(id);
  }, [id]);

  const fetchBookDetails = async (bookId: string) => {
    try {
      const res = await bookService.getBook(bookId);
      if (res.data) {
        setBook(res.data);
        if (res.data.genre) {
          fetchBooksByGenre(res.data.genre, res.data.id);
        }
      } else {
        toast.error("Livre non trouvé");
      }
    } catch (error) {
      toast.error("Erreur de chargement du livre");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBooksByGenre = async (genre: string, currentBookId: string) => {
    try {
      const res = await bookService.getBooks();

      console.log("Fetched books:", res);

      const filtered = res.data
        .filter((b: Book) => b.genre === genre && b.id !== currentBookId)
        .slice(0, 10);

      console.log("Filtered related books:", filtered);
      setRelatedBooks(filtered);
    } catch {
      toast.error("Erreur lors du chargement des livres similaires");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) {
    return <div className="text-center p-6">Livre introuvable</div>;
  }

  return (
    <div className="flex-1 px-5 space-y-6 mb-[120px] pt-[120px]">
      <div className="w-[160px] h-[240px] relative shadow-lg mx-auto">
        <Image
          src={book.coverImage || "/placeholder.png"}
          alt={book.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 width-full ">
          <h1 className="text-2xl font-bold">{book.title}</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {book.publicationYear}
          </p>
        </div>

        <p className="text-muted-foreground text-sm ">
          par <span className="underline"> {book.author}</span>
        </p>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1 font-bold">
            <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
            4.5
          </span>
          <span>(2100)</span>
        </p>
      </div>

      <div className="flex flex-col pt-2 gap-2">
        <div className="flex gap-2  flex-wrap">
          {book.genre && (
            <Badge variant="default" className="capitalize">
              {book.genre}
            </Badge>
          )}
        </div>

        <h2 className="text-lg font-bold">Description</h2>
        <p className="text-sm text-muted-foreground whitespace-pre-line">
          {book.description || "Aucune description disponible."}
        </p>
      </div>

      <div className="flex flex-col pt-2 gap-2">
        {relatedBooks.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">
              {relatedBooks.length > 1
                ? "Livres du même genre"
                : "Livre du même genre"}
            </h2>
            <div className="flex gap-6 overflow-x-auto scrollbar-none py-1">
              {relatedBooks.map((related) => (
                <div
                  key={related.id}
                  className="min-w-[120px] h-[180px] cursor-pointer shrink-0 relative shadow-md"
                  onClick={() => router.push(`/books/${related.id}`)}
                >
                  <Image
                    src={related.coverImage}
                    alt={related.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}{" "}
      </div>
    </div>
  );
}
