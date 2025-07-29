"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Share2, Users, MessageCircle, Heart, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MOCK_CLUBS } from "@/config/mock-data";
import { clubService } from "@/services/club.service";
import { Club } from "@/types/clubTypes";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";

interface ClubDetailsProps {
  clubId: string;
}
export default function ClubDetails({ clubId }: ClubDetailsProps) {
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await clubService.getClub(clubId);
        setClub(res.data.club);
      } catch {
        toast.error("Impossible de charger le club.");
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [clubId]);

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
    <div className="flex-1 pb-[120px] pt-[74px]">
      {/* Cover Image avec boutons */}
      <div className="relative w-full h-[300px]">
        {club.cover_image ? (
          <Image
            src={club.cover_image}
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
          <Button size="icon" variant="default" className="rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" className="rounded-full">
            {club.isMember ? "Quitter" : "Rejoindre"}
          </Button>
        </div>
      </div>

      {/* Contenu */}
      <div className="px-5 space-y-6">
        {/* En-tête du club */}
        <div className="space-y-4 pt-6">
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold">{club.name}</h1>
              {club.type === "Public" ? (
                <Badge
                  variant="outline"
                  className="flex mt-2 items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  Public
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="flex mt-2 items-center gap-1"
                >
                  <Lock className="h-3 w-3" />
                  Privé
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Users className="h-3 w-3" />
              <span>{club.member_count} membres</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Administrateurs */}
            {/* {club.members?.administrators?.map((admin) => (
              <div key={admin.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={admin.avatarUrl} alt={admin.username} />
                  <AvatarFallback>{admin.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{admin.username}</p>
                  <p className="text-xs text-muted-foreground">
                    Modère ce club
                  </p>
                </div>
              </div>
            ))} */}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="publications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="publications" className="mt-6">
            <div className="space-y-4">
              {/* {club.posts?.map((post) => (
                <div key={post.id} className="bg-card rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={post.author.avatarUrl}
                        alt={post.author.username}
                      />
                      <AvatarFallback>{post.author.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {post.createdAt}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm">{post.content}</p>

                  {post.image && (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                      <Image
                        src={post.image}
                        alt="Post image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-2">
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Heart
                        className={`h-4 w-4 ${post.isLiked ? "fill-like text-like" : ""}`}
                      />
                      <span>{post.likesCount}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.commentsCount}</span>
                    </button>
                  </div>
                </div>
              ))} */}
            </div>
          </TabsContent>
          <TabsContent value="chat" className="mt-6">
            {club.isMember ? (
              <div className="flex flex-col space-y-4">
                {/* {club.chat?.map((message: ClubChatMessage, index: number) => {
                  const isFirstMessageOfDay: boolean =
                    index === 0 ||
                    !isSameDay(
                      new Date(message.timestamp),
                      new Date(club.chat[index - 1].timestamp)
                    );

                  return (
                    <div key={message.id} className="flex flex-col">
                      {isFirstMessageOfDay && (
                        <div className="flex justify-center mb-4">
                          <span className="text-xs text-muted-foreground">
                            {format(
                              new Date(message.timestamp),
                              "EEEE d MMMM",
                              { locale: fr }
                            )}
                          </span>
                        </div>
                      )}

                      <div
                        className={cn(
                          "flex items-end gap-2 max-w-[80%]",
                          message.isMe
                            ? "self-end flex-row-reverse"
                            : "self-start"
                        )}
                      >
                        {!message.isMe && (
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={message.sender.avatarUrl} />
                            <AvatarFallback>
                              {message.sender.username[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2 text-sm",
                            message.isMe
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {!message.isMe && (
                            <p className="text-xs font-medium mb-1">
                              {message.sender.username}
                            </p>
                          )}
                          <p>{message.content}</p>
                          <p className="text-[10px] text-right mt-1 opacity-70">
                            {format(new Date(message.timestamp), "HH:mm")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })} */}
              </div>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-muted-foreground">
                  Vous devez être membre du club pour accéder au chat
                </p>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => {
                    /* logique pour rejoindre */
                  }}
                >
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
