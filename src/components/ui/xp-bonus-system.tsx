"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Clock,
  Coffee,
  Crown,
  Flame,
  Gift,
  Sparkles,
  Star,
  Timer,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface XPBonus {
  id: string;
  name: string;
  description: string;
  type:
    | "multiplier"
    | "flat"
    | "streak"
    | "combo"
    | "happy_hour"
    | "daily_chest";
  value: number; // multiplier (1.5 = +50%) or flat amount
  duration?: number; // in minutes, undefined for permanent
  startTime?: string;
  endTime?: string;
  isActive: boolean;
  icon: string;
  color: string;
  requirements?: string[];
  progress?: {
    current: number;
    target: number;
  };
}

interface XPBonusSystemProps {
  currentStreak: number;
  dailyCombo: number;
  userLevel: number;
  onClaimDailyChest: () => void;
  onJoinHappyHour: (happyHourId: string) => void;
  xpBonuses?: XPBonus[];
  happyHours?: any[];
  dailyChestAvailable?: boolean;
  className?: string;
}

// XP bonuses and happy hours data will come from API

export function XPBonusSystem({
  currentStreak,
  dailyCombo,
  userLevel,
  onClaimDailyChest,
  onJoinHappyHour,
  xpBonuses = [],
  happyHours = [],
  dailyChestAvailable = false,
  className,
}: XPBonusSystemProps) {
  const [activeHappyHour, setActiveHappyHour] = useState<string | null>(null);
  const [dailyChestClaimed, setDailyChestClaimed] = useState(false);

  // Bonus activation and happy hour checking is now handled by the API

  const handleClaimDailyChest = () => {
    if (!dailyChestClaimed) {
      setDailyChestClaimed(true);
      onClaimDailyChest();
      toast.success("Coffre quotidien récupéré ! +50 XP");
    }
  };

  const getTotalMultiplier = () => {
    let total = 1.0;
    xpBonuses.forEach((bonus) => {
      if (bonus.isActive && bonus.type === "multiplier") {
        total *= bonus.value;
      }
    });
    return total;
  };

  const getBonusIcon = (iconString: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      "🌅": Clock,
      "🔥": Flame,
      "🏆": Trophy,
      "⚡": Zap,
      "💫": Sparkles,
      "🎉": Gift,
      "🌙": Timer,
      "☕": Coffee,
      "🍽️": Users,
      "🦉": Crown,
    };

    return iconMap[iconString] || Star;
  };

  const BonusCard = ({ bonus }: { bonus: XPBonus }) => {
    const IconComponent = getBonusIcon(bonus.icon);

    return (
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          bonus.isActive
            ? "border-green-500 bg-green-50 shadow-lg"
            : "border-gray-200 opacity-75"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 opacity-10",
            bonus.isActive ? "bg-green-500" : "bg-gray-500"
          )}
        />

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-full text-white",
                  bonus.isActive ? bonus.color : "bg-gray-400"
                )}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm">{bonus.name}</CardTitle>
                <Badge
                  variant={bonus.isActive ? "default" : "secondary"}
                  className="text-xs mt-1"
                >
                  {bonus.type === "multiplier"
                    ? `+${Math.round((bonus.value - 1) * 100)}% XP`
                    : `+${bonus.value} XP`}
                </Badge>
              </div>
            </div>

            {bonus.isActive && (
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                <Zap className="w-3 h-3" />
                Actif
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground mb-3">
            {bonus.description}
          </p>

          {bonus.requirements && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-700">
                Conditions :
              </div>
              {bonus.requirements.map((req, index) => (
                <div
                  key={index}
                  className="text-xs text-gray-600 flex items-center gap-1"
                >
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      bonus.isActive ? "bg-green-500" : "bg-gray-400"
                    )}
                  />
                  {req}
                </div>
              ))}
            </div>
          )}

          {bonus.progress && (
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progression</span>
                <span>
                  {bonus.progress.current}/{bonus.progress.target}
                </span>
              </div>
              <Progress
                value={(bonus.progress.current / bonus.progress.target) * 100}
                className="h-2"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const HappyHourCard = ({ happyHour }: { happyHour: any }) => {
    const isActive = activeHappyHour === happyHour.id;
    const IconComponent = getBonusIcon(happyHour.icon);

    return (
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          isActive
            ? "border-purple-500 bg-purple-50 shadow-lg animate-pulse"
            : "border-gray-200"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 opacity-10",
            isActive ? "bg-purple-500" : "bg-gray-500"
          )}
        />

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-full text-white",
                  isActive ? happyHour.color : "bg-gray-400"
                )}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-sm">{happyHour.name}</CardTitle>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className="text-xs mt-1"
                >
                  x{happyHour.multiplier} XP
                </Badge>
              </div>
            </div>

            {isActive && (
              <Badge className="bg-purple-500 text-white animate-pulse">
                EN COURS
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground mb-3">
            {happyHour.description}
          </p>

          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-600">
              {happyHour.startTime} - {happyHour.endTime}
            </div>
            <div className="text-gray-600">
              {happyHour.participants} participants
            </div>
          </div>

          {isActive && (
            <Button
              size="sm"
              className="w-full mt-3 bg-purple-500 hover:bg-purple-600"
              onClick={() => onJoinHappyHour(happyHour.id)}
            >
              Participer maintenant !
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const activeBonuses = xpBonuses.filter((b) => b.isActive);
  const inactiveBonuses = xpBonuses.filter((b) => !b.isActive);
  const totalMultiplier = getTotalMultiplier();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with total multiplier */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bonus d'Expérience</h2>
          <p className="text-muted-foreground">Maximisez vos gains d'XP</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600">
            x{totalMultiplier.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            Multiplicateur total
          </div>
        </div>
      </div>

      {/* Daily Chest */}
      {dailyChestAvailable && (
        <Card
          className={cn(
            "relative overflow-hidden border-2",
            dailyChestClaimed
              ? "border-gray-300 bg-gray-50"
              : "border-yellow-400 bg-yellow-50"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-3 rounded-full",
                    dailyChestClaimed ? "bg-gray-400" : "bg-yellow-500"
                  )}
                >
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">Coffre Quotidien</h3>
                  <p className="text-sm text-muted-foreground">
                    {dailyChestClaimed
                      ? "Déjà récupéré aujourd'hui"
                      : "Récupérez votre bonus quotidien"}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleClaimDailyChest}
                disabled={dailyChestClaimed}
                className={cn(
                  "font-semibold",
                  !dailyChestClaimed &&
                    "bg-yellow-500 hover:bg-yellow-600 animate-pulse"
                )}
              >
                {dailyChestClaimed ? "Récupéré" : "Récupérer"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Happy Hours */}
      {happyHours.length > 0 && happyHours.some((hh: any) => hh.isActive) && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-600">
            ⚡ Happy Hours Actives
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {happyHours
              .filter((hh: any) => hh.isActive)
              .map((happyHour: any) => (
                <HappyHourCard key={happyHour.id} happyHour={happyHour} />
              ))}
          </div>
        </div>
      )}

      {/* Active Bonuses */}
      {activeBonuses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-600">
            ✅ Bonus Actifs
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeBonuses.map((bonus: XPBonus) => (
              <BonusCard key={bonus.id} bonus={bonus} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Happy Hours */}
      {happyHours.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            🕐 Prochaines Happy Hours
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {happyHours
              .filter((hh: any) => !hh.isActive)
              .map((happyHour: any) => (
                <HappyHourCard key={happyHour.id} happyHour={happyHour} />
              ))}
          </div>
        </div>
      )}

      {/* Available Bonuses */}
      {inactiveBonuses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-600">
            🎯 Bonus Disponibles
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inactiveBonuses.map((bonus: XPBonus) => (
              <BonusCard key={bonus.id} bonus={bonus} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {xpBonuses.length === 0 && happyHours.length === 0 && (
        <div className="text-center py-12">
          <Zap className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Aucun bonus d'XP disponible
          </h3>
          <p className="text-muted-foreground">
            Les bonus d'expérience seront bientôt disponibles via l'API.
          </p>
        </div>
      )}
    </div>
  );
}
