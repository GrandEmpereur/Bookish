"use client";

import { Badge } from "@/components/ui/badge";
import { useNotificationsCount } from "@/hooks/use-notifications-count";

export function NotificationBadgeIcon() {
  const { count, isLoading, error } = useNotificationsCount();

  if (isLoading || error || count === 0) {
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 p-0 text-[9px] font-bold flex items-center justify-center min-w-[14px] border border-white rounded-full shadow-sm"
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}
