"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "@/services/message.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

export default function ConversationPage() {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const isNative = Capacitor.isNativePlatform();
  const queryClient = useQueryClient();
  const router = useRouter();
  const params = useParams();
  const conversationId = params.id as string;

  const [messageText, setMessageText] = useState("");

  // Récupération des détails de la conversation
  const { data: conversations = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await messageService.getConversations();
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 30 * 1000,
  });

  // Trouve la conversation courante
  const selectedConversation = conversations.find(
    (conv: any) => conv.id === conversationId
  );

  // Récupération des messages de la conversation
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["conversationMessages", conversationId],
    queryFn: async () => {
      const response = await messageService.getConversationMessages(
        conversationId,
        { page: 1, limit: 30 }
      );

      // Les messages sont directement dans response.data
      return {
        messages: response.data || [],
        pagination: (response as any).pagination,
      };
    },
    enabled: !!conversationId,
    staleTime: 10 * 1000,
  });

  const messages = (messagesData?.messages || []) as any[];

  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => messageService.sendMessage(conversationId, { content }),
    onSuccess: () => {
      setMessageText("");
      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: ["conversationMessages", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success("Message envoyé");
    },
    onError: (error) => {
      console.error("❌ Erreur envoi message:", error);
      toast.error("Impossible d'envoyer le message");
    },
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || !conversationId) return;

    sendMessageMutation.mutate({
      conversationId,
      content: messageText.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Si pas de conversation trouvée, afficher erreur
  if (!selectedConversation && conversations.length > 0) {
    return (
      <div
        className={cn(
          "flex-1 pb-[120px]",
          isNative ? "pt-[130px]" : "pt-[100px]"
        )}
      >
        <div className="max-w-xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-2xl font-bold">Conversation introuvable</h1>
          <p className="text-muted-foreground">
            Cette conversation n'existe pas ou a été supprimée.
          </p>
          <Button onClick={() => router.push("/messages")}>
            Retour aux messages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Zone des messages - Prend l'espace disponible entre top bar et input */}
      <div
        className={cn(
          "flex-1 overflow-y-auto px-4 py-4 space-y-3",
          isNative ? "mt-[120px]" : "mt-[90px]"
        )}
        style={{
          height: `calc(100vh - ${isNative ? "120px" : "90px"} - 80px)`,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {messagesLoading ? (
          <div className="text-center text-muted-foreground">
            Chargement des messages...
          </div>
        ) : messages.length > 0 ? (
          <>
            {/* Liste des messages (du plus ancien au plus récent) */}
            {messages
              .sort(
                (a: any, b: any) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              )
              .map((message: any) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2",
                    message.is_mine
                      ? "justify-end" // Mes messages à droite
                      : "justify-start" // Messages de l'interlocuteur à gauche
                  )}
                >
                  {/* Avatar pour les messages de l'interlocuteur */}
                  {!message.is_mine && (
                    <Avatar className="h-8 w-8 mb-1">
                      <AvatarFallback className="text-xs">
                        {message.sender.username?.charAt(0).toUpperCase() ||
                          "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "max-w-[75%] px-4 py-2 rounded-2xl",
                      message.is_mine
                        ? "bg-success-200 text-foreground"
                        : "bg-accent-400"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            Aucun message dans cette conversation
          </div>
        )}
      </div>

      {/* Input pour envoyer un message - Fixed bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 z-40"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
        }}
      >
        <div className="flex items-center gap-2 max-w-xl mx-auto">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendMessageMutation.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
