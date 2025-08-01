"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/services/notification.service";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { toast } from "sonner";

export function PushTestButton() {
  const [isChecking, setIsChecking] = useState(false);

  const checkPushStatus = async () => {
    setIsChecking(true);
    try {
      if (!Capacitor.isNativePlatform()) {
        toast.info("Notifications push disponibles uniquement sur mobile");
        return;
      }

      // 1. Vérifier les permissions
      const permissions = await PushNotifications.checkPermissions();

      // 2. Essayer d'enregistrer un token test
      try {
        await notificationService.registerDeviceToken(
          "test-token-debug-" + Date.now()
        );
        toast.success(
          "✅ Connexion serveur OK - Route /push/register fonctionne"
        );

        // Envoi d'une notification de test
        await notificationService.sendTestPush("Test", "Test notification");
        toast.success("🚀 Notification de test envoyée");
      } catch (error) {
        console.error("❌ Erreur test serveur:", error);
        toast.error("❌ Problème avec le serveur push");
      }

      // 3. Informations de debug
      toast.info(`Permissions: ${permissions.receive}`, {
        description: "Vérifiez la console pour plus de détails",
      });
    } catch (error) {
      console.error("❌ Erreur test push:", error);
      toast.error("Erreur lors du test des notifications");
    } finally {
      setIsChecking(false);
    }
  };

  if (!Capacitor.isNativePlatform()) {
    return null; // Ne pas afficher sur web
  }

  return (
    <Button
      onClick={checkPushStatus}
      disabled={isChecking}
      variant="outline"
      size="sm"
    >
      {isChecking ? "Test en cours..." : "🔔 Test Push"}
    </Button>
  );
}
