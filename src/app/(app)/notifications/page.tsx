"use client";

import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { notificationService } from "@/services/notification.service";
import { userService } from "@/services/user.service";
import { Notification } from "@/types/notificationTypes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { PushTestButton } from "@/components/ui/push-test-button";
import { useNotificationsCount } from "@/hooks/use-notifications-count";



function getNotificationText(notification: Notification) {
  const senderName = notification.data?.senderName || notification.data?.requesterUsername || notification.user?.username || "Utilisateur";
  const senderId = notification.data?.senderId || notification.data?.requesterId || notification.user?.id || notification.user_id;
  
  const ClickableName = ({ children }: { children: React.ReactNode }) => {
    if (senderId) {
      return (
        <Link href={`/profile/${senderId}`} className="font-bold text-primary hover:underline cursor-pointer">
          {children}
        </Link>
      );
    }
    return <b>{children}</b>;
  };

  switch (notification.type) {
    case "new_message":
      return (
        <span><ClickableName>{senderName}</ClickableName> vous a envoyé un nouveau message.</span>
      );
    case "friend_request":
      return (
        <span><ClickableName>{senderName}</ClickableName> vous a envoyé une demande d'ami.</span>
      );
    case "friend_request_accepted":
      return (
        <span><ClickableName>{senderName}</ClickableName> a accepté votre demande d'ami.</span>
      );
    case "follow":
      return (
        <span><ClickableName>{senderName}</ClickableName> a commencé à vous suivre.</span>
      );
    case "like":
      return (
        <span><ClickableName>{senderName}</ClickableName> a liké votre post.</span>
      );
    case "comment":
      return (
        <span><ClickableName>{senderName}</ClickableName> a commenté votre post.</span>
      );
    case "comment_reply":
      return (
        <span><ClickableName>{senderName}</ClickableName> a répondu à votre commentaire.</span>
      );
    case "club_invitation":
      return (
        <span><ClickableName>{senderName}</ClickableName> vous a invité dans un club.</span>
      );
    case "club_event":
      return (
        <span>Un nouvel événement de club a été créé.</span>
      );
    case "club_message":
      return (
        <span>Un nouveau message a été posté dans votre club.</span>
      );
    case "system_update":
      return (
        <span>Une mise à jour du système est disponible.</span>
      );
    default:
      return (
        <span><ClickableName>{senderName}</ClickableName> a une nouvelle notification.</span>
      );
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin} min`;
  // Affiche le jour de la semaine sinon
  return date.toLocaleDateString("fr-FR", { weekday: "short" });
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingRequests, setProcessingRequests] = useState<Set<string>>(new Set());
  const { invalidateCount } = useNotificationsCount();

  // Utiliser localStorage pour persister les notifications traitées
  const getProcessedNotifications = (): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    const stored = localStorage.getItem('processedNotifications');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  };

  const addProcessedNotification = (notificationId: string) => {
    const processed = getProcessedNotifications();
    processed.add(notificationId);
    localStorage.setItem('processedNotifications', JSON.stringify([...processed]));
    console.log('🚫 Notification ajoutée au localStorage:', notificationId);
    console.log('🚫 localStorage actuel:', [...processed]);
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      setProcessingRequests(prev => new Set(prev).add(notificationId));
      await notificationService.deleteNotification(notificationId);
      
      // Mettre à jour l'état local pour retirer la notification
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      
      // Invalider le cache du count pour mettre à jour le badge
      invalidateCount();
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleFriendRequestResponse = async (notificationId: string, senderId: string, acceptRequest: boolean) => {
    
    if (!senderId || senderId === 'undefined') {
      console.error('Impossible de traiter la demande d\'ami: senderId invalide');
      return;
    }
    
    try {
      setProcessingRequests(prev => new Set(prev).add(notificationId));
      
      // Répondre à la demande d'ami
      await userService.respondToFriendRequest(senderId, acceptRequest);
      
      // Supprimer la notification côté serveur aussi
      await notificationService.deleteNotification(notificationId);
      
      // Marquer la notification comme traitée pour éviter qu'elle réapparaisse
      addProcessedNotification(notificationId);
      
      // Mettre à jour l'état local pour retirer la notification
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      
      // Invalider le cache du count pour mettre à jour le badge
      invalidateCount();
    } catch (error: any) {
      // Vérifier si c'est une erreur "demande déjà traitée"
      const isRequestAlreadyProcessed = 
        error?.message?.includes('404') || 
        error?.status === 404 ||
        error?.message?.includes('NO_PENDING_FRIEND_REQUEST') ||
        error?.response?.data?.code === 'NO_PENDING_FRIEND_REQUEST';
        
      if (isRequestAlreadyProcessed) {
        // Marquer comme traitée pour éviter la réapparition
        addProcessedNotification(notificationId);
        
        // Supprimer silencieusement la notification obsolète
        setNotifications(prev => 
          prev.filter(notif => notif.id !== notificationId)
        );
        invalidateCount();
      } else {
        // Pour les vraies erreurs, les afficher
        console.error('Erreur lors de la réponse à la demande d\'ami:', error);
      }
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    notificationService.getNotifications()
      .then((res) => {
        const notificationsList = res.data.notifications || [];
        const processedNotifications = getProcessedNotifications();
        
        // Filtrer les notifications déjà traitées côté client
        const filteredNotifications = notificationsList.filter(
          notif => !processedNotifications.has(notif.id)
        );
        
        console.log('🔍 DEBUG FILTRAGE:');
        console.log('- Notifications de l\'API:', notificationsList.map(n => n.id));
        console.log('- localStorage processed:', [...processedNotifications]);
        console.log('- Notifications finales:', filteredNotifications.map(n => n.id));
        

        
        setNotifications(filteredNotifications);
        // Invalider le cache pour s'assurer que le badge est à jour
        invalidateCount();
      })
      .finally(() => setLoading(false));
  }, []); // Charger une seule fois au début

  // Note: Le setup des notifications push est maintenant géré dans le hook usePushNotifications()
  // qui est appelé automatiquement dans le contexte d'authentification

  const isNative = Capacitor.isNativePlatform();

  return (
    <div
      className={cn(
        "max-w-xl mx-auto pb-8",
        isNative ? "pt-[120px]" : "pt-[80px]"
      )}
    >
      {/* Bouton de test push notifications */}
      <div className="px-4 mb-4">
        <PushTestButton />
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-muted-foreground">Aucune notification</div>
      ) : (
        <div className="flex flex-col gap-2 px-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`relative rounded-xl px-4 py-3 ${!notif.read ? "bg-muted/40" : ""}`}
            >
              {/* Bouton de suppression pour toutes les notifications */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteNotification(notif.id)}
                disabled={processingRequests.has(notif.id)}
                className="absolute top-2 right-2 w-6 h-6 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50 z-10"
              >
                <X className="w-3 h-3" />
              </Button>

              <div className="flex items-start gap-3 pr-8">
                <Avatar className="flex-shrink-0">
                  {notif.user?.profile?.profile_picture_url ? (
                    <AvatarImage src={notif.user.profile.profile_picture_url} alt="avatar" />
                  ) : (
                    <AvatarFallback>
                      {notif.user?.username || "?"}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="text-base text-muted-foreground mb-1">
                    {getNotificationText(notif)}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {formatDate(notif.created_at)}
                  </div>
                  
                  {notif.type === "friend_request" && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => {
                          const userId = notif.data?.senderId || notif.data?.requesterId || notif.user?.id || notif.user_id;
                          handleFriendRequestResponse(notif.id, userId, true);
                        }}
                        disabled={processingRequests.has(notif.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Confirmer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const userId = notif.data?.senderId || notif.data?.requesterId || notif.user?.id || notif.user_id;
                          handleFriendRequestResponse(notif.id, userId, false);
                        }}
                        disabled={processingRequests.has(notif.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Refuser
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {notif.data?.image_url && (
                <img
                  src={notif.data.image_url}
                  alt="post"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
