'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import type { VerifyResetCodeRequest } from "@/types/authTypes";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

export default function VerifyResetCode() {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const router = useRouter();
    const { toast } = useToast();
    const { verifyResetCode } = useAuth();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('resetPasswordEmail');
        if (!storedEmail) {
            router.replace('/auth/forgot-password');
            return;
        }
        setEmail(storedEmail);
    }, [router]);

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
            setIsLoading(true);
            const data: VerifyResetCodeRequest = {
                email,
                code
            };

            await verifyResetCode(data);
            router.push('/auth/forgot-password/reset');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Code incorrect",
                description: error.message || "Le code de vérification est invalide"
            });
            setCode('');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background pt-[60px] ">
            <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center">
                <h1 className="text-2xl font-heading mb-2 text-center">
                    Vérification du code
                </h1>
                <p className="text-muted-foreground text-center mb-8">
                    Entrez le code à 6 chiffres envoyé à
                    <br />
                    {email}
                </p>

                <div className="flex justify-center mb-8">
                    <InputOTP maxLength={6} value={code} onChange={setCode}>
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
                    disabled={code.length !== 6 || isLoading}
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
            </div>
        </div>
    );
} 