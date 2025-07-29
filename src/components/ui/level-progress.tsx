"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Gift,
  ChevronRight,
  BookOpen,
  Shield,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  getLevelTitle, 
  getLevelTier, 
  getProgressToNextLevel, 
  getExperienceToNextLevel,
  getExperienceForLevelUp,
  getLevelUpRewards,
  getUnlockedFeatures
} from "@/utils/gamificationUtils";
import { LevelsInfoModal } from "@/components/ui/levels-info-modal";

interface LevelProgressProps {
  level: number;
  currentXP: number;
  totalXP: number;
  className?: string;
  showCelebration?: boolean;
  onCelebrationComplete?: () => void;
}

export function LevelProgress({ 
  level, 
  currentXP, 
  totalXP, 
  className,
  showCelebration = false,
  onCelebrationComplete
}: LevelProgressProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  
  const tier = getLevelTier(level);
  const title = getLevelTitle(level);
  // Calculate progress based on current XP vs required XP
  const progress = totalXP > 0 ? (currentXP / totalXP) * 100 : 0;
  const xpToNext = Math.max(0, totalXP - currentXP);
  const xpForNext = totalXP;
  
  const rewards = getLevelUpRewards(level);
  const unlockedFeatures = getUnlockedFeatures(level);

  useEffect(() => {
    if (showCelebration) {
      setIsAnimating(true);
      setShowRewards(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onCelebrationComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration, onCelebrationComplete]);

  const getTierIcon = () => {
    switch (tier.icon) {
      case 'BookOpen': return BookOpen;
      case 'Shield': return Shield;
      case 'Crown': return Crown;
      case 'Sparkles': return Sparkles;
      case 'Zap': return Zap;
      default: return BookOpen;
    }
  };

  const TierIcon = getTierIcon();

  return (
    <div className={cn("relative", className)}>
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        isAnimating && "animate-pulse shadow-lg border-yellow-500"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div 
                className={cn(
                  "p-2 rounded-full flex-shrink-0",
                  `bg-[${tier.color}]`,
                  "text-white"
                )}
              >
                <TierIcon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base md:text-lg truncate">{title}</CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {tier.name} • Niveau {level}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs flex-shrink-0 hidden md:inline-flex">
                {tier.description}
              </Badge>
              <LevelsInfoModal 
                currentLevel={level} 
                className="text-muted-foreground hover:text-foreground"
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-2">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-xs text-muted-foreground truncate">
                {currentXP} XP / {totalXP} XP
              </span>
            </div>
            <Progress 
              value={progress} 
              className={cn(
                "h-3 bg-muted transition-all duration-500",
                isAnimating && "animate-pulse"
              )}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground gap-2">
              <span className="truncate">Niveau actuel</span>
              <span className="text-right text-xs flex-shrink-0">{xpToNext} XP pour le niveau suivant</span>
            </div>
          </div>

          {/* Next Level Preview */}
          <div className="p-3 bg-muted/50 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 text-sm min-w-0">
              <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span className="font-medium flex-shrink-0">Niveau {level + 1}</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground truncate">
                {getLevelTitle(level + 1)}
              </span>
            </div>
          </div>

          {/* Unlocked Features */}
          {unlockedFeatures.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Fonctionnalités débloquées
              </h4>
              <div className="grid gap-1">
                {unlockedFeatures.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Level Up Celebration */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
          <div className="text-center p-6 bg-background/90 rounded-lg shadow-lg border animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Niveau supérieur !</h3>
            <p className="text-lg mb-4">Vous êtes maintenant <strong>{title}</strong></p>
            
            {/* Rewards */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>+{rewards.bookcoins} BookCoins</span>
                </div>
                {rewards.items && rewards.items.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span>+{rewards.items.length} badges</span>
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={() => {
                setShowRewards(false);
                onCelebrationComplete?.();
              }}
              className="w-full"
            >
              Continuer ma quête
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 