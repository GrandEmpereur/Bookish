'use client';

import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Book } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { bookListService } from "@/services/book-list.service";
import type { BookList } from "@/types/bookListTypes";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<BookList[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 1000);

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
            console.error('Search error:', error);
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
            return Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg bg-card">
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
                    <p>Aucune librairie trouvée</p>
                </div>
            );
        }

        return results.map((library) => (
            <button
                key={library.id}
                onClick={() => handleSelectLibrary(library.id)}
                className="w-full text-left transition-colors hover:bg-accent rounded-lg overflow-hidden group"
            >
                <div className="p-4 flex gap-4">
                    <div className="relative h-[100px] w-[70px] flex-shrink-0 overflow-hidden rounded-md">
                        {library.coverImage ? (
                            <Image
                                src={library.coverImage}
                                alt={library.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Book className="h-8 w-8 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{library.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {library.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                            <Badge variant="secondary">
                                {library.bookCount} livre{library.bookCount > 1 ? 's' : ''}
                            </Badge>
                            <Badge variant="outline">
                                {library.genre}
                            </Badge>
                        </div>
                    </div>
                </div>
            </button>
        ));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Rechercher dans mes librairies</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher une librairie..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="pl-9"
                            autoFocus
                        />
                    </div>
                    <ScrollArea className="max-h-[60vh] -mx-6">
                        <div className="px-6 space-y-3">
                            {renderResults()}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
} 