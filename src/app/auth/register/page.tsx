'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, ChevronLeft, Loader2, Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import type { RegisterRequest } from "@/types/authTypes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
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
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showEmailDialog, setShowEmailDialog] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { register } = useAuth();

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            birthDate: ""
        }
    });

    const handleDialogClose = () => {
        setShowEmailDialog(false);
        router.push('/auth/register/verification');
    };

    const onSubmit = async (data: RegisterInput) => {
        try {
            const isValid = await form.trigger();
            if (!isValid) return;

            setIsLoading(true);
            
            const [day, month, year] = data.birthDate.split('/');
            const formattedDate = `${year}-${month}-${day}`;

            const requestData: RegisterRequest = {
                username: data.username,
                email: data.email,
                password: data.password,
                birthDate: formattedDate
            };

            const response = await register(requestData);
            console.log("Register response:", response);
            sessionStorage.setItem('verificationEmail', data.email);
            setShowEmailDialog(true);

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background">
            <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center">
                <h1 className="text-[32px] text-center font-heading leading-tight mb-14">
                    Créez votre compte
                </h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input 
                                            placeholder="Nom d'utilisateur" 
                                            className="h-14 bg-accent-100 border-0 text-base"
                                            {...field}
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
                                            type="email" 
                                            placeholder="Email" 
                                            className="h-14 bg-accent-100 border-0 text-base"
                                            {...field}
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
                                        <Input 
                                            placeholder="Date de naissance (JJ/MM/AAAA)" 
                                            className="h-14 bg-accent-100 border-0 text-base"
                                            {...field}
                                            onChange={(e) => {
                                                let value = e.target.value.replace(/\D/g, '');
                                                if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
                                                if (value.length >= 5) value = value.slice(0, 5) + '/' + value.slice(5);
                                                if (value.length > 10) value = value.slice(0, 10);
                                                field.onChange(value);
                                            }}
                                        />
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
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Mot de passe"
                                                className="h-14 bg-accent-100 border-0 text-base pr-12"
                                                {...field}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-500 hover:text-muted-700 transition-colors"
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
                        </p>

                        <Button 
                            type="submit" 
                            className="w-full h-14 bg-primary-800 hover:bg-primary-900 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Inscription en cours...
                                </>
                            ) : (
                                "S'inscrire"
                            )}
                        </Button>
                    </form>
                </Form>

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
            </div>

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