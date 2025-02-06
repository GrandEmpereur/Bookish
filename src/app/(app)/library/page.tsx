'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Book, Lock, Globe, BookOpen } from "lucide-react";
import { bookListService } from "@/services/book-list.service";
import { BookList } from "@/types/book-list";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';

export default function Library() {
    const [bookLists, setBookLists] = useState<BookList[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        loadBookLists();
    }, []);

    const loadBookLists = async () => {
        try {
            setIsLoading(true);
            const response = await bookListService.getBookLists();
            const sortedLists = response.data.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setBookLists(sortedLists);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger les listes de lecture"
            });
            setBookLists([]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <ScrollArea className="flex-1 px-5 pb-[120px] pt-[120px]">
                <div className="space-y-4">
                    {bookLists && bookLists.length > 0 ? (
                        bookLists.map((list) => (
                            <Card
                                key={list.id}
                                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => router.push(`/library/${list.id}`)}
                            >
                                <div className="flex">
                                    {list.coverImage ? (
                                        <div className="relative w-24 h-32 flex-shrink-0">
                                            <Image
                                                src={list.coverImage}
                                                alt={list.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-32 flex-shrink-0 bg-muted flex items-center justify-center">
                                            <Book className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    
                                    <div className="flex-1 p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <h3 className="font-semibold">{list.name}</h3>
                                                {list.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {list.description}
                                                    </p>
                                                )}
                                            </div>
                                            {list.visibility === 'private' ? (
                                                <Lock className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Globe className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                {list.genre.charAt(0).toUpperCase() + list.genre.slice(1)}
                                            </Badge>
                                            <Badge 
                                                variant="secondary" 
                                                className="text-xs flex items-center gap-1"
                                            >
                                                <BookOpen className="h-3 w-3" />
                                                {list.bookCount} {list.bookCount > 1 ? 'livres' : 'livre'}
                                            </Badge>
                                            {list.visibility === 'public' && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Public
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            Vous n'avez pas encore de liste de lecture
                        </div>
                    )}
                </div>
            </ScrollArea>

            <FloatingActionButton
                onClick={() => router.push('/library/create')}
                className="bottom-[110px]"
            />
        </>
    );
}
