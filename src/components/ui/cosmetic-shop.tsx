"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Coins,
  Palette,
  User,
  Sticker,
  Frame,
  Sparkles,
  Star,
  Crown,
  Heart,
  ShoppingCart,
  Gift,
  Zap,
  BookOpen,
  Coffee,
  Moon,
  Sun,
  Flower,
  Mountain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  type: "avatar" | "theme" | "sticker" | "frame" | "accessory" | "background";
  price: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  previewUrl?: string;
  isPurchased: boolean;
  isEquipped?: boolean;
  category?: string;
  unlockLevel?: number;
  tags: string[];
  stats?: {
    xpBonus?: number;
    popularity?: number;
  };
}

interface CosmeticShopProps {
  userBookcoins: number;
  onPurchase: (itemId: string, price: number) => void;
  onEquip?: (itemId: string) => void;
  className?: string;
}

// Predefined cosmetic items based on literary themes
const COSMETIC_ITEMS: CosmeticItem[] = [
  // Avatar Accessories
  {
    id: "acc_golden_book",
    name: "Livre Doré",
    description: "Un livre aux pages dorées qui brille dans vos mains",
    type: "accessory",
    price: 150,
    rarity: "rare",
    previewUrl: "/cosmetics/accessories/golden-book.png",
    isPurchased: false,
    category: "Mystique",
    tags: ["élégant", "littéraire", "précieux"],
    stats: { xpBonus: 5, popularity: 85 },
  },
  {
    id: "acc_crystal_quill",
    name: "Plume de Cristal",
    description: "Une plume magique qui fait de vous un vrai écrivain",
    type: "accessory",
    price: 200,
    rarity: "epic",
    previewUrl: "/cosmetics/accessories/crystal-quill.png",
    isPurchased: false,
    category: "Magique",
    unlockLevel: 25,
    tags: ["magique", "écriture", "rare"],
    stats: { xpBonus: 10, popularity: 92 },
  },
  {
    id: "acc_reading_glasses",
    name: "Lunettes du Sage",
    description: "Des lunettes qui vous donnent un air distingué",
    type: "accessory",
    price: 75,
    rarity: "common",
    previewUrl: "/cosmetics/accessories/sage-glasses.png",
    isPurchased: false,
    category: "Classique",
    tags: ["sage", "classique", "intelligent"],
    stats: { popularity: 70 },
  },

  // Profile Frames
  {
    id: "frame_ancient_scroll",
    name: "Parchemin Ancien",
    description: "Un cadre qui évoque les manuscrits médiévaux",
    type: "frame",
    price: 100,
    rarity: "uncommon",
    previewUrl: "/cosmetics/frames/ancient-scroll.png",
    isPurchased: false,
    category: "Historique",
    tags: ["ancien", "parchemin", "médiéval"],
    stats: { popularity: 78 },
  },
  {
    id: "frame_starry_night",
    name: "Nuit Étoilée",
    description: "Un cadre inspiré des nuits de lecture sous les étoiles",
    type: "frame",
    price: 120,
    rarity: "uncommon",
    previewUrl: "/cosmetics/frames/starry-night.png",
    isPurchased: false,
    category: "Romantique",
    tags: ["étoiles", "nuit", "poétique"],
    stats: { popularity: 89 },
  },
  {
    id: "frame_golden_library",
    name: "Bibliothèque Dorée",
    description: "Le cadre ultime pour les vrais bibliophiles",
    type: "frame",
    price: 300,
    rarity: "legendary",
    previewUrl: "/cosmetics/frames/golden-library.png",
    isPurchased: false,
    category: "Premium",
    unlockLevel: 50,
    tags: ["doré", "bibliothèque", "luxueux"],
    stats: { xpBonus: 15, popularity: 96 },
  },

  // Themes
  {
    id: "theme_midnight_reader",
    name: "Lecteur de Minuit",
    description: "Un thème sombre parfait pour les lectures nocturnes",
    type: "theme",
    price: 80,
    rarity: "common",
    previewUrl: "/cosmetics/themes/midnight-reader.png",
    isPurchased: false,
    category: "Sombre",
    tags: ["sombre", "nuit", "minuit"],
    stats: { popularity: 88 },
  },
  {
    id: "theme_autumn_library",
    name: "Bibliothèque d'Automne",
    description: "Des couleurs chaudes qui évoquent les feuilles d'automne",
    type: "theme",
    price: 90,
    rarity: "common",
    previewUrl: "/cosmetics/themes/autumn-library.png",
    isPurchased: false,
    category: "Saisonnier",
    tags: ["automne", "chaleureux", "cosy"],
    stats: { popularity: 85 },
  },
  {
    id: "theme_enchanted_forest",
    name: "Forêt Enchantée",
    description: "Un thème magique aux couleurs de la nature",
    type: "theme",
    price: 150,
    rarity: "rare",
    previewUrl: "/cosmetics/themes/enchanted-forest.png",
    isPurchased: false,
    category: "Fantasy",
    tags: ["nature", "magique", "forêt"],
    stats: { xpBonus: 5, popularity: 91 },
  },

  // Stickers & Emoji
  {
    id: "sticker_book_love",
    name: "Pack Amour des Livres",
    description: "12 stickers expressifs pour vos commentaires",
    type: "sticker",
    price: 50,
    rarity: "common",
    previewUrl: "/cosmetics/stickers/book-love-pack.png",
    isPurchased: false,
    category: "Expression",
    tags: ["emoji", "commentaires", "expression"],
    stats: { popularity: 76 },
  },
  {
    id: "sticker_literary_quotes",
    name: "Citations Littéraires",
    description: "Stickers avec des citations de grands auteurs",
    type: "sticker",
    price: 100,
    rarity: "uncommon",
    previewUrl: "/cosmetics/stickers/literary-quotes.png",
    isPurchased: false,
    category: "Culture",
    unlockLevel: 15,
    tags: ["citations", "culture", "auteurs"],
    stats: { popularity: 82 },
  },

  // Backgrounds
  {
    id: "bg_cozy_library",
    name: "Bibliothèque Cosy",
    description: "Un arrière-plan chaleureux avec des livres partout",
    type: "background",
    price: 110,
    rarity: "uncommon",
    previewUrl: "/cosmetics/backgrounds/cozy-library.png",
    isPurchased: false,
    category: "Ambiance",
    tags: ["cosy", "chaleureux", "livres"],
    stats: { popularity: 87 },
  },
  {
    id: "bg_floating_books",
    name: "Livres Flottants",
    description: "Des livres qui flottent magiquement autour de vous",
    type: "background",
    price: 180,
    rarity: "rare",
    previewUrl: "/cosmetics/backgrounds/floating-books.png",
    isPurchased: false,
    category: "Magique",
    unlockLevel: 30,
    tags: ["magique", "flottant", "surréel"],
    stats: { xpBonus: 8, popularity: 94 },
  },
];

