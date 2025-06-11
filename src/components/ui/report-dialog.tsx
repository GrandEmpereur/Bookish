import { useState } from "react";
import { AlertTriangle, Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useReporting } from "@/hooks/useReporting";
import { ReportType } from "@/types/postTypes";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postTitle: string;
  authorUsername: string;
}

const REPORT_REASONS: Array<{
  value: ReportType;
  label: string;
  description: string;
}> = [
  {
    value: "spam",
    label: "Spam ou contenu commercial",
    description: "Publicité non sollicitée, promotion excessive",
  },
  {
    value: "harassment",
    label: "Harcèlement ou intimidation",
    description: "Comportement abusif envers d'autres utilisateurs",
  },
  {
    value: "hate_speech",
    label: "Discours de haine",
    description: "Contenu discriminatoire ou offensant",
  },
  {
    value: "inappropriate",
    label: "Contenu inapproprié",
    description: "Contenu violent, sexuel ou choquant",
  },
  {
    value: "violence",
    label: "Violence ou menaces",
    description: "Contenu violent ou menaçant",
  },
  {
    value: "misinformation",
    label: "Désinformation",
    description: "Fausses informations ou contenu trompeur",
  },
  {
    value: "copyright",
    label: "Violation de droits d'auteur",
    description: "Utilisation non autorisée de contenu protégé",
  },
  {
    value: "privacy",
    label: "Violation de la vie privée",
    description: "Partage d'informations personnelles sans autorisation",
  },
  {
    value: "other",
    label: "Autre",
    description: "Autre raison non listée ci-dessus",
  },
];

export const ReportDialog = ({
  open,
  onOpenChange,
  postId,
  postTitle,
  authorUsername,
}: ReportDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<ReportType | "">("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const { reportPost, isSubmitting } = useReporting();

  const handleSubmit = async () => {
    if (!selectedReason) {
      return;
    }

    const result = await reportPost({
      postId,
      reportType: selectedReason,
      description: additionalInfo || undefined,
    });

    if (result.success) {
      // Reset form
      setSelectedReason("");
      setAdditionalInfo("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedReason("");
    setAdditionalInfo("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[70vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-destructive" />
            Signaler ce post
          </DialogTitle>
          <DialogDescription>
            Signalez le post "{postTitle}" de {authorUsername}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-4 pb-4">
            {/* Avertissement */}
            <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-amber-800">Important</p>
                <p className="text-amber-700">
                  Les signalements abusifs peuvent entraîner des sanctions.
                  Utilisez cette fonction uniquement pour des contenus
                  inappropriés.
                </p>
              </div>
            </div>

            {/* Raisons de signalement */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Pourquoi signalez-vous ce post ?
              </Label>
              <RadioGroup
                value={selectedReason}
                onValueChange={(value) =>
                  setSelectedReason(value as ReportType)
                }
                className="space-y-2"
              >
                {REPORT_REASONS.map((reason) => (
                  <div
                    key={reason.value}
                    className="flex items-start space-x-2 py-1"
                  >
                    <RadioGroupItem
                      value={reason.value}
                      id={reason.value}
                      className="mt-0.5"
                    />
                    <div className="grid gap-0.5 leading-none">
                      <Label
                        htmlFor={reason.value}
                        className="text-sm font-medium leading-tight cursor-pointer"
                      >
                        {reason.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {reason.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Informations supplémentaires */}
            <div className="space-y-2">
              <Label htmlFor="additional-info" className="text-sm font-medium">
                Informations supplémentaires (optionnel)
              </Label>
              <Textarea
                id="additional-info"
                placeholder="Ajoutez des détails qui pourraient nous aider à comprendre le problème..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="min-h-[60px] text-sm"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {additionalInfo.length}/500 caractères
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Envoi...
              </>
            ) : (
              <>
                <Flag className="h-4 w-4" />
                Signaler
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
