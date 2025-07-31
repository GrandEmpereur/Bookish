"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotificationsCount } from "@/hooks/use-notifications-count";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  size?: number;
  className?: string;
}

export function NotificationBadge({ size = 20, className }: NotificationBadgeProps) {
  const { count, isLoading, error } = useNotificationsCount();
  
  return (
    <div className={cn("relative inline-block", className)}>
      <Bell size={size} />
      {!isLoading && !error && count > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 text-[11px] font-bold flex items-center justify-center min-w-[20px] border-2 border-white rounded-full shadow-sm"
        >
          {count > 99 ? "99+" : count}
        </Badge>
      )}
    </div>
  );
}