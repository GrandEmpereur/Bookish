'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { bookListService } from "@/services/book-list.service";
import { bookService } from "@/services/book.service";
import { Book } from "@/types/book";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AddBook({ params }: { params: { id: string } }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();
    const { toast } = useToast();



    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
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
        <div className="flex-1 px-5 pb-[20px] pt-[120px]">
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
                                            onClick={() => handleAddBook(book.id)}
                                            disabled={isAdding}
                                        >
                                            Ajouter
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        ) : searchTerm ? (
                            <div className="text-center text-muted-foreground py-8">
                                Aucun résultat trouvé
                            </div>
                        ) : null}
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