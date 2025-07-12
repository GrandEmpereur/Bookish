"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  Coins, 
  Sparkles, 
  Star, 
  Crown, 
  Zap,
  BookOpen,
  Award,
  Heart,
  Gem,
  Trophy,
  Wand2,
  Shuffle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MysteryBoxRewardLocal {
  id: string;
  name: string;
  description: string;
  type: 'bookcoins' | 'xp' | 'cosmetic' | 'boost' | 'collectible' | 'badge';
  amount?: number;
  duration?: number; // for boosts in minutes
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  iconUrl?: string;
  probability: number; // percentage
}

interface MysteryBoxType {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'bookcoins';
  iconUrl?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  guaranteedRewards: MysteryBoxRewardLocal[];
  possibleRewards: MysteryBoxRewardLocal[];
  cooldown?: number; // in seconds
  maxDaily?: number;
  purchasedToday?: number;
}

interface MysteryBoxProps {
  userCurrency: {
    bookcoins: number;
  };
  onPurchase: (boxId: string, cost: number, currency: 'bookcoins') => void;
  onRewardReceived: (reward: MysteryBoxRewardLocal) => void;
  onOpenMysteryBox: (boxType: string, cost: number) => Promise<any>;
  mysteryBoxTypes?: MysteryBoxType[];
  className?: string;
}

// Mystery box types and rewards will come from API

