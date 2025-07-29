"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Book, BookOpen, Globe, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { bookListService } from "@/services/book-list.service";
import type { BookList } from "@/types/bookListTypes";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRef, useLayoutEffect } from "react";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<BookList[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) {
      setHasScroll(el.scrollHeight > el.clientHeight);
    }
  }, [results, isSearching]);

  useEffect(() => {
    performSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await bookListService.searchMyBookLists({ query });
      setResults(response.data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSelectLibrary = (id: string) => {
    router.push(`/library/${id}`);
    onOpenChange(false);
  };

  const renderResults = () => {
    if (isSearching) {
      return Array(3)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-6 p-2 border rounded-lg bg-card"
          >
            <Skeleton className="h-[100px] w-[70px] rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ));
    }

    if (results.length === 0 && searchQuery) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Book className="h-12 w-12 mb-2 opacity-20" />
          <p>Aucune liste trouvée</p>
        </div>
      );
    }

    return results.map((list) => (
      <Card
        key={list.id}
        className="py-0 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => router.push(`/library/${list.id}`)}
      >
        <div className="p-2 flex flex-row gap-4">
          {list.cover_image ? (
            <div className="relative w-20 h-24 shrink-0">
              <Image
                src={list.cover_image}
                alt={list.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
          ) : (
            <div className="w-20 h-24 shrink-0 bg-muted flex items-center justify-center rounded-md">
              <Book className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 flex flex-col justify-between ">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">{list.name}</h3>

                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="default" className="text-xs">
                    {list.genre.charAt(0).toUpperCase() + list.genre.slice(1)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                  >
                    <BookOpen className="h-3 w-3" />
                    {list.book_count} {list.book_count > 1 ? "livres" : "livre"}
                  </Badge>
                </div>
              </div>
              {list.visibility === "private" ? (
                <Lock className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
              ) : (
                <Globe className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
              )}
            </div>
          </div>
        </div>
      </Card>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Rechercher dans mes listes</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col flex-1">
          {/* Search input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une liste..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9"
              autoFocus
            />
          </div>

          {/* Conditionally scrollable results */}
          {results.length > 0 || isSearching ? (
            <ScrollArea className="flex-1 overflow-y-auto -mx-6 max-h-[400px]">
              <div className="px-6 space-y-3 pb-4">{renderResults()}</div>
            </ScrollArea>
          ) : (
            <div className="space-y-3">{renderResults()}</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
