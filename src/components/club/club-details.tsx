"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Loader2, Settings, UserPlus, Send, Shield, Mail } from "lucide-react";
import { Share2, Users, MessageCircle, Heart, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ClubPostCard } from "@/components/club/club-post-card";
import { MessageModerationMenu } from "@/components/ui/message-moderation-menu";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";
import { ShareDialog } from "@/components/ui/share-dialog";
import { cn } from "@/lib/utils";
import { clubService } from "@/services/club.service";
import { userService } from "@/services/user.service";
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
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ClubPost | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Vérifier si l'utilisateur actuel est membre du club
  const isMemberOfClub = user?.user?.id
    ? memberIds.includes(user.user.id)
    : false;
  const isOwner = club?.owner?.id === user?.user?.id;

  // Vérifier si l'utilisateur est membre du club OU propriétaire
  const isMemberOrNot = user?.user?.id
    ? // Est membre : son ID est dans la liste des membres
      memberIds.includes(user.user.id) ||
      // OU est propriétaire : son ID = owner.id du club
      club?.owner?.id === user.user.id
    : false;

  // Composant skeleton pour les posts
  const ClubPostSkeleton = () => (
    <div className="rounded-lg p-4 md:p-6 shadow-xs space-y-4 bg-card">
      {/* Header */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-32 mt-1" />
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Image */}
      <Skeleton className="h-48 w-full rounded-lg" />
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );

  // Composant skeleton pour les messages
  const ChatMessageSkeleton = ({ isOwn = false }: { isOwn?: boolean }) => (
    <div
      className={cn(
        "group flex items-end gap-2",
        isOwn ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar pour les messages des autres */}
      {!isOwn && <Skeleton className="h-8 w-8 rounded-full mb-1" />}
      
      {/* Message bubble */}
      <div className={cn("flex items-center gap-1", isOwn ? "flex-row-reverse" : "flex-row")}>
        <Skeleton 
          className={cn(
            "h-10 rounded-2xl",
            isOwn ? "w-32" : "w-40"
          )} 
        />
      </div>
    </div>
  );

  const ChatSkeleton = () => (
    <div className="space-y-3 max-h-96 overflow-y-auto pb-4">
      <ChatMessageSkeleton isOwn={false} />
      <ChatMessageSkeleton isOwn={true} />
      <ChatMessageSkeleton isOwn={false} />
      <ChatMessageSkeleton isOwn={true} />
      <ChatMessageSkeleton isOwn={false} />
    </div>
  );

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const response = await clubService.getMembers(clubId, {
        page: 1,
        perPage: 50,
      });

      if (response.data) {
        const membersData = response.data.members || [];
        setMembers(membersData);

        // Extraire les IDs des membres
        const ids = membersData.map((member: any) => member.id);
        setMemberIds(ids);
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
      const response = await clubService.getPosts(clubId, {
        page: 1,
        perPage: 20,
      });
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
      const response = await clubService.getMessages(clubId, {
        page: 1,
        perPage: 50,
      });
      if (response.status === "success" && response.data?.messages) {
        // Les messages arrivent déjà avec isOwnMessage de l'API
        const mappedMessages = response.data.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          createdAt: msg.createdAt,
          mediaUrl: msg.mediaUrl,
          isReported: msg.isReported,
          isOwnMessage: msg.isOwnMessage, // Fourni par l'API
          user: {
            id: msg.user.id,
            username: msg.user.username,
            profilePicture: msg.user.profilePicture,
          },
          // Compatibilité avec l'UI chat existante
          sender: {
            id: msg.user.id,
            username: msg.user.username,
            profilePicture: msg.user.profilePicture,
          },
          is_mine: msg.isOwnMessage, // Alias pour la compatibilité
        }));
        setMessages(mappedMessages);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
      toast.error("Impossible de charger les messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    const initializeClub = async () => {
      try {
        setLoading(true);

        // 1. Récupérer les données du club
        const clubResponse = await clubService.getClub(clubId);
        if (clubResponse.data) {
          setClub(clubResponse.data);
        }

        // 2. Récupérer la liste des membres du club
        await fetchMembers();

        // 3. Charger les posts automatiquement (onglet par défaut)
        fetchPosts();
      } catch (error) {
        console.error("Erreur lors de l'initialisation du club:", error);
        toast.error("Impossible de charger le club.");
      } finally {
        setLoading(false);
      }
    };

    initializeClub();
  }, [clubId]);

  // Supprimer l'ancien useEffect car on n'utilise plus enhanceClubData

  const handleJoinClub = async () => {
    if (!club || !user) {
      toast.error("Vous devez être connecté pour rejoindre un club");
      return;
    }

    setIsJoining(true);
    try {
      if (club.type === "Public") {
        // API: POST {{baseUrl}}/clubs/{{clubId}}/join
        await clubService.joinClub(clubId);
        toast.success("Vous avez rejoint le club !");
        // Refresh members data pour mettre à jour isMemberOrNot
        await fetchMembers();
      } else {
        // Pour les clubs privés, créer une demande d'adhésion
        // API: POST {{baseUrl}}/clubs/{{clubId}}/requests
        router.push(`/clubs/${clubId}/join-request`);
      }
    } catch (error: any) {
      console.error("Erreur lors de l'adhésion:", error);
      toast.error(error.message || "Impossible de rejoindre le club");
    } finally {
      setIsJoining(false);
    }
  };

  const handleShare = async () => {
    if (!club) return;

    // Créer un objet post factice pour le ShareDialog avec les bonnes infos
    const clubAsPost = {
      id: `clubs/${club.id}`, // URL sera /feed/clubs/{clubId} mais on va corriger ça
      title: `Rejoignez le club "${club.name}"`,
      content: `${club.description || "Découvrez ce club sur Bookish !"}\n\n📚 ${club.member_count} membre${club.member_count > 1 ? "s" : ""}\n🏷️ ${club.genre || "Tous genres"}\n${club.type === "Private" ? "🔒 Club privé" : "🌍 Club public"}`,
      user: {
        username: `Club créé par ${club.owner?.username || "un membre"}`,
      },
    };

    // Vérifier si on peut utiliser le partage natif (mobile/Capacitor)
    const canUseNativeShare = Capacitor.isNativePlatform();

    if (canUseNativeShare) {
      try {
        const shareOptions = {
          title: club.name,
          text: `Rejoignez le club "${club.name}" sur Bookish !`,
          url: `${window.location.origin}/clubs/${club.id}`,
          dialogTitle: "Partager ce club",
        };

        await Share.share(shareOptions);
      } catch (error: any) {
        // Ne rien faire si l'utilisateur annule le partage
        if (error.message !== "Share canceled") {
          console.error("Share error:", error);
          // Fallback vers le dialog desktop
          setSelectedPost(clubAsPost as any);
          setShareDialogOpen(true);
        }
      }
    } else {
      // Desktop : ouvrir le dialog de partage
      setSelectedPost(clubAsPost as any);
      setShareDialogOpen(true);
    }
  };

  const handleLeaveClub = async () => {
    if (!club || !user) {
      toast.error("Vous devez être connecté pour quitter un club");
      return;
    }

    setIsJoining(true);
    try {
      // API: POST {{baseUrl}}/clubs/{{clubId}}/leave
      await clubService.leaveClub(clubId);
      toast.success("Vous avez quitté le club");
      // Refresh members data pour mettre à jour isMemberOrNot
      await fetchMembers();
    } catch (error: any) {
      console.error("Erreur lors de la sortie:", error);
      toast.error(error.message || "Impossible de quitter le club");
    } finally {
      setIsJoining(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!user)
      return toast.error("Vous devez être connecté pour envoyer un message");

    setIsSending(true);
    try {
      const response = await clubService.sendMessage(clubId, {
        content: newMessage.trim(),
      });

      if (response.status === "success") {
        // Mise à jour optimiste : ajouter le message immédiatement à la liste
        const messageData = response.data;
        const newMessageData: ClubMessage = {
          id: messageData.id,
          content: messageData.content,
          isReported: messageData.isReported,
          isOwnMessage: messageData.isOwnMessage, // Fourni par l'API
          user: {
            id: messageData.user.id,
            username: messageData.user.username,
            profilePicture: messageData.user.profilePicture,
          },
          sender: {
            id: messageData.user.id,
            username: messageData.user.username,
            profilePicture: messageData.user.profilePicture,
          },
          createdAt: messageData.createdAt,
          mediaUrl: messageData.mediaUrl,
          is_mine: messageData.isOwnMessage, // Alias pour la compatibilité
        };

        setMessages((prev) => [...prev, newMessageData]);
        setNewMessage("");
        toast.success("Message envoyé");
      } else {
        throw new Error("Erreur lors de l'envoi du message");
      }
    } catch (error: any) {
      console.error("Erreur envoi message:", error);
      toast.error(error.message || "Impossible d'envoyer le message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canModerate = isOwner;

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
              <>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => router.push(`/clubs/${clubId}/invitations`)}
                  title="Invitations"
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => router.push(`/clubs/${clubId}/moderation`)}
                  title="Modération"
                >
                  <Shield className="h-4 w-4" />
                </Button>
              </>
            )}
          <Button
            size="icon"
            variant="default"
            className="rounded-full"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          {/* Bouton Join/Leave - masqué si pas connecté ou si owner */}
          {user?.user?.id && !isOwner && (
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={isMemberOrNot ? handleLeaveClub : handleJoinClub}
              disabled={isJoining}
            >
              {isJoining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isMemberOrNot ? (
                "Quitter"
              ) : club?.type === "Private" ? (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Demander
                </>
              ) : (
                "Rejoindre"
              )}
            </Button>
          )}

          {/* Bouton Se connecter si pas connecté */}
          {!user?.user?.id && (
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => router.push("/auth/login")}
            >
              Se connecter
            </Button>
          )}
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
                    <Avatar
                      key={member.id}
                      className="w-8 h-8 border-2 border-background"
                    >
                      <AvatarImage
                        src={
                          member.profile_picture ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${member.username}`
                        }
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
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center gap-1">
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
        <Tabs
          defaultValue="posts"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="posts"
              onClick={() => !posts.length && fetchPosts()}
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              onClick={() =>
                !messages.length && isMemberOrNot && fetchMessages()
              }
            >
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <div className="space-y-4">
              {loadingPosts ? (
                <div className="space-y-4">
                  <ClubPostSkeleton />
                  <ClubPostSkeleton />
                  <ClubPostSkeleton />
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4">
                  {/* Trier les posts : épinglés en premier, puis par date */}
                  {posts
                    .sort((a, b) => {
                      // Épinglés en premier
                      if (a.isPinned && !b.isPinned) return -1;
                      if (!a.isPinned && b.isPinned) return 1;
                      // Ensuite par date (plus récent en premier)
                      return new Date(b.created_at || b.createdAt || '').getTime() - 
                             new Date(a.created_at || a.createdAt || '').getTime();
                    })
                    .map((post) => (
                  <ClubPostCard
                    key={post.id}
                    post={post}
                    canModerate={canModerate}
                    onShare={(sharedPost) => {
                      // Créer un objet post compatible avec ShareDialog
                      const postForDialog = {
                        id: sharedPost.id,
                        title: sharedPost.title,
                        content: sharedPost.content,
                        user: sharedPost.user,
                      };

                      const canUseNativeShare = Capacitor.isNativePlatform();

                      if (canUseNativeShare) {
                        Share.share({
                          title: sharedPost.title,
                          text: `Découvrez ce post de ${sharedPost.user?.username} sur Bookish`,
                          url: `${window.location.origin}/feed/${sharedPost.id}`,
                          dialogTitle: "Partager ce post",
                        }).catch((error: any) => {
                          if (error.message !== "Share canceled") {
                            setSelectedPost(postForDialog as any);
                            setShareDialogOpen(true);
                          }
                        });
                      } else {
                        setSelectedPost(postForDialog as any);
                        setShareDialogOpen(true);
                      }
                    }}
                    onDelete={async (postId) => {
                      try {
                        await clubService.deletePost(clubId, postId);
                        setPosts(prev => prev.filter(p => p.id !== postId));
                        toast.success("Post supprimé avec succès");
                      } catch (error: any) {
                        toast.error(error.message || "Erreur lors de la suppression");
                      }
                    }}
                    onPin={async (postId) => {
                      try {
                        const post = posts.find(p => p.id === postId);
                        const isPinned = post?.isPinned;
                        
                        await clubService.togglePinPost(clubId, postId);
                        toast.success(
                          isPinned 
                            ? "Post désépinglé avec succès" 
                            : "Post épinglé avec succès"
                        );
                        // Recharger les posts pour voir le changement
                        fetchPosts();
                      } catch (error: any) {
                        toast.error(error.message || "Erreur lors de l'épinglage");
                      }
                    }}
                    onBanUser={async (userId, username) => {
                      try {
                        const reason = `Bannissement effectué depuis la modération des posts par ${user?.user?.username}`;
                        await clubService.banUser(clubId, { userId, reason });
                        toast.success(`${username} a été banni du club`);
                        // Rafraîchir les membres pour retirer l'utilisateur banni
                        await fetchMembers();
                        // Recharger les posts au cas où
                        fetchPosts();
                      } catch (error: any) {
                        toast.error(error.message || "Erreur lors du bannissement");
                      }
                    }}
                  />
                ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Aucun post pour le moment</p>
                  <p className="text-sm">Soyez le premier à publier !</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            {/* Sécurité chat : seuls les membres peuvent voir les messages */}
            {!isMemberOrNot ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <img
                  src="/mascote/talking.svg"
                  alt="Mascotte parlant"
                  className="w-24 h-24 mb-4"
                />
                <p className="text-center text-muted-foreground">
                  Vous devez rejoindre le club pour pouvoir voir les messages
                </p>
                {user?.user?.id ? (
                  <Button
                    variant="secondary"
                    onClick={handleJoinClub}
                    disabled={isJoining}
                    className="rounded-full"
                  >
                    {isJoining ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : club?.type === "Private" ? (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Demander à rejoindre
                      </>
                    ) : (
                      "Rejoindre le club"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => router.push("/auth/login")}
                    className="rounded-full"
                  >
                    Se connecter
                  </Button>
                )}
              </div>
            ) : (
              // Seuls les membres voient les messages
              <>
                {loadingMessages ? (
                  <ChatSkeleton />
                ) : messages.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto pb-4">
                    {/* Messages avec style identique à /messages/[id] */}
                    {messages
                      .sort(
                        (a, b) =>
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime()
                      )
                      .map((message) => {
                        // Utiliser isOwnMessage fourni par l'API
                        const isMyMessage = message.isOwnMessage;

                        return (
                          <div
                            key={message.id}
                            className={cn(
                              "group flex items-end gap-2",
                              isMyMessage
                                ? "justify-end" // Mes messages à droite
                                : "justify-start" // Messages des autres à gauche
                            )}
                          >
                            {/* Avatar à gauche pour les messages des autres */}
                            {!isMyMessage && (
                              <Avatar className="h-8 w-8 mb-1">
                                <AvatarImage
                                  src={message.user?.profilePicture}
                                />
                                <AvatarFallback className="text-xs">
                                  {message.user?.username
                                    ?.charAt(0)
                                    .toUpperCase() || "?"}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            {/* Container du message avec menu */}
                            <div className={cn(
                              "flex items-center gap-1",
                              isMyMessage ? "flex-row-reverse" : "flex-row"
                            )}>
                              {/* Bulle de message */}
                              <div
                                className={cn(
                                  "px-4 py-2 rounded-2xl",
                                  isMyMessage
                                    ? "bg-success-200 text-foreground"
                                    : "bg-accent-400"
                                )}
                              >
                                <p className="text-sm">{message.content}</p>
                              </div>
                              
                              {/* Menu de modération pour les messages des autres uniquement */}
                              {!isMyMessage && (
                                <MessageModerationMenu
                                  canModerate={canModerate}
                                  onDelete={async () => {
                                    try {
                                      await clubService.deleteMessage(clubId, message.id);
                                      setMessages(prev => prev.filter(m => m.id !== message.id));
                                      toast.success("Message supprimé");
                                    } catch (error: any) {
                                      toast.error(error.message || "Erreur lors de la suppression");
                                    }
                                  }}
                                  onBanUser={async () => {
                                    try {
                                      const reason = `Bannissement effectué depuis la modération du chat par ${user?.user?.username}`;
                                      await clubService.banUser(clubId, { 
                                        userId: message.user?.id || '', 
                                        reason 
                                      });
                                      toast.success(`${message.user?.username} a été banni du club`);
                                      // Rafraîchir les membres
                                      await fetchMembers();
                                      // Recharger les messages pour voir les changements
                                      fetchMessages();
                                    } catch (error: any) {
                                      toast.error(error.message || "Erreur lors du bannissement");
                                    }
                                  }}
                                  onReport={async () => {
                                    try {
                                      await clubService.reportMessage(clubId, message.id, {
                                        reason: "inappropriate",
                                        description: `Message signalé par ${user?.user?.username} depuis l'interface de modération`
                                      });
                                      toast.success("Message signalé aux modérateurs");
                                    } catch (error: any) {
                                      toast.error(error.message || "Erreur lors du signalement");
                                    }
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <img
                      src="/mascote/talking.svg"
                      alt="Mascotte parlant"
                      className="w-16 h-16 opacity-50"
                    />
                    <p className="text-center text-muted-foreground">
                      Aucun message dans cette conversation
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Input de message fixé en bas pour le chat - Seulement si membre */}
      {activeTab === "chat" && isMemberOrNot && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 z-40">
          <div className="flex items-center gap-2 max-w-xl mx-auto">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Tapez votre message..."
              className="flex-1"
              disabled={isSending}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Bouton flottant pour créer un club - masqué dans le chat */}
      {activeTab !== "chat" && (
        <FloatingActionButton
          onClick={() => router.push("/clubs/create")}
          className="bottom-[30px] w-14 h-14"
        />
      )}

      {/* Dialog de partage */}
      {selectedPost && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          post={selectedPost as any}
        />
      )}
    </div>
  );
}
