'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";

// Schéma de validation pour l'email
const forgotPasswordSchema = z.object({
    email: z.string().email("Email invalide")
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
    const router = useRouter();
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        try {
            // Ici votre logique de réinitialisation
            toast({
                title: "Email envoyé",
                description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe"
            });
            router.push('/auth/login');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de l'envoi de l'email"
            });
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
                Nouveau mot de passe
            </h1>

            <p className="text-center text-muted-foreground mb-8">
                Saisissez votre compte e-mail pour
                <br />
                réinitialiser votre mot de passe
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full max-w-[400px] mx-auto">
                <div className="space-y-2">
                    <Input
                        {...register('email')}
                        type="email"
                        placeholder="www.uihut@gmail.com"
                        className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                <Button 
                    type="submit" 
                    className="h-14 bg-primary-800 hover:bg-primary-900 text-white"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Envoi en cours..." : "Réinitialiser votre mot de passe"}
                </Button>
            </form>
        </div>
    );
} 