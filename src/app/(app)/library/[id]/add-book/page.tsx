'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Plus, Book } from "lucide-react";
import { bookListService } from "@/services/book-list.service";
import { bookService } from "@/services/book.service";
import { Book as BookType } from "@/types/book";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";

export default function AddBook({ params }: { params: { id: string } }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<BookType[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (!term.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const response = await bookService.searchBooks(term);
            setSearchResults(response.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de rechercher des livres"
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddBook = async (bookId: string) => {
        try {
            setIsAdding(true);
            await bookListService.addBookToList(params.id, { bookId });
            toast({
                title: "Succès",
                description: "Livre ajouté à la liste"
            });
            router.push(`/library/${params.id}`);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible d'ajouter le livre"
            });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="flex-1 px-5 pb-[120px] pt-[120px]">
            <div className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un livre..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={handleSearch}
                        disabled={isAdding}
                    />
                </div>

                <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-4">
                        {isSearching ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((book) => (
                                <Card key={book.id} className="p-4">
                                    <div className="flex gap-4">
                                        {book.coverImage ? (
                                            <div className="relative w-16 h-24 flex-shrink-0">
                                                <Image
                                                    src={book.coverImage}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-24 flex-shrink-0 bg-muted flex items-center justify-center rounded">
                                                <Book className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-medium truncate">{book.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {book.author}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    onClick={() => handleAddBook(book.id)}
                                                    disabled={isAdding}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {book.genre}
                                                </Badge>
                                                {book.publicationYear && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {book.publicationYear}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : searchTerm ? (
                            <div className="text-center text-muted-foreground py-8">
                                Aucun résultat trouvé
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                Commencez à taper pour rechercher des livres
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                    disabled={isAdding}
                >
                    Retour
                </Button>
            </div>
        </div>
    );
} 