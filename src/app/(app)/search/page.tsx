'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchService } from '@/services/search.service';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/layout/top-bar";

const categories = [
    { id: 1, name: 'Motivation' },
    { id: 2, name: 'Fiction' },
    { id: 3, name: 'Sports' },
    { id: 4, name: 'Inspirant' },
    { id: 5, name: 'Education' },
    { id: 6, name: 'Non-Fiction' },
    { id: 7, name: 'Futurisitique' },
    { id: 8, name: 'Adventure' },
    { id: 9, name: 'Horror' },
];

const authors = [
    { id: 1, name: 'Stephen Covey', image: '/authors/stephen-covey.jpg' },
    { id: 2, name: 'James Clear', image: '/authors/james-clear.jpg' },
    { id: 3, name: 'Napaoleon Hill', image: '/authors/napoleon-hill.jpg' },
    { id: 4, name: 'Morgan Housel', image: '/authors/morgan-housel.jpg' },
];

interface SearchResults {
    books: Book[];
    isLoading: boolean;
}

export default function SearchPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResults>({
        books: [],
        isLoading: false
    });
    const { toast } = useToast();
    const searchParams = useSearchParams();

    // Debounce la recherche pour éviter trop d'appels API
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                performSearch(searchQuery, selectedCategories);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategories]);

    const performSearch = async (query: string, categories?: number[]) => {
        if (!query.trim()) {
            setSearchResults({ books: [], isLoading: false });
            return;
        }

        setSearchResults(prev => ({ ...prev, isLoading: true }));
        try {
            const response = await searchService.searchBooks({
                query,
                page: 1,
                limit: 10,
                genre: categories?.join(',')
            });

            setSearchResults({
                books: response.data.items,
                isLoading: false
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible d'effectuer la recherche"
            });
            setSearchResults(prev => ({ ...prev, isLoading: false }));
        }
    };

    const toggleCategory = (categoryId: number) => {
        setSelectedCategories(prev => {
            const isSelected = prev.includes(categoryId);
            const newCategories = isSelected
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId];
            
            if (searchQuery) {
                performSearch(searchQuery, newCategories);
            }
            return newCategories;
        });
    };

    // Limiter les catégories affichées
    const displayedCategories = showAllCategories 
        ? categories 
        : categories.slice(0, 5);

    return (
        <div className="flex-1 px-5 pb-[20px] pt-[120px]">
            <div className="max-w-md mx-auto space-y-8">
                {/* Barre de recherche */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            type="text"
                            placeholder="Cherchez un livre"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pr-10"
                        />
                        <Button 
                            variant="ghost" 
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Résultats de recherche */}
                {searchQuery ? (
                    <div className="space-y-4">
                        {/* Catégories filtrées en haut pendant la recherche */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Badge
                                    key={category.id}
                                    variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                                    className="p-2 text-sm cursor-pointer"
                                    onClick={() => toggleCategory(category.id)}
                                >
                                    {category.name}
                                </Badge>
                            ))}
                        </div>

                        {searchResults.isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : searchResults.books.length > 0 ? (
                            <div className="grid gap-4">
                                {searchResults.books.map((book) => (
                                    <div 
                                        key={book.id} 
                                        className="flex gap-4 p-4 bg-accent rounded-lg"
                                    >
                                        {book.cover && (
                                            <img 
                                                src={book.cover} 
                                                alt={book.title}
                                                className="w-16 h-24 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-medium">{book.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {book.author}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                Aucun résultat trouvé
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Affichage normal quand pas de recherche */}
                        <div className="space-y-4">
                            {/* Catégories avec sélection */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-heading">Catégories</h2>
                                    {categories.length > 5 && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="text-muted-foreground hover:text-primary"
                                            onClick={() => setShowAllCategories(!showAllCategories)}
                                        >
                                            {showAllCategories ? 'Voir moins' : 'Voir plus'}
                                        </Button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {displayedCategories.map((category) => (
                                        <Badge
                                            key={category.id}
                                            variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                                            className="p-2 text-sm cursor-pointer"
                                            onClick={() => toggleCategory(category.id)}
                                        >
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Auteurs connus avec Avatar */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-heading">Auteurs connus</h2>
                                <div className="grid grid-cols-4 gap-4">
                                    {authors.slice(0, 4).map((author) => (
                                        <div key={author.id} className="flex flex-col items-center gap-2">
                                            <Avatar className="w-16 h-16">
                                                <AvatarImage 
                                                    src={author.image} 
                                                    alt={author.name}
                                                />
                                                <AvatarFallback>
                                                    {author.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm text-center line-clamp-1">
                                                {author.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tendances - 2 colonnes fixes */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-heading">Tendances</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Ajouter les livres tendances ici */}
                                </div>
                            </div>

                            {/* Suggestions d'amis - Limité à 4 */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-heading">Suggestion d'amis</h2>
                                <div className="grid grid-cols-4 gap-4">
                                    {/* Ajouter les suggestions d'amis ici */}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 