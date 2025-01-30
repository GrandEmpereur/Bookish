'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import Link from 'next/link';
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
    const router = useRouter();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            // Ici votre logique d'inscription
            router.push('/auth/login');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de l'inscription"
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

            <h1 className="text-[32px] text-center font-heading leading-tight mb-14">
                Rejoignez notre
                <br />
                communauté
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            {...register('username')}
                            placeholder="pseudonyme"
                            className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500"
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500">{errors.username.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Input
                            {...register('birthdate')}
                            placeholder="jj/mm/aaaa"
                            className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500"
                        />
                        {errors.birthdate && (
                            <p className="text-sm text-red-500">{errors.birthdate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Input
                            {...register('email')}
                            type="email"
                            placeholder="adresse email"
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
                                placeholder="********"
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

                <Button 
                    type="submit" 
                    className="h-14 bg-primary-800 hover:bg-primary-900 text-white mt-4"
                    disabled={isSubmitting}
                >
                    S'inscrire
                </Button>

                <p className="text-center mt-4 text-base">
                    Vous avez un compte ?{' '}
                    <Link 
                        href="/auth/login" 
                        className="text-secondary-500 font-medium"
                    >
                        Connectez vous
                    </Link>
                </p>
            </form>
        </div>
    );
} 