import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { notificationService } from "@/services/notification.service";

export function usePushNotifications() {
    useEffect(() => {
        // Ne fonctionne que sur les plateformes natives
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        const setupPushNotifications = async () => {
            try {
                // 1. Vérifier les permissions
                let permStatus = await PushNotifications.checkPermissions();

                if (permStatus.receive === 'prompt') {
                    permStatus = await PushNotifications.requestPermissions();
                }

                if (permStatus.receive !== 'granted') {
                    return;
                }

                // 2. Enregistrer l'appareil
                await PushNotifications.register();

                // 3. Listener pour récupérer le token
                const registrationListener = await PushNotifications.addListener('registration', async (token) => {
                    try {
                        await notificationService.registerDeviceToken(token.value);
                    } catch (error) {
                    }
                });

                // 4. Listener pour les erreurs d'enregistrement
                const errorListener = await PushNotifications.addListener('registrationError', (err) => {
                });

                // 5. Listener pour les notifications reçues
                const receivedListener = await PushNotifications.addListener('pushNotificationReceived', (notification) => {
                    // Ici on peut gérer la notification reçue quand l'app est ouverte
                });

                // 6. Listener pour les actions sur notifications
                const actionListener = await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
                    // Ici on peut naviguer vers une page spécifique
                });

                // Cleanup function
                return () => {
                    registrationListener.remove();
                    errorListener.remove();
                    receivedListener.remove();
                    actionListener.remove();
                };

            } catch (error) {
                console.error("Erreur setup notifications push:", error);
            }
        };

        setupPushNotifications();
    }, []);
} 