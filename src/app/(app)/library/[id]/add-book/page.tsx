"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Loader2, 
  Book, 
  Plus, 
  Search, 
  X, 
  Check, 
  BookOpen
} from "lucide-react";
import { bookListService } from "@/services/book-list.service";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { use } from "react";
import type { Book as BookType } from "@/types/bookTypes";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Capacitor } from "@capacitor/core";
import { searchService } from "@/services/search.service";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AddBookToList({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const isNative = Capacitor.isNativePlatform();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BookType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState<BookType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSelectedModal, setShowSelectedModal] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // load books with correct typing
  const fetchBooks = useCallback(
    async (reset = false) => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        setHasMore(false);
        return;
      }
      try {
        setIsSearching(true);
        const response = await searchService.searchBooks({
          query: debouncedSearchQuery,
          page,
          limit: 20,
        });
        
        const books = response.data.books || [];
        setSearchResults((prev) => (reset ? books : [...prev, ...books]));
        
        const pagination = response.data.pagination;
        if (pagination) {
          setHasMore(pagination.current_page < pagination.total_pages);
        }
      } catch (error: any) {
        console.error("Search error:", error);
        toast.error(error.message || "Impossible de rechercher des livres");
      } finally {
        setIsSearching(false);
      }
    },
    [debouncedSearchQuery, page]
  );

  // trigger new search
  useEffect(() => {
    setPage(1);
    fetchBooks(true);
  }, [debouncedSearchQuery]);

  // infinite scroll sentinel
  const { loadMoreRef } = useInfiniteScroll({
    loading: isSearching,
    hasMore,
    onLoadMore: () => setPage((p) => p + 1),
    threshold: 0.8,
  });

  // fetch more when page increments
  useEffect(() => {
    if (page > 1) fetchBooks();
  }, [page, fetchBooks]);

  const handleSelectBook = useCallback(
    (book: BookType) => {
      setSelectedBooks((prev) => {
        if (prev.some((b) => b.id === book.id)) return prev;
        if (prev.length >= 50) {
          toast.error("Vous ne pouvez pas ajouter plus de 50 livres à la fois");
          return prev;
        }
        return [...prev, book];
      });
      toast.success(`"${book.title}" ajouté à la sélection`);
    },
    []
  );

  const handleRemoveBook = useCallback((bookId: string) => {
    setSelectedBooks((prev) => prev.filter((book) => book.id !== bookId));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selectedBooks.length === 0) {
      toast.error("Veuillez sélectionner au moins un livre");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await bookListService.addBookToList(id, {
        bookIds: selectedBooks.map((book) => book.id),
      });

      toast.success(response.message);

      if (response.data.existingBooks.length > 0) {
        toast.info(
          `Les livres suivants étaient déjà dans la liste : ${response.data.existingBooks
            .map((book) => book.title)
            .join(", ")}`
        );
      }

      setTimeout(() => {
        router.push(`/library/${id}`);
      }, 1000);
    } catch (error: any) {
      toast.error(
        error.message || "Impossible d'ajouter les livres à la liste"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [id, router, selectedBooks]);

  const BookCard = ({ book, isSelected, onSelect, onRemove }: {
    book: BookType;
    isSelected: boolean;
    onSelect: () => void;
    onRemove?: () => void;
  }) => (
    <div>
        <div className="flex gap-4">
          {book.cover_image ? (
            <div className="relative w-20 h-28 shrink-0 rounded-lg overflow-hidden shadow-sm border">
              <Image
                src={book.cover_image}
                alt={book.title}
                fill
                className="object-cover"
                sizes="80px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full bg-muted flex items-center justify-center">
                        <svg class="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z" />
                        </svg>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-20 h-28 shrink-0 bg-muted flex items-center justify-center rounded-lg border">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm leading-tight truncate">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 truncate">
                  {book.author}
                </p>
                {book.genre && (
                  <Badge variant="secondary" className="text-xs mt-2">
                    {book.genre}
                  </Badge>
                )}
              </div>
              <Button
                variant={isSelected ? "destructive" : "outline"}
                size="sm"
                onClick={isSelected ? onRemove : onSelect}
                className="shrink-0"
              >
                {isSelected ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
    </div>
  );

  const SearchResultsSkeleton = () => (
    <div>
      {[...Array(6)].map((_, i) => (
        <div key={i}>
            <div>
              <Skeleton />
              <div>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
              <Skeleton />
            </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className={cn(
        "flex-1 bg-background",
        isNative ? "pt-[120px]" : "pt-[100px]",
        "pb-[120px]"
      )}>
        {/* Search Bar */}
        <div className="sticky top-[75px] z-40 bg-background border-b px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Recherchez et sélectionnez des livres à ajouter
              </p>
            </div>
            {selectedBooks.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSelectedModal(true)}
                className="shrink-0"
              >
                <Check className="h-4 w-4 mr-2" />
                {selectedBooks.length}
              </Button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher des livres par titre, auteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6">
          {/* Search Results */}
          {searchQuery ? (
            <div className="space-y-4">
              {searchResults.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-medium text-muted-foreground">
                      Résultats de recherche
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {searchResults.length} livre(s)
                    </span>
                  </div>
                  <div className="space-y-3">
                    {searchResults.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        isSelected={selectedBooks.some((b) => b.id === book.id)}
                        onSelect={() => handleSelectBook(book)}
                        onRemove={() => handleRemoveBook(book.id)}
                      />
                    ))}
                  </div>
                  {/* Load More */}
                  <div ref={loadMoreRef} className="flex justify-center py-4">
                    {isSearching && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Chargement...</span>
                      </div>
                    )}
                    {!hasMore && !isSearching && searchResults.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Tous les résultats ont été chargés
                      </p>
                    )}
                  </div>
                </>
              ) : isSearching ? (
                <SearchResultsSkeleton />
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Aucun résultat trouvé</h3>
                  <p className="text-muted-foreground text-sm">
                    Essayez d'autres termes de recherche
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Recherchez des livres</h3>
              <p className="text-muted-foreground text-sm">
                Utilisez la barre de recherche pour trouver des livres à ajouter
              </p>
            </div>
          )}
        </div>

        {/* Fixed Bottom Action */}
        {selectedBooks.length > 0 && (
          <div>
            <div>
                <div>
                  <div>
                    <p>
                      {selectedBooks.length} livre(s) sélectionné(s)
                    </p>
                    <p>
                      Prêt à ajouter à la liste
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSelectedModal(true)}
                    >
                      Voir
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Ajouter
                    </Button>
                  </div>
                </div>
          </div>
          </div>
        )}
      </div>

      {/* Selected Books Modal */}
      <Dialog open={showSelectedModal} onOpenChange={setShowSelectedModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Livres sélectionnés ({selectedBooks.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-3 pr-4">
                {selectedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isSelected={true}
                    onSelect={() => {}}
                    onRemove={() => handleRemoveBook(book.id)}
                  />
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSelectedModal(false)}
                className="flex-1"
              >
                Continuer
              </Button>
              <Button
                onClick={() => {
                  setShowSelectedModal(false);
                  handleSubmit();
                }}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
