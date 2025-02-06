'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import type { UsagePurpose } from "@/types/userTypes";
import type { RegisterStepOneRequest } from "@/types/authTypes";

const purposes: Array<{
    id: UsagePurpose;
    label: string;
    description: string;
    icon: string;
}> = [
    {
        id: 'find_books',
        label: 'Découvrir de nouveaux livres',
        description: 'Trouvez des recommandations personnalisées',
        icon: '/img/onbordingRegisterSetp/Book_Lover.png'
    },
    {
        id: 'find_community',
        label: 'Rejoindre une communauté',
        description: 'Partagez et échangez avec d\'autres lecteurs',
        icon: '/img/onbordingRegisterSetp/Notebook_Design.png'
    },
    {
        id: 'both',
        label: 'Les deux',
        description: 'Découvrez et partagez en même temps',
        icon: '/img/onbordingRegisterSetp/Bookshelves_design.png'
    }
];

export default function Purpose() {
    const [selectedPurpose, setSelectedPurpose] = useState<UsagePurpose | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const router = useRouter();
    const { toast } = useToast();
    const { completeStepOne } = useAuth();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('verificationEmail');
        if (!storedEmail) {
            router.replace('/auth/register');
            return;
        }
        setEmail(storedEmail);
    }, [router]);

    const handlePurposeSelection = async (purpose: UsagePurpose) => {
        try {
            setIsLoading(true);
            setSelectedPurpose(purpose);

            const data: RegisterStepOneRequest = {
                email,
                usage_purpose: purpose
            };

            await completeStepOne(data);
            router.push('/auth/register/habits');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue"
            });
            setSelectedPurpose(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background pt-[60px]">
            <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center items-center">
                <h1 className="text-2xl font-heading mb-2 text-center">
                    Pourquoi rejoignez-vous Bookish ?
                </h1>
                <p className="text-muted-foreground text-center mb-8">
                    Sélectionnez votre objectif principal
                </p>

                <div className="space-y-4">
                    {purposes.map((purpose) => (
                        <button
                            key={purpose.id}
                            onClick={() => handlePurposeSelection(purpose.id)}
                            disabled={isLoading}
                            className={`w-full p-4 rounded-lg border flex items-center gap-4 transition-colors
                                ${selectedPurpose === purpose.id 
                                    ? 'bg-primary-50 border-primary' 
                                    : 'bg-accent-100 border-transparent hover:border-primary/20'
                                }
                                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0">
                                <Image
                                    src={purpose.icon}
                                    alt={purpose.label}
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <div className="text-left">
                                <h3 className="font-medium mb-1">{purpose.label}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {purpose.description}
                                </p>
                            </div>
                            {isLoading && selectedPurpose === purpose.id && (
                                <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
} 