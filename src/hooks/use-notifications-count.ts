"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { useAuth } from "@/contexts/auth-context";

export function useNotificationsCount() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications-count", user?.id],
    queryFn: async () => {
      try {
        // Récupérer toutes les notifications
        const response = await notificationService.getNotifications();

        // Vérifier que la réponse existe
        if (!response || !response.data) {
          return 0;
        }

        // Compter TOUTES les notifications affichées dans la page
        const notifications = response.data.notifications || [];
        const totalCount = notifications.length;

        return totalCount;
      } catch (error) {
        console.error("Error fetching notifications count:", error);
        // En cas d'erreur, retourner 0 plutôt que undefined
        return 0;
      }
    },
    enabled: isAuthenticated && !!user,
    staleTime: 30 * 1000, // 30 secondes
    refetchInterval: false, // Pas de rechargement automatique
  });

  // Fonction pour invalider le cache (à appeler après une action sur les notifications)
  const invalidateCount = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
  };

  // Fonction pour mettre à jour manuellement le count
  const updateCount = (newCount: number) => {
    queryClient.setQueryData(["notifications-count", user?.id], newCount);
  };

  // Fonction pour décrémenter le count (quand une notification est supprimée)
  const decrementCount = () => {
    const currentCount = data || 0;
    if (currentCount > 0) {
      updateCount(currentCount - 1);
    }
  };

  return {
    count: data || 0,
    isLoading,
    error,
    refetch,
    invalidateCount,
    updateCount,
    decrementCount,
  };
}
