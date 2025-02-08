'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import type { ReadingHabit } from "@/types/userTypes";
import type { RegisterStepTwoRequest } from "@/types/authTypes";

const readingHabits: Array<{
    id: ReadingHabit;
    label: string;
    description: string;
    icon: string;
}> = [
    {
        id: 'library_rat',
        label: 'Grand lecteur',
        description: 'Je lis plus de 20 livres par an',
        icon: '/img/onbordingRegisterSetp/Book_Lover.png'
    },
    {
        id: 'occasional_reader',
        label: 'Lecteur régulier',
        description: 'Je lis entre 5 et 20 livres par an',
        icon: '/img/onbordingRegisterSetp/Notebook_Design.png'
    },
    {
        id: 'beginner_reader',
        label: 'Lecteur débutant',
        description: 'Je lis moins de 5 livres par an',
        icon: '/img/onbordingRegisterSetp/Bookshelves_design.png'
    }
];

export default function Habits() {
    const [selectedHabit, setSelectedHabit] = useState<ReadingHabit | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const router = useRouter();
    const { toast } = useToast();
    const { completeStepTwo } = useAuth();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('verificationEmail');
        if (!storedEmail) {
            router.replace('/auth/register');
            return;
        }
        setEmail(storedEmail);
    }, [router]);

    const handleHabitSelection = async (habit: ReadingHabit) => {
        try {
            setIsLoading(true);
            setSelectedHabit(habit);

            const data: RegisterStepTwoRequest = {
                email,
                readingHabit: habit
            };

            await completeStepTwo(data);
            router.push('/auth/register/genres');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue"
            });
            setSelectedHabit(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background pt-[60px]">
            <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center items-center">
                <h1 className="text-2xl font-heading mb-2 text-center">
                    Vos habitudes de lecture
                </h1>
                <p className="text-muted-foreground text-center mb-8">
                    Sélectionnez votre profil de lecteur
                </p>

                <div className="space-y-4">
                    {readingHabits.map((habit) => (
                        <button
                            key={habit.id}
                            onClick={() => handleHabitSelection(habit.id)}
                            disabled={isLoading}
                            className={`w-full p-4 rounded-lg border flex items-center gap-4 transition-colors
                                ${selectedHabit === habit.id 
                                    ? 'bg-primary-50 border-primary' 
                                    : 'bg-accent-100 border-transparent hover:border-primary/20'
                                }
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                                <Image
                                    src={habit.icon}
                                    alt={habit.label}
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <div className="text-left">
                                <h3 className="font-medium mb-1">{habit.label}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {habit.description}
                                </p>
                            </div>
                            {isLoading && selectedHabit === habit.id && (
                                <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 