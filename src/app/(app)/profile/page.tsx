'use client';

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/layout/top-bar";
import { BottomBar } from "@/components/layout/bottom-bar";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
    const { user, logout } = useAuth();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            await logout();
            toast({
                title: "Déconnexion réussie",
                description: "À bientôt sur Bookish !",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de la déconnexion"
            });
        }
    };

    return (
        <div className="min-h-[100dvh] bg-background">
            <TopBar />

            <main className="pt-[120px] px-5 pb-[120px]">
                {/* Informations de base */}
                <div className="mb-8">
                    <h1 className="text-2xl font-heading mb-2">Mon Profil</h1>
                    <p className="text-muted-foreground">
                        {user?.username} • {user?.email}
                    </p>
                </div>

                {/* Bouton de déconnexion */}
                <Button 
                    variant="destructive"
                    className="w-full flex items-center gap-2"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    Se déconnecter
                </Button>
            </main>

            <BottomBar />
        </div>
    );
} 