'use client';

import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, LogOut, Settings, Book, Users } from "lucide-react";

export default function Profile() {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

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
            <main className="container mx-auto pt-[120px] px-5 pb-[120px] max-w-3xl">
                {/* Section Avatar et Infos */}
                <div className="flex flex-col items-center space-y-4 mb-8">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={user?.profile?.profile_picture_url} alt={user?.user?.username} />
                        <AvatarFallback>
                            {user?.user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <h1 className="text-3xl font-bold">
                                {user?.user?.username}
                            </h1>
                            {user?.profile?.profileVisibility === 'private' ? (
                                <Badge variant="outline" className="gap-1">
                                    <EyeOff className="w-3 h-3" />
                                    Privé
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="gap-1">
                                    <Eye className="w-3 h-3" />
                                    Public
                                </Badge>
                            )}
                        </div>

                        {user?.profile?.bio && (
                            <p className="text-muted-foreground mt-4 text-lg max-w-md">
                                {user.profile.bio}
                            </p>
                        )}

                        {/* Genres */}
                        {user?.profile?.preferredGenres && user.profile.preferredGenres.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                {user.profile.preferredGenres.map((genre) => (
                                    <Badge 
                                        key={genre} 
                                        variant="outline"
                                        className="px-3 py-1"
                                    >
                                        {genre}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <Card className="p-4">
                                <div className="flex flex-col items-center">
                                    <Users className="w-5 h-5 mb-2 text-muted-foreground" />
                                    <p className="text-2xl font-bold text-primary">
                                        {user?.stats?.followers_count || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Followers
                                    </p>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex flex-col items-center">
                                    <Book className="w-5 h-5 mb-2 text-muted-foreground" />
                                    <p className="text-2xl font-bold text-primary">
                                        238
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Livres lus
                                    </p>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex flex-col items-center">
                                    <Users className="w-5 h-5 mb-2 text-muted-foreground" />
                                    <p className="text-2xl font-bold text-primary">
                                        3
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Clubs
                                    </p>
                                </div>
                            </Card>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="stats" className="w-full mt-8">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="stats">Stats</TabsTrigger>
                                <TabsTrigger value="listes">Listes</TabsTrigger>
                                <TabsTrigger value="posts">Posts</TabsTrigger>
                                <TabsTrigger value="avis">Avis</TabsTrigger>
                                <TabsTrigger value="clubs">Clubs</TabsTrigger>
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
                            <TabsContent value="clubs">
                                {/* Contenu des clubs */}
                            </TabsContent>
                        </Tabs>

                        {/* Actions */}
                        <div className="flex justify-center gap-3 mt-8">
                            <Button 
                                variant="outline" 
                                className="gap-2"
                                onClick={() => router.push('/settings')}
                            >
                                <Settings className="w-4 h-4" />
                                Paramètres
                            </Button>
                            <Button 
                                variant="outline" 
                                className="gap-2"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4" />
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 