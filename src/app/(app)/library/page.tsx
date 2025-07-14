"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Book, Lock, Globe, BookOpen } from "lucide-react";
import { bookListService } from "@/services/book-list.service";
import type { BookList } from "@/types/bookListTypes";
import BookListCards from "@/components/library/book-list-cards";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Library() {
  const [bookLists, setBookLists] = useState<BookList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadBookLists();
  }, []);

  const loadBookLists = async () => {
    try {
      setIsLoading(true);
      const response = await bookListService.getBookLists();

      const sortedLists = response.data.sort(
        (a: BookList, b: BookList) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setBookLists(sortedLists);
    } catch (error) {
      toast.error("Impossible de charger les listes de lecture");
      setBookLists([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScrollArea className="flex-1 px-5 pb-[120px] pt-25">
        <div className="space-y-6">
          <BookListCards bookLists={bookLists} isLoadingLists={isLoading} />
        </div>
      </ScrollArea>

      <FloatingActionButton
        onClick={() => router.push("/library/create")}
        className="bottom-[110px] w-14 h-14"
      />
    </>
  );
}
