"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Book,
  Calendar,
  Globe,
  Lock,
  Trash2,
  Edit,
  Plus,
  BookOpen,
  Share2,
  MoreVertical,
} from "lucide-react";
import { bookListService } from "@/services/book-list.service";
import { BookList } from "@/types/bookListTypes";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";
import { Share } from "@capacitor/share";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BookListDetailProps {
  id: string;
}

export function BookListDetail({ id }: BookListDetailProps) {
  const [bookList, setBookList] = useState<BookList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadBookList();
  }, [id]);

  const loadBookList = async () => {
    try {
      setIsLoading(true);
      const response = await bookListService.getBookList(id);
      setBookList(response.data);
    } catch (error) {
      toast.error("Impossible de charger la liste");
      router.push("/library");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await bookListService.deleteBookList(id);
      toast.success("Liste supprimée avec succès");
      router.push("/library");
    } catch (error) {
      toast.error("Impossible de supprimer la liste");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleShare = async () => {
    try {
      const shareOptions = {
        title: bookList?.name,
        text: bookList?.description || `Liste de lecture : ${bookList?.name}`,
        url: `${window.location.origin}/library/${id}`,
        dialogTitle: "Partager cette liste de lecture",
        ...(bookList?.coverImage && {
          files: [bookList.coverImage],
        }),
      };

      await Share.share(shareOptions);
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Impossible de partager cette liste");
    }
  };

  const handleRemoveBook = async (bookId: string) => {
    try {
      await bookListService.removeBookFromList(id, bookId);
      toast.success("Livre retiré de la liste");
      loadBookList(); // Recharger la liste
    } catch (error) {
      toast.error("Impossible de retirer le livre");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bookList) {
    return null;
  }

  return (
    <>
      <div className="flex-1 px-5 pb-[120px] pt-[120px]">
        <div className="space-y-6">
          {/* En-tête avec image de couverture */}
          {bookList.coverImage ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={bookList.coverImage}
                alt={bookList.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
              <Book className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Informations de la liste */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{bookList.name}</h1>
                {bookList.description && (
                  <p className="text-muted-foreground">
                    {bookList.description}
                  </p>
                )}
              </div>
              <Badge variant={"outline"} className="mt-1">
                {bookList.visibility === "public" ? (
                  <Globe className="h-4 w-4" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                {bookList.visibility === "public" ? "Public" : "Privé"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Créée le{" "}
                  {format(new Date(bookList.createdAt), "dd MMMM yyyy", {
                    locale: fr,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>
                  {bookList.bookCount}{" "}
                  {bookList.bookCount > 1 ? "livres" : "livre"}
                </span>
              </div>
              <Badge variant="outline">
                {bookList.genre.charAt(0).toUpperCase() +
                  bookList.genre.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => router.push(`/library/${id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => router.push(`/library/${id}/add-book`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un livre
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
            <Button
              variant="destructive"
              className="w-full flex items-center justify-center"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>

          {/* Liste des livres */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Livres dans la liste</h2>
            {bookList.books && bookList.books.length > 0 ? (
              bookList.books.map((book) => (
                <Card key={book.id} className="p-4">
                  <div className="flex gap-4">
                    {book.coverImage ? (
                      <div className="relative w-16 h-24 shrink-0">
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-24 shrink-0 bg-muted flex items-center justify-center rounded">
                        <Book className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{book.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {book.author}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleRemoveBook(book.id)}
                                className="text-destructive"
                              >
                                Retirer de la liste
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {"Aucun genre"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Aucun livre dans cette liste
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la liste</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette liste ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
