'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

const readingHabits = [
    {
        id: 'bookworm',
        label: 'Je suis un rat de bibliothèque',
        icon: '/img/onbordingRegisterSetp/Book_Lover.png'
    },
    {
        id: 'casual',
        label: "J'aime lire de temps en temps",
        icon: '/img/onbordingRegisterSetp/Notebook_Design.png'
    },
    {
        id: 'beginner',
        label: 'Je commence à lire',
        icon: '/img/onbordingRegisterSetp/Bookshelves_design.png'
    }
];

export default function Habits() {
    const router = useRouter();
    const [selected, setSelected] = useState<string>('');

    const handleSelect = (id: string) => {
        setSelected(id);
        router.push('/auth/register/genres');
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
                Quelles sont vos
                <br />
                habitudes de lecture ?
            </h1>

            <p className="text-center text-muted-foreground mb-8">
                Nous voulons juste apprendre à mieux
                <br />vous connaître
            </p>

            <div className="space-y-4">
                {readingHabits.map((habit) => (
                    <button
                        key={habit.id}
                        onClick={() => handleSelect(habit.id)}
                        className={`w-full p-4 flex items-center gap-4 rounded-lg border transition-all duration-200 ${
                            selected === habit.id 
                                ? 'border-primary-800 bg-primary-50' 
                                : 'border-accent-200 hover:border-primary-400'
                        }`}
                    >
                        <div className="w-12 h-12 relative flex-shrink-0">
                            <Image
                                src={habit.icon}
                                alt={habit.label}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-base text-left">{habit.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
} 