export function CosmeticShop({
  userBookcoins,
  onPurchase,
  onEquip,
  className,
}: CosmeticShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<CosmeticItem | null>(null);
  const [items, setItems] = useState<CosmeticItem[]>(COSMETIC_ITEMS);

  const categories = [
    { id: "all", name: "Tout", icon: ShoppingCart },
    { id: "accessory", name: "Accessoires", icon: Crown },
    { id: "frame", name: "Cadres", icon: Frame },
    { id: "theme", name: "Thèmes", icon: Palette },
    { id: "sticker", name: "Stickers", icon: Sticker },
    { id: "background", name: "Arrière-plans", icon: Mountain },
  ];

  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.type === selectedCategory);

  const getRarityColor = (rarity: CosmeticItem["rarity"]) => {
    switch (rarity) {
      case "common":
        return "text-gray-600 border-gray-600";
      case "uncommon":
        return "text-green-600 border-green-600";
      case "rare":
        return "text-blue-600 border-blue-600";
      case "epic":
        return "text-purple-600 border-purple-600";
      case "legendary":
        return "text-amber-600 border-amber-600";
      default:
        return "text-gray-600 border-gray-600";
    }
  };

  const getTypeIcon = (type: CosmeticItem["type"]) => {
    switch (type) {
      case "accessory":
        return Crown;
      case "frame":
        return Frame;
      case "theme":
        return Palette;
      case "sticker":
        return Sticker;
      case "background":
        return Mountain;
      default:
        return Gift;
    }
  };

  const handlePurchase = (item: CosmeticItem) => {
    if (userBookcoins >= item.price) {
      // Update item status locally
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isPurchased: true } : i))
      );

      onPurchase(item.id, item.price);
      toast.success(`${item.name} acheté avec succès !`);
      setSelectedItem(null);
    } else {
      toast.error("BookCoins insuffisants !");
    }
  };

  const handleEquip = (item: CosmeticItem) => {
    if (item.isPurchased && onEquip) {
      setItems((prev) =>
        prev.map((i) => ({
          ...i,
          isEquipped:
            i.id === item.id
              ? true
              : i.type === item.type
                ? false
                : i.isEquipped,
        }))
      );

      onEquip(item.id);
      toast.success(`${item.name} équipé !`);
    }
  };

  const ItemCard = ({ item }: { item: CosmeticItem }) => {
    const TypeIcon = getTypeIcon(item.type);
    const canPurchase = userBookcoins >= item.price && !item.isPurchased;
    const isLocked = item.unlockLevel && item.unlockLevel > 10; // Mock user level

    return (
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer",
          item.isPurchased && "ring-2 ring-green-500",
          item.isEquipped && "ring-2 ring-blue-500",
          isLocked && "opacity-60"
        )}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `linear-gradient(135deg, ${
              item.rarity === "legendary"
                ? "#F59E0B"
                : item.rarity === "epic"
                  ? "#8B5CF6"
                  : item.rarity === "rare"
                    ? "#3B82F6"
                    : item.rarity === "uncommon"
                      ? "#10B981"
                      : "#6B7280"
            } 0%, transparent 100%)`,
          }}
        />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-lg">
                <TypeIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  {item.name}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={cn("text-xs", getRarityColor(item.rarity))}
                >
                  {item.rarity}
                </Badge>
              </div>
            </div>

            {item.isEquipped && (
              <Badge variant="default" className="bg-blue-500">
                Équipé
              </Badge>
            )}

            {item.isPurchased && !item.isEquipped && (
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                Possédé
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Preview Image Placeholder */}
          <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <TypeIcon className="w-8 h-8 text-gray-400" />
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-1 py-0"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          {item.stats && (
            <div className="flex items-center gap-3 text-xs">
              {item.stats.xpBonus && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Sparkles className="w-3 h-3" />+{item.stats.xpBonus}% XP
                </div>
              )}
              {item.stats.popularity && (
                <div className="flex items-center gap-1 text-amber-600">
                  <Star className="w-3 h-3" />
                  {item.stats.popularity}%
                </div>
              )}
            </div>
          )}

          {/* Price and Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-600" />
              <span className="font-bold text-sm">{item.price}</span>
            </div>

            {isLocked ? (
              <Badge variant="outline" className="text-xs">
                Niveau {item.unlockLevel}
              </Badge>
            ) : item.isPurchased ? (
              <Button
                size="sm"
                variant={item.isEquipped ? "outline" : "default"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!item.isEquipped) handleEquip(item);
                }}
                disabled={item.isEquipped}
                className="text-xs"
              >
                {item.isEquipped ? "Équipé" : "Équiper"}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
                disabled={!canPurchase}
                className="text-xs"
              >
                Acheter
              </Button>
            )}
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
          <h2 className="text-2xl font-bold">Boutique Cosmétique</h2>
          <p className="text-muted-foreground">
            Personnalisez votre expérience Bookish
          </p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
          <Coins className="w-5 h-5 text-yellow-600" />
          <span className="font-bold text-lg">{userBookcoins}</span>
          <span className="text-sm text-yellow-700">BookCoins</span>
        </div>
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-xs"
              >
                <Icon className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'achat</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  {React.createElement(getTypeIcon(selectedItem.type), {
                    className: "w-8 h-8 text-gray-600",
                  })}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedItem.description}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn("mt-1", getRarityColor(selectedItem.rarity))}
                  >
                    {selectedItem.rarity}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <span className="font-medium">Prix:</span>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-600" />
                  <span className="font-bold text-lg">
                    {selectedItem.price} BookCoins
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Solde actuel:</span>
                <span className="font-medium">{userBookcoins} BookCoins</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Après achat:</span>
                <span
                  className={cn(
                    "font-medium",
                    userBookcoins - selectedItem.price >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {userBookcoins - selectedItem.price} BookCoins
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedItem(null)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => handlePurchase(selectedItem)}
                  disabled={userBookcoins < selectedItem.price}
                  className="flex-1"
                >
                  Confirmer l'achat
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
