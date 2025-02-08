'use client';

import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, LogOut, Settings, Book, Users, Theater, MessageCircle, Heart, Star } from "lucide-react";
import { bookListService } from "@/services/book-list.service";
import { useEffect, useState } from "react";
import type { BookList } from "@/types/bookListTypes";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { postService } from "@/services/post.service";
import type { Post } from "@/types/postTypes";

// Données factices
const MOCK_POSTS = [
    {
        id: '1',
        content: "Je viens de finir 'L'Étranger' de Camus, un chef-d'œuvre absolu ! Qu'en pensez-vous ?",
        created_at: "2024-03-15T10:30:00Z",
        likes_count: 24,
        comments_count: 8,
        author: {
            id: '1',
            username: 'Alice',
            profile_picture_url: '/avatar.png'
        }
    },
    {
        id: '2',
        content: "Ma nouvelle collection de romans policiers commence à prendre forme ! Je vous partage mes dernières acquisitions.",
        created_at: "2024-03-14T15:20:00Z",
        likes_count: 15,
        comments_count: 3,
        author: {
            id: '2',
            username: 'Bob',
            profile_picture_url: '/avatar.png'
        }
    }
];

const MOCK_REVIEWS = [
    {
        id: '1',
        book: {
            title: "1984",
            author: "George Orwell",
            coverImage: "https://example.com/1984.jpg"
        },
        rating: 4.5,
        content: "Une dystopie fascinante et toujours d'actualité...",
        created_at: "2024-03-10T09:00:00Z",
        likes_count: 12
    },
    {
        id: '2',
        book: {
            title: "Dune",
            author: "Frank Herbert",
            coverImage: "https://example.com/dune.jpg"
        },
        rating: 5,
        content: "Un chef-d'œuvre de la science-fiction...",
        created_at: "2024-03-08T14:30:00Z",
        likes_count: 18
    }
];

const MOCK_CLUBS = [
    {
        id: '1',
        name: "Club des Classiques",
        members_count: 156,
        current_book: "Les Misérables",
        next_meeting: "2024-03-20T18:00:00Z",
        image: "/club1.jpg"
    },
    {
        id: '2',
        name: "Science-Fiction Fans",
        members_count: 89,
        current_book: "Fondation",
        next_meeting: "2024-03-22T19:00:00Z",
        image: "/club2.jpg"
    }
];

