import { usePathname } from "next/navigation";

interface BottomBarConfig {
  visible: boolean;
  reason?: string;
}

export function useBottomBar(): BottomBarConfig {
  const pathname = usePathname();

  // Routes où cacher le bottom bar
  const hideBottomBarRoutes = [
    {
      pattern: /^\/messages\/[^/]+$/, // Pages de conversation (/messages/id)
      reason: "Conversation individuelle",
    },
    {
      pattern: /^\/clubs\/[^/]+.*$/, // Toutes les pages de club (/clubs/id, /clubs/id/posts, etc.)
      reason: "Pages de club",
    },
  ];

  // Vérifier si on doit cacher le bottom bar
  for (const route of hideBottomBarRoutes) {
    if (route.pattern.test(pathname)) {
      return {
        visible: false,
        reason: route.reason,
      };
    }
  }

  return {
    visible: true,
  };
}
