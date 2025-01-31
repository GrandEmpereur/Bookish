'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Mail } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
    email: z.string().email("L'email est invalide"),
});

export default function ForgotPassword() {
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await authService.forgotPassword(values.email);
            
            // Stockage de l'email pour les étapes suivantes
            sessionStorage.setItem('resetPasswordEmail', values.email);
            
            // Afficher le dialogue de confirmation
            setShowDialog(true);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: error.message || "Une erreur est survenue"
            });
        }
    };

    const handleDialogClose = () => {
        setShowDialog(false);
        router.push('/auth/forgot-password/verify');
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background">
            <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center -mt-20">
                <h1 className="text-2xl font-heading mb-2 text-center">
                    Mot de passe oublié ?
                </h1>
                <p className="text-muted-foreground text-center mb-8">
                    Entrez votre email pour réinitialiser votre mot de passe
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                        <Button 
                            type="submit" 
                            className="w-full h-14"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                "Réinitialiser le mot de passe"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>

            <Dialog open={showDialog} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-primary-800" />
                        </div>
                        <DialogTitle className="text-center font-heading text-2xl">
                            Vérifiez vos emails
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Nous avons envoyé un code de réinitialisation à votre adresse email.
                            <br />
                            Veuillez vérifier votre boîte de réception.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
} 