export default function Profile() {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [bookLists, setBookLists] = useState<BookList[]>([]);
    const [isLoadingLists, setIsLoadingLists] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);

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

    const fetchBookLists = async () => {
        try {
            setIsLoadingLists(true);
            const response = await bookListService.getBookLists();
            setBookLists(response.data);
        } catch (error) {
            console.error('Error fetching book lists:', error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger vos listes"
            });
        } finally {
            setIsLoadingLists(false);
        }
    };

    useEffect(() => {
        fetchBookLists();
    }, []);

    // const fetchUserPosts = async () => {
    //     try {
    //         setIsLoadingPosts(true);
    //         const response = await postService.getUserPosts();
    //         setPosts(response.data);
    //     } catch (error) {
    //         console.error('Error fetching posts:', error);
    //         toast({
    //             variant: "destructive",
    //             title: "Erreur",
    //             description: "Impossible de charger vos posts"
    //         });
    //     } finally {
    //         setIsLoadingPosts(false);
    //     }
    // };

    const renderBookListSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-[120px] w-[80px]" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );

    const renderPostSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24 mt-1" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex gap-4">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-[100dvh] bg-background">
            <main className="container mx-auto pt-[120px] px-5 pb-[120px] max-w-3xl">
                {/* Section Avatar et Infos */}
                <div className="flex flex-col items-center space-y-4 mb-8">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={user?.profile?.profile_picture_url ?? undefined} alt={user?.username ?? undefined} />
                        <AvatarFallback>
                            {user?.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <h1 className="text-3xl font-bold">
                                {user?.username}
                            </h1>
                            {user?.profile?.profile_visibility === 'private' ? (
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
                        {user?.profile?.preferred_genres && user?.profile?.preferred_genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                {user?.profile?.preferred_genres.map((genre) => (
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
                        <div className="grid grid-cols-4 gap-4 mt-8">
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
                                    <Users className="w-5 h-5 mb-2 text-muted-foreground" />
                                    <p className="text-2xl font-bold text-primary">
                                        {user?.stats?.following_count || 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Followings
                                    </p>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex flex-col items-center">
                                    <Book className="w-5 h-5 mb-2 text-muted-foreground" />
                                    <p className="text-2xl font-bold text-primary">
                                        { 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Livres lus
                                    </p>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex flex-col items-center">
                                    <Theater className="w-5 h-5 mb-2 text-muted-foreground" />
                                    <p className="text-2xl font-bold text-primary">
                                        {0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Clubs
                                    </p>
                                </div>
                            </Card>
                        </div>

                        {/* Tabs avec largeur fixe */}
                        <div className="max-w-[600px] mx-auto mt-8">
                            <Tabs defaultValue="stats" className="w-full">
                                <TabsList className="grid w-full grid-cols-5 h-14">
                                    <TabsTrigger value="stats" className="data-[state=active]:bg-accent">Stats</TabsTrigger>
                                    <TabsTrigger value="listes" className="data-[state=active]:bg-accent">Listes</TabsTrigger>
                                    <TabsTrigger value="posts" className="data-[state=active]:bg-accent">Posts</TabsTrigger>
                                    <TabsTrigger value="avis" className="data-[state=active]:bg-accent">Avis</TabsTrigger>
                                    <TabsTrigger value="clubs" className="data-[state=active]:bg-accent">Clubs</TabsTrigger>
                                </TabsList>

                                {/* Conteneur principal des tabs */}
                                <div className="w-full mt-6">
                                    <TabsContent value="stats" className="w-full">
                                        <div className="space-y-4">
                                            Contenu des statistiques à venir...
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="listes" className="w-full">
                                        <div className="space-y-4">
                                            {isLoadingLists ? (
                                                renderBookListSkeleton()
                                            ) : bookLists.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <Book className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                                                    <p className="mt-4 text-muted-foreground">
                                                        Vous n'avez pas encore créé de liste
                                                    </p>
                                                    <Button 
                                                        variant="outline" 
                                                        className="mt-4"
                                                        onClick={() => router.push('/library/create')}
                                                    >
                                                        Créer une liste
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="grid gap-4">
                                                    {bookLists.map((list) => (
                                                        <button
                                                            key={list.id}
                                                            onClick={() => router.push(`/library/${list.id}`)}
                                                            className="w-full text-left"
                                                        >
                                                            <div className="flex gap-4 p-4 border rounded-lg hover:bg-accent transition-colors">
                                                                <div className="relative h-[120px] w-[80px] overflow-hidden rounded-md">
                                                                    {list.coverImage ? (
                                                                        <Image
                                                                            src={list.coverImage}
                                                                            alt={list.name}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                                                            <Book className="h-8 w-8 text-muted-foreground" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <h3 className="font-semibold text-lg">{list.name}</h3>
                                                                        <Badge variant={list.visibility === 'private' ? 'secondary' : 'outline'}>
                                                                            {list.visibility === 'private' ? 'Privé' : 'Public'}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                                        {list.description}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        <Badge variant="secondary">
                                                                            {list.bookCount} livre{list.bookCount > 1 ? 's' : ''}
                                                                        </Badge>
                                                                        <Badge variant="outline">
                                                                            {list.genre}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="posts" className="w-full">
                                        <div className="grid gap-4">
                                            {MOCK_POSTS.map((post) => (
                                                <div key={post.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={post.author.profile_picture_url} alt={post.author.username} />
                                                            <AvatarFallback>{post.author.username[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium">{post.author.username}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {new Date(post.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm">{post.content}</p>
                                                    <div className="flex items-center gap-4 mt-3">
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <Heart className="w-4 h-4" />
                                                            {post.likes_count}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                            <MessageCircle className="w-4 h-4" />
                                                            {post.comments_count}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="avis" className="w-full">
                                        <div className="grid gap-4">
                                            {MOCK_REVIEWS.map((review) => (
                                                <div key={review.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                                    <div className="flex gap-4">
                                                        <div className="relative h-[100px] w-[70px] flex-shrink-0">
                                                            <Image
                                                                src={review.book.coverImage}
                                                                alt={review.book.title}
                                                                fill
                                                                className="object-cover rounded-md"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold">{review.book.title}</h3>
                                                            <p className="text-sm text-muted-foreground">{review.book.author}</p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <div className="flex">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`w-4 h-4 ${
                                                                                i < review.rating 
                                                                                    ? 'text-yellow-400 fill-yellow-400' 
                                                                                    : 'text-gray-300'
                                                                            }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-sm text-muted-foreground">
                                                                    {review.rating}/5
                                                                </span>
                                                            </div>
                                                            <p className="text-sm mt-2">{review.content}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="clubs" className="w-full">
                                        <div className="grid gap-4">
                                            {MOCK_CLUBS.map((club) => (
                                                <div key={club.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative h-16 w-16 rounded-full overflow-hidden">
                                                            <Image
                                                                src={club.image}
                                                                alt={club.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold">{club.name}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {club.members_count} membres
                                                            </p>
                                                            <div className="mt-2">
                                                                <Badge variant="outline">
                                                                    Lecture en cours : {club.current_book}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground mt-2">
                                                                Prochaine réunion : {new Date(club.next_meeting).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 