"use client";

import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { messageService } from "@/services/message.service";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

// Fonction pour calculer le temps relatif
const getRelativeTime = (date: string | Date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMs = now.getTime() - messageDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMinutes < 1) return "maintenant";
  if (diffInMinutes < 60) return `il y a ${diffInMinutes}min`;
  if (diffInHours < 24) return `il y a ${diffInHours}h`;
  if (diffInDays < 7) return `il y a ${diffInDays}j`;
  if (diffInWeeks < 4) return `il y a ${diffInWeeks}sem`;
  if (diffInMonths < 12) return `il y a ${diffInMonths}mois`;
  
  // Si plus d'un an, afficher la date
  return messageDate.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: '2-digit' 
  });
};

export default function MessagesPage() {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const isNative = Capacitor.isNativePlatform();
  const router = useRouter();

  // Récupération des conversations avec TanStack Query
  const {
    data: conversations = [],
    isLoading: loading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await messageService.getConversations();

      // response.data est déjà le tableau des conversations
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return [];
      }
    },
    staleTime: 30 * 1000, // 30 secondes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleSelectConversation = (conversation: any) => {
    router.push(`/messages/${conversation.id}`);
  };

  if (error) {
    return (
      <div className={cn("flex-1 pb-[120px]", isNative ? "pt-[130px]" : "pt-[100px]")}>
        <div className="max-w-xl mx-auto px-4">
          {/* Header avec bouton refresh */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Messages</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isFetching}
              className="h-10 w-10"
            >
              <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            </Button>
          </div>
          
          <div className="text-center space-y-4">
            <div className="text-red-500">Erreur lors du chargement des conversations</div>
            <Button onClick={handleRefresh} disabled={isFetching}>
              {isFetching ? "Chargement..." : "Réessayer"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 pb-[120px]", isNative ? "pt-[130px]" : "pt-[100px]")}>
      <div className="max-w-xl mx-auto px-4">
        {/* Header avec bouton refresh */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isFetching}
            className="h-10 w-10"
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          </Button>
        </div>

        {loading ? (
          <div className="text-center">Chargement des conversations...</div>
        ) : conversations.length > 0 ? (
          <div className="space-y-4">
            
            {conversations.map((conv: any) => {
              // Pour conversation 1-to-1, trouve le partenaire
              const partner = conv.is_group 
                ? null 
                : conv.participants.find((p: any) => p.id !== currentUserId);
              
              const displayName = conv.is_group ? conv.title : partner?.username;
              const avatarText = conv.is_group 
                ? conv.title?.charAt(0).toUpperCase() 
                : partner?.username?.charAt(0).toUpperCase();

              return (
                <div
                  key={conv.id}
                  className="flex items-center gap-4 p-4 bg-card rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleSelectConversation(conv)}
                >
                  {/* Avatar à gauche */}
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{avatarText || "?"}</AvatarFallback>
                  </Avatar>
                  
                  {/* Contenu central en colonne */}
                  <div className="flex-1 flex flex-col">
                    <span className="font-medium text-lg">
                      {displayName || "Conversation sans nom"}
                    </span>
                    
                    {conv.last_message ? (
                      <div className="text-sm text-muted-foreground truncate">
                        {conv.last_message.content}
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        Aucun message
                      </div>
                    )}
                  </div>
                  
                  {/* Date à droite */}
                  <div className="text-xs text-muted-foreground text-right">
                    {getRelativeTime(conv.updated_at)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Aucune conversation trouvée
          </div>
        )}
      </div>
    </div>
  );
}
