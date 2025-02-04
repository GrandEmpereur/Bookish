'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Book, Calendar, Globe, Lock, Trash2, Edit, Plus } from "lucide-react";
import { bookListService } from "@/services/book-list.service";
import { BookList } from "@/types/book-list";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';

interface BookListDetailProps {
    id: string;
}

export function BookListDetail({ id }: BookListDetailProps) {
    console.log('BookListDetail component rendered with id:', id);
    const [bookList, setBookList] = useState<BookList | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        loadBookList();
    }, [id]);

    const loadBookList = async () => {
        try {
            setIsLoading(true);
            const response = await bookListService.getBookList(id);
            console.log('BookList response:', response);
            setBookList(response);
        } catch (error) {
            console.error('Error loading book list:', error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger la liste"
            });
            router.push('/library');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette liste ?')) return;

        try {
            setIsDeleting(true);
            await bookListService.deleteBookList(id);
            toast({
                title: "Succès",
                description: "Liste supprimée avec succès"
            });
            router.push('/library');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de supprimer la liste"
            });
        } finally {
            setIsDeleting(false);
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
        <div className="flex-1 px-5 pb-[20px] pt-[120px]">
            {/* En-tête de la liste */}
            <div className="space-y-4 mb-8">
                {bookList.coverImage && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image
                            src={bookList.coverImage}
                            alt={bookList.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold mb-2">{bookList.name}</h1>
                        {bookList.description && (
                            <p className="text-muted-foreground">
                                {bookList.description}
                            </p>
                        )}
                    </div>
                    <Badge variant={bookList.visibility === 'public' ? "default" : "secondary"}>
                        {bookList.visibility === 'public' ? (
                            <Globe className="h-4 w-4 mr-1" />
                        ) : (
                            <Lock className="h-4 w-4 mr-1" />
                        )}
                        {bookList.visibility === 'public' ? 'Public' : 'Privé'}
                    </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                        Créée le {format(new Date(bookList.createdAt), 'dd MMMM yyyy', { locale: fr })}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-6">
                <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => router.push(`/library/${id}/edit`)}
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                </Button>
                <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => router.push(`/library/${id}/add-book`)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un livre
                </Button>
                <Button 
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Liste des livres */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Livres dans la liste
                    {bookList.books && (
                        <Badge variant="secondary" className="ml-2">
                            {bookList.books.length}
                        </Badge>
                    )}
                </h2>
                {bookList.books && bookList.books.length > 0 ? (
                    bookList.books.map((book) => (
                        <Card key={book.id} className="p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium">{book.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {book.author}
                                    </p>
                                </div>
                                <Badge variant={
                                    book.reading_status === 'finished' ? "default" :
                                    book.reading_status === 'reading' ? "secondary" :
                                    "outline"
                                }>
                                    {book.reading_status === 'to_read' && 'À lire'}
                                    {book.reading_status === 'reading' && 'En cours'}
                                    {book.reading_status === 'finished' && 'Terminé'}
                                </Badge>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        Aucun livre dans cette liste coucou
                    </div>
                )}
            </div>
        </div>
    );
}