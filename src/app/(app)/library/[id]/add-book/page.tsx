'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Book, Plus, Search, X, Check } from "lucide-react";
import { bookService } from "@/services/book.service";
import { bookListService } from "@/services/book-list.service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { use } from 'react';
import { Book as BookType } from "@/types/book";
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from "@/lib/utils";
import { existingBooks } from '@/types/book-list';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function AddBookToList({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<BookType[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedBooks, setSelectedBooks] = useState<BookType[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim()) return setSearchResults([]);

        try {
            setIsSearching(true);
            const response = await bookService.searchBooks({
                query,
                limit: 10,
                sort_by: 'relevance'
            });
            setSearchResults(response.data.books);
        } catch {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de rechercher des livres"
            });
        } finally {
            setIsSearching(false);
        }
    }, [toast]);

    const handleSelectBook = useCallback((book: BookType) => {
        setSelectedBooks(prev => {
            if (prev.some(b => b.id === book.id)) return prev;
            return [...prev, book];
        });
    }, []);

    const handleRemoveBook = useCallback((bookId: string) => {
        setSelectedBooks(prev => prev.filter(book => book.id !== bookId));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (selectedBooks.length === 0) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Veuillez sélectionner au moins un livre"
            });
            return;
        }

        try {
            setIsSubmitting(true);
            
            const response = await bookListService.addBooksToList(id, { 
                bookIds: selectedBooks.map(book => book.id) 
            });

            const { status, message } = response;

            if (status === 'success') {
                toast({
                    title: "Succès",
                    description: (
                        <div className="">
                            <p>{message}</p>
                            <p>Les livres suivants sont déjà dans la liste : <br />{response.data?.existingBooks?.map((book: existingBooks) => book.title).join(", ")}</p>
                        </div>
                    ),
                    duration: 3000,
                });
                
                router.push(`/library/${id}`);
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Impossible d'ajouter les livres à la liste"
            });
        } finally {
            setIsSubmitting(false);
        }
    }, [id, router, toast, selectedBooks]);

    useEffect(() => {
        if (debouncedSearchQuery) {
            handleSearch(debouncedSearchQuery);
        }
    }, [debouncedSearchQuery, handleSearch]);

    if (isSearching) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex-1 px-5 pb-[120px] pt-[120px]">
            <div className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un livre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h2 className="font-semibold">Résultats de recherche</h2>
                        <ScrollArea className="h-[400px] rounded-md border p-4">
                            <div className="space-y-4">
                                {isSearching ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((book) => (
                                        <Card 
                                            key={book.id} 
                                            className={cn(
                                                "p-4",
                                            )}
                                        >
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
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-medium">{book.title}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {book.author}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleSelectBook(book)}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="mt-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            {book.genre.charAt(0).toUpperCase() + book.genre.slice(1)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : searchQuery ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        Aucun résultat trouvé
                                    </div>
                                ) : null}
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-semibold">Livres sélectionnés ({selectedBooks.length})</h2>
                        <ScrollArea className="h-[400px] rounded-md border p-4">
                            <div className="space-y-4">
                                {selectedBooks.length > 0 ? (
                                    selectedBooks.map((book) => (
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
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h3 className="font-medium">{book.title}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {book.author}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveBook(book.id)}
                                                            className="text-destructive"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        Aucun livre sélectionné
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {selectedBooks.length > 0 && (
                            <Button 
                                className="w-full"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                Ajouter {selectedBooks.length} livre(s) à la liste
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
