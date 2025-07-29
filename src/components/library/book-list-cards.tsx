"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Book, BookOpen, Globe, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BookListSkeleton from "@/components/library/book-list-skeleton";

import type { BookList } from "@/types/bookListTypes";

interface BookListCardsProps {
  bookLists: BookList[];
  isLoadingLists?: boolean;
}
export default function BookListCards({
  bookLists,
  isLoadingLists = false,
}: BookListCardsProps) {
  const router = useRouter();

  if (isLoadingLists) {
    return <div className="space-y-6">{BookListSkeleton()}</div>;
  }

  if (!bookLists || bookLists.length === 0) {
    return (
      <div className="text-center py-8">
        <Book className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
        <p className="mt-4 text-muted-foreground">
          Vous n'avez pas encore créé de liste
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/library/create")}
        >
          Créer une liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookLists.map((list) => (
        <Card
          key={list.id}
          className="py-0 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(`/library/${list.id}`)}
        >
          <div className="p-4 flex flex-row gap-4">
            {list.cover_image ? (
              <div className="relative w-24 h-32 shrink-0">
                <Image
                  src={list.cover_image}
                  alt={list.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="w-24 h-32 shrink-0 bg-muted flex items-center justify-center rounded-md">
                <Book className="h-8 w-8 text-muted-foreground" />
              </div>
            )}

            <div className="flex-1 flex flex-col justify-between min-h-[130px]">
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
                      {list.book_count}{" "}
                      {list.book_count > 1 ? "livres" : "livre"}
                    </Badge>
                  </div>

                  {list.description && (
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {list.description}
                    </p>
                  )}
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
      ))}
    </div>
  );
}
