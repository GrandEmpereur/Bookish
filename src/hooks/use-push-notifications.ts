import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { notificationService } from "@/services/notification.service";

interface UsePushNotificationsProps {
    isAuthenticated?: boolean;
    userId?: string;
}

export function usePushNotifications({ isAuthenticated = false, userId }: UsePushNotificationsProps = {}) {
    const setupRef = useRef(false);
    const lastUserIdRef = useRef<string | undefined>(undefined);

    useEffect(() => {

        // Ne fonctionne que sur les plateformes natives et si l'utilisateur est connecté
        if (!Capacitor.isNativePlatform() || !isAuthenticated || !userId) {
            return;
        }

        // Éviter les re-setups pour le même utilisateur
        if (setupRef.current && lastUserIdRef.current === userId) {
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

                // 2. Setup listener AVANT l'enregistrement
                const registrationListener = await PushNotifications.addListener('registration', async (token) => {
                    try {
                        await notificationService.registerDeviceToken(token.value);
                    } catch (error) {
                    }
                });

                // 3. Enregistrer l'appareil APRÈS avoir setup le listener
                await PushNotifications.register();

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

                setupRef.current = true;
                lastUserIdRef.current = userId;

                // Cleanup function
                return () => {
                    registrationListener.remove();
                    errorListener.remove();
                    receivedListener.remove();
                    actionListener.remove();
                    setupRef.current = false;
                };

            } catch (error) {
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