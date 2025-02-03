'use client';

import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    // Ces données devraient venir de votre API
    const stats = {
        followers: 360,
        booksRead: 238,
        clubs: 3
    };

    const genres = ["Thrillers", "Fiction", "Fantasy", "Sci-fi"];

    const handleLogout = async () => {
        try {
            await logout();
            toast({
                title: "Déconnexion réussie",
                description: "À bientôt sur Bookish !",
            });
            router.push('/auth/login');
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
            <main className="pt-[120px] px-5 pb-[120px]">
                {/* Section Avatar et Infos */}
                <div className="flex flex-col items-center space-y-4 mb-8">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={user?.avatarUrl} alt={user?.username} />
                        <AvatarFallback>
                            {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                        <h1 className="text-2xl font-semibold mb-2">{user?.username}</h1>
                        <p className="text-muted-foreground max-w-md">
                            Fan de thriller et de romance mais j'aime aussi la fantasy et le scifi
                        </p>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {genres.map((genre) => (
                            <Badge 
                                key={genre} 
                                variant="outline"
                                className="px-3 py-1"
                            >
                                {genre}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Card Stats */}
                <Card className="p-6 mb-8">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-primary">
                                {stats.followers}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Followers
                            </p>
                        </div>
                        <div className="text-center border-x">
                            <p className="text-2xl font-semibold text-primary">
                                {stats.booksRead}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Livres lus
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-primary">
                                {stats.clubs}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Clubs
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="stats" className="w-full mb-8">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                        <TabsTrigger value="listes">Listes</TabsTrigger>
                        <TabsTrigger value="posts">Posts</TabsTrigger>
                        <TabsTrigger value="avis">Avis</TabsTrigger>
                    </TabsList>
                    <TabsContent value="stats">
                        {/* Contenu des stats */}
                    </TabsContent>
                    <TabsContent value="listes">
                        {/* Contenu des listes */}
                    </TabsContent>
                    <TabsContent value="posts">
                        {/* Contenu des posts */}
                    </TabsContent>
                    <TabsContent value="avis">
                        {/* Contenu des avis */}
                    </TabsContent>
                </Tabs>

                {/* Bouton de déconnexion */}
                <Button 
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    Se déconnecter
                </Button>
            </main>
        </div>
    );
} 