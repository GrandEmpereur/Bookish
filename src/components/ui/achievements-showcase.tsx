"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EnhancedBadgeCard } from "@/components/ui/enhanced-badge-card";
import {
  Trophy,
  Star,
  Target,
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  Award,
  Flame,
  Crown,
  Sparkles,
  Share,
  Users,
  BarChart3,
  Zap,
  Heart,
  Eye,
  MessageCircle,
  ThumbsUp,
  PenTool,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Badge as BadgeType } from "@/types/gamificationTypes";

interface AchievementStats {
  totalXP: number;
  level: number;
  booksRead: number;
  currentStreak: number;
  longestStreak: number;
  reviewsWritten: number;
  genresExplored: number;
  readingTimeHours: number;
  friendsCount: number;
  likesReceived: number;
  commentsWritten: number;
  profileViews: number;
  joinDate: string;
  favoriteGenre: string;
  averageRating: number;
  totalPages: number;
}

interface RecentActivity {
  id: string;
  type:
    | "book_completed"
    | "badge_earned"
    | "review_written"
    | "friend_added"
    | "level_up";
  title: string;
  description: string;
  date: string;
  metadata?: {
    bookTitle?: string;
    badgeName?: string;
    newLevel?: number;
    friendName?: string;
  };
}

interface AchievementsShowcaseProps {
  userBadges: BadgeType[];
  stats: AchievementStats;
  recentActivities: RecentActivity[];
  onShareAchievement?: (achievementId: string) => void;
  className?: string;
}

// Mock data for demonstration
const MOCK_ACTIVITIES: RecentActivity[] = [
  {
    id: "act_1",
    type: "badge_earned",
    title: 'Badge "Bibliophile" débloqué',
    description: "Vous avez terminé 25 livres !",
    date: "2024-01-15T10:30:00Z",
    metadata: { badgeName: "Bibliophile Confirmé" },
  },
  {
    id: "act_2",
    type: "book_completed",
    title: "Livre terminé",
    description: 'Vous avez terminé "Le Petit Prince"',
    date: "2024-01-14T20:15:00Z",
    metadata: { bookTitle: "Le Petit Prince" },
  },
  {
    id: "act_3",
    type: "level_up",
    title: "Niveau supérieur !",
    description: "Vous êtes maintenant niveau 12",
    date: "2024-01-13T14:22:00Z",
    metadata: { newLevel: 12 },
  },
  {
    id: "act_4",
    type: "review_written",
    title: "Critique rédigée",
    description: 'Vous avez partagé votre avis sur "1984"',
    date: "2024-01-12T16:45:00Z",
    metadata: { bookTitle: "1984" },
  },
];

const READING_MILESTONES = [
  {
    books: 1,
    title: "Premier Livre",
    description: "Votre première lecture complète",
    unlocked: true,
  },
  {
    books: 5,
    title: "Lecteur Débutant",
    description: "5 livres terminés",
    unlocked: true,
  },
  {
    books: 10,
    title: "Lecteur Régulier",
    description: "10 livres terminés",
    unlocked: true,
  },
  {
    books: 25,
    title: "Bibliophile",
    description: "25 livres terminés",
    unlocked: true,
  },
  {
    books: 50,
    title: "Grand Lecteur",
    description: "50 livres terminés",
    unlocked: false,
  },
  {
    books: 100,
    title: "Maître Lecteur",
    description: "100 livres terminés",
    unlocked: false,
  },
  {
    books: 250,
    title: "Sage des Livres",
    description: "250 livres terminés",
    unlocked: false,
  },
  {
    books: 500,
    title: "Légende Vivante",
    description: "500 livres terminés",
    unlocked: false,
  },
];

