"use client";

import React, { useEffect, useState } from "react";
import { notificationService } from "@/services/notification.service";
import { userService } from "@/services/user.service";
import { Notification } from "@/types/notificationTypes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";


function getNotificationText(notification: Notification) {
  const senderName = notification.data?.senderName || notification.user?.username || "Utilisateur";
  switch (notification.type) {
    case "new_message":
      return (
        <span><b>{senderName}</b> vous a envoyé un nouveau message.</span>
      );
    case "friend_request":
      return (
        <span><b>{senderName}</b> vous a envoyé une demande d'ami.</span>
      );
    case "friend_request_accepted":
      return (
        <span><b>{senderName}</b> a accepté votre demande d'ami.</span>
      );
    case "follow":
      return (
        <span><b>{senderName}</b> a commencé à vous suivre.</span>
      );
    case "like":
      return (
        <span><b>{senderName}</b> a liké votre post.</span>
      );
    case "comment":
      return (
        <span><b>{senderName}</b> a commenté votre post.</span>
      );
    case "comment_reply":
      return (
        <span><b>{senderName}</b> a répondu à votre commentaire.</span>
      );
    case "club_invitation":
      return (
        <span><b>{senderName}</b> vous a invité dans un club.</span>
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
        <span><b>{senderName}</b> a une nouvelle notification.</span>
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

  const handleFriendRequestResponse = async (notificationId: string, senderId: string, acceptRequest: boolean) => {
    try {
      setProcessingRequests(prev => new Set(prev).add(notificationId));
      await userService.respondToFriendRequest(senderId, acceptRequest);
      
      // Mettre à jour l'état local pour retirer la notification ou la marquer comme traitée
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Erreur lors de la réponse à la demande d\'ami:', error);
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
        console.log('Réponse brute de l\'API /notifications:', res);
        setNotifications(res.data.notifications || []);
        console.log('Notifications reçues:', res.data.notifications || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Notifications</h1>
      {loading ? (
        <div>Chargement...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-muted-foreground">Aucune notification</div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 ${!notif.read ? "bg-muted/40" : ""}`}
            >
              <Avatar>
                {notif.user?.profile?.profile_picture_url ? (
                  <AvatarImage src={notif.user.profile.profile_picture_url} alt="avatar" />
                ) : (
                  <AvatarFallback>
                    {notif.user?.username || "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-base text-muted-foreground">
                  {getNotificationText(notif)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDate(notif.created_at)}
                </div>
                {notif.type === "friend_request" && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={() => handleFriendRequestResponse(notif.id, notif.data?.senderId || "", true)}
                      disabled={processingRequests.has(notif.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Confirmer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFriendRequestResponse(notif.id, notif.data?.senderId || "", false)}
                      disabled={processingRequests.has(notif.id)}
                      className="w-8 h-8 p-0 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
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
