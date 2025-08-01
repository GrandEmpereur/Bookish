"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Plus } from "lucide-react";

interface XPToastProps {
  amount: number;
  reason?: string;
  isVisible: boolean;
  onComplete?: () => void;
  className?: string;
}

export function XPToast({
  amount,
  reason,
  isVisible,
  onComplete,
  className,
}: XPToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed top-[100px] right-4 z-50 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg",
        "transform transition-all duration-300",
        isAnimating ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
        className
      )}
    >
      <Sparkles className="w-4 h-4 animate-pulse" />
      <div className="flex items-center gap-1">
        <Plus className="w-3 h-3" />
        <span className="font-bold">{amount} XP</span>
      </div>
      {reason && <span className="text-sm opacity-90">• {reason}</span>}
    </div>
  );
}