export function AchievementsShowcase({
  userBadges,
  stats,
  recentActivities = MOCK_ACTIVITIES,
  onShareAchievement,
  className,
}: AchievementsShowcaseProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");

  const unlockedBadges = userBadges.filter((badge) => badge.isUnlocked);
  const totalBadges = userBadges.length;
  const completionPercentage = (unlockedBadges.length / totalBadges) * 100;

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "book_completed":
        return BookOpen;
      case "badge_earned":
        return Award;
      case "review_written":
        return PenTool;
      case "friend_added":
        return Users;
      case "level_up":
        return TrendingUp;
      default:
        return Star;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Il y a moins d'une heure";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const shareProfile = () => {
    const achievementText = `🏆 Niveau ${stats.level} sur Bookish !
📚 ${stats.booksRead} livres lus
🔥 ${stats.currentStreak} jours de série
⭐ ${unlockedBadges.length} badges débloqués

Rejoignez-moi sur Bookish pour découvrir de nouveaux livres !`;

    if (navigator.share) {
      navigator
        .share({
          title: "Mes accomplissements Bookish",
          text: achievementText,
        })
        .catch(() => {
          navigator.clipboard?.writeText(achievementText);
          toast.success("Accomplissements copiés dans le presse-papiers !");
        });
    } else {
      navigator.clipboard?.writeText(achievementText);
      toast.success("Accomplissements copiés dans le presse-papiers !");
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mes Succès</h2>
          <p className="text-muted-foreground">
            Votre parcours de lecture et vos accomplissements
          </p>
        </div>
        <Button onClick={shareProfile} className="flex items-center gap-2">
          <Share className="w-4 h-4" />
          Partager
        </Button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.level}
            </div>
            <div className="text-sm text-muted-foreground">Niveau</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.booksRead}
            </div>
            <div className="text-sm text-muted-foreground">Livres lus</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.currentStreak}
            </div>
            <div className="text-sm text-muted-foreground">Série actuelle</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {unlockedBadges.length}
            </div>
            <div className="text-sm text-muted-foreground">Badges</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Progression Globale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Collection de badges</span>
              <span>
                {unlockedBadges.length} / {totalBadges}
              </span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-lg font-bold">
                {stats.totalXP.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">XP Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.readingTimeHours}h</div>
              <div className="text-sm text-muted-foreground">
                Temps de lecture
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {stats.averageRating.toFixed(1)}/5
              </div>
              <div className="text-sm text-muted-foreground">Note moyenne</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="milestones">Étapes</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Derniers Accomplissements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unlockedBadges.slice(0, 3).map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{badge.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {badge.description}
                      </div>
                    </div>
                    <Badge variant="secondary">{badge.level}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reading Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Statistiques de Lecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {stats.totalPages.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pages lues
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {stats.genresExplored}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Genres explorés
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {stats.reviewsWritten}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Critiques écrites
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{stats.longestStreak}</div>
                  <div className="text-sm text-muted-foreground">
                    Plus longue série
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Impact Social
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold">{stats.friendsCount}</div>
                  <div className="text-sm text-muted-foreground">Amis</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{stats.likesReceived}</div>
                  <div className="text-sm text-muted-foreground">
                    J'aime reçus
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">
                    {stats.commentsWritten}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Commentaires
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{stats.profileViews}</div>
                  <div className="text-sm text-muted-foreground">
                    Vues du profil
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userBadges.map((badge) => (
              <div key={badge.id} onClick={() => setSelectedBadge(badge)}>
                <EnhancedBadgeCard
                  badge={badge}
                  isCompact={true}
                  onShare={
                    onShareAchievement
                      ? () => onShareAchievement(badge.id)
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <div className="space-y-3">
            {READING_MILESTONES.map((milestone, index) => (
              <Card
                key={index}
                className={cn(
                  "transition-all duration-300",
                  milestone.unlocked
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 opacity-60"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        milestone.unlocked
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      )}
                    >
                      {milestone.unlocked ? (
                        <Trophy className="w-6 h-6" />
                      ) : (
                        <Target className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{milestone.books}</div>
                      <div className="text-xs text-muted-foreground">
                        {milestone.books === 1 ? "livre" : "livres"}
                      </div>
                    </div>
                    {milestone.unlocked && (
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        Débloqué
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">
                          {activity.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(activity.date)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Badge Detail Dialog */}
      <Dialog
        open={!!selectedBadge}
        onOpenChange={() => setSelectedBadge(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du Badge</DialogTitle>
          </DialogHeader>
          {selectedBadge && (
            <EnhancedBadgeCard
              badge={selectedBadge}
              showProgress={!selectedBadge.isUnlocked}
              onShare={
                onShareAchievement
                  ? () => onShareAchievement(selectedBadge.id)
                  : undefined
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
