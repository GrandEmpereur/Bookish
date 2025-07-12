"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search, 
  Users, 
  PenTool, 
  Target, 
  Clock, 
  Star, 
  Award, 
  CheckCircle, 
  Circle,
  Sparkles,
  Coins,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MISSION_CATEGORIES, getDifficultyColor } from "@/utils/gamificationUtils";
import type { Mission } from "@/types/gamificationTypes";

interface MissionBoardProps {
  missions: Mission[];
  onMissionAccept?: (missionId: string) => void;
  onMissionComplete?: (missionId: string) => void;
  className?: string;
}

export function MissionBoard({ 
  missions, 
  onMissionAccept, 
  onMissionComplete, 
  className 
}: MissionBoardProps) {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());

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

  const safeMissions = missions || [];
  
  // Filter missions based on selected tab
  const getFilteredMissions = () => {
    switch (selectedTab) {
      case "available":
        return safeMissions.filter(mission => !mission.isAccepted && !mission.isCompleted);
      case "active":
        return safeMissions.filter(mission => mission.isAccepted && !mission.isCompleted);
      case "completed":
        return safeMissions.filter(mission => mission.isCompleted || completedMissions.has(mission.id));
      case "all":
      default:
        return safeMissions;
    }
  };

  const filteredMissions = getFilteredMissions();

  const handleMissionComplete = (missionId: string) => {
    setCompletedMissions(prev => new Set([...prev, missionId]));
    onMissionComplete?.(missionId);
  };

  const MissionCard = ({ mission }: { mission: Mission }) => {
    const CategoryIcon = getCategoryIcon(mission.category);
    const isCompleted = mission.isCompleted || completedMissions.has(mission.id);
    const progressPercentage = (mission.progress / mission.target) * 100;

    return (
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-md",
        isCompleted && "bg-green-50 border-green-200",
        mission.isAccepted && !isCompleted && "bg-blue-50 border-blue-200"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div 
                className={cn(
                  "p-2 rounded-full text-white",
                  `bg-[${MISSION_CATEGORIES[mission.category as keyof typeof MISSION_CATEGORIES]?.color || '#6B7280'}]`
                )}
              >
                <CategoryIcon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base leading-tight">{mission.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {mission.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  mission.difficulty === 'easy' && "bg-green-100 text-green-700",
                  mission.difficulty === 'medium' && "bg-yellow-100 text-yellow-700",
                  mission.difficulty === 'hard' && "bg-red-100 text-red-700",
                  mission.difficulty === 'expert' && "bg-purple-100 text-purple-700"
                )}
              >
                {mission.difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {MISSION_CATEGORIES[mission.category as keyof typeof MISSION_CATEGORIES]?.name || mission.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Mission Status */}
          {mission.isAccepted && !isCompleted && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Mission en cours
              </span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progression</span>
              <span className="text-muted-foreground">
                {mission.progress} / {mission.target}
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className={cn(
                "h-2",
                isCompleted && "[&>div]:bg-green-500",
                mission.isAccepted && !isCompleted && "[&>div]:bg-blue-500",
                !mission.isAccepted && "[&>div]:bg-gray-400"
              )}
            />
          </div>

          {/* Narrative Context */}
          {mission.narrativeContext && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground italic">
                "{mission.narrativeContext}"
              </p>
            </div>
          )}

          {/* Rewards */}
          <div className="flex items-center gap-4 text-sm flex-wrap">
            {/* Always show XP reward */}
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>+{mission.reward.type === 'experience' ? mission.reward.amount || 0 : 25} XP</span>
            </div>
            
            {/* Show BookCoins reward if available */}
            {mission.reward.type === 'bookcoins' && (
              <div className="flex items-center gap-1">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span>+{mission.reward.amount || 0} BookCoins</span>
              </div>
            )}
            
            {/* Show badge reward if available */}
            {mission.reward.badgeId && (
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-purple-500" />
                <span>Badge</span>
              </div>
            )}
          </div>

          {/* Expiration */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>
              Expire {new Date(mission.expiresAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!mission.isAccepted && !isCompleted && (
              <Button 
                onClick={() => onMissionAccept?.(mission.id)}
                className="flex-1"
                variant="outline"
              >
                Accepter la mission
              </Button>
            )}
            {mission.isAccepted && !isCompleted && (
              <Button 
                onClick={() => handleMissionComplete(mission.id)}
                className="flex-1"
                variant={progressPercentage >= 100 ? "default" : "secondary"}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {progressPercentage >= 100 ? "Terminer" : "Marquer comme terminé"}
              </Button>
            )}
            {isCompleted && (
              <div className="flex-1 flex items-center justify-center text-green-600 font-medium">
                <Trophy className="w-4 h-4 mr-2" />
                Mission accomplie !
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Missions disponibles</h2>
        <Badge variant="secondary" className="text-sm">
          {filteredMissions.length} missions
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="available">Disponibles</TabsTrigger>
          <TabsTrigger value="active">Actives</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {filteredMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {filteredMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {filteredMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {filteredMissions.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredMissions.length === 0 && (
        <div className="text-center py-12">
          <Circle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune mission disponible</h3>
          <p className="text-muted-foreground">
            {selectedTab === "all" ? "Revenez plus tard pour de nouvelles missions !" : 
             selectedTab === "available" ? "Aucune mission disponible pour le moment" :
             selectedTab === "active" ? "Aucune mission active" : 
             "Aucune mission terminée"}
          </p>
        </div>
      )}
    </div>
  );
} 