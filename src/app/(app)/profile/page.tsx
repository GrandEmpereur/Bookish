"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { bookListService } from "@/services/book-list.service";
import type { BookList } from "@/types/bookListTypes";
import { Book, Eye, EyeOff, Heart, MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MOCK_POSTS = [
  {
    id: "1",
    content:
      "Je viens de finir 'L'Étranger' de Camus, un chef-d'œuvre absolu ! Qu'en pensez-vous ?",
    created_at: "2024-03-15T10:30:00Z",
    likes_count: 24,
    comments_count: 8,
    author: {
      id: "1",
      username: "Alice",
      profile_picture_url: "/avatar.png",
    },
  },
  {
    id: "2",
    content:
      "Ma nouvelle collection de romans policiers commence à prendre forme ! Je vous partage mes dernières acquisitions.",
    created_at: "2024-03-14T15:20:00Z",
    likes_count: 15,
    comments_count: 3,
    author: {
      id: "2",
      username: "Bob",
      profile_picture_url: "/avatar.png",
    },
  },
];

const MOCK_REVIEWS = [
  {
    id: "1",
    book: {
      title: "1984",
      author: "George Orwell",
      coverImage: "https://example.com/1984.jpg",
    },
    rating: 4.5,
    content: "Une dystopie fascinante et toujours d'actualité...",
    created_at: "2024-03-10T09:00:00Z",
    likes_count: 12,
  },
  {
    id: "2",
    book: {
      title: "Dune",
      author: "Frank Herbert",
      coverImage: "https://example.com/dune.jpg",
    },
    rating: 5,
    content: "Un chef-d'œuvre de la science-fiction...",
    created_at: "2024-03-08T14:30:00Z",
    likes_count: 18,
  },
];

const MOCK_CLUBS = [
  {
    id: "1",
    name: "Club des Classiques",
    members_count: 156,
    current_book: "Les Misérables",
    next_meeting: "2024-03-20T18:00:00Z",
    image: "/club1.jpg",
  },
  {
    id: "2",
    name: "Science-Fiction Fans",
    members_count: 89,
    current_book: "Fondation",
    next_meeting: "2024-03-22T19:00:00Z",
    image: "/club2.jpg",
  },
];

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [bookLists, setBookLists] = useState<BookList[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur Bookish !",
      });
      router.push("/auth/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    }
  };

  const fetchBookLists = async () => {
    try {
      setIsLoadingLists(true);
      const response = await bookListService.getBookLists();
      setBookLists(response.data);
    } catch (error) {
      console.error("Error fetching book lists:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger vos listes",
      });
    } finally {
      setIsLoadingLists(false);
    }
  };

  useEffect(() => {
    fetchBookLists();
  }, []);

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

  return (
    <div className="min-h-[100dvh] bg-background">
      <main className="container mx-auto pt-[120px] px-5 pb-[120px] max-w-3xl">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Avatar className="w-32 h-32">
            <AvatarImage
              src={user?.profile?.profile_picture_url ?? undefined}
              alt={user?.username ?? undefined}
            />
            <AvatarFallback>
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-bold">
                {user?.username || "Lucas"}
              </h1>
              {user?.profile?.profile_visibility === "private" ? (
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

            <p className="text-muted-foreground mt-2 text-lg max-w-md">
              {user?.profile?.bio ||
                "Fan de thriller et de romance mais j’aime aussi la fantasy et le scifi"}
            </p>

            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {(
                user?.profile?.preferred_genres ?? ["Thrillers", "Fiction"]
              ).map((genre) => (
                <Badge key={genre} variant="outline" className="px-3 py-1">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Followers</p>
                <p className="text-2xl font-bold text-primary">
                  {user?.stats?.followers_count ?? 360}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Livres lus</p>
                <p className="text-2xl font-bold text-primary">{238}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Clubs</p>
                <p className="text-2xl font-bold text-primary">{3}</p>
              </div>
            </div>

            <div className="max-w-[600px] mx-auto mt-8">
              <Tabs defaultValue="stats" className="w-full">
                <TabsList className="grid w-full grid-cols-5 h-14">
                  <TabsTrigger
                    value="stats"
                    className="data-[state=active]:bg-accent"
                  >
                    Stats
                  </TabsTrigger>
                  <TabsTrigger
                    value="listes"
                    className="data-[state=active]:bg-accent"
                  >
                    Listes
                  </TabsTrigger>
                  <TabsTrigger
                    value="posts"
                    className="data-[state=active]:bg-accent"
                  >
                    Posts
                  </TabsTrigger>
                  <TabsTrigger
                    value="avis"
                    className="data-[state=active]:bg-accent"
                  >
                    Avis
                  </TabsTrigger>
                  <TabsTrigger
                    value="clubs"
                    className="data-[state=active]:bg-accent"
                  >
                    Clubs
                  </TabsTrigger>
                </TabsList>

                <div className="w-full mt-6">
                  <TabsContent value="stats" className="w-full">
                    <div
                      className="cursor-pointer rounded-xl p-6 text-white"
                      style={{
                        background:
                          "linear-gradient(to right, #6DA37F, #416E54)",
                      }}
                      onClick={() => router.push("/profile/stats")}
                    >
                      <h2 className="text-center text-xl font-semibold mb-6">
                        Résumé de lecture
                      </h2>

                      <div className="grid grid-cols-3 gap-4">
                        <div
                          className="rounded-lg px-4 py-5 flex flex-col items-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mb-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-3.03 2.47-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09A6.025 6.025 0 0 1 16.5 3C19.53 3 22 5.47 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <p className="text-sm font-semibold mb-1">
                            Genre le plus lus
                          </p>
                          <p className="text-base mb-1">Romance</p>
                          <p className="text-xs text-gray-200">
                            Depuis le début de l'année
                          </p>
                        </div>

                        <div
                          className="rounded-lg px-4 py-5 flex flex-col items-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                        >
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-white mb-2">
                            <img
                              src="/avatar.png"
                              alt="avatar"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-semibold mb-1">
                            2024 goal
                          </p>
                          <p className="text-base mb-1">20 sur 50</p>
                          <p className="text-xs text-gray-200">Livres</p>
                        </div>

                        <div
                          className="rounded-lg px-4 py-5 flex flex-col items-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mb-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27l5.18 3.05-1.39-5.81 4.47-3.88-5.85-.5L12 5.1l-2.41 5.03-5.85.5 4.47 3.88-1.39 5.81L12 17.27z" />
                          </svg>
                          <p className="text-sm font-semibold mb-1">
                            Note moyenne
                          </p>
                          <p className="text-base mb-1">4.5</p>
                          <p className="text-xs text-gray-200">Étoiles</p>
                        </div>
                      </div>

                      <div className="mt-6 text-center">
                        <p className="mb-2 font-semibold">
                          20 Livres lus depuis le début de l'année
                        </p>
                        <div className="w-full h-2 bg-white/40 rounded-full">
                          <div
                            className="h-2 bg-white rounded-full"
                            style={{ width: "40%" }}
                          ></div>
                        </div>
                      </div>
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
                            onClick={() => router.push("/library/create")}
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
                                    <h3 className="font-semibold text-lg">
                                      {list.name}
                                    </h3>
                                    <Badge
                                      variant={
                                        list.visibility === "private"
                                          ? "secondary"
                                          : "outline"
                                      }
                                    >
                                      {list.visibility === "private"
                                        ? "Privé"
                                        : "Public"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {list.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary">
                                      {list.bookCount} livre
                                      {list.bookCount > 1 ? "s" : ""}
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
                        <div
                          key={post.id}
                          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={post.author.profile_picture_url}
                                alt={post.author.username}
                              />
                              <AvatarFallback>
                                {post.author.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {post.author.username}
                              </p>
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
                        <div
                          key={review.id}
                          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
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
                              <h3 className="font-semibold">
                                {review.book.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {review.book.author}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.round(review.rating)
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
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
                        <div
                          key={club.id}
                          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
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
                                Prochaine réunion :{" "}
                                {new Date(
                                  club.next_meeting
                                ).toLocaleDateString()}
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
