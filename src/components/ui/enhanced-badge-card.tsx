"use client";

import { Badge as BadgeInterface } from "@/types/gamificationTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Award,
  Crown,
  Star,
  Medal,
  Lock,
  Share,
  Gift,
  Target,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getBadgeColor,
  getBadgeRarityColor,
  getNextBadgeInSeries,
} from "@/utils/badgeSystem";
import React from "react"; // Added missing import for React

interface EnhancedBadgeCardProps {
  badge: BadgeInterface;
  userProgress?: {
    current: number;
    target: number;
  };
  showProgress?: boolean;
  isCompact?: boolean;
  onShare?: (badge: BadgeInterface) => void;
  className?: string;
}

export function EnhancedBadgeCard({
  badge,
  userProgress,
  showProgress = false,
  isCompact = false,
  onShare,
  className,
}: EnhancedBadgeCardProps) {
  const badgeColor = getBadgeColor(badge.level);
  const rarityColor = getBadgeRarityColor(badge.rarity);
  const nextBadge = getNextBadgeInSeries(badge);
  const progressPercentage = userProgress
    ? (userProgress.current / userProgress.target) * 100
    : 0;

  const getLevelIcon = (level: BadgeInterface["level"]) => {
    switch (level) {
      case "bronze":
        return Medal;
      case "silver":
        return Award;
      case "gold":
        return Trophy;
      case "platinum":
        return Crown;
      case "diamond":
        return Sparkles;
      default:
        return Award;
    }
  };

  const LevelIcon = getLevelIcon(badge.level);

  if (isCompact) {
    return (
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
          badge.isUnlocked
            ? "border-2 shadow-md"
            : "border border-gray-200 opacity-75",
          className
        )}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundColor: badge.isUnlocked ? rarityColor : "#6B7280",
          }}
        />

        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "relative w-12 h-12 rounded-full flex items-center justify-center",
                badge.isUnlocked ? "shadow-lg" : "bg-gray-100"
              )}
            >
              {badge.isUnlocked ? (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: badgeColor }}
                >
                  <LevelIcon className="w-5 h-5" />
                </div>
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={cn(
                    "font-semibold text-sm truncate",
                    badge.isUnlocked ? "text-gray-900" : "text-gray-500"
                  )}
                >
                  {badge.name}
                </h3>
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{ borderColor: rarityColor, color: rarityColor }}
                >
                  {badge.level}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">
                {badge.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-xl group",
        badge.isUnlocked
          ? "border-2 shadow-lg transform hover:scale-105"
          : "border border-gray-200 opacity-80",
        className
      )}
    >
      {/* Rarity background gradient */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          background: `linear-gradient(135deg, ${rarityColor} 0%, transparent 100%)`,
        }}
      />

      {/* Unlocked indicator */}
      {badge.isUnlocked && (
        <div className="absolute top-2 right-2 z-10">
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>
      )}

      <CardContent className="p-6">
        {/* Badge Icon and Level */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "relative w-16 h-16 rounded-full flex items-center justify-center",
              badge.isUnlocked ? "shadow-xl" : "bg-gray-100"
            )}
          >
            {badge.isUnlocked ? (
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-inner"
                style={{ backgroundColor: badgeColor }}
              >
                <LevelIcon className="w-7 h-7" />
              </div>
            ) : (
              <Lock className="w-7 h-7 text-gray-400" />
            )}

            {/* Tier indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center">
              {badge.tier}
            </div>
          </div>

          <div className="text-right">
            <Badge
              variant="outline"
              className="mb-2"
              style={{ borderColor: rarityColor, color: rarityColor }}
            >
              {badge.rarity}
            </Badge>
            <div className="text-xs text-gray-500 capitalize">
              {badge.category}
            </div>
          </div>
        </div>

        {/* Badge Info */}
        <div className="space-y-3">
          <div>
            <h3
              className={cn(
                "text-lg font-bold mb-1",
                badge.isUnlocked ? "text-gray-900" : "text-gray-500"
              )}
            >
              {badge.name}
            </h3>
            {badge.series && (
              <p className="text-sm text-gray-600">Série : {badge.series}</p>
            )}
          </div>

          <p className="text-sm text-gray-700">{badge.description}</p>

          {/* Requirements */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Objectif
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {badge.requirements.description}
            </p>
          </div>

          {/* Progress Bar (if applicable) */}
          {showProgress && userProgress && !badge.isUnlocked && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progression</span>
                <span className="font-medium">
                  {userProgress.current} / {userProgress.target}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          {/* Rewards */}
          {badge.reward && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Récompenses
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  +{badge.reward.bookcoins} BookCoins
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  +{badge.reward.xp} XP
                </span>
                {badge.reward.title && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                    Titre : {badge.reward.title}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Next Badge in Series */}
          {badge.isUnlocked && nextBadge && (
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-gray-700">
                  Prochain niveau
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: getBadgeColor(nextBadge.level) }}
                >
                  {React.createElement(getLevelIcon(nextBadge.level), {
                    className: "w-4 h-4",
                  })}
                </div>
                <div>
                  <div className="font-medium">{nextBadge.name}</div>
                  <div className="text-xs">
                    {nextBadge.requirements.description}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {badge.isUnlocked && onShare && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShare(badge)}
                className="flex-1"
              >
                <Share className="w-4 h-4 mr-2" />
                Partager
              </Button>
            )}

            {!badge.isUnlocked && (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-2" />À débloquer
              </div>
            )}
          </div>

          {/* Unlock Date */}
          {badge.isUnlocked && badge.unlockedAt && (
            <div className="text-xs text-gray-500 text-center pt-2 border-t">
              Débloqué le{" "}
              {new Date(badge.unlockedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
