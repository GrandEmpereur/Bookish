"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export function FloatingActionButton({
  onClick,
  className,
  icon = <Plus className="h-6 w-6" style={{ width: "24px", height: "24px" }} />,
}: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "fixed bottom-[110px] right-[30px] w-[60px] h-[60px] [box-shadow:var(--shadow-strong)]",
        "rounded-full flex items-center justify-center",
        "bg-primary",
        " p-0",
        className
      )}
    >
      {icon}
    </Button>
  );
}
