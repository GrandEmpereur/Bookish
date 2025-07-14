"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService } from "@/services/user.service";
import { GetUserProfileResponse } from "@/types/userTypes";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Book,
  BookOpen,
  CircleDashed,
  Globe,
  Heart,
  Loader2,
  Lock,
  MessageSquare,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Club } from "@/types/clubTypes";

interface LoadingStates {
  profile: boolean;
  bookLists: boolean;
  posts: boolean;
  clubs: boolean;
  reviews: boolean;
}

export default function UserDetails() {
  const { userId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<GetUserProfileResponse | null>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [hasSentRequest, setHasSentRequest] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getUserProfile(userId as string);
      setData(response);
    } catch (e) {
      toast.error("Impossible de charger le profil utilisateur");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const sendFriendRequest = useCallback(async () => {
    if (!data?.data?.id || hasSentRequest) return;
    try {
      setIsSending(true);
      await userService.sendFriendRequest(data.data.id);
      toast.success("Demande d'ami envoyée !");
      setHasSentRequest(true);
    } catch (e) {
      console.error(e);
      toast.error("Impossible d'envoyer la demande d'ami");
    } finally {
      setIsSending(false);
    }
  }, [data?.data?.id, hasSentRequest]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    profile: true,
    bookLists: false,
    posts: false,
    clubs: false,
    reviews: false,
  });

  const renderSkeleton = (type: "posts" | "book_lists" | "clubs") => (
    <div className="space-y-4 mt-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );

  const renderClubCard = (club: Club) => (
    <button
      key={club.id}
      onClick={() => router.push(`/clubs/${club.id}`)}
      className="w-full text-left p-4 border rounded-lg space-y-3 hover:bg-accent transition-colors"
    >
      <div className="flex gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-lg">
          {club.cover_image ? (
            <Image
              src={club.cover_image}
              alt={club.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{club.name}</h3>
            <Badge variant={club.type === "Private" ? "secondary" : "outline"}>
              {club.type === "Private" ? "Privé" : "Public"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {club.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {club.member_count} membre{club.member_count > 1 ? "s" : ""}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {club.genre}
            </Badge>
          </div>
        </div>
      </div>
    </button>
  );

  if (loading || !data) {
    return (
      <main className="container pt-12 px-5 max-w-md">
        <Skeleton className="h-16 w-16 rounded-full mb-4" />
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-full mb-8" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </main>
    );
  }

  const profile = data.data.profile;
  const posts = data.data.posts || [];

  return (
    <div className="min-h-dvh bg-background">
      <main className="container mx-auto pt-8 px-5 pb-[120px] max-w-md">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-2 mt-20">
          <Avatar className="w-16 h-16 border-4 border-[#F3D7D7] bg-[#F3D7D7]">
            <AvatarImage
              src={profile.profile_picture_url ?? "/avatar.png"}
              alt={profile.first_name || "Profil"}
            />
            <AvatarFallback>{profile.first_name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{data.data.username}</h1>

            <div className="mt-2 flex flex-wrap gap-2">
              {profile.preferredGenres?.slice(0, 2).map((genre, i) => (
                <span
                  key={i}
                  className="bg-[#F5F5F5] text-xs rounded-full px-3 py-1"
                >
                  {genre}
                </span>
              ))}
              {profile.readingHabit && (
                <div className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs font-medium">
                  {profile.readingHabit}
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {profile.bio || "Aucune bio disponible"}
            </p>
          </div>
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin text-purple-700" />
          ) : (
            <UserPlus
              className={`w-5 h-5 text-purple-700 ${
                hasSentRequest
                  ? "opacity-40 pointer-events-none"
                  : "cursor-pointer hover:text-purple-900"
              }`}
              onClick={sendFriendRequest}
            />
          )}
        </div>

        {/* Stats */}
        <div className="relative w-full rounded-xl px-6 py-4 bg-[#2F4739] overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex flex-col items-center flex-1">
              <CircleDashed className="w-5 h-5 text-white/80" />
              <span className="text-xs text-white/70">Suivis</span>
              <span className="text-white font-bold">
                {data.data.stats?.following_count || 0}
              </span>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div className="flex flex-col items-center flex-1">
              <Globe className="w-5 h-5 text-white/80" />
              <span className="text-xs text-white/70">Abonnés</span>
              <span className="text-white font-bold">
                {data.data.stats?.followers_count || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mt-6"
        >
          <TabsList className="w-full flex justify-center items-center border-b border-b-gray-200 rounded-none bg-transparent h-auto pb-0 gap-6">
            {[
              { label: "Posts", value: "posts" },
              { label: "Listes", value: "liste" },
              { label: "Clubs", value: "club" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none "
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="posts">
            {posts.length > 0 ? (
              <div className="space-y-4 mt-4">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => router.push(`/feed/${post.id}`)}
                    className="w-full text-left p-4 border rounded-lg space-y-3 hover:bg-accent transition-colors"
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {data.data.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {data.data.username}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </span>
                        </div>
                        <h3 className="text-sm text-muted-foreground">
                          {post.title}
                        </h3>
                        {post.subject === "book_review" && (
                          <div className="mt-1 inline-block bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                            Critique de livre
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments_count}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-4 text-muted-foreground">Aucun post publié</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liste">
            {data.data.book_lists.length > 0 ? (
              <div className="space-y-6">
                {data.data.book_lists.map((list) => (
                  <Card
                    key={list.id}
                    className="py-0 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => router.push(`/library/${list.id}`)}
                  >
                    <div className="p-4 flex flex-row gap-4">
                      {list.cover_image ? (
                        <div className="relative w-24 h-32 shrink-0">
                          <Image
                            src={list.cover_image}
                            alt={list.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-32 shrink-0 bg-muted flex items-center justify-center rounded-md">
                          <Book className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex-1 flex flex-col justify-between min-h-[130px]">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{list.name}</h3>

                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="default" className="text-xs">
                                {list.genre.charAt(0).toUpperCase() +
                                  list.genre.slice(1)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs flex items-center gap-1"
                              >
                                <BookOpen className="h-3 w-3" />
                                {list.book_count}{" "}
                                {list.book_count > 1 ? "livres" : "livre"}
                              </Badge>
                            </div>

                            {list.description && (
                              <p className="text-xs text-muted-foreground line-clamp-3">
                                {list.description}
                              </p>
                            )}
                          </div>
                          {list.visibility === "private" ? (
                            <Lock className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                          ) : (
                            <Globe className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Book className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-4 text-muted-foreground">
                  Aucune liste de livres
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="club">
            {loadingStates.clubs ? (
              renderSkeleton("clubs")
            ) : data.data.clubs.length > 0 ? (
              <div className="space-y-4">
                {data.data.clubs.map((club) => renderClubCard(club))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                <p className="mt-4 text-muted-foreground">Aucun club rejoint</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
