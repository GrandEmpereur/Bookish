"use client";

import React, { useEffect, useState } from "react";
import { notificationService } from "@/services/notification.service";
import { Notification } from "@/types/notificationTypes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


function getNotificationText(notification: Notification) {
  const firstName = notification.user?.profile?.first_name || "";
  const lastName = notification.user?.profile?.last_name || "";
  switch (notification.type) {
    case "new_message":
      return (
        <span><b>{firstName} {lastName}</b> vous a envoyé un nouveau message.</span>
      );
    case "friend_request":
      return (
        <span><b>{firstName} {lastName}</b> vous a envoyé une demande d'ami.</span>
      );
    case "friend_request_accepted":
      return (
        <span><b>{firstName} {lastName}</b> a accepté votre demande d'ami.</span>
      );
    case "follow":
      return (
        <span><b>{firstName} {lastName}</b> a commencé à vous suivre.</span>
      );
    case "like":
      return (
        <span><b>{firstName} {lastName}</b> a liké votre post.</span>
      );
    case "comment":
      return (
        <span><b>{firstName} {lastName}</b> a commenté votre post.</span>
      );
    case "comment_reply":
      return (
        <span><b>{firstName} {lastName}</b> a répondu à votre commentaire.</span>
      );
    case "club_invitation":
      return (
        <span><b>{firstName} {lastName}</b> vous a invité dans un club.</span>
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
        <span><b>{firstName} {lastName}</b> a une nouvelle notification.</span>
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
                    {notif.user?.profile?.first_name?.[0] || "?"}
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
