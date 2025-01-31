'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";

const genres = [
    { id: 'fantasy', label: 'Fantasy' },
    { id: 'sci-fi', label: 'Science Fiction' },
    { id: 'romance', label: 'Romance' },
    { id: 'thriller', label: 'Thriller' },
    { id: 'mystery', label: 'Mystère' },
    { id: 'horror', label: 'Horreur' },
    { id: 'historical', label: 'Historique' },
    { id: 'contemporary', label: 'Contemporain' },
    { id: 'literary', label: 'Littérature' },
    { id: 'non-fiction', label: 'Non-Fiction' },
    { id: 'biography', label: 'Biographie' },
    { id: 'self-help', label: 'Développement Personnel' }
];

export default function Genres() {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('verificationEmail');
        if (!storedEmail) {
            router.replace('/auth/register');
            return;
        }
        setEmail(storedEmail);
    }, [router]);

    const toggleGenre = (genreId: string) => {
        setSelectedGenres(prev => 
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId]
        );
    };

    const handleSubmit = async () => {
        if (selectedGenres.length === 0) {
            toast({
                variant: "destructive",
                title: "Sélection requise",
                description: "Veuillez sélectionner au moins un genre"
            });
            return;
        }

        try {
            setIsLoading(true);
            await authService.completeStep3(email, selectedGenres);
            
            // Nettoyage et redirection vers le feed
            sessionStorage.removeItem('verificationEmail');
            router.replace('/feed');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background pt-[60px]">
            <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
                <h1 className="text-2xl font-heading mb-2 text-center">
                    Vos genres préférés
                </h1>
                <p className="text-muted-foreground text-center mb-8">
                    Sélectionnez les genres qui vous intéressent
                </p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    {genres.map((genre) => (
                        <button
                            key={genre.id}
                            onClick={() => toggleGenre(genre.id)}
                            disabled={isLoading}
                            className={`p-3 rounded-lg border flex items-center justify-between transition-colors
                                ${selectedGenres.includes(genre.id)
                                    ? 'bg-primary-50 border-primary' 
                                    : 'bg-accent-100 border-transparent hover:border-primary/20'
                                }
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <span className="text-sm font-medium">{genre.label}</span>
                            {selectedGenres.includes(genre.id) && (
                                <Check className="h-4 w-4 text-primary" />
                            )}
                        </button>
                    ))}
                </div>

                <Button
                    className="w-full h-14"
                    onClick={handleSubmit}
                    disabled={selectedGenres.length === 0 || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Finalisation...
                        </>
                    ) : (
                        "Terminer l'inscription"
                    )}
                </Button>
            </div>
        </div>
    );
} 