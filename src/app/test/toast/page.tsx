'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function TestToast() {
    const { toast } = useToast();

    const showDefaultToast = () => {
        toast({
            title: "Toast par défaut",
            description: "Ceci est un message toast par défaut"
        });
    };

    const showSuccessToast = () => {
        toast({
            title: "Succès !",
            description: "L'opération a été effectuée avec succès",
            variant: "default",
        });
    };

    const showErrorToast = () => {
        toast({
            title: "Erreur",
            description: "Une erreur est survenue",
            variant: "destructive",
        });
    };

    const showLoadingToast = () => {
        toast({
            title: "Chargement en cours",
            description: "Veuillez patienter...",
            action: <Loader2 className="h-4 w-4 animate-spin" />
        });
    };

    const showLongToast = () => {
        toast({
            title: "Message long",
            description: "Ceci est un message très long qui devrait s'afficher sur plusieurs lignes pour tester le comportement du toast avec beaucoup de contenu. Nous voulons voir comment il gère le texte long.",
            duration: 5000, // 5 secondes
        });
    };

    const showActionToast = () => {
        toast({
            title: "Action requise",
            description: "Voulez-vous continuer ?",
            action: (
                <Button variant="outline" size="sm" className="h-8">
                    Confirmer
                </Button>
            ),
        });
    };

    return (
        <div className="min-h-[100dvh] flex flex-col px-5 bg-background">
            <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center space-y-4">
                <h1 className="text-2xl font-heading mb-4 text-center">
                    Test des Toasts
                </h1>

                <Button 
                    onClick={showDefaultToast}
                    className="w-full h-12"
                >
                    Toast par défaut
                </Button>

                <Button 
                    onClick={showSuccessToast}
                    className="w-full h-12"
                    variant="secondary"
                >
                    Toast de succès
                </Button>

                <Button 
                    onClick={showErrorToast}
                    className="w-full h-12"
                    variant="destructive"
                >
                    Toast d'erreur
                </Button>

                <Button 
                    onClick={showLoadingToast}
                    className="w-full h-12"
                    variant="outline"
                >
                    Toast avec loader
                </Button>

                <Button 
                    onClick={showLongToast}
                    className="w-full h-12"
                >
                    Toast avec long message
                </Button>

                <Button 
                    onClick={showActionToast}
                    className="w-full h-12"
                    variant="secondary"
                >
                    Toast avec action
                </Button>
            </div>
        </div>
    );
} 