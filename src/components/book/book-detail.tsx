"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Star, Bookmark } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { bookService } from "@/services/book.service";
import { bookListService } from "@/services/book-list.service";

import type { Book } from "@/types/bookTypes";
import type { BookList } from "@/types/bookListTypes";

interface BookProps {
  id: string;
}

export default function BookDetail({ id }: BookProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [bookLists, setBookLists] = useState<BookList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBookDetails(id);
    fetchBookLists();
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
    } catch {
      toast.error("Erreur de chargement du livre");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBooksByGenre = async (genre: string, currentBookId: string) => {
    try {
      const res = await bookService.getBooks();
      const filtered = res.data
        .filter((b: Book) => b.genre === genre && b.id !== currentBookId)
        .slice(0, 10);
      setRelatedBooks(filtered);
    } catch {
      toast.error("Erreur lors du chargement des livres similaires");
    }
  };

  const fetchBookLists = async () => {
    try {
      const res = await bookListService.getBookLists();
      setBookLists(res.data);
    } catch {
      toast.error("Impossible de récupérer les listes");
    }
  };

  const isBookInList = (list: BookList) =>
    list.books?.some((b) => b.id === book?.id);

  const handleToggleBookInList = async (list: BookList) => {
    if (!book) return;
    const alreadyIn = isBookInList(list);
    try {
      if (alreadyIn) {
        await bookListService.removeBookFromList(list.id, book.id);
        toast.success(`Retiré de "${list.name}"`);
      } else {
        await bookListService.addBookToList(list.id, {
          bookIds: [book.id],
        });
        toast.success(`Ajouté à "${list.name}"`);
      }
      await fetchBookLists();
    } catch {
      toast.error("Erreur lors de la mise à jour de la liste");
    }
  };

  const isBookInAnyList = () => bookLists.some((list) => isBookInList(list));

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
    <div className="space-y-6 mb-[100px] pt-[56px] bg-accent-100">
      {/* Image + bouton ajout */}
      <div className="w-[160px] h-[240px] relative shadow-lg mx-auto px-5 ">
        <Image
          src={book.coverImage || "/placeholder.png"}
          alt={book.title}
          fill
          className="object-cover rounded-sm"
        />

        <div className="absolute right-[-40]">
          <Popover>
            <PopoverTrigger asChild>
              <Bookmark
                className="w-7 h-7 text-gray-500"
                fill={isBookInAnyList() ? "currentColor" : "none"}
              />
            </PopoverTrigger>
            <PopoverContent className="p-2 space-y-1 w-48">
              {bookLists.map((list) => {
                const active = isBookInList(list);
                return (
                  <Button
                    key={list.id}
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => handleToggleBookInList(list)}
                  >
                    {list.name}
                  </Button>
                );
              })}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="relative ">
        <div className="absolute top-[-130px]  -translate-x-1/2 w-full z-1  ">
          <svg
            className="block w-[200%] h-[200px] drop-shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
            viewBox="0 0 200 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,100 Q100,0 200,100 L200,100 L0,100 Z" fill="white" />
          </svg>
        </div>

        {/* Titre / auteur / note */}
        <div className="space-y-6 bg-white mt-16 pt-2 px-5 z-[8] relative">
          <div className="flex flex-col gap-2 ">
            <div className="flex gap-2">
              <h1 className="text-2xl font-bold">{book.title}</h1>
              {book.publicationYear && (
                <p className="text-muted-foreground text-sm mt-2">
                  ({book.publicationYear})
                </p>
              )}
            </div>

            <p className="text-muted-foreground text-sm">
              par <span className="underline">{book.author}</span>
            </p>

            {/* Etoiles */}
            {/* <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-bold">
                <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
                4.5
              </span>
              <span>(2100)</span>
            </p> */}
          </div>

          {/* Tags + description */}
          <div className="flex flex-col pt-2 gap-2">
            {book.genre && (
              <div className="flex gap-2 flex-wrap">
                <Badge variant="default" className="capitalize">
                  {book.genre}
                </Badge>
              </div>
            )}

            <h2 className="text-lg font-bold">Description</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {book.description || "Aucune description disponible."}
            </p>
          </div>

          {/* Suggestions */}
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
                        src={related.coverImage || "/placeholder.png"}
                        alt={related.title}
                        fill
                        className="object-cover  rounded-sm "
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
