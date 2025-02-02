'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";

export default function Verification() {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [email, setEmail] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
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

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleVerification = async () => {
        if (code.length !== 6) {
            toast({
                variant: "destructive",
                title: "Code invalide",
                description: "Le code doit contenir 6 chiffres"
            });
            return;
        }

        try {
            setIsVerifying(true);
            const data = {email, code};
            const response = await authService.verifyEmail(data);
            
            if (response.status === 'success') {
                router.replace('/auth/register/purpose');
            } else {
                toast({
                    variant: "destructive",
                    title: "Code incorrect",
                    description: "Le code de vérification est invalide"
                });
                setCode('');
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur de vérification",
                description: error.message || "Code invalide, veuillez réessayer"
            });
            setCode('');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (timeLeft > 0) return;

        try {
            setIsLoading(true);
            await authService.resendVerification(email);
            setTimeLeft(30);
            
            toast({
                title: "Code renvoyé",
                description: "Un nouveau code a été envoyé à votre email"
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de renvoyer le code"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background">
            <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full -mt-20">
                {isVerifying ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Vérification en cours...</p>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-heading mb-2 text-center">
                            Vérification de votre email
                        </h1>
                        <p className="text-muted-foreground text-center mb-8">
                            Entrez le code à 6 chiffres envoyé à
                            <br />
                            {email}
                        </p>

                        <div className="flex justify-center mb-8">
                            <InputOTP 
                                maxLength={6} 
                                value={code} 
                                onChange={setCode}
                                disabled={isVerifying || isLoading}
                            >
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
                            className="w-full h-14"
                            onClick={handleVerification}
                            disabled={code.length !== 6 || isVerifying || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Vérification...
                                </>
                            ) : (
                                "Vérifier"
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            className="mt-4 text-sm text-muted-foreground"
                            disabled={timeLeft > 0 || isVerifying || isLoading}
                            onClick={handleResendCode}
                        >
                            {timeLeft > 0 ? `Renvoyer dans ${timeLeft}s` : "Renvoyer le code"}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
} 