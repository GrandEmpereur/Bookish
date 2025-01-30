'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";

export default function Verification() {
    const router = useRouter();
    const { toast } = useToast();
    const [code, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(60); // Changé à 60 secondes (1 minute)
    const [resendAttempts, setResendAttempts] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [resendAttempts]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleResendCode = () => {
        setResendAttempts(prev => prev + 1);
        setTimeLeft(60); // Toujours réinitialiser à 60 secondes
        toast({
            title: "Code renvoyé",
            description: "Un nouveau code a été envoyé à votre adresse email"
        });
    };

    const handleComplete = (value: string) => {
        if (value.length === 6) {
            router.push('/auth/register/purpose');
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
                Authentification
            </h1>

            <p className="text-center text-muted-foreground mb-8">
                Veuillez vérifier votre mail
                <br />www.uihut@gmail.com pour voir le code de
                <br />vérification
            </p>

            <div className="flex justify-center mb-8">
                <InputOTP maxLength={6}
                    value={code}
                    onChange={setCode}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>

            <Button
                onClick={() => handleComplete(code)}
                className="h-14 bg-primary-800 hover:bg-primary-900 text-white"
            >
                Valider
            </Button>

            {timeLeft > 0 ? (
                <p className="text-center mt-4 text-sm text-muted-500">
                    Renvoie du code dans {formatTime(timeLeft)}
                </p>
            ) : (
                <Button
                    variant="secondary"
                    onClick={handleResendCode}
                    className="mt-4 text-sm text-white"
                >
                    Renvoyer l'email
                </Button>
            )}
        </div>
    );
} 