import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReporting } from "@/hooks/useReporting";
import { ReportType } from "@/types/postTypes";
import { useAuth } from "@/contexts/auth-context";

interface QuickReportButtonProps {
  postId: string;
  postUserId?: string; // ID de l'auteur du post pour vérifier la propriété
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "lg";
  className?: string;
}

const QUICK_REPORT_OPTIONS: Array<{
  value: ReportType;
  label: string;
  description: string;
}> = [
  {
    value: "spam",
    label: "Spam",
    description: "Contenu promotionnel non désiré",
  },
  {
    value: "harassment",
    label: "Harcèlement",
    description: "Comportement abusif",
  },
  {
    value: "inappropriate",
    label: "Contenu inapproprié",
    description: "Contenu offensant ou choquant",
  },
  {
    value: "hate_speech",
    label: "Discours de haine",
    description: "Contenu discriminatoire",
  },
  {
    value: "violence",
    label: "Violence",
    description: "Menaces ou contenu violent",
  },
];

export const QuickReportButton = ({
  postId,
  postUserId,
  variant = "ghost",
  size = "sm",
  className,
}: QuickReportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { quickReportPost, isSubmitting } = useReporting();
  const { user } = useAuth();

  // Ne pas afficher le bouton si c'est son propre post
  if (
    user &&
    postUserId &&
    (user as any).user &&
    (user as any).user.id === postUserId
  ) {
    return null;
  }

  const handleQuickReport = async (
    reportType: ReportType,
    description: string
  ) => {
    const result = await quickReportPost(postId, reportType, description);

    if (result.success) {
      setIsOpen(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={isSubmitting}
        >
          <Flag className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {QUICK_REPORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleQuickReport(option.value, option.description)}
            disabled={isSubmitting}
            className="flex flex-col items-start gap-1"
          >
            <span className="font-medium">{option.label}</span>
            <span className="text-xs text-muted-foreground">
              {option.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
