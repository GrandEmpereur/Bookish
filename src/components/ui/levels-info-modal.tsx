"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Info,
  BookOpen,
  Shield,
  Crown,
  Sparkles,
  Zap,
  Star,
  Trophy,
  Gem,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLevelTitle, getLevelTier } from "@/utils/gamificationUtils";

interface LevelsInfoModalProps {
  currentLevel: number;
  className?: string;
}

export function LevelsInfoModal({
  currentLevel,
  className,
}: LevelsInfoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getTierIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return BookOpen;
      case "Shield":
        return Shield;
      case "Crown":
        return Crown;
      case "Sparkles":
        return Sparkles;
      case "Zap":
        return Zap;
      default:
        return BookOpen;
    }
  };

  const levelRanges = [
    {
      range: "1-10",
      tier: "Apprenti",
      color: "#6B7280",
      icon: "BookOpen",
      description: "Premiers pas dans la lecture",
    },
    {
      range: "11-25",
      tier: "Explorateur",
      color: "#059669",
      icon: "Shield",
      description: "Découverte des genres littéraires",
    },
    {
      range: "26-50",
      tier: "Connaisseur",
      color: "#DC2626",
      icon: "Crown",
      description: "Maîtrise des techniques de lecture",
    },
    {
      range: "51-100",
      tier: "Expert",
      color: "#7C3AED",
      icon: "Sparkles",
      description: "Excellence en analyse littéraire",
    },
    {
      range: "101-200",
      tier: "Grand Sage",
      color: "#F59E0B",
      icon: "Zap",
      description: "Sagesse ultime du lecteur",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", className)}
        >
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Système de niveaux
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <div className="space-y-4 pr-4">
            {levelRanges.map((tier, index) => {
              const TierIcon = getTierIcon(tier.icon);
              const isCurrentTier =
                currentLevel >= parseInt(tier.range.split("-")[0]) &&
                currentLevel <= parseInt(tier.range.split("-")[1]);

              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    isCurrentTier
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="p-2 rounded-full text-white"
                      style={{ backgroundColor: tier.color }}
                    >
                      <TierIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{tier.tier}</h3>
                        {isCurrentTier && (
                          <Badge variant="default" className="text-xs">
                            Niveau actuel
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Niveaux {tier.range}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground ml-11">
                    {tier.description}
                  </p>

                  {/* Example levels for this tier */}
                  <div className="mt-3 ml-11">
                    <div className="text-xs text-muted-foreground mb-1">
                      Exemples :
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {[0, 1, 2].map((offset) => {
                        const levelStart = parseInt(tier.range.split("-")[0]);
                        const levelEnd = parseInt(tier.range.split("-")[1]);
                        const exampleLevel = Math.min(
                          levelStart +
                            offset * Math.floor((levelEnd - levelStart) / 3),
                          levelEnd
                        );

                        return (
                          <Badge
                            key={offset}
                            variant={
                              exampleLevel === currentLevel
                                ? "default"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            Niv. {exampleLevel}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Progression Tips */}
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-blue-600" />
                <h3 className="font-semibold text-sm text-blue-800 dark:text-blue-200">
                  Comment progresser ?
                </h3>
              </div>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Terminez vos missions quotidiennes</li>
                <li>• Lisez régulièrement pour maintenir votre série</li>
                <li>• Participez aux événements spéciaux</li>
                <li>• Explorez différents genres littéraires</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
