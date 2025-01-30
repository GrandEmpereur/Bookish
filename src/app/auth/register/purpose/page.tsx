'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";

const purposes = [
    {
        id: 'discover',
        label: 'Trouver de nouveaux livres',
        icon: '/img/onbordingRegisterSetp/Book_Lover.png'
    },
    {
        id: 'community',
        label: 'Trouver une communauté',
        icon: '/img/onbordingRegisterSetp/Notebook_Design.png'
    },
    {
        id: 'both',
        label: 'Les deux',
        icon: '/img/onbordingRegisterSetp/Bookshelves_design.png'
    }
];

export default function Purpose() {
    const router = useRouter();
    const [selected, setSelected] = useState<string>('');

    const handleSelect = (id: string) => {
        setSelected(id);
        router.push('/auth/register/habits');
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
                Que faites vous sur
                <br />
                Bookish
            </h1>

            <p className="text-center text-muted-foreground mb-8">
                Nous voulons juste apprendre à mieux vous
                <br />connaître
            </p>

            <div className="space-y-4">
                {purposes.map((purpose) => (
                    <button
                        key={purpose.id}
                        onClick={() => handleSelect(purpose.id)}
                        className={`w-full p-4 flex items-center gap-4 rounded-lg border transition-all duration-200 ${
                            selected === purpose.id 
                                ? 'border-primary-800 bg-primary-50' 
                                : 'border-accent-200 hover:border-primary-400'
                        }`}
                    >
                        <div className="w-12 h-12 relative flex-shrink-0">
                            <Image
                                src={purpose.icon}
                                alt={purpose.label}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-base text-left">{purpose.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
} 