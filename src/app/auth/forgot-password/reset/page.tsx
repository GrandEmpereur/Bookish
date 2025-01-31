'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial"),
});

export default function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('resetPasswordEmail');
        if (!storedEmail) {
            router.replace('/auth/forgot-password');
            return;
        }
        setEmail(storedEmail);
    }, [router]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await authService.resetPassword(email, values.password);
            
            // Nettoyage et redirection
            sessionStorage.removeItem('resetPasswordEmail');
            
            toast({
                title: "Mot de passe réinitialisé",
                description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe"
            });
            
            router.push('/auth/login');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue"
            });
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background pt-[60px]">
            <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center">
                <h1 className="text-2xl font-heading mb-2 text-center">
                    Nouveau mot de passe
                </h1>
                <p className="text-muted-foreground text-center mb-8">
                    Choisissez un nouveau mot de passe sécurisé
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Nouveau mot de passe"
                                                className="h-14 bg-accent-100 border-0 text-base pr-12"
                                                disabled={form.formState.isSubmitting}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-500 hover:text-muted-700 transition-colors"
                                                disabled={form.formState.isSubmitting}
                                            >
                                                {showPassword ? (
                                                    <EyeOff size={20} />
                                                ) : (
                                                    <Eye size={20} />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <p className="text-sm text-muted-foreground">
                            Le mot de passe doit avoir au moins 8 caractères
                            <br />
                            et 1 caractère spécial
                        </p>

                        <Button 
                            type="submit" 
                            className="w-full h-14"
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