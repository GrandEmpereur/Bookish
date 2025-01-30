'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from 'next/link';
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
    const router = useRouter();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            // Ici votre logique d'authentification
            localStorage.setItem('isLoggedIn', 'true');
            router.push('/dashboard');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de la connexion"
            });
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 pt-[60px] bg-background justify-center items-center">
            {/* Titre */}
            <h1 className="text-[32px] text-center font-heading leading-tight mb-14">
                Connectez-vous
                <br />
                à votre compte
            </h1>

            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-[400px]">
                <div className="space-y-4">
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

                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                {...register('password')}
                                type={showPassword ? "text" : "password"}
                                className="h-14 bg-accent-100 border-0 text-base pr-12"
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
                        {errors.password && (
                            <p className="text-sm text-red-500">{errors.password.message}</p>
                        )}
                    </div>
                </div>

                {/* Mot de passe oublié */}
                <div className="flex justify-end">
                    <Link 
                        href="/auth/forgot-password" 
                        className="text-secondary-500 text-base"
                    >
                        Mot de passe oublié ?
                    </Link>
                </div>

                {/* Bouton de connexion */}
                <Button 
                    type="submit" 
                    className="h-14 bg-primary-800 hover:bg-primary-900 text-white mt-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Connexion..." : "Connexion"}
                </Button>

                {/* Lien d'inscription */}
                <p className="text-center mt-4 text-base">
                    Vous n'avez pas de compte ?{' '}
                    <Link 
                        href="/auth/register" 
                        className="text-secondary-500 font-medium"
                    >
                        Créez un compte
                    </Link>
                </p>
            </form>
        </div>
    );
} 