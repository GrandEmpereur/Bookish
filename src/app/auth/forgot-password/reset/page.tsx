'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPasswordSchema, type ResetPasswordInput } from "@/validations/auth";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import type { ResetPasswordRequest } from "@/types/authTypes";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const { resetPassword } = useAuth();

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
            newPassword: "",
            confirmPassword: ""
        },
    });

    // Récupérer et définir l'email au chargement
    useEffect(() => {
        const storedEmail = sessionStorage.getItem('resetPasswordEmail');
        if (!storedEmail) {
            router.replace('/auth/forgot-password');
            return;
        }
        // Définir l'email dans le formulaire
        form.setValue('email', storedEmail);
    }, [router, form]);

    const onSubmit = async (formData: ResetPasswordInput) => {
        try {
            const data: ResetPasswordRequest = {
                email: formData.email,
                newPassword: formData.newPassword
            };

            await resetPassword(data);

            // Retour haptique sur mobile
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }

            // Nettoyage et redirection
            sessionStorage.removeItem('resetPasswordEmail');
            router.replace('/auth/login');
        } catch (error: any) {
            console.error('Reset password error:', error); // Debug log
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue lors de la réinitialisation"
            });
        }
    };

    return (
        <div className="min-h-dvh flex flex-col px-5 bg-background safe-area-pt">
            <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center">
                <h1 className="text-[32px] font-heading leading-tight mb-4">
                    Nouveau mot de passe
                </h1>
                <p className="text-muted-foreground mb-8">
                    Choisissez un nouveau mot de passe sécurisé
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Nouveau mot de passe"
                                                className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500 pr-12"
                                                disabled={form.formState.isSubmitting}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-14 px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Confirmer le mot de passe"
                                                className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500 pr-12"
                                                disabled={form.formState.isSubmitting}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full h-14 bg-primary-800 hover:bg-primary-900 text-white"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Réinitialisation...
                                </>
                            ) : (
                                "Réinitialiser le mot de passe"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
} 