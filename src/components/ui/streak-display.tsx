"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Flame, 
  Heart, 
  Sword, 
  Shield,
  Coffee,
  Zap,
  Clock,
  Gift
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  gameMode: 'zen' | 'challenge';
  streakGoal?: number;
  lastActivityDate?: string;
  hasGracePeriod?: boolean;
  className?: string;
}

export function StreakDisplay({ 
  currentStreak, 
  longestStreak, 
  gameMode, 
  streakGoal = 7,
  lastActivityDate,
  hasGracePeriod = false,
  className 
}: StreakDisplayProps) {
  
  const progress = (currentStreak / streakGoal) * 100;
  const isNearGoal = currentStreak >= streakGoal * 0.8;
  const isAtRisk = lastActivityDate && new Date().getTime() - new Date(lastActivityDate).getTime() > 20 * 60 * 60 * 1000; // 20h sans activité

  const getStreakMessage = () => {
    if (gameMode === 'zen') {
      if (currentStreak === 0) {
        return "Prêt(e) pour une nouvelle aventure de lecture ? 📚";
      } else if (currentStreak < 3) {
        return "Votre routine de lecture prend forme ! 🌱";
      } else if (currentStreak < 7) {
        return "Belle régularité ! Vous développez une excellente habitude 📖";
      } else {
        return "Quelle constance admirable ! Vous êtes un(e) vrai(e) lecteur(ice) 🌟";
      }
    } else {
      if (currentStreak === 0) {
        return "Remontez dans le classement avec une nouvelle série ! 🚀";
      } else if (currentStreak < 3) {
        return "Série naissante ! Continuez pour dépasser vos rivaux 💪";
      } else if (currentStreak < 7) {
        return "Série en feu ! Vous grimpez dans les classements 🔥";
      } else {
        return "Série de champion ! Vous dominez la compétition 👑";
      }
    }
  };

  const getStreakColor = () => {
    if (gameMode === 'zen') {
      return currentStreak > 0 ? "text-emerald-600" : "text-gray-500";
    } else {
      if (currentStreak >= 7) return "text-red-600";
      if (currentStreak >= 3) return "text-orange-600";
      if (currentStreak >= 1) return "text-yellow-600";
      return "text-gray-500";
    }
  };

  const getStreakIcon = () => {
    if (gameMode === 'zen') {
      return currentStreak > 0 ? Heart : Coffee;
    } else {
      if (currentStreak >= 7) return Zap;
      if (currentStreak >= 3) return Flame;
      return Sword;
    }
  };

  const StreakIcon = getStreakIcon();

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <StreakIcon className={cn("w-5 h-5", getStreakColor())} />
          Série de lecture
          {gameMode === 'challenge' && currentStreak >= 7 && (
            <Badge variant="destructive" className="text-xs">
              <Flame className="w-3 h-3 mr-1" />
              EN FEU
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Streak */}
        <div className="text-center">
          <div className={cn("text-4xl font-bold", getStreakColor())}>
            {currentStreak}
          </div>
          <p className="text-sm text-muted-foreground">
            jour{currentStreak > 1 ? 's' : ''} consécutif{currentStreak > 1 ? 's' : ''}
          </p>
        </div>

        {/* Progress to Goal */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Objectif {streakGoal} jours</span>
            <span className={cn(
              "font-medium",
              isNearGoal ? "text-green-600" : "text-muted-foreground"
            )}>
              {Math.min(currentStreak, streakGoal)} / {streakGoal}
            </span>
          </div>
          <Progress 
            value={Math.min(progress, 100)} 
            className={cn(
              "h-2",
              gameMode === 'zen' ? "[&>div]:bg-emerald-500" : "[&>div]:bg-orange-500"
            )}
          />
        </div>

        {/* Message */}
        <div className={cn(
          "p-3 rounded-lg text-sm",
          gameMode === 'zen' ? "bg-emerald-50 text-emerald-800" : "bg-orange-50 text-orange-800"
        )}>
          {getStreakMessage()}
        </div>

        {/* Grace Period Notice (Zen mode only) */}
        {gameMode === 'zen' && hasGracePeriod && isAtRisk && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-lg text-xs">
            <Shield className="w-4 h-4" />
            <span>
              Période de grâce active - Votre série est protégée jusqu'à demain
            </span>
          </div>
        )}

        {/* Risk Warning (Challenge mode) */}
        {gameMode === 'challenge' && isAtRisk && currentStreak > 0 && (
          <div className="flex items-center gap-2 p-2 bg-red-50 text-red-700 rounded-lg text-xs">
            <Clock className="w-4 h-4" />
            <span>
              Attention ! Lisez aujourd'hui ou perdez votre série
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between text-sm pt-2 border-t">
          <div className="text-center">
            <div className="font-semibold">{longestStreak}</div>
            <div className="text-xs text-muted-foreground">Record</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">
              {gameMode === 'zen' ? 'Flexible' : 'Stricte'}
            </div>
            <div className="text-xs text-muted-foreground">Mode série</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">
              {gameMode === 'zen' ? (
                <Heart className="w-4 h-4 text-emerald-500 mx-auto" />
              ) : (
                <Flame className="w-4 h-4 text-orange-500 mx-auto" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">Style</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 