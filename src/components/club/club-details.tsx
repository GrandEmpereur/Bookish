"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Loader2, Settings, UserPlus } from "lucide-react";
import { Share2, Users, MessageCircle, Heart, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clubService } from "@/services/club.service";
import { Club, ClubMember, ClubPost, ClubMessage } from "@/types/clubTypes";
import { useAuth } from "@/contexts/auth-context";

interface ClubDetailsProps {
  clubId: string;
}
export default function ClubDetails({ clubId }: ClubDetailsProps) {
  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [posts, setPosts] = useState<ClubPost[]>([]);
  const [messages, setMessages] = useState<ClubMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const enhanceClubData = (clubData: any) => {
    if (!user?.id) {
      return {
        ...clubData,
        isMember: false,
        currentUserRole: null
      };
    }

    const userMembership = clubData.members?.find((member: any) => member.id === user.id);
    return {
      ...clubData,
      isMember: !!userMembership,
      currentUserRole: userMembership?.role || null
    };
  };

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await clubService.getMembers(clubId, { page: 1, perPage: 50 });
      if (response.data) {
        setMembers(response.data.members || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des membres:", error);
      toast.error("Impossible de charger les membres.");
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await clubService.getPosts(clubId, { page: 1, perPage: 20 });
      if (response.data) {
        setPosts(response.data.posts || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des posts:", error);
      toast.error("Impossible de charger les posts.");
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await clubService.getMessages(clubId, { page: 1, perPage: 50 });
      if (response.data) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
      toast.error("Impossible de charger les messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await clubService.getClub(clubId);
        
        if (response.data) {
          // Pour getClub, les données sont directement dans response.data
          setClub(enhanceClubData(response.data));
          // Récupérer les membres pour les avatars
          fetchMembers();
        }
      } catch (error) {
        console.error("Erreur lors du chargement du club:", error);
        toast.error("Impossible de charger le club.");
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubId]);

  // Re-calculer les propriétés de membre quand l'utilisateur change
  useEffect(() => {
    if (club) {
      setClub(prevClub => prevClub ? enhanceClubData(prevClub) : null);
    }
  }, [user?.id]);

  const handleJoinClub = async () => {
    if (!club || !user) {
      toast.error("Vous devez être connecté pour rejoindre un club");
      return;
    }
    
    setIsJoining(true);
    try {
      if (club.type === "Public") {
        await clubService.joinClub(clubId);
        toast.success("Vous avez rejoint le club !");
        // Refresh club data
        const response = await clubService.getClub(clubId);
        if (response.data) {
          setClub(enhanceClubData(response.data));
        }
      } else {
        // Rediriger vers la page de demande d'adhésion pour les clubs privés
        router.push(`/clubs/${clubId}/join-request`);
      }
    } catch (error: any) {
      console.error("Erreur lors de l'adhésion:", error);
      toast.error(error.message || "Impossible de rejoindre le club");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveClub = async () => {
    if (!club || !user) {
      toast.error("Vous devez être connecté pour quitter un club");
      return;
    }
    
    setIsJoining(true);
    try {
      await clubService.leaveClub(clubId);
      toast.success("Vous avez quitté le club");
      // Refresh club data
      const response = await clubService.getClub(clubId);
      if (response.data) {
        setClub(enhanceClubData(response.data));
      }
    } catch (error: any) {
      console.error("Erreur lors de la sortie:", error);
      toast.error(error.message || "Impossible de quitter le club");
    } finally {
      setIsJoining(false);
    }
  };

  const canModerate = club?.currentUserRole && ['ADMIN', 'OWNER', 'MODERATOR'].includes(club.currentUserRole);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center pt-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!club) {
    return <div className="text-center pt-10">Club introuvable</div>;
  }

  return (
    <div className="flex-1 pt-[74px]">
      {/* Cover Image avec boutons */}
      <div className="relative w-full h-[300px]">
        {club.club_picture ? (
          <Image
            src={club.club_picture}
            alt={club.name}
            fill
            className="object-cover"
            draggable={false}
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ImageIcon className="text-muted-foreground w-8 h-8" />
          </div>
        )}

        <div className="absolute top-4 right-4 flex items-center gap-2">
          {canModerate && (
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full"
              onClick={() => router.push(`/clubs/${clubId}/settings`)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <Button size="icon" variant="default" className="rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            className="rounded-full"
            onClick={
              !user 
                ? () => router.push("/auth/login")
                : (club.isMember || club.currentUserRole) 
                  ? handleLeaveClub 
                  : handleJoinClub
            }
            disabled={isJoining && !!user}
          >
            {isJoining && user ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : !user ? (
              "Se connecter"
            ) : (club.isMember || club.currentUserRole) ? (
              "Quitter"
            ) : club.type === "Private" ? (
              <>
                <UserPlus className="h-4 w-4 mr-1" />
                Demander
              </>
            ) : (
              "Rejoindre"
            )}
          </Button>
        </div>
      </div>

      {/* Contenu */}
      <div className="px-5 space-y-6">
        {/* En-tête du club */}
        <div className="space-y-4 pt-6">
          <div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{club.name}</h1>
              </div>
              
              {/* Div à droite avec avatars et badge en colonne */}
              <div className="flex flex-col items-end gap-3">
                {/* Stack d'avatars des membres */}
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                  {members.slice(0, 3).map((member) => (
                    <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                      <AvatarImage 
                        src={member.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${member.username}`} 
                        alt={`@${member.username}`} 
                      />
                      <AvatarFallback className="text-xs">
                        {member.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {members.length > 3 && (
                    <Avatar className="w-8 h-8 border-2 border-background">
                      <AvatarFallback className="text-xs bg-muted">
                        +{members.length - 3}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                
                {/* Badge Public/Privé */}
                {club.type === "Public" ? (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Globe className="h-3 w-3" />
                    Public
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Lock className="h-3 w-3" />
                    Privé
                  </Badge>
                )}
              </div>
            </div>

            {club.description && (
              <p className="text-muted-foreground mt-6">{club.description}</p>
            )}
          </div>


        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts" onClick={() => !posts.length && fetchPosts()}>Posts</TabsTrigger>
            <TabsTrigger value="chat" onClick={() => !messages.length && fetchMessages()}>Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-6">
            <div className="space-y-4">
              {user && (club.isMember || club.currentUserRole) && (
                <Button 
                  onClick={() => router.push(`/clubs/${clubId}/posts/create`)}
                  className="w-full"
                >
                  Créer un post
                </Button>
              )}
              
              {loadingPosts ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 space-y-3">
                      {post.isPinned && (
                        <Badge variant="secondary" className="text-xs">📌 Épinglé</Badge>
                      )}
                      <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={post.author?.profile?.profile_picture_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {post.author?.username?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">{post.author?.username}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h3 className="font-semibold mt-1">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">Sujet: {post.subject}</p>
                          <p className="mt-2">{post.content}</p>
                          
                          {post.mediaUrl && (
                            <div className="mt-3">
                              <Image
                                src={post.mediaUrl}
                                alt="Media du post"
                                width={400}
                                height={200}
                                className="rounded-lg max-w-full h-auto"
                              />
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {post.likesCount || 0}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              {post.commentsCount || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun post pour le moment</p>
                  {!user ? (
                    <p className="text-sm">Connectez-vous pour participer !</p>
                  ) : (club.isMember || club.currentUserRole) ? (
                    <p className="text-sm">Soyez le premier à publier !</p>
                  ) : (
                    <p className="text-sm">Rejoignez le club pour publier !</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            {(club.isMember || club.currentUserRole) ? (
              <div className="space-y-4">
                <Button 
                  onClick={() => router.push(`/clubs/${clubId}/messages`)}
                  className="w-full"
                >
                  Ouvrir le chat complet
                </Button>
                
                {loadingMessages ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {messages.slice(0, 10).map((message) => {
                      const member = members.find(m => m.id === message.userId);
                      return (
                        <div key={message.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member?.profile_picture || `https://api.dicebear.com/7.x/initials/svg?seed=${member?.username}`} />
                            <AvatarFallback className="text-xs">
                              {member?.username?.substring(0, 2).toUpperCase() || '??'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">{member?.username || 'Utilisateur inconnu'}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground text-xs">
                                {new Date(message.createdAt).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{message.content}</p>
                            {message.mediaUrl && (
                              <div className="mt-2">
                                <Image
                                  src={message.mediaUrl}
                                  alt="Media du message"
                                  width={200}
                                  height={150}
                                  className="rounded-lg max-w-full h-auto"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {messages.length > 10 && (
                      <div className="text-center text-sm text-muted-foreground">
                        Et {messages.length - 10} message{messages.length - 10 > 1 ? 's' : ''} de plus...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Aucun message pour le moment</p>
                    <p className="text-sm">Démarrez une conversation !</p>
                  </div>
                )}
              </div>
            ) : !user ? (
              <div className="text-center space-y-3">
                <p className="text-muted-foreground">
                  Connectez-vous pour accéder au chat du club
                </p>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => router.push("/auth/login")}
                >
                  Se connecter
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-muted-foreground">
                  Vous devez être membre du club pour accéder au chat
                </p>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={handleJoinClub}
                  disabled={isJoining}
                >
                  {isJoining ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Rejoindre le club
                </Button>
              </div>
            )}
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}
