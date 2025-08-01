"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { GAME_MODES } from "@/utils/gamificationUtils";
import { Heart, Info, Settings, Sword } from "lucide-react";
import { useState } from "react";

interface GameModeToggleProps {
  currentMode: "zen" | "challenge";
  onModeChange: (mode: "zen" | "challenge") => void;
  className?: string;
}

export function GameModeToggle({
  currentMode,
  onModeChange,
  className,
}: GameModeToggleProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = () => {
    const newMode = currentMode === "zen" ? "challenge" : "zen";
    onModeChange(newMode);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5" />
          Mode de Jeu
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="ml-auto"
          >
            <Info className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-emerald-500" />
            <span className="font-medium">Zen</span>
          </div>

          <Switch
            checked={currentMode === "challenge"}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-orange-500"
          />

          <div className="flex items-center gap-3">
            <span className="font-medium">Challenge</span>
            <Sword className="h-5 w-5 text-orange-500" />
          </div>
        </div>

        {/* Current Mode Display */}
        <div className="text-center">
          <Badge
            variant={currentMode === "zen" ? "secondary" : "destructive"}
            className="mb-2"
          >
            {currentMode === "zen" ? "🧘 " : "⚔️ "}
            {GAME_MODES[currentMode].name}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {GAME_MODES[currentMode].description}
          </p>
        </div>

        {/* Detailed Features */}
        {showDetails && (
          <div className="grid gap-3 pt-3 border-t">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">
                Fonctionnalités du mode actuel :
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {GAME_MODES[currentMode].features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded text-center">
                <Heart className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs font-medium">Mode Zen</p>
                <p className="text-xs text-muted-foreground">Sérénité</p>
              </div>
              <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded text-center">
                <Sword className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                <p className="text-xs font-medium">Mode Challenge</p>
                <p className="text-xs text-muted-foreground">Compétition</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
