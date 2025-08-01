import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { notificationService } from "@/services/notification.service";

interface UsePushNotificationsProps {
  isAuthenticated?: boolean;
  userId?: string;
}

export function usePushNotifications({
  isAuthenticated = false,
  userId,
}: UsePushNotificationsProps = {}) {
  const setupRef = useRef(false);
  const lastUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Debug logs
    console.log("🔔 usePushNotifications useEffect:", {
      isNativePlatform: Capacitor.isNativePlatform(),
      isAuthenticated,
      userId,
      hasUserId: !!userId,
      setupRef: setupRef.current,
      lastUserId: lastUserIdRef.current
    });

    // Ne fonctionne que sur les plateformes natives et si l'utilisateur est connecté
    if (!Capacitor.isNativePlatform() || !isAuthenticated || !userId) {
      console.log("❌ Conditions non remplies pour les push notifications");
      return;
    }

    // Éviter les re-setups pour le même utilisateur
    if (setupRef.current && lastUserIdRef.current === userId) {
      console.log("✅ Push notifications déjà configurées pour cet utilisateur");
      return;
    }

    console.log("🚀 Initialisation des push notifications...");

    const setupPushNotifications = async () => {
      try {
        console.log("1️⃣ Vérification des permissions...");
        // 1. Vérifier les permissions
        let permStatus = await PushNotifications.checkPermissions();
        console.log("📋 Statut permissions:", permStatus);

        if (permStatus.receive === "prompt") {
          console.log("❓ Demande de permissions à l'utilisateur...");
          permStatus = await PushNotifications.requestPermissions();
          console.log("📋 Nouvelles permissions:", permStatus);
        }

        if (permStatus.receive !== "granted") {
          console.log("❌ Permissions refusées");
          return;
        }

        console.log("✅ Permissions accordées!");

        // 2. Setup listener AVANT l'enregistrement
        console.log("2️⃣ Configuration des listeners...");
        const registrationListener = await PushNotifications.addListener(
          "registration",
          async (token) => {
            console.log("🎯 Token reçu:", token.value);
            try {
              await notificationService.registerDeviceToken(token.value);
              console.log("✅ Token enregistré en BDD");
            } catch (error) {
              console.error("❌ Erreur enregistrement token:", error);
            }
          }
        );

        // 3. Enregistrer l'appareil APRÈS avoir setup le listener
        console.log("3️⃣ Enregistrement de l'appareil...");
        await PushNotifications.register();

        // 4. Listener pour les erreurs d'enregistrement
        const errorListener = await PushNotifications.addListener(
          "registrationError",
          (err) => {
            console.error("❌ Erreur enregistrement push:", err);
          }
        );

        // 5. Listener pour les notifications reçues
        const receivedListener = await PushNotifications.addListener(
          "pushNotificationReceived",
          (notification) => {
            console.log("📱 Notification reçue:", notification);
            // Ici on peut gérer la notification reçue quand l'app est ouverte
          }
        );

        // 6. Listener pour les actions sur notifications
        const actionListener = await PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (action) => {
            console.log("👆 Action sur notification:", action);
            // Ici on peut naviguer vers une page spécifique
          }
        );

        setupRef.current = true;
        lastUserIdRef.current = userId;
        console.log("✅ Configuration terminée!");

        // Cleanup function
        return () => {
          console.log("🧹 Cleanup des listeners push notifications");
          registrationListener.remove();
          errorListener.remove();
          receivedListener.remove();
          actionListener.remove();
          setupRef.current = false;
        };
      } catch (error) {
        console.error("❌ Erreur setup push notifications:", error);
        setupRef.current = false;
      }
    };

    setupPushNotifications();
  }, [isAuthenticated, userId]);

  // Reset quand l'utilisateur se déconnecte
  useEffect(() => {
    if (!isAuthenticated) {
      setupRef.current = false;
      lastUserIdRef.current = undefined;
    }
  }, [isAuthenticated]);
}
