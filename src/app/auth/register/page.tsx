'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ChevronLeft, Mail } from "lucide-react";
import Link from 'next/link';
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

// Types pour les différentes étapes
type RegisterStep = 'form' | 'verification' | 'purpose' | 'habits' | 'genres';

export default function Register() {
    const router = useRouter();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [currentStep, setCurrentStepState] = useState<RegisterStep>('form');
    const [showEmailDialog, setShowEmailDialog] = useState(false);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '']);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            router.push('/auth/register/verification');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de l'inscription"
            });
        }
    };

    const handleDialogClose = () => {
        setShowEmailDialog(false);
        router.push('/auth/register/verification');
    };

    const handleVerificationCodeSubmit = () => {
        if (verificationCode.join('').length === 4) {
            setShowEmailDialog(false);
            setCurrentStepState('purpose');
        }
    };

    const renderVerificationDialog = () => (
        <Dialog open={showEmailDialog} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center font-heading text-2xl">
                        Vérifiez vos emails
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Nous avons envoyé des instructions de
                        <br />récupération ou mot de passe à votre
                        <br />adresse électronique
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-6">
                    <div className="rounded-full bg-primary-100 p-4">
                        <Mail className="h-6 w-6 text-primary-800" />
                    </div>
                    <p className="text-sm text-muted-500">
                        {getValues('email')}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background">
            <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full">
                <h1 className="text-[32px] text-center font-heading leading-tight mb-8">
                    Rejoignez notre
                    <br />
                    communauté
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="space-y-4">
                        <Input
                            {...register('username')}
                            placeholder="pseudonyme"
                            className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500"
                        />
                        {errors.username && (
                            <p className="text-sm text-red-500">{errors.username.message}</p>
                        )}

                        <Input
                            {...register('birthdate')}
                            placeholder="jj/mm/aaaa"
                            className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500"
                        />
                        {errors.birthdate && (
                            <p className="text-sm text-red-500">{errors.birthdate.message}</p>
                        )}

                        <Input
                            {...register('email')}
                            type="email"
                            placeholder="adresse email"
                            className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
                        )}

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

                        <p className="text-sm text-success">
                            Le mot de passe doit avoir au moins 8 caractères
                            <br />
                            1 caractère spécial
                        </p>
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

            {renderVerificationDialog()}
        </div>
    );
} 