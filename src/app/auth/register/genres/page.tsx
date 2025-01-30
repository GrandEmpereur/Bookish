'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const genres = [
    'Développement personnel', 'Fiction', 'Sports', 'Inspirant', 'Education',
    'Non-Fiction', 'Sci-fi', 'Aventure', 'Horror', 'Romance', 'Essais',
    'Shōjo', 'Comics', 'Romanatasy', 'Shōnen', 'Western', 'Thriller',
    'Young adulte', 'Biographie', 'Policier'
];

export default function Genres() {
    const router = useRouter();
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev => 
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleValidate = () => {
        if (selectedGenres.length > 0) {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background safe-area-pt">
            <button
                onClick={() => router.back()}
                className="text-black mb-8 flex items-center gap-2 pt-[60px]"
            >
                <ChevronLeft size={24} />
            </button>

            <h1 className="text-[32px] text-center font-heading leading-tight mb-4">
                Quels sont les genres
                <br />
                de livres que vous
                <br />
                aimez lire ?
            </h1>

            <div className="flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-8">
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            onClick={() => toggleGenre(genre)}
                            className={`px-4 py-2 rounded-full text-sm ${
                                selectedGenres.includes(genre)
                                    ? 'bg-primary-800 text-white'
                                    : 'bg-accent-100 text-muted-700'
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                <div className="mt-auto pb-[63px] safe-area-pb">
                    <Button 
                        onClick={handleValidate}
                        className="w-full h-14 bg-primary-800 hover:bg-primary-900 text-white"
                    >
                        Valider
                    </Button>
                </div>
            </div>
        </div>
    );
} 