export function MysteryBox({ userCurrency, onPurchase, onRewardReceived, onOpenMysteryBox, mysteryBoxTypes = [], className }: MysteryBoxProps) {
  const [selectedBox, setSelectedBox] = useState<MysteryBoxType | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [openingProgress, setOpeningProgress] = useState(0);
  const [revealedReward, setRevealedReward] = useState<MysteryBoxRewardLocal | null>(null);
  const [showReward, setShowReward] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-600 bg-gray-50';
      case 'rare': return 'text-blue-600 border-blue-600 bg-blue-50';
      case 'epic': return 'text-purple-600 border-purple-600 bg-purple-50';
      case 'legendary': return 'text-amber-600 border-amber-600 bg-amber-50';
      default: return 'text-gray-600 border-gray-600 bg-gray-50';
    }
  };

  const getRewardIcon = (type: MysteryBoxRewardLocal['type']) => {
    switch (type) {
      case 'bookcoins': return Coins;
      case 'xp': return Star;
      case 'cosmetic': return Crown;
      case 'boost': return Zap;
      case 'collectible': return Gem;
      case 'badge': return Award;
      default: return Gift;
    }
  };

  // Reward generation is now handled by the API

  const handlePurchase = async (boxType: MysteryBoxType) => {
    const cost = boxType.price;
    const currency = boxType.currency;
    
    if (userCurrency.bookcoins < cost) {
      toast.error("BookCoins insuffisants !");
      return;
    }

    if (boxType.maxDaily && (boxType.purchasedToday || 0) >= boxType.maxDaily) {
      toast.error("Limite quotidienne atteinte !");
      return;
    }

    setSelectedBox(boxType);
    setIsOpening(true);
    setOpeningProgress(0);

    try {
      // Simulate opening animation
      const progressInterval = setInterval(() => {
        setOpeningProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the real API
      const apiResponse = await onOpenMysteryBox(boxType.rarity, cost);
      
      // Transform API response to match our component's expected structure
      const apiReward = apiResponse.data.reward;
      const transformedReward: MysteryBoxRewardLocal = {
        id: apiReward.id || `reward_${Date.now()}`,
        name: apiReward.name || 'Récompense mystérieuse',
        description: apiReward.description || 'Une récompense spéciale',
        type: apiReward.type || 'bookcoins',
        amount: apiReward.amount || 0,
        rarity: apiReward.rarity || boxType.rarity,
        probability: 100 // Not used for display
      };
      
      setRevealedReward(transformedReward);
      setIsOpening(false);
      setShowReward(true);
      
      // Call callbacks
      onPurchase(boxType.id, cost, 'bookcoins');
      onRewardReceived(transformedReward);
      
    } catch (error) {
      console.error("Error opening mystery box:", error);
      toast.error("Erreur lors de l'ouverture du coffre mystère");
      setIsOpening(false);
      setSelectedBox(null);
      setOpeningProgress(0);
    }
  };

  const closeRewardDialog = () => {
    setShowReward(false);
    setRevealedReward(null);
    setSelectedBox(null);
    setOpeningProgress(0);
  };

  const BoxCard = ({ boxType }: { boxType: MysteryBoxType }) => {
    const canPurchase = userCurrency.bookcoins >= boxType.price;
    const isLimited = Boolean(boxType.maxDaily && (boxType.purchasedToday || 0) >= boxType.maxDaily);
    const isFree = boxType.price === 0;

    return (
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer",
        getRarityColor(boxType.rarity),
        !canPurchase && "opacity-60",
        isLimited && "opacity-40"
      )}>
        <div 
          className="absolute inset-0 opacity-10"
                      style={{ 
            background: `linear-gradient(135deg, ${
              boxType.rarity === 'legendary' ? '#F59E0B' :
              boxType.rarity === 'epic' ? '#8B5CF6' :
              boxType.rarity === 'rare' ? '#3B82F6' : '#6B7280'
            } 0%, transparent 100%)`
          }}
        />

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Gift className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">{boxType.name}</CardTitle>
                <Badge variant="outline" className={cn("text-xs", getRarityColor(boxType.rarity))}>
                  {boxType.rarity}
                </Badge>
              </div>
            </div>
            
            {isFree && (
              <Badge className="bg-green-500 text-white">
                Gratuit !
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {boxType.description}
          </p>

          {/* Guaranteed Rewards Preview */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-green-600">✓ Garanti :</h4>
            <div className="space-y-1">
              {boxType.guaranteedRewards.slice(0, 2).map(reward => (
                <div key={reward.id} className="flex items-center gap-2 text-xs">
                  {React.createElement(getRewardIcon(reward.type), { className: "w-3 h-3" })}
                  <span>{reward.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Possible Rewards Preview */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-blue-600">🎲 Possible :</h4>
            <div className="space-y-1">
              {boxType.possibleRewards.slice(0, 3).map(reward => (
                <div key={reward.id} className="flex items-center gap-2 text-xs opacity-75">
                  {React.createElement(getRewardIcon(reward.type), { className: "w-3 h-3" })}
                  <span>{reward.name}</span>
                  <span className="text-muted-foreground">({reward.probability}%)</span>
                </div>
              ))}
              {boxType.possibleRewards.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  Et {boxType.possibleRewards.length - 3} autres récompenses...
                </div>
              )}
            </div>
          </div>

          {/* Limits */}
          {boxType.maxDaily && (
            <div className="text-xs text-muted-foreground">
              Limite : {boxType.purchasedToday || 0}/{boxType.maxDaily} par jour
            </div>
          )}

          {/* Price and Purchase */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-lg">
                {isFree ? 'Gratuit' : boxType.price}
              </span>
              {!isFree && (
                <span className="text-sm text-muted-foreground">
                  BookCoins
                </span>
              )}
            </div>

            <Button 
              onClick={() => handlePurchase(boxType)}
              disabled={!canPurchase || isLimited}
              className={cn(
                "font-semibold",
                isFree && "bg-green-500 hover:bg-green-600"
              )}
            >
              {isLimited ? "Épuisé" : isFree ? "Ouvrir" : "Acheter"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Coffres Mystère</h2>
          <p className="text-muted-foreground">Tentez votre chance pour des récompenses exceptionnelles</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="font-bold">{userCurrency.bookcoins}</span>
          </div>
        </div>
      </div>

      {/* Mystery Boxes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {mysteryBoxTypes.length > 0 ? (
          mysteryBoxTypes.map((boxType: MysteryBoxType) => (
            <BoxCard key={boxType.id} boxType={boxType} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Gift className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun coffre mystère disponible</h3>
            <p className="text-muted-foreground">
              Les coffres mystère seront bientôt disponibles via l'API.
            </p>
          </div>
        )}
      </div>

      {/* Opening Animation Dialog */}
      <Dialog open={isOpening} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Ouverture en cours...</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="flex justify-center">
              <div className="relative">
                <Gift className="w-24 h-24 text-purple-600 animate-bounce" />
                <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-spin" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Ouverture...</span>
                <span>{openingProgress}%</span>
              </div>
              <Progress value={openingProgress} className="h-3" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reward Reveal Dialog */}
      <Dialog open={showReward} onOpenChange={closeRewardDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">🎉 Félicitations !</DialogTitle>
          </DialogHeader>
          {revealedReward && (
            <div className="space-y-6 py-6">
              <div className="text-center space-y-4">
                <div className={cn(
                  "inline-flex items-center justify-center w-20 h-20 rounded-full",
                  getRarityColor(revealedReward.rarity)
                )}>
                  {React.createElement(getRewardIcon(revealedReward.type), { 
                    className: "w-10 h-10" 
                  })}
                </div>
                
                <div>
                  <h3 className="text-xl font-bold">{revealedReward.name}</h3>
                  <p className="text-muted-foreground">{revealedReward.description}</p>
                  <Badge variant="outline" className={cn("mt-2", getRarityColor(revealedReward.rarity))}>
                    {revealedReward.rarity}
                  </Badge>
                </div>

                {revealedReward.amount && (
                  <div className="text-2xl font-bold text-green-600">
                    +{revealedReward.amount}
                    {revealedReward.type === 'bookcoins' && ' BookCoins'}
                    {revealedReward.type === 'xp' && ' XP'}
                    {revealedReward.type === 'boost' && '% XP'}
                  </div>
                )}

                {revealedReward.duration && (
                  <div className="text-sm text-muted-foreground">
                    Durée : {revealedReward.duration >= 60 
                      ? `${Math.floor(revealedReward.duration / 60)}h`
                      : `${revealedReward.duration}min`
                    }
                  </div>
                )}
              </div>

              <Button onClick={closeRewardDialog} className="w-full">
                Formidable !
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 