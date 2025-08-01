"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Star, Bookmark, Plus } from "lucide-react";

import { BookSuggestions } from "@/components/ui/book-suggestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { ReviewPopover } from "@/components/review/review-popover";

import { bookService } from "@/services/book.service";
import { bookListService } from "@/services/book-list.service";
import { authorService } from "@/services/author.service";

import type { Book } from "@/types/bookTypes";
import type { BookList } from "@/types/bookListTypes";

import type { Review } from "@/types/reviewTypes";
import { reviewService } from "@/services/review.service";
import { userService } from "@/services/user.service";

interface BookProps {
  id: string;
}

export default function BookDetail({ id }: BookProps) {
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [bookLists, setBookLists] = useState<BookList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const router = useRouter();

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchBookDetails(id);
    fetchBookLists();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getAuthenticatedProfile();
        setCurrentUserId(res.data.id);
      } catch (err) {
        console.error("Impossible de récupérer l'utilisateur", err);
      }
    };

    fetchUser();
  }, []);

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
    } catch (err) {
      console.error(err);
      toast.error("Erreur de chargement du livre");
    } finally {
      setIsLoading(false);
    }
  };

  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = async () => {
    try {
      const res = await reviewService.getReviewsForBook(id);
      const data = res.data;
      setReviews(data.reviews);
      setAverageRating(data.statistics.average_rating || null);
      setTotalReviews(data.statistics.total_reviews || 0);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des avis");
    }
  };

  useEffect(() => {
    fetchBookDetails(id);
    fetchBookLists();
    fetchReviews();
  }, [id]);

  const goToAuthorPage = async () => {
    try {
      const res = await authorService.getAuthors();

      const normalize = (str: string) => str.toLowerCase().replace(/\s/g, "");

      const bookAuthor = book?.author ?? "";
      const normalizedBookAuthor = normalize(bookAuthor);

      const author = res.data.find(
        (a) => normalize(a.name) === normalizedBookAuthor
      );

      if (author) {
        router.push(`/authors/${author.id}`);
      } else {
        toast.error("Auteur introuvable");
      }
    } catch (err) {
      toast.error("Erreur lors de la recherche de l'auteur");
    }
  };

  const fetchBooksByGenre = async (genre: string, currentBookId: string) => {
    try {
      const res = await bookService.getBooks();

      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("Liste de livres invalide");
      }

      const filtered = res.data
        .filter((b: Book) => b.genre === genre && b.id !== currentBookId)
        .slice(0, 10);

      setRelatedBooks(filtered);
    } catch (err) {
      console.error(err);
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

  type BookListWithIds = BookList & {
    book_ids?: string[];
  };

  const isBookInList = (list: BookListWithIds) =>
    list.book_ids?.includes(book?.id ?? "");

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
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) {
    return <div className="text-center p-6">Livre introuvable</div>;
  }

  return (
    <div className="space-y-3 pt-[38px] bg-accent-100 overflow-hidden">
      {/* Image + bouton ajout */}
      <div className="w-[130px] h-[180px] relative mx-auto px-5 ">
        <Image
          src={book.cover_image || "/placeholder.png"}
          alt={book.title}
          fill
          className="object-cover [box-shadow:var(--shadow-strong)]"
        />

        <div className="absolute right-[-40]">
          <Popover>
            <PopoverTrigger asChild>
              <Bookmark
                className="w-6 h-6 text-primary"
                fill={isBookInAnyList() ? "currentColor" : "none"}
              />
            </PopoverTrigger>
            <PopoverContent className="p-2 space-y-2 w-48">
              {bookLists.length === 0 ? (
                <p
                  className="flex w-full align-center gap-1 justify-start text-sm"
                  onClick={() => router.push("/library/create/")}
                >
                  <Plus className="h-4 w-4" />
                  Créer une liste
                </p>
              ) : (
                bookLists.map((list) => {
                  const active = isBookInList(list);
                  return (
                    <Button
                      key={list.id}
                      variant={active ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handleToggleBookInList(list)}
                    >
                      <span className="block truncate max-w-full">
                        {list.name}
                      </span>
                    </Button>
                  );
                })
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {book.genre && (
        <div className="flex justify-center">
          <Badge variant="default" className="capitalize">
            {book.genre}
          </Badge>
        </div>
      )}

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
          <div className="flex flex-col gap-1 ">
            <div className="flex gap-2">
              <h1 className="text-2xl font-bold">{book.title}</h1>
              {book.publicationYear && (
                <p className="text-muted-foreground text-sm mt-2">
                  ({book.publicationYear})
                </p>
              )}
            </div>

            <p className="text-muted-foreground text-sm">
              par{" "}
              <button
                onClick={goToAuthorPage}
                className="underline hover:text-primary transition-colors"
              >
                {book.author}
              </button>
            </p>

            {/* Etoiles */}
            {currentUserId && (
              <ReviewPopover
                bookId={book.id}
                reviews={reviews}
                averageRating={averageRating}
                totalReviews={totalReviews}
                onReviewAdded={fetchReviews}
                currentUserId={currentUserId}
              />
            )}
          </div>

          {/* Tags + description */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold">Description</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {book.description || "Aucune description disponible."}
            </p>
          </div>

          {relatedBooks.length > 0 && (
            <BookSuggestions
              books={relatedBooks}
              title={
                relatedBooks.length > 1
                  ? "Livres du même genre"
                  : "Livre du même genre"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
