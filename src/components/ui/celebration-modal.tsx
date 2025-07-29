"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, 
  Star, 
  Sparkles, 
  Award, 
  Coins, 
  BookOpen, 
  Crown,
  Zap,
  Gift,
  Target,
  Users,
  PenTool,
  Search,
  PartyPopper,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getRandomNarrativeMessage } from "@/utils/gamificationUtils";
import type { Mission, Badge as GamificationBadge } from "@/types/gamificationTypes";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'mission' | 'level' | 'badge' | 'streak' | 'achievement';
  data: {
    mission?: Mission;
    level?: number;
    badge?: GamificationBadge;
    streak?: number;
    experience?: number;
    bookcoins?: number;
    title?: string;
    description?: string;
    newFeatures?: string[];
  };
}

export function CelebrationModal({ 
  isOpen, 
  onClose, 
  type, 
  data 
}: CelebrationModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setShowConfetti(true);
      
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getCelebrationContent = () => {
    switch (type) {
      case 'mission':
        return {
          icon: <Target className="w-20 h-20 text-blue-500" />,
          title: "Mission accomplie !",
          subtitle: data.mission?.title || "Félicitations !",
          message: getRandomNarrativeMessage('missionComplete'),
          color: "blue"
        };
      
      case 'level':
        return {
          icon: <Trophy className="w-20 h-20 text-yellow-500" />,
          title: `Niveau ${data.level} atteint !`,
          subtitle: data.title || "Nouveau niveau débloqué",
          message: getRandomNarrativeMessage('levelUp'),
          color: "yellow"
        };
      
      case 'badge':
        return {
          icon: <Award className="w-20 h-20 text-purple-500" />,
          title: "Nouveau badge !",
          subtitle: data.badge?.name || "Badge débloqué",
          message: getRandomNarrativeMessage('badgeEarned'),
          color: "purple"
        };
      
      case 'streak':
        return {
          icon: <Sparkles className="w-20 h-20 text-orange-500" />,
          title: "Série maintenue !",
          subtitle: `${data.streak} jours consécutifs`,
          message: getRandomNarrativeMessage('streakMaintained'),
          color: "orange"
        };
      
      default:
        return {
          icon: <Star className="w-20 h-20 text-green-500" />,
          title: "Succès !",
          subtitle: data.title || "Objectif atteint",
          message: "Vous avez accompli quelque chose d'extraordinaire !",
          color: "green"
        };
    }
  };

  const content = getCelebrationContent();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reading': return BookOpen;
      case 'exploration': return Search;
      case 'community': return Users;
      case 'creation': return PenTool;
      case 'engagement': return Target;
      default: return BookOpen;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md max-h-[90vh] overflow-y-auto"
        style={{ zIndex: 9999 }}
      >
        <div className="relative">
          {/* Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="animate-pulse">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute w-2 h-2 rounded-full animate-bounce",
                      i % 4 === 0 && "bg-yellow-400",
                      i % 4 === 1 && "bg-blue-400",
                      i % 4 === 2 && "bg-green-400",
                      i % 4 === 3 && "bg-purple-400"
                    )}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="relative z-10 text-center pt-4 pb-2">
            <div className="flex justify-center mb-4">
              <div className={cn(
                "animate-bounce",
                isAnimating && "animate-pulse"
              )}>
                {content.icon}
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">{content.title}</h2>
            <p className="text-base text-muted-foreground mb-3">
              {content.subtitle}
            </p>

            <div className="bg-muted/50 rounded-lg p-3 mb-4">
              <p className="text-sm italic text-muted-foreground">
                "{content.message}"
              </p>
            </div>

            {/* Rewards Display */}
            <div className="space-y-3 mb-4">
              {(data.experience || data.bookcoins) && (
                <div className="flex justify-center gap-6">
                  {data.experience && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">+{data.experience} XP</span>
                    </div>
                  )}
                  {data.bookcoins && (
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-500" />
                      <span className="font-medium">+{data.bookcoins} BookCoins</span>
                    </div>
                  )}
                </div>
              )}

              {/* Mission Details */}
              {type === 'mission' && data.mission && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const CategoryIcon = getCategoryIcon(data.mission.category);
                        return <CategoryIcon className="w-5 h-5 text-muted-foreground" />;
                      })()}
                      <div className="flex-1 text-left">
                        <p className="font-medium">{data.mission.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.mission.description}
                        </p>
                      </div>
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* New Features */}
              {data.newFeatures && data.newFeatures.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Gift className="w-5 h-5 text-purple-500" />
                      <h3 className="font-medium">Nouvelles fonctionnalités</h3>
                    </div>
                    <div className="space-y-2">
                      {data.newFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Badge Details */}
              {type === 'badge' && data.badge && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{data.badge.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.badge.description}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {data.badge.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Fixed bottom button with proper spacing */}
            <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t pt-3 pb-2 mt-4 -mx-6 px-6">
              <Button 
                onClick={onClose}
                className="w-full relative z-20 shadow-lg"
                size="lg"
              >
                <PartyPopper className="w-4 h-4 mr-2" />
                Continuer ma quête
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 