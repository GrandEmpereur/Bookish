'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ChevronLeft, Loader2, Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Register() {
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showEmailDialog, setShowEmailDialog] = useState(false);
    const router = useRouter();

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            birthDate: ""
        },
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            const response = await authService.register(data);
            
            // S'assurer que l'email est stocké avant d'afficher le dialogue
            if (data.email) {
                sessionStorage.setItem('verificationEmail', data.email);
            }

            // Retour haptique sur mobile
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }

            // Afficher le dialogue
            setShowEmailDialog(true);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur d'inscription",
                description: error.message || "Une erreur est survenue lors de l'inscription"
            });
            console.error('Register error:', error);
        }
    };

    const handleDialogClose = () => {
        // Vérifier que l'email est bien stocké avant la redirection
        const storedEmail = sessionStorage.getItem('verificationEmail');
        if (!storedEmail) {
            console.error('No email stored in session');
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue, veuillez réessayer"
            });
            return;
        }

        setShowEmailDialog(false);
        router.push('/auth/register/verification');
    };

    const formatBirthdate = (value: string) => {
        // Supprime tout ce qui n'est pas un chiffre
        const numbers = value.replace(/\D/g, '');
        
        // Ajoute les "/" automatiquement
        let formatted = '';
        for (let i = 0; i < numbers.length && i < 8; i++) {
            if (i === 2 || i === 4) formatted += '/';
            formatted += numbers[i];
        }
        
        return formatted;
    };

    const handleBirthdateChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        field: { onChange: (value: string) => void }
    ) => {
        const formatted = formatBirthdate(event.target.value);
        field.onChange(formatted);
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background safe-area-pt justify-center items-center">
            <h1 className="text-[32px] text-center font-heading leading-tight mb-14">
                Créez votre compte
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-[400px] mx-auto">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Nom d'utilisateur"
                                            className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500"
                                            disabled={form.formState.isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            placeholder="votre@email.com"
                                            className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500"
                                            disabled={form.formState.isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="birthDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="JJ/MM/AAAA"
                                                maxLength={10}
                                                value={field.value}
                                                onChange={(e) => handleBirthdateChange(e, field)}
                                                className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500"
                                                disabled={form.formState.isSubmitting}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                                placeholder="Mot de passe"
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
                    </div>

                    <Button 
                        type="submit" 
                        className="h-14 bg-primary-800 hover:bg-primary-900 text-white mt-4"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Inscription en cours...
                            </>
                        ) : (
                            "S'inscrire"
                        )}
                    </Button>

                    <p className="text-center mt-4 text-base">
                        Vous avez un compte ?{' '}
                        <Link 
                            href="/auth/login" 
                            className="text-secondary-500 font-medium"
                            tabIndex={form.formState.isSubmitting ? -1 : 0}
                        >
                            Connectez vous
                        </Link>
                    </p>
                </form>
            </Form>

            {/* Dialog de vérification d'email */}
            <Dialog open={showEmailDialog} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-primary-800" />
                        </div>
                        <DialogTitle className="text-center font-heading text-2xl">
                            Vérifiez vos emails
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Nous avons envoyé un code de vérification à votre adresse email.
                            <br />
                            Veuillez vérifier votre boîte de réception.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
} 